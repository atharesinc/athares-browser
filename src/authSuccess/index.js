import React, { withGlobal } from 'reactn';
import { withAuth } from '@8base/react-sdk';
import AtharesLoader from '../components/AtharesLoader';
import { withApollo } from 'react-apollo';
import compose from 'lodash.flowright';
import { loginWithToken } from '../utils/auth';

class CallbackContainer extends React.Component {
  async handleAuthentication({ idToken, email, ...rest }) {
    /**
     * Set Auth headers for communicating with the 8base API.
     */

    window.localStorage.setItem('ATHARES_TOKEN', idToken);
    window.localStorage.setItem('ATHARES_ALIAS', email);

    try {
      const id = await loginWithToken(idToken, email);
      this.setGlobal({ user: id });
    } catch (e) {
      console.error(e);
    }
  }

  async componentDidMount() {
    const { auth, history } = this.props;

    /* Get authResult from auth client after redirect */
    const authResult = await auth.authClient.getAuthorizedData();

    /* Identify or create user record using authenticated details */
    await this.handleAuthentication(authResult);

    /* Add the idToken to the auth state, this becomes the Authorization: Bearer ... header in GraphQL requests to 8base*/
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
export default withGlobal(({ user }) => ({
  user,
}))(compose(withAuth, withApollo)(CallbackContainer));
