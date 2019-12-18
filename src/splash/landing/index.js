import React, { useState } from "reactn";
import Splash from "./Splash";
import Footer from "../Footer";
import { Scrollbars } from "react-custom-scrollbars";


function SplashPage (){
  state = {
    scrolled: false,
    top: 0
  };
  const handleUpdate = ({ scrollTop }) => {
    if (this.state.top !== scrollTop) {
      this.setState({ scrolled: scrollTop > 100, top: scrollTop });
    }
  };
  shouldComponentUpdate(nextProps, nextState) {
    return nextState.scrolled !== this.state.scrolled;
  }
  
    return (
      <Scrollbars
        style={{ width: "100vw", height: "100vh" }}
        className="splash"
        onUpdate={this.handleUpdate}
        autoHide
        autoHideTimeout={1000}
        autoHideDuration={200}
        universal={true}
      >
        <Splash {...props} scrolled={this.state.scrolled} />
        <Footer />
      </Scrollbars>
    );
}

function mapStateToProps(state) {
  return {};
}
export default connect(mapStateToProps)(SplashPage);
