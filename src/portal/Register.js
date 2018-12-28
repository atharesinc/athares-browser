import React, { Fragment, PureComponent } from 'react';
import FeatherIcon from 'feather-icons-react';
import { validateRegister } from '../utils/validators';
import { Link, withRouter } from 'react-router-dom';
import swal from 'sweetalert';
import Gun from 'gun/gun';
import { withGun } from 'react-gun';
import moment from 'moment';
import {
    updateUser,
    updatePub,
    updateChannel,
    updateCircle,
    updateRevision
} from '../store/state/actions';
import { connect } from 'react-redux';
import { pull } from '../store/state/reducers';
import { pair } from 'simple-asym-crypto';
import { updateDesc, updateTitle } from '../store/head/actions';
import { showLoading, hideLoading } from 'react-redux-loading-bar';
import defaultUser from './defaultUser.json';
import Loader from '../components/Loader';
import sha from 'simple-hash-browser';

class Register extends PureComponent {
    constructor(props) {
        super(props);

        this.state = {
            firstName: '',
            lastName: '',
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
            this.props.dispatch(
                updateDesc(
                    'Register with Athares, the only government platform committed to 100% transparency and secured with blockchain technology.'
                )
            );
            this.props.dispatch(updateTitle('Athares - Register'));
        }
    }
    tryRegister = async e => {
        this.props.dispatch(showLoading());

        e.preventDefault();
        await this.setState({ loading: true });

        const isValid = validateRegister({
            ...this.state
        });

        if (isValid !== undefined) {
            swal('Error', isValid[Object.keys(isValid)[0]][0], 'error');
            this.props.dispatch(showLoading());
            await this.setState({ loading: false });
            return false;
        }

        let { firstName, lastName, password, email } = this.state;
        const { random } = Gun.text;
        let gunRef = this.props.gun;
        try {
            let newUser = gunRef.user();

            let user = {
                id: 'US' + random(),
                firstName,
                lastName,
                email,
                phone: '',
                icon: defaultUser.text,
                uname: '',
                keychain: 'KC' + random(), // keychain for dms
                circleChain: 'CC' + random(), // keychain for circles
                createdAt: moment().format(),
                updatedAt: moment().format()
            };
            // hash our password so it's mildly more safe when stored in localstorage
            let token = await sha(password);
            newUser.create(email, token, ack => {
                //store alias and token in localstorage
                if (ack.err) {
                    swal(
                        'Error',
                        'User already exists with that email.',
                        'error'
                    );
                    newUser.leave();
                    return false;
                }
                window.localStorage.setItem('ATHARES_ALIAS', email);
                window.localStorage.setItem('ATHARES_TOKEN', token);
                gunRef
                    .get('users')
                    .get(user.id)
                    .put(ack.pub);
                newUser.auth(email, token, async otherAck => {
                    // setup user's other information (since apparently it can't live inside of profile)
                    // Before i tried to set circles as an object inside of profile so that the user's circles could be attained with:
                    // user.get("profile").get("circles").map(circle=>...)
                    // but I was unable to set or get/put anything to circles for some reason.
                    // Since it makes more sense for user's graph references to be outside the user's profile that's where they'll live
                    newUser.get('circles');
                    newUser.get('messages');
                    newUser.get('revisions');
                    newUser.get('votes');
                    newUser.get('channels');
                    newUser.get('keychain');
                    newUser.get('circleChain');

                    // create the "global" keychain for this user's DM's and their circles
                    gunRef.get(user.keychain);
                    gunRef.get(user.circleChain);

                    // HERE'S SOMETHING STUPID
                    // I can't figure out how to do public key crypto with Gun/SEA
                    // so I rolled my own wrapper to create a separate pub priv key pair
                    // these should be used to pass symmetric keys to other users publicly
                    // OBSERVE
                    let keys = await pair();
                    // this is publicly viewable (but not editable) so we can symmetrically encrypt it with the user's keys
                    // This can be decrypted by the user when necessary
                    let encryptedPriv = await this.props.SEA.encrypt(
                        keys.priv,
                        { pub: newUser.is.pub, priv: newUser._.sea.priv }
                    );

                    // // Actually set the user's information
                    newUser
                        .get('profile')
                        .put({ ...user, apub: keys.pub, apriv: encryptedPriv });
                    newUser.get('profile').once(async profile => {
                        // set the public key and id in redux to log in
                        this.props.dispatch(updateUser(user.id));
                        this.props.dispatch(updatePub(otherAck.put.pub));
                        // start listening to changes on our user
                        this.props.listen();
                        this.props.history.push('/app');
                        this.props.dispatch(hideLoading());
                        await this.setState({ loading: false });
                    });
                });
            });
        } catch (err) {
            console.log(err);
            swal('Error', 'User already exists with that email.', 'error');
        }
    };
    updateInfo = () => {
        this.setState({
            firstName: document.getElementById('registerFirstName').value,
            lastName: document.getElementById('registerLastName').value,
            password: document.getElementById('registerPassword').value,
            email: document.getElementById('registerEmail').value
        });
    };
    render() {
        const { firstName, lastName, email, password, loading } = this.state;
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
                        className='flex flex-row justify-center items-center'
                        id='portal-register'>
                        <Loader />
                    </div>
                ) : (
                    <form
                        className='wrapper'
                        id='portal-register'
                        onSubmit={this.tryRegister}>
                        <p className='portal-text'>
                            Create an account by completing the following fields
                        </p>
                        <div className='portal-input-wrapper'>
                            <FeatherIcon
                                className='portal-input-icon h1 w1'
                                icon='user'
                            />
                            <input
                                type='text'
                                className='portal-input h2 ghost pa2'
                                placeholder='First Name'
                                id='registerFirstName'
                                onChange={this.updateInfo}
                                value={firstName}
                                tabIndex='1'
                            />
                        </div>
                        <div className='portal-input-wrapper'>
                            <FeatherIcon
                                className='portal-input-icon h1 w1'
                                icon='user'
                            />
                            <input
                                type='text'
                                className='portal-input h2 ghost pa2'
                                placeholder='Last Name'
                                id='registerLastName'
                                onChange={this.updateInfo}
                                value={lastName}
                                tabIndex='2'
                            />
                        </div>
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
                                id='registerEmail'
                                tabIndex='3'
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
                                id='registerPassword'
                                onChange={this.updateInfo}
                                value={password}
                                tabIndex='4'
                            />
                        </div>
                        <button
                            id='register-button'
                            className='f6 link dim br-pill bg-white ba bw1 ph3 pv2 mb2 dib black'
                            onClick={this.tryRegister}
                            tabIndex='4'>
                            REGISTER
                        </button>
                        <Link to='/login'>
                            <div className='switch-portal'>
                                I already have an account
                            </div>
                        </Link>
                        <Link to='policy'>
                            <div className='white-70 dim ph4 pv2 f6'>
                                {' '}
                                By registering, you acknowledge that you agree
                                to the Terms of Use and have read the Privacy
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

export default connect(mapStateToProps)(withRouter(withGun(Register)));
