import React, { PureComponent } from 'react';
import Amendment from './Amendment';
import Loader from '../components/Loader.js';
import { Link } from 'react-router-dom';
import { Scrollbars } from 'react-custom-scrollbars';
import { connect } from 'react-redux';
import { pull } from '../store/state/reducers';
import {
  updateCircle,
  updateChannel,
  updateRevision,
} from '../store/state/actions';
import { GET_AMENDMENTS_FROM_CIRCLE_ID } from '../graphql/queries';
import { Query } from 'react-apollo';
import { SUB_TO_CIRCLES_AMENDMENTS } from '../graphql/subscriptions';

import FeatherIcon from 'feather-icons-react';

class Constitution extends PureComponent {
  constructor(props) {
    super(props);
    this.state = {
      circle: null,
      amendments: [],
    };
  }

  componentDidMount() {
    // we only need to manually fetch the circle and it's amendments if the user isn't signed in
    // we should always make sure that the currently navigated-to circle is the activeCircle in redux
    this._isMounted = true;
    if (this.props.activeCircle) {
      this.props.dispatch(updateChannel(null));
      this.props.dispatch(updateRevision(null));
    } else {
      let circleID = this.props.match.params.id;

      this.props.dispatch(updateCircle(circleID));
      this.props.dispatch(updateChannel(null));
      this.props.dispatch(updateRevision(null));
    }
  }
  _subToMore = subscribeToMore => {
    subscribeToMore({
      document: SUB_TO_CIRCLES_AMENDMENTS,
      variables: { id: this.props.activeCircle || '' },
      updateQuery: (prev, { subscriptionData }) => {
        let {
          previousValues,
          mutation,
          node: amendment,
        } = subscriptionData.data.Amendment;
        switch (mutation) {
          case 'CREATED':
            let ind = prev.Circle.amendments.findIndex(
              a => a.id === amendment.id,
            );
            // if the new node isn't in the data set
            if (ind === -1) {
              prev.Circle.amendments = [...prev.Circle.amendments, amendment];
            }
            break;
          case 'UPDATED':
            let index = prev.Circle.amendments.findIndex(
              a => a.id === amendment.id,
            );
            prev.Circle.amendments[index] = amendment;
            break;
          case 'DELETED':
            let i = prev.Circle.amendments.findIndex(
              a => a.id === previousValues.id,
            );
            prev.Circle.amendments.splice(i, 1);
            break;
          default:
            break;
        }
        return prev;
      },
    });
  };
  render() {
    let { user } = this.props;
    let circle = null;
    let amendments = [];

    return (
      <Query
        query={GET_AMENDMENTS_FROM_CIRCLE_ID}
        variables={{ id: this.props.activeCircle || '' }}
        fetchPolicy={'cache-and-network'}
      >
        {({ data = {}, subscribeToMore }) => {
          if (data.Circle) {
            circle = data.Circle;
            amendments = data.Circle.amendments;
            this._subToMore(subscribeToMore);
          }
          if (circle) {
            return (
              <div id='docs-wrapper'>
                <div className='flex justify-between items-center ph2 mobile-nav'>
                  <Link to='/app' className='flex justify-center items-center'>
                    <FeatherIcon
                      icon='chevron-left'
                      className='white db dn-l'
                      onClick={this.back}
                    />
                  </Link>
                  <h2 className='ma3 lh-title white'> Constitution </h2>
                  {user && (
                    <Link
                      to={`/app/circle/${circle.id}/add/amendment`}
                      className='icon-wrapper'
                    >
                      <FeatherIcon icon='plus' />
                    </Link>
                  )}
                </div>

                <div className='pa2 pa4-ns white wrapper mobile-body'>
                  <div className='f6 mt3 mb4'>{circle.preamble}</div>
                  <Scrollbars style={{ width: '100%', height: '70vh' }}>
                    {amendments &&
                      amendments.map((amendment, i) => (
                        <Amendment
                          key={i}
                          editable={user !== null}
                          updateItem={this.updateItem}
                          amendment={amendment}
                          addSub={this.addSub}
                          circle={circle}
                          user={user}
                        />
                      ))}
                  </Scrollbars>
                </div>
              </div>
            );
          } else {
            return (
              <div
                id='docs-wrapper'
                style={{
                  justifyContent: 'center',
                  alignItems: 'center',
                  display: 'flex',
                  flexDirection: 'column',
                }}
              >
                <Loader />
                <div className='f3 pb2 b mv4 tc'>Loading Constitution</div>
              </div>
            );
          }
        }}
      </Query>
    );
  }
}

function mapStateToProps(state) {
  return {
    user: pull(state, 'user'),
    activeCircle: pull(state, 'activeCircle'),
  };
}

export default connect(mapStateToProps)(Constitution);