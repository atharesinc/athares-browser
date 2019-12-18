import { useState  } from 'react';

import { connect } from 'react-redux';

import { updateChannel, updateRevision } from '../store/state/actions';
import { withRouter } from 'react-router-dom';
// import { withGun } from 'react-gun';

function Constitution (){
useEffect(()=>{
 componentMount();
}, [])

const componentMount =      => {
        props.dispatch(updateChannel(null));
        props.dispatch(updateRevision(null));
        props.history.replace('/app');
    }
    
        return null;
    }
}

function mapStateToProps(state) {
    return {};
}

export default withRouter(connect(mapStateToProps)(Constitution));
