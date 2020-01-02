import { useGlobal, useEffect } from "reactn";

import { withRouter } from "react-router-dom";

function News(props) {
  const [, setActiveChannel] = useGlobal("setActiveChannel");
  const [, setActiveRevision] = useGlobal("setActiveRevision");
  useEffect(() => {
    setActiveChannel(null);
    setActiveRevision(null);
    props.history.replace("/app");
  }, [setActiveChannel, setActiveRevision, props.history]);

  return null;
}

export default withRouter(News);
