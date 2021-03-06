import React from 'reactn';
import { Link } from 'react-router-dom';
import { LogIn, UserPlus } from 'react-feather';

const BottomNav = ({ show, activeCircle, belongsToCircle }) => {
  // ask the user to log in
  if (!show) {
    return (
      <Link className='w-100' to={'/login'}>
        <div
          className='w-100 v-mid bg-theme-dark flex flex-row justify-start items-center pv2 ph3'
          id='bottom-nav'
        >
          <LogIn className='white w2 h2 mr3' style={styles.icon} />
          <div className='white'>Login or Register</div>
        </div>
      </Link>
    );
  }
  // user is logged in but no circle is selected
  if (show && !activeCircle) {
    return (
      <div
        className='w-100 v-mid bg-theme-dark flex flex-row justify-start items-center pv2 ph3'
        id='bottom-nav-no-hover'
      >
        <div className='white-50'>Select a Circle</div>
      </div>
    );
  }
  // user is logged in and viewing a valid circle, but doesn't belong to it
  if (show && belongsToCircle !== true) {
    return (
      <div
        className='w-100 v-mid bg-theme-dark flex flex-row justify-start items-center pv2 ph3'
        id='bottom-nav-no-hover'
      />
    );
  }
  // user is logged in and able to add a user to a defined circle
  return (
    <Link className='w-100' to={'/app/circle/' + activeCircle + '/add/user'}>
      <div
        className='w-100 v-mid bg-theme-dark flex flex-row justify-start items-center pv2 ph3'
        id='bottom-nav'
      >
        <UserPlus className='white w2 h2 mr3' style={styles.icon} />
        <div className='white'>Invite User to Circle</div>
      </div>
    </Link>
  );
};
export default BottomNav;

const styles = {
  icon: { height: '1.5em', width: '1.5em' },
};
