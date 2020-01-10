import React from 'react';
import { FileText } from 'react-feather';

const FileMessage = ({ file, fileName, ...rest }) => {
  return (
    <a href={file} target='_blank' rel='noopener noreferrer'>
      <div className='mh0 ba bg-theme-light b--white-70 flex flex-row justify-start items-center'>
        <FileText className='ma2' />
        <div
          className='f6 white-70 mr2'
          // style={{
          //   width: 'calc(100 % - 1em)',
          //   textOverflow: 'ellipsis',
          //   overflow: 'hidden',
          // }}
        >
          {fileName}
        </div>
      </div>
    </a>
  );
};

export default FileMessage;
