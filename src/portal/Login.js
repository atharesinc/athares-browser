import React, { Fragment, Component } from 'react';
import FeatherIcon from 'feather-icons-react';
import swal from 'sweetalert';
import { Link, withRouter } from 'react-router-dom';
import { withGun } from 'react-gun';
import {
    updateUser,
    updatePub,
    updateChannel,
    updateCircle,
    updateRevision
} from '../store/state/actions';
import { validateLogin } from '../utils/validators';
import { pull } from '../store/state/reducers';
import { connect } from 'react-redux';
import { updateDesc, updateTitle } from '../store/head/actions';
import { showLoading, hideLoading } from 'react-redux-loading-bar';
import Loader from '../components/Loader';
import sha from 'simple-hash-browser';

class Login extends Component {
    constructor(props) {
        super(props);
        this.state = {
            password: '',
            email: '',
            loading: false
        };
    }

    componentDidMount() {
        if (this.props.user) {
            this.props.history.replace('/app');
        } else {
            this.props.dispatch(updateChannel(null));
            this.props.dispatch(updateCircle(null));
            this.props.dispatch(updateRevision(null));
            // Update meta tags
            this.props.dispatch(updateDesc('Log in to Athares'));
            this.props.dispatch(updateTitle('Athares - Login'));
        }
    }
    tryLogin = async e => {
        this.props.dispatch(showLoading());
        e.preventDefault();
        const isValid = validateLogin({ ...this.state });

        await this.setState({ loading: true });

        if (isValid !== undefined) {
            swal('Error', isValid[Object.keys(isValid)[0]][0], 'error');
            this.props.dispatch(hideLoading());
            return false;
        }

        let { password, email } = this.state;

        let newUser = this.props.gun.user();
        // hash our password so it's mildly more safe when stored in localstorage
        // TODO: better login persistence
        let token = await sha(password);
        newUser.auth(email, token, async ack => {
            if (ack.err) {
                // console.log(ack.err);
                if (ack.err.indexOf('Auth attempt failed!')) {
                    swal('Error', 'Incorrect password', 'error');
                } else {
                    swal(
                        'Error',
                        'No user found with that information.',
                        'error'
                    );
                }
                this.props.dispatch(hideLoading());
                // Prevent user from being able to re-attempt login
                // newUser.leave();
                // above doesn't work https://github.com/amark/gun/issues/468
                await this.setState({
                    password: '',
                    loading: false
                });
                newUser = null;
                return false;
            }
            window.localStorage.setItem('ATHARES_ALIAS', email);
            window.localStorage.setItem('ATHARES_TOKEN', token);
            newUser.get('profile').once(async profile => {
                // set the public key and id in redux to log in
                this.props.dispatch(updateUser(profile.id));
                this.props.dispatch(updatePub(ack.put.pub));
                // start listening to changes on our user
                this.props.listen();
                this.props.history.push('/app');
                this.props.dispatch(hideLoading());
                await this.setState({ loading: false });
            });
        });
    };
    updateInfo = () => {
        this.setState({
            password: document.getElementById('loginPassword').value,
            email: document.getElementById('loginEmail').value
        });
    };
    shouldComponentUpdate(nextProps, nextState) {
        return nextState !== this.state;
    }
    render() {
        const { email, password, loading } = this.state;
        return (
            <Fragment>
                <div id='portal-header'>
                    <img
                        src='/img/Athares-owl-logo-large-white.png'
                        id='portal-logo'
                        alt='logo'
                    />
                    <img
                        src='/img/Athares-type-small-white.png'
                        id='portal-brand'
                        alt='brand'
                    />
                </div>
                {loading ? (
                    <div
                        className='wrapper flex flex-row justify-center items-center'
                        id='portal-login'>
                        <Loader />
                    </div>
                ) : (
                    <form
                        className='wrapper'
                        id='portal-login'
                        onSubmit={this.tryLogin}>
                        <p className='portal-text'>Login with the form below</p>
                        <div className='portal-input-wrapper'>
                            <FeatherIcon
                                className='portal-input-icon h1 w1'
                                icon='at-sign'
                            />
                            <input
                                placeholder='Email'
                                className='portal-input h2 ghost pa2'
                                required
                                type='email'
                                onChange={this.updateInfo}
                                value={email}
                                id='loginEmail'
                                tabIndex='1'
                            />
                        </div>
                        <div className='portal-input-wrapper'>
                            <FeatherIcon
                                className='portal-input-icon h1 w1'
                                icon='lock'
                            />
                            <input
                                type='password'
                                className='portal-input h2 ghost pa2'
                                placeholder='Password'
                                id='loginPassword'
                                onChange={this.updateInfo}
                                value={password}
                                tabIndex='2'
                            />
                        </div>
                        <button
                            id='login-button'
                            className='f6 link dim br-pill ba bg-white bw1 ph3 pv2 mb2 dib black'
                            onClick={this.tryLogin}
                            tabIndex='3'>
                            LOGIN
                        </button>
                        <Link to='register'>
                            {' '}
                            <div className='switch-portal'>
                                I want to register
                            </div>
                        </Link>
                        <Link to='policy'>
                            <div className='white-70 dim ph4 pv2 f6'>
                                {' '}
                                By logging in you acknowledge that you agree to
                                the Terms of Use and have read the Privacy
                                Policy.
                            </div>
                        </Link>
                    </form>
                )}
            </Fragment>
        );
    }
}

function mapStateToProps(state) {
    return {
        user: pull(state, 'user')
    };
}
export default connect(mapStateToProps)(withRouter(withGun(Login)));
