import { Grid } from '@mui/material';
import { FC, useContext, useEffect, useState } from 'react';
import { API } from 'src/api/Api';
import { DataContext } from 'src/contexts/DataContext';
import { SessionContext } from 'src/contexts/SessionContext';
import { Offer, OfferPlan, OfferType } from 'src/models/offer';
import { calculateAvailability } from 'src/utils';
import { v4 as uuidv4 } from 'uuid';
import MyPlans from './MyPlans';
import MySummary from './MySummary';

interface IMyOfferWrapperProps {
  create: boolean;
  offer: Offer;
}

const MyOfferWrapper: FC<IMyOfferWrapperProps> = props => {
  const { create, offer } = props;
  const {
    clusterParameters,
    clusterPrettyName,
    contractEndpoint,
    setDirtyData: setDirty,
  } = useContext(DataContext);
  const { setMessage, setSystemError } = useContext(SessionContext);
  const offerUUID = clusterParameters.clusterID + '_' + uuidv4();
  const [offerID, setOfferID] = useState(create ? offerUUID : offer.offerID);
  const [offerName, setOfferName] = useState('test');
  const [offerType, setOfferType] = useState<OfferType>('computational');
  const [offerStatus, setOfferStatus] = useState<boolean>(false);
  const [description, setDescription] = useState('test');
  const [offerPlans, setOfferPlans] = useState<OfferPlan[]>([]);
  const [edit, setEdit] = useState(false);

  const availability = calculateAvailability(offerPlans);

  const hasChanged =
    !create &&
    (offerName !== offer.offerName ||
      offerType !== offer.offerType ||
      offerStatus !== offer.status ||
      description !== offer.description ||
      offerPlans !== offer.plans);

  const publishOrUpdateOffer = async () => {
    if (
      offerID !== '' &&
      offerName !== '' &&
      description !== '' &&
      offerPlans.length > 0
    ) {
      const offer = {
        offerID,
        offerName,
        offerType,
        description,
        plans: offerPlans,
        created: new Date().getTime(),
        status: offerStatus,
        clusterID: clusterParameters.clusterID,
        clusterName: clusterParameters.clusterName,
        clusterPrettyName: clusterPrettyName,
        clusterContractEndpoint: contractEndpoint,
        endpoint: clusterParameters.endpoint,
      } as Offer;
      if (hasChanged || create) {
        try {
          const result = await API.createMyOffer(offer, setMessage);
          if (result) {
            setEdit(false);
            setDirty();
          }
        } catch (error) {
          setSystemError(error);
        }
      }
      setEdit(false);
    } else {
      setSystemError('Please fill in all required fields');
    }
  };

  useEffect(() => {
    if (!create) {
      setOfferID(offer.offerID);
      setOfferName(offer.offerName);
      setOfferType(offer.offerType);
      setOfferStatus(offer.status);
      setDescription(offer.description);
      setOfferPlans(offer.plans);
    } else {
      setEdit(true);
    }
    //setReady(true);
  }, [offer, create]);

  const properties = {
    offerID,
    offerName,
    offerType,
    offerStatus,
    description,
    edit,
    create,
    setOfferName,
    setOfferType,
    setOfferStatus,
    setDescription,
    setEdit,
    clusterPrettyName: create ? clusterPrettyName : offer.clusterPrettyName,
    publishOrUpdateOffer,
    availability,
  };

  return (
    <>
      {offer || create ? (
        <>
          <Grid item xs={12}>
            <MySummary {...properties} />
          </Grid>
          <Grid item xs={12}>
            <MyPlans
              offerID={offerID}
              offerPlans={offerPlans}
              edit={edit}
              create={create}
              setOfferPlans={setOfferPlans}
            />
          </Grid>
        </>
      ) : (
        <div></div>
      )}
    </>
  );
};

export default MyOfferWrapper;
