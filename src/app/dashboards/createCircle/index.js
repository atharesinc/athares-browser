import React, { Component } from 'react';
import ImageUpload from './imageUpload';
import ErrorSwap from '../../../utils/ErrorSwap';
import { compose, graphql } from 'react-apollo';
import { createCircle, updateCircleIcon, setActiveCircle } from '../../../graphql/mutations';
import { getUserLocal } from '../../../graphql/queries';
import S3 from 'aws-sdk/clients/s3';
import keys from '../../../utils/aws-restricted-key';
import Loader from '../../Loader';
import swal from 'sweetalert';
import { Scrollbars } from 'react-custom-scrollbars';

class createCircleBoard extends Component {
  constructor(props) {
    super(props);

    this.state = {
      icon: '/img/Athares-logo-large-white.png',
      name: '',
      preamble: '',
      isTaken: false,
      loading: false
    };
  }
  changeImage = (imageUrl) => {
    this.setState({
      icon: imageUrl
    });
  };
  updateName = (e) => {
    this.setState({
      name: e.target.value.substring(0, 51),
      isTaken: false
    });
  };
  updatePreamble = (e) => {
    this.setState({
      preamble: e.target.value
    });
  };
  onSubmit = async (e) => {
    e.preventDefault();
    // validate & trim fields
    console.log(this.state);
    await this.setState({ loading: true });

    try {
      // create circle and get the id
      const res = await this.props.createCircle({
        variables: {
          name: this.state.name,
          preamble: this.state.preamble,
          icon: 'https://s3.us-east-2.amazonaws.com/athares-images/Athares-logo-large-white.png',
          usersIds: [this.props.getUserLocal.user.id]
        }
      });
      console.log(res);

      //upload image to AWS (propbably)
      await this.uploadFile(res.data.createCircle.id);
    } catch (err) {
      // poor Error handling
      if (err.message.includes('A unique constraint')) {
        this.setState({ loading: false, isTaken: true });
      }
      console.log(new Error(err));
      this.setState({ loading: false }, () => {
        swal('Sorry', 'Failed to create Circle. Please try again later', 'error');
      });
    }
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
        // updateCircle with aws icon url
        const newCircle = await this.props.updateCircleIcon({
          variables: {
            id: id,
            icon: data.Location
          }
        });
        console.log(newCircle);
        this.props.setActiveCircle({
          variables: { id: newCircle.data.updateCircle.id }
        });
        this.props.history.push(`/app/circle/${newCircle.data.updateCircle.id}/constitution`);
      });
    } catch (err) {
      console.log(err);
    }
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
          id="dashboard-wrapper"
          style={{
            justifyContent: 'center'
          }}
          className="pa2">
          <Loader />
          <h1 className="mb3 mt0 lh-title mt4 f3 f2-ns">Creating Your Circle</h1>
        </div>
      );
    }
    return (
      <div id="dashboard-wrapper">
        <form className="pa4 white wrapper" onSubmit={this.onSubmit} id="create-circle-form">
          <Scrollbars style={{ height: '100%', width: '100%' }}>
            <article className="cf">
              <h1 className="mb3 mt0 lh-title">Create New Circle</h1>
              <time className="f7 ttu tracked white-80">Circles represent the digital repository for your government.</time>
              <header className="fn fl-ns w-50-ns pr4-ns">
                <ImageUpload onSet={this.changeImage} defaultImage={this.state.icon} />
              </header>
              <div className="fn fl-ns w-50-ns mt4">
                <div className="measure mb4">
                  <label htmlFor="name" className="f6 b db mb2">
                    Name
                  </label>
                  <input
                    id="name"
                    className="input-reset ba pa2 mb2 db w-100 ghost"
                    type="text"
                    aria-describedby="name-desc"
                    required
                    value={this.state.name}
                    onChange={this.updateName}
                  />
                  <ErrorSwap
                    condition={!this.state.isTaken}
                    normal={
                      <small id="name-desc" className="f6 white-80 db mb2">
                        This name must be unique.
                      </small>
                    }
                    error={
                      <small id="name-desc" className="f6 red db mb2">
                        Sorry! This name has already been taken.
                      </small>
                    }
                  />
                </div>
                <div className="mv4">
                  <label htmlFor="comment" className="f6 b db mb2">
                    Preamble
                  </label>
                  <textarea
                    id="comment"
                    name="comment"
                    className="db border-box w-100 measure ba pa2 mb2 ghost"
                    aria-describedby="comment-desc"
                    resize="false"
                    required
                    value={this.state.preamble}
                    onChange={this.updatePreamble}
                  />
                  <small id="comment-desc" className="f6 white-80">
                    Describe your government in a few sentences. This will be visible at the top of the Constitution and outlines the basic vision of this government.
                  </small>
                </div>
              </div>
            </article>
            <div id="comment-desc" className="f6 white-80">
              By pressing "Create Circle" you will create a new government with a the above name, preamble, and the selected image. After this point, all changes must be made
              through the democratic revision process.
            </div>
            <button id="create-circle-button" className="btn mt4" type="submit">
              Create Circle
            </button>
          </Scrollbars>
        </form>
      </div>
    );
  }
}

export default compose(
  graphql(updateCircleIcon, { name: 'updateCircleIcon' }),
  graphql(createCircle, { name: 'createCircle' }),
  graphql(getUserLocal, { name: 'getUserLocal' }),
  graphql(setActiveCircle, { name: 'setActiveCircle' })
)(createCircleBoard);
