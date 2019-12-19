import React from "reactn";
import { Line } from "rc-progress";
import { Link } from "react-router-dom";

function Distributed(props) {
  const [percent, setPercent] = useState(0);
  useEffect(() => {
    window.addEventListener("scroll", animateProgress, true);

    return () => {
      window.removeEventListener(
        "scroll",

        animateProgress,
        true
      );
    };
  }, []);
  const animateProgress = () => {
    if (!isInViewport()) {
      return false;
    }
    // some value from the database or whatever
    setPercent(5);
    window.removeEventListener("scroll", animateProgress, true);
  };

  const isInViewport = () => {
    let rect = document
      .getElementById("distributed-meter")
      .getBoundingClientRect();
    let html = document.documentElement;
    return rect.bottom <= html.clientHeight;
  };

  return (
    <header className="sans-serif grey-screen">
      <div className="mw9 center pa4 pt5-ns ph5-l">
        <h3 className="f1 f1-m lh-title mv0">
          <span className="lh-copy white pa1 tracked-tight">
            As Distributed As Possible
          </span>
        </h3>
        <h4 className="f3 fw1 white">
          Athares clients leverage cutting edge technology improvements in
          WebRTC and P2P libraries with the goal of becoming 100% server-free
          during operation.
        </h4>
        <Line
          id="distributed-meter"
          percent={percent}
          strokeWidth="1"
          strokeColor="#00DFFC"
        />{" "}
        <div className="white mb3 mt3">
          <span className="f3 fw1">{percent}</span>% Distributed
        </div>
        <div>
          <div className="f6 link dim br-pill ba bw1 ph3 pv2 mb3 mt3 dib white">
            <Link to="/roadmap">Check our progress &raquo;</Link>
          </div>
        </div>
      </div>
    </header>
  );
}

export default Distributed;
