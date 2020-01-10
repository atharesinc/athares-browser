import React from 'reactn';
import { Plus, ChevronLeft } from 'react-feather';
import { Link } from 'react-router-dom';

const DocsSearchBar = ({ id }) => {
  return (
    <div id='doc-toolbar'>
      <Link to='/app'>
        <ChevronLeft className='white db dn-ns' />
      </Link>
      <Link to={`/app/circle/${id}/add/amendment`} className='icon-wrapper'>
        <Plus />
      </Link>
    </div>
  );
};
export default DocsSearchBar;
