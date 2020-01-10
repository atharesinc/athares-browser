import React, { useState, useGlobal, useEffect } from 'reactn';
import AtharesLoader from '../components/AtharesLoader';
import { Loader } from 'react-feather';
import { CREATE_INVITE } from '../graphql/mutations';
import { GET_CIRCLE_NAME_BY_ID } from '../graphql/queries';
import { graphql, Query } from 'react-apollo';
import { withRouter } from 'react-router-dom';
import swal from 'sweetalert';

let urlBase =
  process.env.NODE_ENV === 'development'
    ? 'http://localhost:3000/invite/'
    : 'https://www.athares.us/invite/';

function ShareCircle(props) {
  const [loading, setLoading] = useState(false);
  const [link, setLink] = useState(null);
  const [user] = useGlobal('user');
  const [activeCircle] = useGlobal('activeCircle');
  useEffect(() => {
    if (!user || !activeCircle) {
      props.history.replace('/app');
    }
  }, [user, activeCircle, props.history]);

  const generateLink = async () => {
    setLoading(true);
    setLink(null);

    try {
      let link = await props.createInvite({
        variables: {
          inviter: user,
          circle: activeCircle,
        },
      });

      let { id } = link.data.createInvite;

      setLink(id);
      setLoading(false);
    } catch (err) {
      console.error(new Error(err));
      setLoading(false);

      swal('Error', 'Unable to generate invite link.', 'error');
    }
  };

  return (
    <Query query={GET_CIRCLE_NAME_BY_ID} variables={{ id: activeCircle }}>
      {({ loading: loadingData, data: { Circle: circle } = {} }) => {
        if (loading || loadingData) {
          return (
            <div className='w-100 flex justify-center items-center'>
              <AtharesLoader />
            </div>
          );
        }
        return (
          <div className='pa2 pv3 bb b--white-70'>
            <article className='mb3'>
              <time className='f4 lh-title white'>Share Circle</time>
            </article>
            <div id='comment-desc' className='f6 white-80'>
              Invite someone to {circle.name} with a single-use link.
              Prospective users will have the option to sign up if they don't
              have an Athares account.
            </div>

            {!loading ? (
              <button
                id='create-circle-button'
                className='btn mt4'
                onClick={generateLink}
              >
                {link ? 'Create New Link' : 'Generate Link'}
              </button>
            ) : (
              <Loader className='spin white mt4' />
            )}
            {link && (
              <pre
                className='springUp ba b--white-70 pa3'
                style={{ maxWidth: '100%', overflowX: 'scroll' }}
              >
                {urlBase + link}
              </pre>
            )}
          </div>
        );
      }}
    </Query>
  );
}

export default graphql(CREATE_INVITE, {
  name: 'createInvite',
})(withRouter(ShareCircle));
