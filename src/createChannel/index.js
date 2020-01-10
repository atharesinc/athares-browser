import React, { useState, useEffect, useGlobal } from 'reactn';
import ErrorSwap from '../utils/ErrorSwap';
import AtharesLoader from '../components/AtharesLoader';
import { Scrollbars } from 'react-custom-scrollbars';
import swal from 'sweetalert';
import { ChevronLeft } from 'react-feather';
import { Link } from 'react-router-dom';
import { CREATE_CHANNEL, ADD_CHANNEL_TO_CIRCLE } from '../graphql/mutations';
import { GET_CIRCLE_NAME_BY_ID } from '../graphql/queries';
import { graphql, Query } from 'react-apollo';
import compose from 'lodash.flowright';

function CreateChannel(props) {
  const [name, setName] = useState('');
  const [description, setDescription] = useState('');
  const [isTaken, setIsTaken] = useState(false);
  const [loading, setLoading] = useState(false);
  const [activeCircle] = useGlobal('activeCircle');
  const [, setActiveChannel] = useGlobal('activeChannel');

  const [user] = useGlobal('user');

  useEffect(() => {
    if (!user || !activeCircle) {
      props.history.replace('/app');
    }
  }, [user, activeCircle, props.history]);

  const back = () => {
    props.history.push('/app');
  };

  const updateName = e => {
    const name = e.target.value.substring(0, 51);
    setName(name);
    setIsTaken(false);
  };
  const updateDesc = e => {
    setDescription(e.target.value.substring(0, 301));
  };
  const onSubmit = async e => {
    setLoading(true);
    e.preventDefault();
    if (name.trim().length === 0) {
      return false;
    }

    // /* Check if doesn't exist */

    // validate & trim fields
    // TODO: ???
    /* create channel */
    let newChannel = {
      name: name,
      description: description,
      channelType: 'group',
    };

    try {
      let newChannelRes = await props.createChannel({
        variables: {
          ...newChannel,
          circleId: activeCircle,
        },
      });

      const { id, name } = newChannelRes.data.createChannel;

      swal(
        'Channel Created',
        `${name} has been created in ${name}.`,
        'success',
      );
      setActiveChannel(id);

      props.history.push(`/app/circle/${activeCircle}/channel/${id}`);
    } catch (err) {
      console.error(new Error(err));
    }
    setLoading(false);
  };

  let circle = null;
  return (
    <Query query={GET_CIRCLE_NAME_BY_ID} variables={{ id: activeCircle || '' }}>
      {({ loading: dataLoading, err, data = {} }) => {
        if (data) {
          circle = data.Circle;
        }
        if (loading || dataLoading) {
          return (
            <div
              id='dashboard-wrapper'
              style={{
                justifyContent: 'center',
              }}
              className='pa2'
            >
              <AtharesLoader />
              {loading && (
                <h1 className='mb3 mt0 lh-title mt4 f3 f2-ns'>
                  Creating Channel
                </h1>
              )}
            </div>
          );
        }
        return (
          <div id='revisions-wrapper'>
            <div className='flex ph2 mobile-nav'>
              <Link to='/app' className='flex justify-center items-center'>
                <ChevronLeft className='white db dn-l' onClick={back} />
              </Link>
              <h2 className='ma3 lh-title white'> Create Channel </h2>
            </div>
            <form
              className='pa2 pa4-ns white wrapper mobile-body'
              onSubmit={onSubmit}
            >
              <Scrollbars style={{ height: '90vh', width: '100%' }}>
                <article className='cf'>
                  <time className='f7 ttu tracked white-80'>
                    Create a new channel within {circle.name}
                  </time>
                  <div className='fn mt4'>
                    <div className='measure mb4'>
                      <label htmlFor='name' className='f6 b db mb2'>
                        Name
                      </label>
                      <input
                        id='name'
                        className='input-reset ba pa2 mb2 db w-100 ghost'
                        type='text'
                        aria-describedby='name-desc'
                        required
                        value={name}
                        onChange={updateName}
                      />
                      <ErrorSwap
                        condition={
                          !isTaken ||
                          props.checkIfNameUnique.Circle.channels.length !== 0
                        }
                        normal={
                          <small id='name-desc' className='f6 white-80 db mb2'>
                            This name must be unique to this Circle.
                          </small>
                        }
                        error={
                          <small id='name-desc' className='f6 red db mb2'>
                            Sorry! This name has already been taken.
                          </small>
                        }
                      />
                    </div>
                    <div className='mv4'>
                      <label htmlFor='comment' className='f6 b db mb2'>
                        Description{' '}
                        <span className='normal white-80'>(optional)</span>
                      </label>
                      <textarea
                        id='comment'
                        name='comment'
                        className='db border-box w-100 measure ba pa2 mb2 ghost'
                        aria-describedby='comment-desc'
                        resize='false'
                        maxLength='300'
                        value={description}
                        onChange={updateDesc}
                      />
                      <small id='comment-desc' className='f6 white-80'>
                        Describe this channel.
                      </small>
                    </div>
                  </div>
                </article>
                <div id='comment-desc' className='f6 white-80'>
                  By pressing "Create Channel" you will create a new channel
                  within {circle.name}.
                </div>
                <button
                  id='create-circle-button'
                  className='btn mt4'
                  type='submit'
                >
                  Create Channel
                </button>
              </Scrollbars>
            </form>
          </div>
        );
      }}
    </Query>
  );
}

export default compose(
  graphql(CREATE_CHANNEL, { name: 'createChannel' }),
  graphql(ADD_CHANNEL_TO_CIRCLE, { name: 'addChannelToCircle' }),
)(CreateChannel);
