import React, { useState, useGlobal, useEffect } from 'reactn';
import CircleInviteList from './CircleInviteList';
import swal from 'sweetalert';
import { ChevronLeft } from 'react-feather';
import { Link } from 'react-router-dom';
import { graphql } from 'react-apollo';
import compose from 'lodash.flowright';
import { ADD_USER_TO_CIRCLE } from '../graphql/mutations';

function AddUser(props) {
  const [selectedUsers, setSelectedUsers] = useState([]);
  const [user] = useGlobal('user');
  const [activeCircle, setActiveCircle] = useGlobal('activeCircle');

  useEffect(() => {
    function componentMount() {
      if (!user) {
        props.history.replace('/app');
      }
      if (!activeCircle || activeCircle !== props.match.params.id) {
        setActiveCircle(props.match.params.id);
      }
    }

    componentMount();
  }, [
    activeCircle,
    props.history,
    props.match.params.id,
    setActiveCircle,
    user,
  ]);

  useEffect(() => {
    if (!user) {
      props.history.replace('/app');
    }
  }, [user, props.history]);

  const back = () => {
    props.history.push(`/app`);
  };

  const updateList = items => {
    setSelectedUsers(items);
  };

  const onSubmit = async e => {
    e.preventDefault();
    // add each user to circle
    if (selectedUsers.length === 0) {
      return;
    }
    try {
      let invites = selectedUsers.map(user => {
        return props.addUserToCircle({
          variables: {
            user: user.id,
            circle: activeCircle,
          },
        });
      });

      Promise.all(invites).then(() => {
        swal(
          `${selectedUsers.length > 1 ? 'Users Added' : 'User Added'}`,
          `${
            selectedUsers.length > 1 ? 'These users have' : 'This user has'
          } been added.`,
          'success',
        );
        props.history.push('/app');
        // clear state
        setSelectedUsers([]);
      });
    } catch (err) {
      console.error(new Error(e));
      swal('Error', 'There was an error inviting users.', 'error');
    }
  };

  return (
    <div id='revisions-wrapper'>
      <div className='flex ph2 mobile-nav'>
        <Link to='/app' className='flex justify-center items-center'>
          <ChevronLeft className='white db dn-l' onClick={back} />
        </Link>
        <h2 className='ma3 lh-title white'> Invite Users </h2>
      </div>
      <form
        className='pa4 white wrapper mobile-body scroll-form'
        onSubmit={onSubmit}
      >
        <article className='cf'>
          <time className='f7 ttu tracked white-60'>
            Add existing users to participate in this circle
          </time>
          <div className='fn mt4'>
            <div className='mb4 ba b--white-30' id='circle-invite-list'>
              <CircleInviteList
                shouldPlaceholder={selectedUsers.length === 0}
                updateList={updateList}
                selectedUsers={selectedUsers}
              />
            </div>
          </div>
        </article>
        <div id='comment-desc' className='f6 white-60'>
          After pressing "Invite Users", the recipient(s) will be added
          automatically to this circle.
          <br />
          <br />
          Invitations aren't subject to democratic process.
        </div>
        <button id='create-circle-button' className='btn mt4' type='submit'>
          Invite Users
        </button>
      </form>
    </div>
  );
}

export default compose(
  graphql(ADD_USER_TO_CIRCLE, { name: 'addUserToCircle' }),
)(AddUser);
