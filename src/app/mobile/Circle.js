import React, { Component } from "react";

const Circle = ({ id, name, icon, selectCircle, isActive }) => {
  return (
    <img
      src={icon}
      className="br-100 w2 h2 bw1 mh1"
      alt=""
      data-circle-id={id}
      data-circle-name={name}
      onClick={() => {
        selectCircle(id);
      }}
    />
  );
};

export default Circle;
