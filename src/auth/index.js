import React from 'react';
import { withAuth } from '@8base/app-provider';
import AtharesLoader from '../components/AtharesLoader';

class AuthContainer extends React.Component {
  async componentDidMount() {
    const { auth } = this.props;

    await auth.authClient.authorize();
  }

  render() {
    return (
      <AtharesLoader
        className='center'
        text={'Redirecting to Secure Login...'}
      />
    );
  }
}

const AuthRedirect = withAuth(AuthContainer);

export default AuthRedirect;
