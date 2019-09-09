import React, { Component } from 'react';
import { GET_CIRCLE_NOTICES } from '../../../graphql/queries';
import CircleNotice from './CircleNotice';
import { graphql } from 'react-apollo';
import Scrollbars from 'react-custom-scrollbars';
import ReactDOM from 'react-dom';

class NoticeBoard extends Component {
  state = {
    wrapperHeight: 300,
  };
  componentDidMount() {
    let wrapper = ReactDOM.findDOMNode(this).getBoundingClientRect();

    wrapper &&
      this.setState({
        wrapperHeight: window.innerHeight - wrapper.top,
      });
  }
  render() {
    const { wrapperHeight } = this.state;
    const {
      loading,
      error,
      data: { Circle },
    } = this.props;
    if (error) {
      return (
        <div className='bg-white-10 pv3 w-100 ph4 ttu tracked tc'>
          Unable to reach news server
        </div>
      );
    }
    if (loading) {
      return (
        <div className='bg-white-10 pv3 w-100 ph4 ttu tracked tc'>
          Fetching News...
        </div>
      );
    }
    if (Circle && Circle.notices.length !== 0) {
      return (
        <Scrollbars
          id='circle-news-wrapper'
          style={{
            width: '100%',
            height: wrapperHeight,
          }}
          autoHide
          autoHideTimeout={1000}
          autoHideDuration={200}
          universal={true}
        >
          {Circle.notices.map(notice => (
            <CircleNotice key={notice.id} notice={notice} />
          ))}
        </Scrollbars>
      );
    }
    return (
      <div className='bg-white-10 pv3 w-100 ph4 ttu tracked tc'>
        No news available
      </div>
    );
  }
}

export default graphql(GET_CIRCLE_NOTICES, {
  options: ({ activeCircle }) => ({ variables: { id: activeCircle || '' } }),
})(NoticeBoard);
