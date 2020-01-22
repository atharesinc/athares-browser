import React from 'reactn';

const AtharesLoader = ({ className = '', text = null, ...props }) => {
  return (
    <div className={`flex flex-column ${className}`}>
      {text && <div className={`h2 white center mb2`}>{text}</div>}
      <div className={`loader-wrapper ${className}`}>
        <img
          className='loader-img'
          src='/img/Athares-logo-small-white-no-circle.png'
          alt='Loading'
        />
        <div className='loader' />
        <div className='loader delay' />
      </div>
    </div>
  );
};
export default AtharesLoader;
