import React, { useState } from "reactn";
import Footer from "../Footer";
import Navbar from "../Navbar";
import FAQ from "./FAQ";
import { Scrollbars } from "react-custom-scrollbars";

function About() {
  const [scrolled, setScrolled] = useState(false);
  const [top, setTop] = useState(0);

  const handleUpdate = ({ scrollTop }) => {
    if (top !== scrollTop) {
      setScrolled(scrollTop > 100);
      setTop(scrollTop);
    }
  };

  return (
    <Scrollbars
      style={{ width: "100vw", height: "100vh", overflowX: "hidden" }}
      className="splash"
      onUpdate={handleUpdate}
      autoHide
      autoHideTimeout={1000}
      autoHideDuration={200}
      universal={true}
    >
      <div className="splash">
        {/* <video autoPlay muted loop preload="true" id="splash-video">
                        <source src="./img/earth.mp4" type="video/mp4" />
                    </video> */}

        <Navbar scrolled={scrolled} top={top} />
        <header className="sans-serif">
          <div className="mw9 center pa4 pt6">
            <time className="f6 mb2 dib ttu tracked">
              <small className="white-80">What is Athares?</small>
            </time>
            <h3 className="f2 f4-ns f-headline-l measure-wide lh-title mv0">
              <span className="lh-copy white pa1 tracked-tight">
                The most ambitious startup in history.
              </span>
            </h3>
            <h5 className="f6 ttu tracked white-80">
              Everything you need to know about Athares.
            </h5>
          </div>
        </header>
        <FAQ />
        <Footer />
      </div>
    </Scrollbars>
  );
}

export default About;
