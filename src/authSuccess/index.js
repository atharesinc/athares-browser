import React from 'react';
import { withAuth } from '@8base/react-sdk';
import AtharesLoader from '../components/AtharesLoader';

class CallbackContainer extends React.Component {
  async handleAuthentication({ idToken, email }) {
    /**
     * Set Auth headers for communicating with the 8base API.
     */
    console.log(idToken, email);
    window.localStorage.setItem('ATHARES_TOKEN', idToken);
    // client.setIdToken(idToken);
    // /**
    //  * Check if user exists in 8base.
    //  */
    // try {
    //   await client.request(gql.CURRENT_USER_QUERY);
    // } catch {
    //   /**
    //    * If user doesn't exist, an error will be
    //    * thrown, which then the new user can be
    //    * created using the authResult values.
    //    */
    //   await client.request(gql.USER_SIGN_UP_MUTATION, {
    //     user: { email: email },
    //     authProfileId: process.env.REACT_APP_AUTH_PROFILE_ID,
    //   });
    // }
  }

  async componentDidMount() {
    const { auth, history } = this.props;
    /* Get authResult from auth client after redirect */
    const authResult = await auth.authClient.getAuthorizedData();
    /* Identify or create user record using authenticated details */
    await this.handleAuthentication(authResult);
    /* Add the idToken to the auth state */
    auth.authClient.setState({ token: authResult.idToken });
    /* Redirect user to app path */
    history.replace('/app');
  }

  render() {
    return (
      <AtharesLoader
        className='center'
        text={'Login Success... Loading Athares'}
      />
    );
  }
}
/* withAuth injects 'auth' prop into component */
const AuthSuccess = withAuth(CallbackContainer);

export default AuthSuccess;
