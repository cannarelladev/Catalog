import {
  createContext,
  Dispatch,
  FC,
  PropsWithChildren,
  SetStateAction,
  useEffect,
  useState,
} from 'react';
import { API } from 'src/api/Api';

interface ISessionContext {
  initDashboard: boolean;
  systemError: string;
  systemMessage: string;
  setSystemError: Dispatch<SetStateAction<String>>;
  setSystemMessage: Dispatch<SetStateAction<String>>;
  setMessage: (string) => void;
  setInitDashboard: Dispatch<SetStateAction<boolean>>;
  setDirty: Dispatch<SetStateAction<boolean>>;
  dirty: boolean;
}

export const SessionContext = createContext<ISessionContext>({
  initDashboard: false,
  systemError: '',
  systemMessage: '',
  setSystemError: () => null,
  setSystemMessage: () => null,
  setMessage: () => null,
  setInitDashboard: () => null,
  setDirty: () => null,
  dirty: true,
});

const SessionContextProvider: FC<PropsWithChildren<{}>> = ({
  children,
}: PropsWithChildren<{}>) => {
  const [initDashboard, setInitDashboard] = useState(false);
  const [systemError, setSystemError] = useState('');
  const [systemMessage, setSystemMessage] = useState('');
  const [wsHostname, setWsHostname] = useState('');
  //const [ws, setWs] = useState<WebSocket>();
  const [dirtyInit, setDirtyInit] = useState(true);
  //const [dirty, setDirty] = useState(true);

  const handleSystemMessage = (message: string) => {
    setSystemMessage(message);
    setTimeout(() => {
      setSystemMessage('');
    }, 5000);
  };

  const getInitStatus = async () => {
    try {
      const response = await API.getInitStatus();
      if (response.ready === 'true') {
        setInitDashboard(true);
      }
      setDirtyInit(false);
    } catch (error) {
      setSystemError(error.error);
      setDirtyInit(false);
    }
  };

  useEffect(() => {
    if (!initDashboard /*  && wsHostname */) {
      getInitStatus();
    }
  }, [dirtyInit]);

  return (
    <SessionContext.Provider
      value={{
        initDashboard,
        systemError,
        systemMessage,
        setSystemError,
        setSystemMessage,
        setMessage: handleSystemMessage,
        setInitDashboard,
        setDirty: setDirtyInit,
        dirty: dirtyInit,
      }}
    >
      {children}
    </SessionContext.Provider>
  );
};

export default SessionContextProvider;
