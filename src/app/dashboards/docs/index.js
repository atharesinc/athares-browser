import React, { PureComponent } from "react";
import Amendment from "./Amendment";
import DocsSearchBar from "./DocsSearchBar";
import Loader from "../../Loader.js";
import { Scrollbars } from "react-custom-scrollbars";
import { connect } from "react-redux";
import { withGun } from "react-gun";
import { pull } from "../../../store/state/reducers";
import {updateCircle} from "../../../store/state/actions";

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
            if (this.props.user === null) {
                this.getAmendments();
            } else {
                // we can get amendments and circles from props
                // don't bother updating state
            }
        } else {
            let circleID = this.props.location.pathname.match(/circle\/(CI.+)\/co/)[1];
            this.props.dispatch(updateCircle(circleID));
        }
    }
    getAmendments = () => {
        let gunRef = this.props.gun;

        gunRef.get(this.props.activeCircle).open(circle => {
            console.log(circle);

            let {id, name, preamble, amendments, createdAt} = circle;
            let thisCircle = { 
                id,
                name,
                preamble, 
                createdAt
            };

            this._isMounted && this.setState({
                circle: thisCircle,
                amendments: Object.values(amendments).filter(a => a !== null)
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
        if(this.props.user !== null && activeCircle !== null){
            circle = circles.find(c => c.id === activeCircle);
            amendments = this.props.amendments.filter(a => a.circle === circle.id);
        } else {
            circle = this.state.circle;
            amendments = this.state.amendments;
        }

        if (circle) {
            return (
                <div id="docs-wrapper">
                {user && <DocsSearchBar id={circle.id} />}
                <div id="docs-inner" className="pa2 pa4-ns">
                <div className="f2 pb2 b bb b--white-30 mv4 tc">
                The Bill of Rights & All Amendments
                </div>
                <div className="f3 b mv4">Preamble</div>
                <div className="f6 mt3 mb4">{circle.preamble}</div>
                <Scrollbars style={{ width: "100%", height: "70vh" }}>
                {amendments.map((section, i) => (
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