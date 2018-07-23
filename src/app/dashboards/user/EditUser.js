import React, { Component } from 'react';
import ImageUpload from '../createCircle/imageUpload';
import ErrorSwap from '../../../utils/ErrorSwap';
import Phone from 'react-phone-number-input';
import 'react-phone-number-input/rrui.css';
import 'react-phone-number-input/style.css';
import { Link } from 'react-router-dom';
import { updateUser } from '../../../graphql/mutations';
import { compose, graphql } from 'react-apollo';
import Loader from '../../Loader';
import S3 from 'aws-sdk/clients/s3';
import keys from '../../../utils/aws-restricted-key';
import swal from 'sweetalert';
import { Scrollbars } from 'react-custom-scrollbars';

class EditUser extends Component {
  constructor(props) {
    super(props);
    this.state = {
      id: this.props.user.id || '',
      icon: this.props.user.icon || '',
      phone: this.props.user.phone || '',
      firstName: this.props.user.firstName || '',
      lastName: this.props.user.lastName || '',
      uname: this.props.user.uname || '',
      phoneTaken: false,
      unameTaken: false,
      loading: false
    };
  }
  changeImage = (imageUrl) => {
    this.setState({
      icon: imageUrl
    });
  };
  updateFirstName = (e) => {
    this.setState({
      firstName: e.target.value.substring(0, 51)
    });
  };
  updateLastName = (e) => {
    this.setState({
      lastName: e.target.value.substring(0, 51)
    });
  };
  updateUsername = (e) => {
    this.setState({
      uname: e.target.value.substring(0, 100),
      unameTaken: false
    });
  };
  updatePhone = (number) => {
    this.setState({
      phone: number,
      phoneTaken: false
    });
  };
  // updateEmail = e => {
  // 	this.setState({
  // 		email: e.target.value.substring(0, 100)
  // 	});
  // };
  onSubmit = async (e) => {
    e.preventDefault();
    await this.setState({ loading: true });

    try {
      await this.uploadFile(this.state.id);
    } catch (err) {
      console.log(err.message);
    }
    this.setState({ loading: false, unameTaken: false });
  };
  uploadFile = async (id) => {
    // Set credentials and region
    var s3 = new S3({
      apiVersion: '2006-03-01',
      region: 'us-east-2',
      credentials: {
        accessKeyId: keys.AccessKey,
        secretAccessKey: keys.SecretAccessKey
      },
      logger: console
    });

    var params = {
      Body: this.state.icon,
      Bucket: 'athares-images',
      Key: id + '.jpg',
      ACL: 'public-read'
    };

    try {
      await s3.upload(params, async (err, data) => {
        if (err) {
          console.log('An error occurred', err);
          return false;
        }
        // updateUser with aws icon url
        await this.props.updateUser({
          variables: {
            id: id,
            icon: data.Location,
            // email: this.state.email,
            phone: this.state.phone !== '' ? this.state.phone : null,
            firstName: this.state.firstName,
            lastName: this.state.lastName,
            uname: this.state.uname
          }
        });
        this.props.history.push(`/app/user`);
        swal('User Updated', 'Your changes have been saved', 'success');
      });
    } catch (err) {
      console.log(err);
    }
  };
  clearError = () => {
    this.setState({
      phoneTaken: false,
      unameTaken: false
    });
  };
  render() {
    if (this.state.loading) {
      return (
        <div
          id="dashboard-wrapper"
          style={{
            justifyContent: 'center'
          }}
          className="pa2">
          <Loader />
          <h1 className="mb3 mt0 lh-title mt4 f3 f2-ns">Saving User Information</h1>
        </div>
      );
    }
    return (
      <div id="dashboard-wrapper">
        <Scrollbars style={{ width: '100%', height: '100%' }} autoHide autoHideTimeout={1000} autoHideDuration={200} universal={true}>

          <form
            className="pa4 white wrapper"
            onSubmit={this.onSubmit}
            id="update-user-form"
          >
            <article className="cf">
              <div
                className="w-100 row-center"
                style={{
                  justifyContent: 'space-between',
                  flexDirection: 'row-reverse'
                }}>
                <Link className="f6 link dim br-pill ba bw1 ph3 pv2 ml4-ns ml2 dib white" to="/app/user">
                  BACK
              </Link>
                <h1 className="mv0 lh-title">Edit Info</h1>
              </div>
              <header className="fn fl-ns w-50-ns pr4-ns">
                <ImageUpload onSet={this.changeImage} defaultImage={this.state.icon} />
                <small id="name-desc" className="f6 white-80 db mb2">
                  Your profile picture will be cropped as a circle. It is recommended you upload a square photo with dimensions around 250x250 pixels.
              </small>
              </header>
              <div className="fn fl-ns w-50-ns mt4">
                <div className="row-center">
                  <div className="w-50 mb4">
                    <label htmlFor="firstName" className="f6 b db mb2">
                      First Name
                  </label>
                    <input
                      id="firstName"
                      className="input-reset ba pa2 mb2 db ghost w-90"
                      type="text"
                      aria-describedby="name-desc"
                      required
                      value={this.state.firstName}
                      onChange={this.updateFirstName}
                    />
                  </div>
                  <div className="w-50 mb4">
                    <label htmlFor="lastName" className="f6 b db mb2">
                      Last Name
                  </label>
                    <input
                      id="lastName"
                      className="input-reset ba pa2 mb2 db ghost w-100"
                      type="text"
                      aria-describedby="edit-last-name"
                      required
                      value={this.state.lastName}
                      onChange={this.updateLastName}
                    />
                  </div>
                </div>
                <div className="measure mb4">
                  <label htmlFor="name" className="f6 b db mb2">
                    Phone Number
                </label>
                  <Phone
                    placeholder="+1 123 456 7890"
                    value={this.state.phone}
                    country="US"
                    inputClassName="db w-100 ghost pa2"
                    aria-describedby="name-desc"
                    displayInitialValueAsLocalNumber={true}
                    onChange={this.updatePhone}
                    nativeCountrySelect
                    className="mv2"
                  />
                  <ErrorSwap
                    condition={!this.state.phoneTaken}
                    normal={
                      <small id="name-desc" className="f6 white-80 db mb2">
                        Your phone number is used for multi-factor authentication. This number must be unique.
                    </small>
                    }
                    error={
                      <small id="name-desc" className="f6 red db mb2">
                        This number has already been taken.
                    </small>
                    }
                  />
                </div>
                {/*<div className="measure mb4">
								<label htmlFor="email" className="f6 b db mb2">
									Email Address
								</label>
								<input
									id="email"
									className="input-reset ba pa2 mb2 db w-100 ghost"
									type="text"
									aria-describedby="name-desc"
									required
									value={this.state.email}
									onChange={this.updateEmail}
								/>
								<ErrorSwap
									condition={!this.state.emailTaken}
									normal={
										<small
											id="name-desc"
											className="f6 white-80 db mb2"
										>
											An email address is used for
											multi-factor authentication. This
											number must be unique.
										</small>
									}
									error={
										<small
											id="name-desc"
											className="f6 red db mb2"
										>
											This email has already been taken.
										</small>
									}
								/>
							</div>*/}
                <div className="measure mb4">
                  <label htmlFor="uname" className="f6 b db mb2">
                    Unique Name
                </label>
                  <input
                    id="uname"
                    className="input-reset ba pa2 mb2 db w-100 ghost"
                    type="text"
                    aria-describedby="name-desc"
                    placeholder="firstname.lastname"
                    value={this.state.uname}
                    onChange={this.updateUsername}
                  />
                  <ErrorSwap
                    condition={!this.state.unameTaken}
                    normal={
                      <small id="name-desc" className="f6 white-80 db mb2">
                        This is a human-readable way to uniquely identify each user. This name must be unique.
                    </small>
                    }
                    error={
                      <small id="name-desc" className="f6 red db mb2">
                        Sorry! This name has already been taken.
                    </small>
                    }
                  />
                </div>
              </div>
            </article>

            <button id="create-circle-button" className="btn" type="submit">
              SAVE
          </button>
          </form>
        </Scrollbars>
      </div>
    );
  }
}

export default compose(graphql(updateUser, { name: 'updateUser' }))(EditUser);
