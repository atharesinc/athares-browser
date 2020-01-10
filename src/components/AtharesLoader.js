import React from 'reactn';

const AtharesLoader = ({ className = '', ...props }) => {
  return (
    <div className={`loader-wrapper ${className}`}>
      <img
        className='loader-img'
        src='/img/Athares-logo-small-white-no-circle.png'
        alt='Loading'
      />
      <div className='loader' />
      <div className='loader delay' />
    </div>
  );
};
export default AtharesLoader;
