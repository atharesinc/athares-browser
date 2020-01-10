import React from 'reactn';
import { Circle } from 'react-feather';

const CircleComponent = ({ id, name, icon, selectCircle, isActive }) => {
  const selectCircleHere = () => {
    selectCircle(id);
  };
  return (
    <div
      className={`circle-img-wrapper ${isActive ? 'active-circle' : ''}`}
      data-circle-id={id}
      data-circle-name={name}
      onClick={selectCircleHere}
    >
      <img src={icon} className='circle-img' alt='' />
      <div className='circle-name white'>
        {name}
        <Circle id='circle-options' />
      </div>
    </div>
  );
};

export default CircleComponent;
