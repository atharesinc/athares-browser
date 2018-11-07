import React, { PureComponent } from "react";
import Amendment from "./Amendment";
import DocsSearchBar from "./DocsSearchBar";
import Loader from "../../Loader.js";
import { Link } from "react-router-dom";
import { Scrollbars } from "react-custom-scrollbars";
import { connect } from "react-redux";
import { withGun } from "react-gun";
import { pull } from "../../../store/state/reducers";
import { updateCircle, updateChannel, updateRevision } from "../../../store/state/actions";
import FeatherIcon from "feather-icons-react";

class Constitution extends PureComponent {
    constructor(props) {
        super(props);
        this.state = {
            circle: null,
            amendments: []
        };
    }

    componentDidMount() {
        // we only need to manually fetch the circle and it's amendments if the user isn't signed in
        // we should always make sure that the currently navigated-to circle is the activeCircle in redux
        this._isMounted = true;
        if (this.props.activeCircle) {
            // if (this.props.user === null) {
            this.getAmendments();
            // } else {
            //     // we can get amendments and circles from props
            //     // don't bother updating state
            // }
        } else {
            let circleID = this.props.location.pathname.match(/circle\/(CI.+)\/co/ )[1];
            this.props.dispatch(updateCircle(circleID));
            this.props.dispatch(updateChannel(null));
            this.props.dispatch(updateRevision(null));

        }
    }
    getAmendments = () => {
        let gunRef = this.props.gun;

        gunRef.get(this.props.activeCircle).open(circle => {
            let { id, name, preamble, amendments, createdAt, users } = circle;
            let thisCircle = {
                id,
                name,
                preamble,
                createdAt,
                users: Object.values(users)
            };

            if (amendments) {
                amendments = Object.values(amendments).filter(a => a !== null);
            }
            this._isMounted &&
                this.setState({
                    circle: thisCircle,
                    amendments
                });
        });
    };
    componentDidUpdate(prevProps) {
        if (prevProps.activeCircle !== this.props.activeCircle) {
            this.getAmendments();
        }
    }
    componentWillUnmount() {
        this._isMounted = false;
    }
    render() {
        let { circles, activeCircle, user } = this.props;
        let circle = null;
        let amendments = [];
        // if user isn't set we can get this circle and it's amendments the hard way (for public transparency)
        // if(this.props.user !== null && activeCircle !== null){
        //     circle = circles.find(c => c.id === activeCircle);
        //     console.log(this.props, this.state, circle);
        //     amendments = this.props.amendments.filter(a => a.circle === circle.id);
        // } else {
        circle = this.state.circle;
        amendments = this.state.amendments;
        // }

        if (circle) {
            return (
                <div id="docs-wrapper">
                <div className="flex justify-between items-center ph2 mobile-nav">
                    <Link
                        to="/app"
                        className="flex justify-center items-center"
                    >
                        <FeatherIcon
                            icon="chevron-left"
                            className="white db dn-ns"
                            onClick={this.back}
                        />
                    </Link>
                    <h2 className="ma3 lh-title white"> Constitution </h2>
                    {user && <Link
                                            to={`/app/circle/${circle.id}/add/amendment`}
                                            className="icon-wrapper"
                                        >
                                            <FeatherIcon icon="plus" />
                                        </Link>}
                </div>
                    {/*{user && <DocsSearchBar id={circle.id} />}
                                        <div
                                            id="docs-inner"
                                            className="pa2 pa4-ns white wrapper mobile-nav"
                                        >
                                            <div className="f2 pb2 b bb b--white-30 mv2 mv4-ns tc">
                                                Constitution
                                            </div>
                                        </div>
                    
                                        <div id="current-channel">
                                            <Link to="/app">
                                                <FeatherIcon
                                                    icon="chevron-left"
                                                    className="white db dn-ns"
                                                    onClick={this.updateChannel}
                                                />
                                            </Link>
                                            <div>Constitution</div>
                                            <Link
                                                to={`/app/circle/${circle.id}/add/amendment`}
                                                className="icon-wrapper"
                                            >
                                                <FeatherIcon icon="plus" />
                                            </Link>
                                        </div>*/}

                    <div className="pa2 pa4-ns white wrapper mobile-body">
                        <div className="f6 mt3 mb4">{circle.preamble}</div>
                        <Scrollbars style={{ width: "100%", height: "70vh" }}>
                            {amendments &&
                                amendments.map((section, i) => (
                                    <Amendment
                                        key={i}
                                        editable={user !== null}
                                        updateItem={this.updateItem}
                                        amendment={section}
                                        addSub={this.addSub}
                                        circle={circle}
                                        user={user}
                                    />
                                ))}
                        </Scrollbars>
                    </div>
                </div>
            );
        } else {
            return (
                <div
                    id="docs-wrapper"
                    style={{
                        justifyContent: "center",
                        alignItems: "center",
                        display: "flex",
                        flexDirection: "column"
                    }}
                >
                    <Loader />
                    <div className="f3 pb2 b mv4 tc">Loading Constitution</div>
                </div>
            );
        }
    }
}

function mapStateToProps(state) {
    return {
        user: pull(state, "user"),
        activeCircle: pull(state, "activeCircle"),
        circles: pull(state, "circles"),
        amendments: pull(state, "amendments")
    };
}

export default withGun(connect(mapStateToProps)(Constitution));