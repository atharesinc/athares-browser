import React, { Component } from 'react';
import ImageUpload from './imageUpload';
import ErrorSwap from '../../../utils/ErrorSwap';
import { withGun } from 'react-gun';
import { connect } from 'react-redux';
import { pull } from '../../../store/state/reducers';
import { updateCircle } from '../../../store/state/actions';
import Gun from 'gun/gun';
import Loader from '../../../components/Loader';
import swal from 'sweetalert';
import { Scrollbars } from 'react-custom-scrollbars';
import moment from 'moment';
import FeatherIcon from 'feather-icons-react';
import { Link } from 'react-router-dom';

class createCircleBoard extends Component {
    constructor(props) {
        super(props);

        this.state = {
            // this should be whatever fits into an img src value or a css url(), either a filepath or base64 encoded image string
            icon: '/img/Athares-logo-large-white.png',
            name: '',
            preamble: '',
            isTaken: false,
            loading: false,
            editMode: false
        };
    }
    componentDidMount() {
        // verify this circle is real and that the user is logged in, but for now...
        if (!this.props.user) {
            this.props.history.replace('/app');
        }

        let that = this;
        fetch(this.state.icon)
            .then(function(response) {
                return response.blob();
            })
            .then(function(blob) {
                // here the image is a blob
                that.setState({
                    icon: blob
                });
            });
    }
    changeImage = imageUrl => {
        this.setState({
            icon: imageUrl
        });
    };
    editMode = bool => {
        this.setState({
            editMode: bool
        });
    };
    updateName = e => {
        this.setState({
            name: e.target.value.substring(0, 51),
            isTaken: false
        });
    };
    updatePreamble = e => {
        this.setState({
            preamble: e.target.value
        });
    };
    convertBlobToBase64 = blob => {
        return new Promise(resolve => {
            let reader = new FileReader();
            reader.readAsDataURL(blob);
            reader.onloadend = function() {
                resolve(reader.result);
            };
        });
    };
    onSubmit = async e => {
        e.preventDefault();
        if (this.state.editMode) {
            return false;
        }
        let { name, preamble } = this.state;

        let base64Large = this.state.icon;
        // Depending on whether or not the user updates their image, the photo can be either base64 or a Blob
        if (base64Large instanceof Blob) {
            base64Large = await this.convertBlobToBase64(base64Large);
        }

        let base64Small = await this.shrinkBase64(base64Large);

        // console.log("Shrunk to " + base64Small.length / base64Large.length + "% of original file size");

        preamble = preamble.trim();
        name = name.trim();

        if (preamble === '' || name === '') {
            swal('Sorry', 'Circles must have a name and preamble.', 'error');
            return false;
        }
        await this.setState({ loading: true });

        // create circle
        let newCircle = {
            id: 'CI' + Gun.text.random(),
            name: name,
            preamble: preamble,
            icon: base64Small,
            createdAt: moment().format(),
            updatedAt: moment().format()
        };
        // get our user as a readonly ref
        let user = this.props.gun.user(this.props.pub);

        // create the node reference
        let circle = this.props.gun.get(newCircle.id);

        // populate node
        circle.put(newCircle);

        // add this user to the node's circles
        circle.get('users').set(user);

        // add this circle to the list of all circles
        this.props.gun.get('circles').set(circle);

        // add this circle to the user's list of circles

        user.get('circles').set(circle);

        // set activeCircle as this one
        this.props.dispatch(updateCircle(newCircle.id));

        await this.setState({ loading: false });
        swal(
            'Circle Created',
            `${name} has been created successfully.`,
            'success'
        );

        this.props.history.push(
            '/app/circle/' + newCircle.id + '/constitution'
        );
    };

