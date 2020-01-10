import React from 'reactn';
import { Link } from 'react-router-dom';

const DashboardLink = ({ link, icon, title }) => {
  return (
    <Link className='fl w-100 w-50-ns pv2 transparent-hover' to={link}>
      <div className='bg-white-10 tc dashboard-item'>
        <div className='dashboard-title white'>{title}</div>
      </div>
    </Link>
  );
};

export default DashboardLink;
