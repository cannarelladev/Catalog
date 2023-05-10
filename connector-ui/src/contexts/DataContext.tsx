import {
  FC,
  PropsWithChildren,
  createContext,
  useContext,
  useEffect,
  useState,
} from 'react';
import { API } from 'src/api/Api';
import { Contract, Mappers, Provider } from 'src/models';
import Broker from 'src/models/broker';
import { Catalog } from 'src/models/catalog';
import { Offer } from 'src/models/offer';
import { Message } from 'src/models/websocket';
import { catalogToOffersMapper, populateOffersDetails } from '../utils';
import { SessionContext } from './SessionContext';

const api = 'api/';
const wsEndpoint = window.location.hostname;

interface IDataContext {
  clusterParameters: Provider;
  clusterPrettyName: string;
  contractEndpoint: string;
  catalog: Offer[];
  myOffers: Offer[];
  providers: Provider[];
  brokers: Broker[];
  contracts: Contract[];
  dirtyData: boolean;
  dirtyConfig: boolean;
  setDirtyData: () => void;
  setDirtyConfig: () => void;
}

export const DataContext = createContext<IDataContext>({
  clusterParameters: undefined,
  clusterPrettyName: '',
  contractEndpoint: '',
  catalog: [],
  myOffers: [],
  providers: [],
  brokers: [],
  contracts: [],
  dirtyData: true,
  dirtyConfig: true,
  setDirtyData: () => null,
  setDirtyConfig: () => null,
});

const DataContextProvider: FC<PropsWithChildren<{}>> = ({
  children,
}: PropsWithChildren<{}>) => {
  const { initDashboard, setSystemError } = useContext(SessionContext);
  const [clusterParameters, setClusterParameters] = useState<Provider>();
  const [clusterID, setClusterID] = useState('');
  const [clusterPrettyName, setClusterPrettyName] = useState('');
  const [contractEndpoint, setContractEndpoint] = useState('');
  const [catalog, setCatalog] = useState<Offer[]>([]);
  const [brokerCatalog, setBrokerCatalog] = useState<Offer[]>([]);
  const [myOffers, setMyOffers] = useState<Offer[]>([]);
  const [providers, setProviders] = useState<Provider[]>([]);
  const [brokers, setBrokers] = useState<Broker[]>([]);
  const [contracts, setContracts] = useState<Contract[]>([]);
  const [webSocketInitialized, setWebSocketInitialized] = useState(false);

  const [dirtyData, setDirtyData] = useState(true);
  const [dirtyConfig, setDirtyConfig] = useState(true);

  const getContracts = async () => {
    try {
      const response = await API.getContracts();
      setContracts(response);
    } catch (error) {
      console.log(error);
      setSystemError(error);
    }
  };

  const getBrokers = async () => {
    try {
      const response = await API.getBrokers();
      setBrokers(response);
    } catch (error) {
      setSystemError(error);
    }
  };

  const getClusterParameters = async () => {
    try {
      const cluster = await API.getClusterParameters();
      setClusterParameters({ ...cluster });
      setClusterID(cluster.clusterID);
    } catch (error) {
      setSystemError(error);
    }
  };

  const getClusterPrettyName = async () => {
    try {
      const data = await API.getClusterPrettyName();
      setClusterPrettyName(data.prettyName);
    } catch (error) {
      setSystemError(error);
    }
  };

  const getContractEndpoint = async () => {
    try {
      const data = await API.getContractEndpoint();
      setContractEndpoint(data.contractEndpoint);
    } catch (error) {
      setSystemError(error);
    }
  };

  const getCatalogs = async () => {
    try {
      const catalogs = await API.getCatalogs();
      console.log(catalogs);
      setBrokerCatalog(catalogToOffersMapper(catalogs));
    } catch (error) {
      setSystemError(error.error);
    }
  };

  const getMyCatalog = async () => {
    try {
      const myCatalog = await API.getMyOffers();
      setMyOffers(
        populateOffersDetails(
          myCatalog,
          clusterParameters.clusterID,
          clusterParameters.clusterName
        )
      );
    } catch (error) {
      setSystemError(error);
    }
  };

  const wsConnect = () => {
    const ws = new WebSocket(`ws://${wsEndpoint}:6002/${api}subscribe`);
    ws.onopen = () => {
      console.log('WebSocket Client Connected');
    };
    ws.onerror = err => {
      console.log('WebSocket Client Error', err);
    };
    ws.onclose = e => {
      console.log('WebSocket Client Closed:', e);
      console.log(ws);
      setTimeout(wsConnect, 1000);
    };
    ws.onmessage = message => wsMessageParser(message);
  };

  const wsMessageParser = (message: MessageEvent) => {
    let tmpCatalog: Catalog;
    const jsonParsedData: Message = JSON.parse(message.data);
    const messageBody = jsonParsedData.body;
    switch (messageBody.event) {
      case 1:
        console.log(messageBody.data);
        break;
      case 2:
        tmpCatalog = Mappers.mapJSONToCatalog(JSON.parse(messageBody.data));
        //if (tmpCatalog.clusterID !== clusterParameters.clusterID) {
        console.log('Received catalog:', messageBody.data);
        setBrokerCatalog(old => {
          const oldFiltered = [
            ...old.filter(o => o.clusterID !== tmpCatalog.clusterID),
          ];
          return [...oldFiltered, ...catalogToOffersMapper([tmpCatalog])];
        });
        //}
        setBrokerCatalog(catalogToOffersMapper([tmpCatalog]));
        break;
      case 3:
        //console.log(messageBody.data);
        break;
      case 4:
        console.log(JSON.parse(messageBody.data));
        break;
      default:
        break;
    }
  };

  useEffect(() => {
    // WebSocket Management
    if (initDashboard && clusterID && !webSocketInitialized && !dirtyConfig) {
      wsConnect();
      setWebSocketInitialized(true);
    }
  }, [initDashboard, clusterID, dirtyConfig]);

  useEffect(() => {
    if (initDashboard && dirtyConfig) {
      getClusterParameters();
      getClusterPrettyName();
      getContractEndpoint();
      setDirtyConfig(false);
    }
  }, [initDashboard, dirtyConfig]);

  useEffect(() => {
    if (
      dirtyData &&
      clusterParameters &&
      clusterPrettyName &&
      contractEndpoint &&
      !dirtyConfig
    ) {
      getBrokers();
      getCatalogs();
      getMyCatalog();
      getContracts();
      setDirtyData(false);
    }
  }, [
    dirtyData,
    clusterParameters,
    clusterPrettyName,
    contractEndpoint,
    dirtyConfig,
  ]);

  useEffect(() => {
    setCatalog([...brokerCatalog]);
  }, [brokerCatalog]);

  return (
    <DataContext.Provider
      value={{
        clusterParameters,
        clusterPrettyName,
        contractEndpoint,
        catalog,
        providers,
        myOffers,
        brokers,
        contracts,
        dirtyData,
        dirtyConfig,
        setDirtyData: () => setDirtyData(true),
        setDirtyConfig: () => setDirtyConfig(true),
      }}
    >
      {children}
    </DataContext.Provider>
  );
};

export default DataContextProvider;