    shrinkBase64 = base64String => {
        return new Promise(resolve => {
            // We create an image to receive the Data URI
            var img = document.createElement('img');

            // When the event "onload" is triggered we can resize the image.
            img.onload = function() {
                // We create a canvas and get its context.
                var canvas = document.createElement('canvas');
                var ctx = canvas.getContext('2d');

                // We set the dimensions at the wanted size.
                canvas.width = 200;
                canvas.height = 200;

                // We resize the image with the canvas method drawImage();
                ctx.drawImage(this, 0, 0, 200, 200);
                resolve(canvas.toDataURL('image/png'));
            };

            img.src = base64String;
        });
    };
    clearError = () => {
        this.setState({
            isTaken: false
        });
    };
    render() {
        if (this.state.loading) {
            return (
                <div
                    id='dashboard-wrapper'
                    style={{
                        justifyContent: 'center'
                    }}
                    className='pa2'>
                    <Loader />
                    <h1 className='mb3 mt0 lh-title mt4 f3 f2-ns'>
                        Creating Your Circle
                    </h1>
                </div>
            );
        }
        return (
            <div id='revisions-wrapper'>
                <div className='flex ph2 mobile-nav'>
                    <Link
                        to='/app'
                        className='flex justify-center items-center'>
                        <FeatherIcon
                            icon='chevron-left'
                            className='white db dn-l'
                            onClick={this.back}
                        />
                    </Link>
                    <h2 className='ma3 lh-title white'> Create Circle </h2>
                </div>
                <form
                    className='pa2 pa4-ns white wrapper mobile-body'
                    onSubmit={this.onSubmit}
                    id='create-circle-form'>
                    <Scrollbars style={{ height: '100%', width: '100%' }}>
                        <article className='cf'>
                            <time className='f7 ttu tracked white-80'>
                                Circles represent the digital repository for
                                your government.
                            </time>
                            <header className='fn fl-ns w-50-ns pr4-ns'>
                                <ImageUpload
                                    onSet={this.changeImage}
                                    defaultImage={this.state.icon}
                                    editMode={this.editMode}
                                />
                            </header>
                            <div className='fn fl-ns w-50-ns mt4'>
                                <div className='measure mb4'>
                                    <label
                                        htmlFor='name'
                                        className='f6 b db mb2'>
                                        Name
                                    </label>
                                    <input
                                        id='name'
                                        className='input-reset ba pa2 mb2 db w-100 ghost'
                                        type='text'
                                        aria-describedby='name-desc'
                                        required
                                        value={this.state.name}
                                        onChange={this.updateName}
                                    />
                                    <ErrorSwap
                                        condition={!this.state.isTaken}
                                        normal={
                                            <small
                                                id='name-desc'
                                                className='f6 white-80 db mb2'>
                                                This name must be unique.
                                            </small>
                                        }
                                        error={
                                            <small
                                                id='name-desc'
                                                className='f6 red db mb2'>
                                                Sorry! This name has already
                                                been taken.
                                            </small>
                                        }
                                    />
                                </div>
                                <div className='mv4'>
                                    <label
                                        htmlFor='comment'
                                        className='f6 b db mb2'>
                                        Preamble
                                    </label>
                                    <textarea
                                        id='comment'
                                        name='comment'
                                        className='db border-box w-100 measure ba pa2 mb2 ghost'
                                        aria-describedby='comment-desc'
                                        resize='false'
                                        required
                                        value={this.state.preamble}
                                        onChange={this.updatePreamble}
                                    />
                                    <small
                                        id='comment-desc'
                                        className='f6 white-80'>
                                        Describe your government in a few
                                        sentences. This will be visible at the
                                        top of the Constitution and outlines the
                                        basic vision of this government.
                                    </small>
                                </div>
                            </div>
                        </article>
                        <div id='comment-desc' className='f6 white-80'>
                            By pressing "Create Circle" you will create a new
                            government with a the above name, preamble, and the
                            selected image. After this point, all changes must
                            be made through the democratic revision process.
                        </div>
                        {!this.state.editMode && (
                            <button
                                id='create-circle-button'
                                className='btn mt4'
                                type='submit'>
                                Create Circle
                            </button>
                        )}
                    </Scrollbars>
                </form>
            </div>
        );
    }
}

function mapStateToProps(state) {
    return {
        user: pull(state, 'user'),
        pub: pull(state, 'pub')
    };
}

export default withGun(connect(mapStateToProps)(createCircleBoard));
