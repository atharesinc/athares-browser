import React from 'react';

const Circle = ({ id, name, icon, selectCircle, isActive }) => {
    return (
        <img
            src={icon}
            className={
                `br-100 bw1 mh1 circle-mobile ` +
                (isActive ? 'active-circle-mobile' : '')
            }
            style={{ height: '3em', width: '3em' }}
            alt=''
            data-circle-id={id}
            data-circle-name={name}
            onClick={() => {
                selectCircle(id);
            }}
        />
    );
};

export default Circle;
