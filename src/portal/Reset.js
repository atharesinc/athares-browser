import React, { useState, Fragment } from 'reactn';
import {
  UPDATE_USER_PASSWORD,
  DELETE_RESET_REQUEST,
} from '../graphql/mutations';
import { GET_RESET_REQUEST, GET_USER_BY_EMAIL } from '../graphql/queries';
import { parseDate } from '../utils/transform';
import { graphql } from 'react-apollo';
import compose from 'lodash.flowright';
import { withRouter } from 'react-router-dom';
import swal from 'sweetalert';
import { Link, Lock } from 'react-feather';
import sha from 'simple-hash-browser';
import AtharesLoader from '../components/AtharesLoader';
import { addHours } from 'date-fns';

function Reset(props) {
  const [loading, setLoading] = useState(false);
  const [code, setCode] = useState('');
  const [password, setPassword] = useState('');
  const [showReset, setShowReset] = useState(false);

  const checkIfExpired = () => {
    if (
      !props.data.ResetRequest ||
      parseDate(addHours(new Date(props.data.ResetRequest.createdAt), 24)) <=
        parseDate()
    ) {
      swal('Error', 'This code is invalid or has expired.', 'error');
      return false;
    }
    return true;
  };

  const check = async () => {
    let valid = checkIfExpired();
    if (valid === false) {
      return false;
    }
    setCode(code.trim().toLowerCase());

    let { token, id } = props.data.ResetRequest;

    if (id !== props.match.params.id) {
      return false;
    }

    if (code === '') {
      return false;
    }

    if ((await sha(code)) !== token) {
      return false;
    }
    setShowReset(true);
  };

  const resetPassword = async () => {
    setLoading(true);

    const { id, token } = props.data.ResetRequest;
    const { User } = props.getUser;

    if (id !== props.match.params.id) {
      return false;
    }

    setCode(code.trim().toLowerCase());

    if ((await sha(code)) !== token) {
      return false;
    }
    if (password.trim() === '') {
      swal('Error', 'Password cannot be blank', 'error');
      return false;
    }

    try {
      let hashedPass = await sha(password);
      await props.updateUserPassword({
        variables: {
          user: User.id,
          password: hashedPass,
        },
      });
      await props.deleteResetRequest({
        variables: {
          id,
        },
      });
      if (localStorage.getItem('ATHARES_HASH')) {
        localStorage.setItem('ATHARES_HASH', hashedPass);
      }
      props.history.push('/login');
      setLoading(false);
    } catch (err) {
      console.error(new Error(err));
      swal('Error', 'Unable to update password at this time.', 'error');
      setLoading(false);
    }
  };

  const updateCode = e => {
    setCode(e.currentTarget.value.toUpperCase());
  };

  const updatePassword = e => {
    setPassword(e.currentTarget.value);
  };

  return (
    <Fragment>
      <div id='portal-header'>
        <img
          src='/img/Athares-owl-logo-large-white.png'
          id='portal-logo'
          alt='logo'
        />
        <img
          src='/img/Athares-type-small-white.png'
          id='portal-brand'
          alt='brand'
        />
      </div>

      {loading ? (
        <div className='w-100 w-50-l flex flex-column justify-around items-center'>
          <AtharesLoader />
        </div>
      ) : showReset === false ? (
        <Fragment>
          <div className='w-100 w-50-l flex flex-column justify-around items-center'>
            <p className='portal-text'>
              Enter the code sent to your email address.
            </p>
            <div className='portal-input-wrapper mb3'>
              <Link className='portal-input-icon h1 w1' />
              <input
                placeholder='Code'
                className='portal-input h2 ghost pa2'
                required
                type='text'
                onChange={updateCode}
                value={code}
                id='recoverCode'
                tabIndex='1'
              />
            </div>
            <button
              id='forgot-button'
              className='f6 link glow br-pill ph3 pv2 bg-theme mb2 dib white pointer'
              tabIndex='2'
              onClick={check}
            >
              VERIFY CODE
            </button>
          </div>
        </Fragment>
      ) : (
        <Fragment>
          <div className='w-100 w-50-l flex flex-column justify-around items-center'>
            <p className='portal-text'>
              Enter a new password for this account.
            </p>
            <div className='portal-input-wrapper mb3'>
              <Lock className='portal-input-icon h1 w1' />
              <input
                placeholder='New Password'
                className='portal-input h2 ghost pa2'
                required
                type='password'
                onChange={updatePassword}
                value={password}
                id='newPassword'
                tabIndex='1'
              />
            </div>
            <button
              className='f6 link glow br-pill ph3 pv2 bg-theme mb2 dib white pointer'
              tabIndex='2'
              onClick={resetPassword}
            >
              RESET PASSWORD
            </button>
          </div>
        </Fragment>
      )}
    </Fragment>
  );
}

export default withRouter(
  compose(
    graphql(UPDATE_USER_PASSWORD, { name: 'updateUserPassword' }),
    graphql(DELETE_RESET_REQUEST, { name: 'deleteResetRequest' }),
    graphql(GET_RESET_REQUEST, {
      options: ({ match }) => ({ variables: { id: match.params.id || '' } }),
    }),
    graphql(GET_USER_BY_EMAIL, {
      name: 'getUser',
      options: ({ data }) => ({
        variables: { email: data.ResetRequest ? data.ResetRequest.email : '' },
      }),
    }),
  )(Reset),
);
