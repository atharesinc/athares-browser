import React from 'react';
// import Splash from "./Splash";
// import Body from "./Body";
// import Distributed from "./Distributed";
// import Illustration from "./Illustration";
import Footer from '../Footer';
import Navbar from '../Navbar';
import FAQ from './FAQ';
import { Scrollbars } from 'react-custom-scrollbars';

class About extends React.Component {
  state = {
    top: 0
  };
  handleUpdate = ({ scrollTop }) => {
    if (scrollTop !== this.state.top) {
      this.setState({ top: scrollTop });
    }
  };
  render() {
    return (
      <Scrollbars
        style={{ width: '100vw', height: '100vh' }}
        className="splash"
        onUpdate={this.handleUpdate}
        autoHide
        autoHideTimeout={1000}
        autoHideDuration={200}
        universal={true}>
        <div className="splash">
          <video autoPlay muted loop preload="true" id="splash-video">
            <source src="./img/earth.mp4" type="video/mp4" />
          </video>

          <Navbar {...this.props} top={this.state.top} />
          <header className="bg-black-50 sans-serif">
            <div className="mw9 center pa4 pt7-ns">
              <time className="f6 mb2 dib ttu tracked">
                <small className="white-80">What is Athares?</small>
              </time>
              <h3 className="f2 f4-ns f-headline-l measure-wide lh-title mv0">
                <span className="lh-copy white pa1 tracked-tight">The most ambitious startup in history.</span>
              </h3>
              <h5 className="f6 ttu tracked white-80">Everything you need to know about Athares.</h5>
            </div>
          </header>
          <FAQ />
          <Footer />
        </div>
      </Scrollbars>
    );
  }
}

export default About;
