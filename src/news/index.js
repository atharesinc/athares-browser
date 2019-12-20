import React, { useGlobal, useEffect } from "react";

import { withRouter } from "react-router-dom";

function News(props) {
  const [activeChannel, setActiveChannel] = useGlobal("setActiveChannel");
  const [activeRevision, setActiveRevision] = useGlobal("setActiveRevision");
  useEffect(() => {
    setActiveChannel(null);
    setActiveRevision(null);
    props.history.replace("/app");
  }, []);

  return null;
}

export default withRouter(News);
