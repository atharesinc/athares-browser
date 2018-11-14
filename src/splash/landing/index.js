import React, { Component } from 'react';
import Splash from './Splash';
import Footer from '../Footer';
import { Scrollbars } from 'react-custom-scrollbars';

class SplashPage extends Component {
    state = {
        scrolled: false,
        top: 0
    };
    handleUpdate = ({ scrollTop }) => {
        if (this.state.top !== scrollTop) {
            this.setState({ scrolled: scrollTop > 100, top: scrollTop });
        }
    };
    shouldComponentUpdate(nextProps, nextState) {
        return nextState.scrolled !== this.state.scrolled;
    }
    render() {
        return (
            <Scrollbars
                style={{ width: '100vw', height: '100vh' }}
                className='splash'
                onUpdate={this.handleUpdate}
                autoHide
                autoHideTimeout={1000}
                autoHideDuration={200}
                universal={true}>
                <Splash {...this.props} scrolled={this.state.scrolled} />
                <Footer />
            </Scrollbars>
        );
    }
}

export default SplashPage;
