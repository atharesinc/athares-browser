import React, { useGlobal, useEffect } from 'reactn';
import Amendment from './Amendment';
import AtharesLoader from '../components/AtharesLoader.js';
import { Link } from 'react-router-dom';
import { Scrollbars } from 'react-custom-scrollbars';
import { GET_AMENDMENTS_FROM_CIRCLE_ID } from '../graphql/queries';
import { Query } from 'react-apollo';
import { SUB_TO_CIRCLES_AMENDMENTS } from '../graphql/subscriptions';

import { Plus, ChevronLeft } from 'react-feather';

function Constitution(props) {
  const [user] = useGlobal('user');
  const [activeCircle, setActiveCircle] = useGlobal('activeCircle');
  const [, setActiveChannel] = useGlobal('activeChannel');
  const [, setActiveRevision] = useGlobal('activeRevision');

  useEffect(() => {
    // we only need to manually fetch the circle and it's amendments if the user isn't signed in
    // we should always make sure that the currently navigated-to circle is the activeCircle in redux
    if (activeCircle) {
      setActiveChannel(null);
      setActiveRevision(null);
    } else {
      let circleID = props.match.params.id;

      setActiveCircle(circleID);
      setActiveChannel(null);
      setActiveRevision(null);
    }
  }, [
    activeCircle,
    setActiveChannel,
    setActiveRevision,
    props.match.params.id,
    setActiveCircle,
  ]);

  const back = () => {
    props.history.push(`/app`);
  };

  const _subToMore = subscribeToMore => {
    subscribeToMore({
      document: SUB_TO_CIRCLES_AMENDMENTS,
      variables: { id: activeCircle || '' },
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

  let circle = null;
  let amendments = [];

  return (
    <Query
      query={GET_AMENDMENTS_FROM_CIRCLE_ID}
      variables={{ id: activeCircle || '' }}
      fetchPolicy={'cache-and-network'}
    >
      {({ data = {}, subscribeToMore }) => {
        if (data.circle) {
          circle = data.circle;
          amendments = data.circle.amendments.items;
          _subToMore(subscribeToMore);
        }
        if (circle) {
          return (
            <div id='docs-wrapper'>
              <div className='flex justify-between items-center ph2 mobile-nav'>
                <Link to='/app' className='flex justify-center items-center'>
                  <ChevronLeft className='white db dn-l' onClick={back} />
                </Link>
                <h2 className='ma3 lh-title white'> Constitution </h2>
                {user && (
                  <Link
                    to={`/app/circle/${circle.id}/add/amendment`}
                    className='icon-wrapper'
                  >
                    <Plus />
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
                        // updateItem={updateItem}
                        amendment={amendment}
                        // addSub={addSub}
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
              <AtharesLoader />
              <div className='f3 pb2 b mv4 tc'>Loading Constitution</div>
            </div>
          );
        }
      }}
    </Query>
  );
}

export default Constitution;
