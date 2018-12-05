import React, { Component } from 'react';
import { withGun } from 'react-gun';
import { connect } from 'react-redux';
import { pull } from '../../../store/state/reducers';
import { updateCircle } from '../../../store/state/actions';
import Loader from '../../../components/Loader';
import Gun from 'gun';
import swal from 'sweetalert';
import 'gun/lib/unset';
import FeatherIcon from 'feather-icons-react';
import { Link } from 'react-router-dom';

class CreateChannel extends Component {
    constructor(props) {
        super(props);

        this.state = {
            activeCircle: null,
            loading: true
        };
    }
    componentDidMount() {
        // verify this circle is real and that the user is logged in, but for now...
        if (!this.props.user || !this.props.activeCircle) {
            this.props.history.push('/app');
        }
        let circle = this.props.circles.find(
            c => c.id && c.id === this.props.activeCircle
        );

        this.setState({ activeCircle: circle, loading: false });
    }

    leaveCircle = e => {
        e.preventDefault();
        let { activeCircle } = this.state;

        swal("Are you sure you'd like to leave this Circle?", {
            buttons: {
                cancel: 'Not yet',
                confirm: true
            }
        }).then(async value => {
            if (value === true) {
                let gunRef = this.props.gun;

                let user = gunRef.user();
                let circleRef = gunRef.get(activeCircle.id);

                user.get('circles')
                    .get(activeCircle.id)
                    .put({ ignore: true });

                // remove the user from this circle (node wise)
                gunRef
                    .get(activeCircle.id)
                    .get('users')
                    .get(gunRef.user(this.props.pub));

                swal(
                    'Removed From Circle',
                    `You have willfully left ${
                        activeCircle.name
                    }. You will have to be re-invited to participate at a later time.`,
                    'warning'
                );
                this.props.dispatch(updateCircle(null));
                this.props.history.push(`/app`);
            }
        });
    };
    back = () => {
        this.props.history.push(`/app`);
    };
    render() {
        const { loading, activeCircle } = this.state;

        if (loading) {
            return (
                <div
                    id='dashboard-wrapper'
                    style={{ justifyContent: 'center' }}
                    className='pa2'>
                    <Loader />
                </div>
            );
        }
        return (
            <div id='revisions-wrapper'>
                <div className='flex db-ns ph2 mobile-nav'>
                    <Link
                        to='/app'
                        className='flex justify-center items-center'>
                        <FeatherIcon
                            icon='chevron-left'
                            className='white db dn-ns'
                            onClick={this.back}
                        />
                    </Link>
                    <h2 className='ma3 lh-title white'> Leave Circle </h2>
                </div>
                <div
                    id='create-circle-form'
                    className='pa2 pa4-ns white wrapper mobile-body'>
                    <article className='mb3'>
                        <time className='f7 ttu tracked white-80'>
                            Leave the Circle {activeCircle.name}
                        </time>
                    </article>
                    <div id='comment-desc' className='f6 white-80'>
                        By pressing "Leave Circle" you are choosing to be
                        removed from participation in all circle communication,
                        notifications, channels, and revisions. You can still
                        view all public information about this circle, but you
                        will not be able to use it's channels, or cast votes in
                        revision polls.
                        <br />
                        <br />
                        If you would like to return to this Circle at a later
                        date, you will need to be re-invited by someone inside
                        the Circle.
                    </div>

                    <button
                        id='create-circle-button'
                        className='btn mt4'
                        onClick={this.leaveCircle}>
                        Leave Circle
                    </button>
                </div>
            </div>
        );
    }
}

function mapStateToProps(state) {
    return {
        user: pull(state, 'user'),
        activeCircle: pull(state, 'activeCircle'),
        circles: pull(state, 'circles')
    };
}

export default withGun(connect(mapStateToProps)(CreateChannel));
