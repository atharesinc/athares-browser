import React from 'reactn';
import { X, Check, Trash2 } from 'react-feather';

const EditSection = ({ cancel, save, repeal }) => {
  return (
    <div className='edit-section-bar'>
      <div className='column-center toolbar-item' onClick={save}>
        <Check className='save-changes' />
        <div className='save-changes' style={{ fontSize: '0.75em' }}>
          SAVE
        </div>
      </div>
      <div className='column-center toolbar-item' onClick={repeal}>
        <Trash2 className='save-changes' />
        <div className='save-changes' style={{ fontSize: '0.75em' }}>
          REPEAL
        </div>
      </div>
      <div className='column-center toolbar-item' onClick={cancel}>
        <X className='save-changes' />
        <div className='save-changes' style={{ fontSize: '0.75em' }}>
          CANCEL
        </div>
      </div>
    </div>
  );
};

export default EditSection;
