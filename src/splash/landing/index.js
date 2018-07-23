import React from 'react';
import Splash from './Splash';
import Body from './Body';
import Distributed from './Distributed';
import Illustration from './Illustration';
import Footer from '../Footer';
import CallToAction from './CallToAction';
import { Scrollbars } from 'react-custom-scrollbars';

class SplashPage extends React.Component {
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
        {/*
				<video autoPlay muted loop preload="true" id="splash-video">
									<source src="./img/earth.mp4" type="video/mp4" />
								</video> 
			*/}
        <Splash {...this.props} top={this.state.top} />
        <Body />
        <div
          className="w-100 bg-white"
          style={{
            display: 'flex',
            justifyContent: 'center',
            alignItems: 'center'
          }}>
          <a className="f6 link dim br-pill ba bw1 ph3 pv2 mb3 mt3 dib black-80" href="/about">
            How it works &raquo;
          </a>
        </div>
        <Distributed />
        <Illustration />
        <CallToAction />
        <Footer />
      </Scrollbars>
    );
  }
}

export default SplashPage;
