import React, { Component } from 'react';
import ErrorSwap from '../../../utils/ErrorSwap';
import { connect } from 'react-redux';
import { pull } from '../../../store/state/reducers';
import Loader from '../../../components/Loader';
import { Scrollbars } from 'react-custom-scrollbars';
import { updateChannel } from '../../../store/state/actions';
import swal from 'sweetalert';
import FeatherIcon from 'feather-icons-react';
import { Link } from 'react-router-dom';
import {
  CREATE_CHANNEL,
  ADD_CHANNEL_TO_CIRCLE,
} from '../../../graphql/mutations';
import { GET_CIRCLE_NAME_BY_ID } from '../../../graphql/queries';
import { graphql, Query } from 'react-apollo';
import compose from 'lodash.flowright';

class CreateChannel extends Component {
  constructor(props) {
    super(props);

    this.state = {
      name: '',
      description: '',
      isTaken: false,
      activeCircle: null,
      loading: false,
    };
  }
  componentDidMount() {
    // verify this circle is real and that the user is logged in, but for now...
    if (!this.props.user || !this.props.activeCircle) {
      this.props.history.replace('/app');
    }
  }
  updateName = e => {
    const name = e.target.value.substring(0, 51);
    this.setState({
      name,
      isTaken: false,
    });
  };
  updateDesc = e => {
    this.setState({
      description: e.target.value.substring(0, 301),
    });
  };
  onSubmit = async e => {
    e.preventDefault();
    if (this.state.name.trim().length === 0) {
      return false;
    }

    // /* Check if doesn't exist */

    // validate & trim fields
    // TODO: ???
    /* create channel */
    let newChannel = {
      name: this.state.name,
      description: this.state.description,
      channelType: 'group',
    };

    try {
      let newChannelRes = await this.props.createChannel({
        variables: {
          ...newChannel,
          circleId: this.props.activeCircle,
        },
      });

      const { id, name } = newChannelRes.data.createChannel;

      // let res = await this.props.addChannelToCircle({
      //   variables: {
      //     circle: this.props.activeCircle,
      //     channel: newChannel.id,
      //   },
      // });

      // let { name } = res.data.addToCircleOnChannels.circleCircle;

      swal(
        'Channel Created',
        `${this.state.name} has been created in ${name}.`,
        'success',
      );
      this.props.dispatch(updateChannel(id));
      this.props.history.push(
        `/app/circle/${this.props.activeCircle}/channel/${id}`,
      );
    } catch (err) {
      console.error(new Error(err));
    }
  };
  render() {
    let circle = null;
    return (
      <Query
        query={GET_CIRCLE_NAME_BY_ID}
        variables={{ id: this.props.activeCircle || '' }}
      >
        {({ loading, err, data = {} }) => {
          if (data) {
            circle = data.Circle;
          }
          if (this.state.loading || loading) {
            return (
              <div
                id='dashboard-wrapper'
                style={{
                  justifyContent: 'center',
                }}
                className='pa2'
              >
                <Loader />
                {this.state.loading && (
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
                  <FeatherIcon
                    icon='chevron-left'
                    className='white db dn-l'
                    onClick={this.back}
                  />
                </Link>
                <h2 className='ma3 lh-title white'> Create Channel </h2>
              </div>
              <form
                className='pa2 pa4-ns white wrapper mobile-body'
                onSubmit={this.onSubmit}
                id='create-circle-form'
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
                          value={this.state.name}
                          onChange={this.updateName}
                        />
                        <ErrorSwap
                          condition={
                            !this.state.isTaken ||
                            this.props.checkIfNameUnique.Circle.channels
                              .length !== 0
                          }
                          normal={
                            <small
                              id='name-desc'
                              className='f6 white-80 db mb2'
                            >
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
                          value={this.state.description}
                          onChange={this.updateDesc}
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
}

function mapStateToProps(state) {
  return {
    user: pull(state, 'user'),
    activeCircle: pull(state, 'activeCircle'),
    circles: pull(state, 'circles'),
  };
}

export default compose(
  graphql(CREATE_CHANNEL, { name: 'createChannel' }),
  graphql(ADD_CHANNEL_TO_CIRCLE, { name: 'addChannelToCircle' }),
)(connect(mapStateToProps)(CreateChannel));
