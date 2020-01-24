import { setGlobal } from 'reactn';
import { CURRENT_USER_QUERY } from '../graphql/queries';
import { USER_SIGN_UP_MUTATION } from '../graphql/mutations';
import { client } from '../graphql';

export async function loginWithToken(token, email) {
  client.setIdToken(token);

  try {
    /**
     * Check if user exists in 8base.
     */
    const res = await client.request(CURRENT_USER_QUERY);
    return res.user.id;
  } catch {
    /**
     * If user doesn't exist, an error will be
     * thrown, which then the new user can be
     * created using the authResult values.
     */
    const res = await client.request(USER_SIGN_UP_MUTATION, {
      user: { email: email },
      authProfileId: process.env.REACT_APP_AUTH_PROFILE_ID,
    });

    return res.userSignUp.id;
  }
}

export function logout() {
  sessionStorage.clear();
  localStorage.clear();

  window.localStorage.removeItem('ATHARES_ALIAS');
  window.localStorage.removeItem('ATHARES_TOKEN');
  window.localStorage.removeItem('ATHARES_HASH');

  setGlobal({
    user: null,
    activeCircle: null,
    activeChannel: null,
    activeRevision: null,
    activeAmendment: null,
    pub: null,
    circles: [],
    channels: [],
    unreadChannels: [],
    revisions: [],
    votes: [],
    users: [],
    amendments: [],
    messages: [],
    dms: [],
    unreadDMs: [],
    dmsgs: [],
    viewUser: null,
    // ui
    showSearch: false,
    dmSettings: false,
    showAddMoreUsers: false,
    searchParams: '',
    isOnline: false,
    showMenu: false,
  });
}
