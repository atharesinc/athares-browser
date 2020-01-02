import React, { useState } from "reactn";
import Splash from "./Splash";
import Footer from "../Footer";
import { Scrollbars } from "react-custom-scrollbars";

function SplashPage(props) {
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
      style={{ width: "100vw", height: "100vh" }}
      className="splash"
      onUpdate={handleUpdate}
      autoHide
      autoHideTimeout={1000}
      autoHideDuration={200}
      universal={true}
    >
      <Splash {...props} scrolled={scrolled} />
      <Footer />
    </Scrollbars>
  );
}

export default SplashPage;
