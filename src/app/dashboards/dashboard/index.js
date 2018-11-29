import React, { Component } from 'react';
// import DashboardLink from "./DashboardLink";
import { Link } from 'react-router-dom';
import { connect } from 'react-redux';
import { withGun } from 'react-gun';
import { pull } from '../../../store/state/reducers';
import { updateDesc, updateTitle } from '../../../store/head/actions';
import {
    updateCircle,
    updateChannel,
    updateRevision
} from '../../../store/state/actions';

class Dashboard extends Component {
    constructor(props) {
        super(props);
        this.state = {
            news: []
        };
    }

    componentDidMount() {
        // fetch('https://github.com/repos/atharesinc/athares-browser/commits')
        //     .then(data => data.json)
        //     .then(data => {
        //         let news = data.map(
        //             ({
        //                 base_commit: {
        //                     commit: { message }
        //                 }
        //             }) => {
        //                 let newsItem = {
        //                     message: message.replace(/.+:\s(.*)/gi, '$1')
        //                 };
        //                 return newsItem;
        //             }
        //         );
        //         console.log(news);
        //     })
        //     .catch(err => {
        //         console.error("Couldn't connect to Github API");
        //     });

        if (this.props.match.params.id) {
            this.props.gun.get(this.props.match.params.id).once(circle => {
                this.props.dispatch(updateCircle(circle.id));
                this.props.dispatch(updateChannel(null));
                this.props.dispatch(updateRevision(null));
                // update meta data
                this.props.dispatch(updateDesc(circle.preamble));
                this.props.dispatch(updateTitle(circle.name));
            });
        }
    }
    componentDidUpdate() {
        if (this.props.match.params.id) {
            this.props.gun.get(this.props.match.params.id).once(circle => {
                this.props.dispatch(updateCircle(circle.id));
                this.props.dispatch(updateChannel(null));
                this.props.dispatch(updateRevision(null));
                // update meta data
                this.props.dispatch(updateDesc(circle.preamble));
                this.props.dispatch(updateTitle(circle.name));
            });
        }
    }
    render() {
        return (
            <div
                id='dashboard-wrapper'
                className='horizontal pa3'
                style={{
                    display: 'block'
                }}>
                <div
                    className='contain bg-center h4 pa2 mb2'
                    style={{
                        backgroundImage:
                            'url(/img/Athares-full-large-white.png)'
                    }}
                />
                <div className='f7 ttu tracked white-80 mb3'>
                    Distributed Democracy Platform
                </div>
                <div className='mw9 center'>
                    {this.props.user ? (
                        <div className='cf mb3'>
                            <Link
                                className='fl w-100 pv2'
                                to={'/app/new/circle'}>
                                <div className='bg-white-10 tc dashboard-item'>
                                    <div className='dashboard-title white'>
                                        Create New Circle
                                    </div>
                                </div>
                            </Link>
                            {/*<Link className="fl w-100 w-50-ns pv2" to={"/app/new/message"}>
                                <div className="bg-white-20 tc dashboard-item">
                                  <div className="dashboard-title white">Message User</div>
                                </div>
                            </Link> */}
                        </div>
                    ) : (
                        <Link className='pv3 w-100 ph4' to={'/login'}>
                            <div className='bg-white-10 pv3 w-100 ph4 tracked tc transparent-hover-white'>
                                You are not signed in
                            </div>
                        </Link>
                    )}
                    <div className='bg-white-20 mt2 pv3 w-100 ph4 ttu tracked'>
                        Athares News
                    </div>
                    <div className='bg-white-10 pv3 w-100 ph4 ttu tracked tc'>
                        No News Available
                    </div>
                </div>
            </div>
        );
    }
}

function mapStateToProps(state) {
    return {
        user: pull(state, 'user')
    };
}

export default withGun(connect(mapStateToProps)(Dashboard));
