import React from 'reactn';
import { Globe, Grid, Hash, User } from 'react-feather';
import { Link } from 'react-router-dom';

const BottomNav = ({ show, activeTab, toggleMenu }) => {
  return (
    <div id='bottom-nav' style={{ display: show ? 'none' : 'flex' }}>
      <Link className='bottom-nav-wrapper' to={'/app/circles'}>
        <Globe className={activeTab === 'circles' ? 'black' : 'black-60'} />
      </Link>
      <Link className='bottom-nav-wrapper' to={'/app/channels'}>
        <Hash className={activeTab === 'channels' ? 'black' : 'black-60'} />
      </Link>
      <Link className='bottom-nav-wrapper' to={'/app'}>
        <Grid className={activeTab === 'app' ? 'black' : 'black-60'} />
      </Link>
      <div className='bottom-nav-wrapper' onClick={toggleMenu}>
        <User className={activeTab === 'user' ? 'black' : 'black-60'} />
      </div>
    </div>
  );
};

export default BottomNav;
