import React, { useRef, useState, useEffect, Fragment } from 'react';

export default function PINEntry({
  round = false,
  validate,
  showNumber = false,
  pinBoxStyles = {},
  pinBoxRowStyles = {},
  currentBoxStyle = {},
  errorMessage,
  successMessage,
  errorComponent: ErrorComponent,
  successComponent: SuccessComponent,
  autoFocus = true,
  loadingComponent: LoadingComponent,
  ...props
}) {
  const [pin, setPin] = useState('');
  const [error, setError] = useState(false);
  const [success, setSuccess] = useState(false);
  const [loading, setLoading] = useState(false);
  const inputEl = useRef(null);

  const updatePIN = e => {
    if (pin.length === 4) {
      return false;
    }
    setPin(e.currentTarget.value);
  };
  const clearPin = () => {
    setPin('');
  };

  useEffect(() => {
    autoFocus && inputEl.current.focus();
  }, [autoFocus]);

  const focus = () => {
    inputEl.current.focus();
  };
  useEffect(() => {
    const validateTest = () => {
      if (pin === '4321') {
        setSuccess(true);
        setTimeout(clearPin, 1000);
        return;
      }
      setError(true);
      setTimeout(clearPin, 1000);
    };

    if (pin.length === 4) {
      // try PIN
      validate
        ? validate(pin, { setPin, setError, setSuccess, clearPin, setLoading })
        : validateTest();
    } else {
      setError(false);
      setSuccess(false);
    }
  }, [pin, validate]);

  const boxStyle = {
    ...styles.pinBox,
    borderRadius: round ? '100%' : '0',
    ...pinBoxStyles,
  };
  const rowStyles = { ...styles.pinBoxRow, ...pinBoxRowStyles };
  // const thisBoxStyle = { border: "3px solid #FFF", ...currentBoxStyle };
  const thisBoxStyle = {
    boxShadow: 'inset 0 0 0 2px #FFF',
    ...currentBoxStyle,
  };

  if (loading) {
    if (LoadingComponent) {
      return <LoadingComponent />;
    } else {
      return <div style={styles.pinBox}>Verifying...</div>;
    }
  }
  return (
    <Fragment>
      <input
        ref={inputEl}
        style={styles.input}
        type='number'
        maxLength={4}
        onChange={updatePIN}
        value={pin}
        tabIndex={0}
      />
      <div style={rowStyles}>
        {[0, 1, 2, 3].map(item => {
          let st = boxStyle;
          if (pin.length === item) {
            st = { ...st, ...thisBoxStyle };
          }
          return (
            <div onClick={focus} style={st} key={item}>
              {pin.length > item && (showNumber ? pin[item] : `\u2022`)}
            </div>
          );
        })}
      </div>
      {error ? (
        ErrorComponent ? (
          <ErrorComponent />
        ) : (
          <div>{errorMessage ? errorMessage : 'Incorrect PIN'}</div>
        )
      ) : null}
      {success ? (
        SuccessComponent ? (
          <SuccessComponent />
        ) : (
          <div>{successMessage ? successMessage : 'Success!'}</div>
        )
      ) : null}
    </Fragment>
  );
}

const styles = {
  pinBoxRow: {
    display: 'flex',
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
  },
  pinBox: {
    color: '#FFF',
    fontSize: '2.5em',
    border: '1px solid #898989',
    height: '2.5rem',
    width: '2.5rem',
    margin: '1rem',
    justifyContent: 'center',
    alignItems: 'center',
    borderRadius: '100%',
    lineHeight: '95%',
    transition: 'all 0.5s ease',
  },
  input: {
    opacity: 0,
    height: 0,
  },
};
