import { useState } from "reactn";

import { pull } from "../store/ui/reducers";
import { updateOnlineStatus } from "../store/ui/actions";

function OnlineMonitor (){
  
    this.timer = null;
  
useEffect(()=>{
 componentMount();
}, [])

const componentMount =    => {
    this.timer = setInterval(this.checkOnline, 2000);
  }
  componentWillUnmount() {
    clearInterval(this.timer);
  }
  const checkOnline = e => {
    if (navigator.onLine !== props.isOnline) {
      props.dispatch(updateOnlineStatus(navigator.onLine));
    }
  };
  shouldComponentUpdate(nextProps) {
    return nextProps.isOnline !== props.isOnline;
  }
  
    return null;
  }
}
function mapStateToProps(state) {
  return {
    isOnline: pull(state, "isOnline")
  };
}
export default connect(mapStateToProps)(OnlineMonitor);
