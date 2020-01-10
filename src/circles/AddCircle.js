import React from 'reactn';
import { Link } from 'react-router-dom';
import { Plus } from 'react-feather';

const AddCircle = (props, { addCircle }) => {
  return (
    <Link to='/app/new/circle' id='add-circle-button'>
      <Plus />
    </Link>
  );
};

export default AddCircle;
