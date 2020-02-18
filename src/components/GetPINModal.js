import React from 'react';
import { AlertCircle } from 'react-feather';
import PINEntry from './PINEntry';
import { decryptPrivWithPin } from '../utils/auth';
import AtharesLoader from './AtharesLoader';

export default function GetPINModal({ priv, show, ...props }) {
  const verifyPIN = async (
    pin,
    { setPin, setError, setSuccess, clearPin, setLoading },
  ) => {
    setLoading(true);
    try {
      // decrypt priv with PIN
      await decryptPrivWithPin(priv, pin);

      setLoading(false);
      setSuccess(true);
      show(false);
    } catch (e) {
      console.error(e);
      // should throw "unable to decrypt" if no good
      setLoading(false);
      setError(true);
      setTimeout(clearPin, 1000);
    }
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
        <h1 className='mb3 mt0 lh-title mt4 f3 f2-ns'>Verifying PIN</h1>
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
        <h1 className='mb4 lh-title mt2 f4 f3-ns'>Enter PIN</h1>
        <div className='mb1 mt0 f6 f5-ns white-80'>
          To send and receive direct messages, you need to enter your secure
          PIN.
        </div>
        <PINEntry
          showNumber={false}
          round
          validate={verifyPIN}
          loadingComponent={loadingComponent}
          errorMessage={'Incorrect PIN'}
        />
      </div>
    </div>
  );
}
