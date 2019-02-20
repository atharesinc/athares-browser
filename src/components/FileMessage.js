import React from "react";
import FeatherIcon from "feather-icons-react";

const FileMessage = ({ file, fileName }) => (
  <a href={file} target="_blank" rel="no-referrer-opener">
    <div
      style={{ height: "6rem", width: "8rem" }}
      className="ma2 mb0 ba bg-theme-light b--white-70 flex flex-column justify-center items-center"
    >
      <FeatherIcon icon="file-text" className="ma2" />
      <div
        className="f6 white-70"
        style={{
          width: "calc(100 % - 1em)",
          textOverflow: "ellipsis",
          overflow: "hidden"
        }}
      >
        {fileName}
      </div>
    </div>
  </a>
);

export default FileMessage;
