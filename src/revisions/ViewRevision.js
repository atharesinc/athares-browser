import React, { Component } from 'react';
import RevisionHeader from './RevisionHeader';
import RevisionStats from './RevisionStats';
import VoteButtons from './VoteButtons';
import RevisionStatus from './RevisionStatus';
import ToggleDiffBar from './ToggleDiffBar';
import DiffSection from './DiffSection';
import HasVoted from './HasVoted';
import { Scrollbars } from 'react-custom-scrollbars';
import {
  updateRevision,
  updateChannel,
  updateCircle,
} from '../store/state/actions';
import Loader from '../components/Loader.js';
import moment from 'moment';
import { pull } from '../store/state/reducers';
import { connect } from 'react-redux';
import { withRouter, Link } from 'react-router-dom';
import FeatherIcon from 'feather-icons-react';
import { graphql } from 'react-apollo';
import compose from 'lodash.flowright';

import { CREATE_VOTE, UPDATE_VOTE } from '../graphql/mutations';

import {
  GET_REVISION_BY_ID,
  IS_USER_IN_CIRCLE,
} from '../graphql/queries';
import swal from 'sweetalert';

class ViewRevision extends Component {
  constructor(props) {
    super(props);
    this.state = {
      mode: 0,
    };
    this._isMounted = false;
  }
  componentDidMount() {
    if (
      !this.props.activeRevision ||
      this.props.activeRevision !== this.props.match.params.id
    ) {
      this.props.dispatch(updateRevision(this.props.match.params.id));
      this.props.dispatch(
        updateCircle(this.props.match.url.match(/circle\/(.+)\/rev/)[1]),
      );
      this.props.dispatch(updateChannel(null));
    }
  }

  toggleMode = num => {
    this.setState({
      mode: num,
    });
  };
  vote = async support => {
    let { activeRevision, data, isUserInCircle, activeCircle } = this.props;

    // make sure the user belongs to this circle
    if (
      !isUserInCircle ||
      !isUserInCircle.allCircles ||
      isUserInCircle.allCircles[0].id !== activeCircle
    ) {
      return false;
    }
    if (data.Revision) {
      const { votes, ...revision } = data.Revision;
      // If the user attempts to vote after the revision expires, stop and return;
      if (moment().valueOf() >= moment(revision.expires).valueOf()) {
        return false;
      }

      const hasVoted = votes.find(({ user: { id } }) => id === this.props.user);
      try {
        if (hasVoted) {
          // update this user's existing vote
          await this.props.updateVote({
            variables: {
              vote: hasVoted.id,
              support,
            },
          });
        } else {
          // create a new vote, this user hasn't voted yet
          this.props.createVote({
            variables: {
              revision: activeRevision,
              user: this.props.user,
              support,
            },
          });
        }
      } catch (err) {
        console.error(new Error(err));
        swal('Error', 'Unable to cast vote. Please try again later', 'error');
      }
    }
  };
  checkIfPass = () => {
    this.forceUpdate();
  };
  render() {
    let revision = null;
    let belongsToCircle = false;
    const { data = {}, isUserInCircle, activeCircle } = this.props;

    if (data.Revision && isUserInCircle) {
      if (
        isUserInCircle.allCircles &&
        isUserInCircle.allCircles.length !== 0 &&
        isUserInCircle.allCircles[0].id === activeCircle
      ) {
        belongsToCircle = true;
      }
      revision = data.Revision;
      const { newText, title, votes } = revision;

      const support = votes.filter(({ support }) => support).length;
      const hasVoted = votes.find(({ user: { id } }) => id === this.props.user);
      const hasExpired =
        moment().valueOf() >= moment(revision.expires).valueOf();
      if (revision.amendment) {
        /* Represents a change to existing legislation; Show diff panels   */
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
              <h2 className='ma3 lh-title white'>{title}</h2>
            </div>
            <Scrollbars style={{ height: '90vh', width: '100%' }}>
              <RevisionHeader
                title={title}
                isNew={false}
                isRepeal={revision.repeal}
              />

              {hasVoted && <HasVoted vote={hasVoted} />}
              <div className='bg-theme ma2 ma4-ns'>
                <RevisionStatus {...revision} support={support} />
                <DiffSection {...revision} mode={this.state.mode} />
                {revision.amendment && revision.repeal === false && (
                  <ToggleDiffBar
                    mode={this.state.mode}
                    toggle={this.toggleMode}
                  />
                )}
                <RevisionStats
                  {...revision}
                  support={support}
                  hasExpired={hasExpired}
                />
                {this.props.user && !hasExpired && belongsToCircle && (
                  <VoteButtons vote={this.vote} />
                )}{' '}
              </div>
            </Scrollbars>
          </div>
        );
      } else {
        /* Represents a new revision; Show single panel */
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
              <h2 className='ma3 lh-title white'>{title}</h2>
            </div>
            <Scrollbars style={{ height: '90vh', width: '100%' }}>
              <RevisionHeader title={title} isNew={true} />
              {hasVoted && <HasVoted vote={hasVoted} />}

              <div className='bg-theme ma2 ma4-ns'>
                <RevisionStatus {...revision} support={support} />
                <div className='pa3 white pre-wrap'>
                  <Scrollbars
                    style={{
                      height: '11em',
                      width: '100%',
                    }}
                  >
                    {newText}
                  </Scrollbars>
                </div>
                <RevisionStats
                  {...revision}
                  support={support}
                  hasExpired={hasExpired}
                  checkIfPass={this.checkIfPass}
                />
                {this.props.user && !hasExpired && belongsToCircle && (
                  <VoteButtons vote={this.vote} />
                )}
              </div>
            </Scrollbars>
          </div>
        );
      }
    } else {
      return (
        <div id='docs-wrapper' className='column-center'>
          <Loader />
          <div className='f3 pb2 b mv4 tc'>Fetching Revision</div>
        </div>
      );
    }
  }
}
function mapStateToProps(state) {
  return {
    user: pull(state, 'user'),
    activeCircle: pull(state, 'activeCircle'),
    activeRevision: pull(state, 'activeRevision'),
  };
}

export default connect(mapStateToProps)(
  compose(
    graphql(CREATE_VOTE, { name: 'createVote' }),
    graphql(UPDATE_VOTE, { name: 'updateVote' }),
    graphql(IS_USER_IN_CIRCLE, {
      name: 'isUserInCircle',
      options: ({ activeCircle, user }) => ({
        variables: { circle: activeCircle || '', user: user || '' },
      }),
    }),
    graphql(GET_REVISION_BY_ID, {
      options: ({ activeRevision }) => ({
        variables: { id: activeRevision || '' },
        pollInterval: 5000,
      }),
    }),
  )(withRouter(ViewRevision)),
);
