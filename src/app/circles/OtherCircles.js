import React, { PureComponent } from 'react';
import Circle from './Circle';
import { withRouter } from 'react-router-dom';
import { Scrollbars } from 'react-custom-scrollbars';
import { pull } from '../../store/state/reducers';
import { updateCircle } from '../../store/state/actions';
import { withGun } from 'react-gun';
import { connect } from 'react-redux';

class OtherCircles extends PureComponent {
    state = {
        user: this.props.user,
        circles: []
    };
    componentDidMount() {
        let user = this.props.gun.user();
        user.get('circles').open(circles => {
            console.log(circles);
            if (circles) {
                this.setState({
                    circles
                });
            }
        });
    }
    setActive = id => {
        this.props.dispatch(updateCircle(id));
        this.props.history.push(`/app/circle/${id}`);
    };
    render() {
        const { circles } = this.state;
        return (
            <div id='other-circles'>
                <Scrollbars
                    style={{ width: '100%', height: '100%' }}
                    className='splash'
                    autoHide
                    autoHideTimeout={1000}
                    autoHideDuration={200}
                    universal={true}>
                    {circles.map(circle => (
                        <Circle
                            key={circle.id}
                            {...circle}
                            isActive={circle.id === this.props.activeCircle}
                            selectCircle={this.setActive}
                        />
                    ))}
                </Scrollbars>
            </div>
        );
    }
}

function mapStateToProps(state) {
    return {
        user: pull(state, 'user'),
        activeCircle: pull(state, 'activeCircle'),
        pub: pull(state, 'pub'),
        circles: pull(state, 'circles')
    };
}

export default withGun(withRouter(connect(mapStateToProps)(OtherCircles)));
