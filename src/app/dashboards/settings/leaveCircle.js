import React, { Component } from 'react';
import { connect } from 'react-redux';
import { pull } from '../../../store/state/reducers';
import { updateCircle } from '../../../store/state/actions';
import Loader from '../../../components/Loader';
import swal from 'sweetalert';
import {
  DELETE_USER_FROM_CIRCLE,
  DELETE_CIRCLE_PERMISSION,
} from '../../../graphql/mutations';
import {
  GET_CIRCLE_NAME_BY_ID,
  GET_CIRCLE_PREFS_FOR_USER,
} from '../../../graphql/queries';
import { graphql, Query } from 'react-apollo';
import compose from 'lodash.flowright';
import { withRouter } from 'react-router-dom';

class LeaveCircle extends Component {
  componentDidMount() {
    // verify this circle is real and that the user is logged in, but for now...
    if (!this.props.user || !this.props.activeCircle) {
      this.props.history.replace('/app');
    }
  }

  leaveCircle = e => {
    e.preventDefault();
    let { activeCircle, user } = this.props;

    swal("Are you sure you'd like to leave this Circle?", {
      buttons: {
        cancel: 'Not yet',
        confirm: true,
      },
    })
      .then(async value => {
        if (value === true) {
          let { id } = this.props.getCirclePrefs.User.circlePermissions[0];

          this.props.deleteCirclePermission({
            variables: {
              id,
            },
          });
          this.props.deleteUserFomCircle({
            variables: {
              user,
              circle: activeCircle,
            },
          });
          swal(
            'Removed From Circle',
            `You have left this Circle. You will have to be re-invited to participate at a later time.`,
            'warning',
          );
          this.props.dispatch(updateCircle(null));
          this.props.history.push(`/app`);
        }
      })
      .catch(err => {
        console.error(err);
        swal('Error', 'There was an error leaving the Circle.', 'error');
      });
  };
  back = () => {
    this.props.history.push(`/app`);
  };
  render() {
    return (
      <Query
        query={GET_CIRCLE_NAME_BY_ID}
        variables={{ id: this.props.activeCircle }}
      >
        {({ loading, data: { Circle: circle } }) => {
          if (loading) {
            return (
              <div className='w-100 flex justify-center items-center'>
                <Loader />
              </div>
            );
          }
          return (
            <div className='mv3 pa2 pv3 ba b--red'>
              <article className='mb3'>
                <time className='f4 lh-title white'>
                  Leave the Circle {circle.name}
                </time>
              </article>
              <div id='comment-desc' className='f6 white-80'>
                By pressing "Leave Circle" you will be removed from all circle
                communication. You will not be able to use it's channels, or
                vote in revision polls.
                <br />
                If you would like to return to this Circle at a later date, you
                will need to be re-invited by someone inside the Circle.
              </div>

              <button
                id='create-circle-button'
                className='btn-red mt4'
                onClick={this.leaveCircle}
              >
                Leave Circle
              </button>
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
  };
}

export default connect(mapStateToProps)(
  compose(
    graphql(GET_CIRCLE_PREFS_FOR_USER, {
      name: 'getCirclePrefs',
      options: ({ user, activeCircle }) => ({
        variables: { user: user || '', circle: activeCircle || '' },
      }),
    }),
    graphql(DELETE_USER_FROM_CIRCLE, {
      name: 'deleteUserFomCircle',
    }),
    graphql(DELETE_CIRCLE_PERMISSION, { name: 'deleteCirclePermission' }),
  )(withRouter(LeaveCircle)),
);
