import React from 'react';

const ImageMessage = ({ file, fileName }) => (
  <div className='w-50'>
    <img src={file} alt={fileName || 'file'} />
  </div>
);

export default ImageMessage;
