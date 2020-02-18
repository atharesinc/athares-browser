import React from 'react';
import { AlertCircle } from 'react-feather';
import PINEntry from './PINEntry';
import { updateUserWithKeys } from '../utils/auth';
import AtharesLoader from './AtharesLoader';

export default function CreatePINModal({ id, hide, ...props }) {
  const createNewPIN = async (pin, { setSuccess, setLoading }) => {
    setLoading(true);
    await updateUserWithKeys(id, pin);
    setLoading(false);
    setSuccess(true);
    hide(false);
  };

  const loadingComponent = () => {
    return (
      <div
        id='dashboard-wrapper'
        style={{
          justifyContent: 'center',
        }}
        className='pa2'
      >
        <AtharesLoader />
        <h1 className='mb3 mt0 lh-title mt4 f3 f2-ns'>Updating PIN</h1>
      </div>
    );
  };
  return (
    <div
      style={{
        position: 'absolute',
        width: '100vw',
        height: '100vh',
        background: '#00000090',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        top: 0,
        left: 0,
        bottom: 0,
        right: 0,
        zIndex: 2,
      }}
    >
      <div className='pa2 bg-theme b--white-70 popIn tc  w-80 w-50-ns'>
        <AlertCircle className='w4 h4 pa1 white' />
        <h1 className='mb4 lh-title mt2 f4 f3-ns'>Set up Message PIN</h1>
        <div className='mb1 mt0 f6 f5-ns white-80'>
          To send and receive direct messages, you need to create a secure PIN.
        </div>
        <PINEntry
          showNumber={true}
          validate={createNewPIN}
          loadingComponent={loadingComponent()}
        />
      </div>
    </div>
  );
}
