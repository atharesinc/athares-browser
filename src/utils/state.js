import { setGlobal } from "reactn";

export function logout() {
  sessionStorage.clear();
  localStorage.clear();

  window.localStorage.removeItem("ATHARES_ALIAS");
  window.localStorage.removeItem("ATHARES_TOKEN");
  window.localStorage.removeItem("ATHARES_HASH");

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
    searchParams: "",
    isOnline: false,
    showMenu: false
  });
}
