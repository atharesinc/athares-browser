import { setGlobal } from 'reactn';
import { CURRENT_USER_QUERY } from '../graphql/queries';
import {
  USER_SIGN_UP_MUTATION,
  CREATE_USER_PREF,
  UPDATE_USER_GENERIC,
} from '../graphql/mutations';
import { client } from '../graphql';
import { sha, pair } from './crypto';
import SimpleCrypto from 'simple-crypto-js';

export async function updateUserWithKeys(id, pin) {
  const priv = sha(pin);

  // update user profile and encrypt priv with pin
  let simpleCrypto = new SimpleCrypto(priv);

  // create a pair
  const keys = await pair();

  await client.request(UPDATE_USER_GENERIC, {
    data: { id, pub: keys.pub, priv: simpleCrypto.encrypt(keys.priv) },
  });

  // set the pin in localStorage
  window.localStorage.setItem('ATHARES_HASH', priv);
}

export async function decryptPrivWithPin(priv, pin) {
  try {
    const hashedPIN = sha(pin);

    // create decryption object with secret pin, now hashed
    let simpleCrypto = new SimpleCrypto(hashedPIN);

    let decryptedUserPriv = simpleCrypto.decrypt(priv);

    if (decryptedUserPriv === '') {
      throw new Error('unable to decrypt');
    }
    // set the pin in localStorage
    window.localStorage.setItem('ATHARES_HASH', hashedPIN);
  } catch (e) {
    throw new Error('unable to decrypt');
  }
}

export async function loginWithToken(token, email) {
  client.setIdToken(token);

  try {
    /**
     * Check if user exists in 8base.
     */
    const res = await client.request(CURRENT_USER_QUERY);

    // create the user's preferences if they haven't already
    if (res.user.prefs === null) {
      await client.request(CREATE_USER_PREF, {
        id: res.user.id,
      });
    }

    return res.user.id;
  } catch {
    /**
     * If user doesn't exist, an error will be
     * thrown, and the new user can be
     * created using the authResult values.
     */
    const res = await client.request(USER_SIGN_UP_MUTATION, {
      user: {
        email: email,
        icon: '/img/user-default.png',
      },
      authProfileId: process.env.REACT_APP_AUTH_PROFILE_ID,
    });

    await client.request(CREATE_USER_PREF, {
      id: res.userSignUp.id,
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
