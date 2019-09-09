import React from 'react';

const ImageMessage = ({ file, fileName }) => (
  <div className='w-50 ma2 mb0'>
    <img src={file} alt={fileName || 'file'} />
  </div>
);

export default ImageMessage;
