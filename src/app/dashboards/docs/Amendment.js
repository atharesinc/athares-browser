import React from 'react';
import AmendmentEdit from './AmendmentEdit';
import AmendmentView from './AmendmentView';
import Gun from 'gun/gun';
import { withGun } from 'react-gun';
import moment from 'moment';
import { updateRevision } from '../../../store/state/actions';
import { connect } from 'react-redux';
import { withRouter } from 'react-router-dom';

class Amendment extends React.Component {
    constructor(props) {
        super(props);

        this.state = {
            editMode: false,
            text: this.props.text
        };
    }
    cancel = () => {
        this.setState({
            editMode: false,
            text: this.props.text
        });
    };
    toggleEdit = e => {
        if (e.target.className !== 'editMask' && this.state.editMode) {
            return false;
        }
        this.setState({
            editMode: !this.state.editMode
        });
    };
    update = text => {
        this.setState({
            text: text
        });
    };
    addSub = () => {
        this.props.addSub(this.props.id);
        this.cancel();
    };
    customSigm = x => {
        return 604800 / (1 + Math.pow(Math.E, -1 * (x - 10))) / 2;
    };
    save = () => {
        // can be undefined if no changes
        if (this.props.amendment.text.trim() === this.state.text) {
            return;
        }
        let gunRef = this.props.gun;

        const {
            title,
            circle: circleID,
            text,
            id: amendmentID
        } = this.props.amendment;
        let { circle } = this.props;
        let numUsers = circle.users.length;
        const user = this.props.gun.user();
        let amendmentRef = gunRef.get(amendmentID);
        user.get('profile').once(async profile => {
            let { id, firstName, lastName, icon } = profile;

            const newRevision = {
                id: 'RV' + Gun.text.random(),
                circle: circleID,
                backer: { id, firstName, lastName, icon },
                title,
                oldText: text,
                newText: this.state.text.trim(),
                createdAt: moment().format(),
                updatedAt: moment().format(),
                amendment: this.props.amendment,
                expires: moment()
                    .add(Math.max(this.customSigm(numUsers), 61), 's')
                    .format(),
                voterThreshold: Math.round(numUsers / 2)
            };

            const newVote = {
                id: 'VO' + Gun.text.random(),
                circle: circleID,
                revision: newRevision.id,
                user: this.props.user,
                support: true
            };

            let revision = gunRef.get(newRevision.id);
            revision.put(newRevision);

            let vote = gunRef.get(newVote.id);
            vote.put(newVote);

            // set this node as a revision in the parent circle
            gunRef
                .get(circleID)
                .get('revisions')
                .set(revision);

            gunRef
                .get(newRevision.id)
                .get('votes')
                .set(vote);

            //add it to ambiguous "list" of revisions
            gunRef.get('revisions').set(revision);
            gunRef.get('votes').set(vote, () => {
                this.props.dispatch(updateRevision(newRevision.id));

                this.props.history.push(
                    `/app/circle/${circleID}/revisions/${newRevision.id}`
                );
            });
        });
    };
    shouldComponentUpdate(nextProps, nextState) {
        return (
            nextProps !== this.props ||
            nextState.editMode !== this.state.editMode
        );
    }
    render() {
        const { text, editMode } = this.state;
        return (
            <div>
                {editMode ? (
                    <AmendmentEdit
                        save={this.save}
                        cancel={this.cancel}
                        update={this.update}
                        amendment={this.props.amendment}
                        toggleEdit={this.toggleEdit}
                        text={text}
                    />
                ) : (
                    <AmendmentView
                        amendment={this.props.amendment}
                        toggleEdit={this.toggleEdit}
                        text={text}
                        editable={this.props.editable}
                    />
                )}
            </div>
        );
    }
}
function mapStateToProps(state) {
    return {};
}
export default withRouter(connect(mapStateToProps)(withGun(Amendment)));
