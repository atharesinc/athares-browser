import React, { useState } from 'react';
import { connect } from 'react-redux';
import { pull } from '../store/state/reducers';
import { updateCircle } from '../store/state/actions';
import swal from 'sweetalert';
import FeatherIcon from 'feather-icons-react';
import { Link } from 'react-router-dom';
import LeaveCircle from './LeaveCircle';
import ShareCircle from './ShareCircle';
import CirclePrefs from './CirclePrefs';
import ScrollBars from 'react-custom-scrollbars';

function Settings (){
useEffect(()=>{
 componentMount();
}, [])

const componentMount =    => {
    // verify this circle is real and that the user is logged in, but for now...
    if (!props.user || !props.activeCircle) {
      props.history.replace('/app');
    }
  }
  componentDidUpdate() {
    if (!props.user || !props.activeCircle) {
      props.history.replace('/app');
    }
  }
  const leaveCircle = e => {
    e.preventDefault();
    let { activeCircle, user } = props;

    swal("Are you sure you'd like to leave this Circle?", {
      buttons: {
        cancel: 'Not yet',
        confirm: true,
      },
    }).then(async value => {
      if (value === true) {
        props.deleteUserFomCircle({
          variables: {
            user,
            circle: activeCircle,
          },
        });
        swal(
          'Removed From Circle',
          `You have left this Circle. You will have to be re-invited to participate at a later time.`,
          'warning',
        );
        props.dispatch(updateCircle(null));
        props.history.push(`/app`);
      }
    });
  };
  const back = () => {
    props.history.push(`/app`);
  };
  
    let { user, activeCircle } = props;
    return (
      <div id='revisions-wrapper'>
        <div className='flex ph2 mobile-nav'>
          <Link to='/app' className='flex justify-center items-center'>
            <FeatherIcon
              icon='chevron-left'
              className='white db dn-l'
              onClick={this.back}
            />
          </Link>
          <h2 className='ma3 lh-title white'> Settings </h2>
        </div>
        <div
          id='create-circle-form'
          className='pa2 pa4-ns white wrapper mobile-body'
        >
          <ScrollBars
            style={{ width: '100%', height: '100%' }}
            autoHide
            autoHideTimeout={1000}
            autoHideDuration={200}
            universal={true}
          >
            <ShareCircle />
            <CirclePrefs user={user} activeCircle={activeCircle} />
            <LeaveCircle />
          </ScrollBars>
        </div>
      </div>
    );
}

function mapStateToProps(state) {
  return {
    user: pull(state, 'user'),
    activeCircle: pull(state, 'activeCircle'),
  };
}

export default connect(mapStateToProps)(Settings);
