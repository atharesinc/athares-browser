import React, { useState, useGlobal } from 'reactn';
import { AtSign, Lock } from 'react-feather';
import swal from 'sweetalert';
import { Link, withRouter } from 'react-router-dom';
import { validateLogin } from '../utils/validators';

import sha from 'simple-hash-browser';
import { SIGNIN_USER } from '../graphql/mutations';
import { graphql } from 'react-apollo';

function MiniLogin(props) {
  const [password, setPassword] = useState('');
  const [email, setEmail] = useState('');
  const [, setLoading] = useState(false);

  const [setUser] = useGlobal('setUser');
  const [setPub] = useGlobal('setPub');

  const tryLogin = async e => {
    setLoading(true);
    e.preventDefault();
    const isValid = validateLogin({ email, password });

    if (isValid !== undefined) {
      swal('Error', isValid[Object.keys(isValid)[0]][0], 'error');
      setLoading(false);
      return false;
    }
    const { signinUser } = props;
    let hashedToken = await sha(password);

    try {
      const res = await signinUser({
        variables: {
          email,
          password: hashedToken,
        },
      });

      const {
        data: {
          signinUser: { token, userId },
        },
      } = res;

      //store in redux
      window.localStorage.setItem('ATHARES_ALIAS', email);
      window.localStorage.setItem('ATHARES_HASH', hashedToken);
      window.localStorage.setItem('ATHARES_TOKEN', token);
      setUser(userId);
      setPub(hashedToken);
      setLoading(false);
    } catch (err) {
      if (err.message.indexOf('Invalid Credentials') !== -1) {
        swal('Error', 'Invalid Credentials', 'error');
      } else {
        swal('Error', err.message, 'error');
      }
      setLoading(false);
    }
  };
  const updateInfo = () => {
    setPassword(document.getElementById('loginPassword').value);
    setEmail(document.getElementById('loginEmail').value);
  };

  return (
    <form
      id='portal-login'
      className='wrapper w-100 slideInFromRight'
      onSubmit={tryLogin}
    >
      <div className='portal-input-wrapper'>
        <AtSign className='portal-input-icon h1 w1' />
        <input
          placeholder='Email'
          className='portal-input h2 ghost pa2 mv2'
          required
          type='email'
          onChange={updateInfo}
          value={email}
          id='loginEmail'
          tabIndex='1'
        />
      </div>
      <div className='portal-input-wrapper'>
        <Lock className='portal-input-icon h1 w1' />
        <input
          type='password'
          className='portal-input h2 ghost pa2 mv2'
          placeholder='Password'
          id='loginPassword'
          onChange={updateInfo}
          value={password}
          tabIndex='2'
        />
      </div>
      <button
        id='login-button'
        className='f6 link dim br-pill ba bg-white bw1 ph3 pv2 mb2 dib black'
        onClick={tryLogin}
        tabIndex='3'
      >
        LOGIN
      </button>
      <Link to='policy'>
        <div className='white-70 dim ph4 pv2 f6'>Privacy Policy</div>
      </Link>
    </form>
  );
}

export default graphql(SIGNIN_USER, {
  name: 'signinUser',
})(withRouter(MiniLogin));
