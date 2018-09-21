import React, { Component } from 'react';
import Circle from './Circle';
import Loader from '../Loader';
import { withRouter } from 'react-router-dom';
import { Scrollbars } from 'react-custom-scrollbars';
import * as stateSelectors from "../../store/state/reducers";
import {updateCircle} from "../../store/state/actions";
import {withGun} from "../../utils/react-gun";
import {connect} from "react-redux";

class OtherCircles extends Component {
  state = {
    user: this.props.user,
    circles: []
  };

  componentDidMount(){
    if(this.props.user){
      // get this user's circles
      let circles = [];
      this.props.gun.get(this.props.user).get("circles").map((circle)=>{
        circles.push(circle);
      });
      this.setState({
        circles
      });
    }
  }
  setActive = (id) => {
    // this.props.setActiveCircle({ variables: { id } });
    this.props.dispatch(updateCircle(id));
    this.props.history.push('/app/circle/' + id);
  };
  render() {
    const { circles, user } = this.state;
    // if (loading) {
    //   return (
    //     <div id="other-circles">
    //       <Loader />
    //     </div>
    //   );
    // } else if (error) {
    //   return (
    //     <div id="other-circles">
    //       <div>Error</div>
    //     </div>
    //   );
    // } else if (allCircles.length !== 0) {
      return (
        <div id="other-circles">
          <Scrollbars style={{ width: '100%', height: '100%' }} className="splash" autoHide autoHideTimeout={1000} autoHideDuration={200} universal={true}>
            {circles.map((circle) => <Circle key={circle.id} {...circle} isActive={circle.id === this.props.activeCircle} selectCircle={this.setActive} />)}
          </Scrollbars>
        </div>
      );
    // } else {
    //   return <div id="other-circles" />;
    // }
  }
}


function mapStateToProps(state) {
    return {
      user: stateSelectors.pull(state, "user"),
      activeCircle: stateSelectors.pull(state, "activeCircle")
    }
  }

export default withRouter(connect(mapStateToProps)(OtherCircles));

