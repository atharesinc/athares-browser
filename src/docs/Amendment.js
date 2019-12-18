import React from 'react';
import AmendmentEdit from './AmendmentEdit';
import AmendmentView from './AmendmentView';
import moment from 'moment';
import { updateRevision } from '../store/state/actions';
import { connect } from 'react-redux';
import { withRouter } from 'react-router-dom';
import swal from 'sweetalert';
import { pull } from '../store/state/reducers';
import {  graphql } from 'react-apollo';
import compose from 'lodash.flowright';
import {
  CREATE_REVISION,
  CREATE_VOTE,
  ADD_REVISION_TO_AMENDMENT,
} from '../graphql/mutations';
import sha from 'simple-hash-browser';

function Amendment (){
  

    this.state = {
      editMode: false,
      text: props.text,
    };
  
  const cancel = () => {
    this.setState({
      editMode: false,
      text: props.text,
    });
  };
  const repeal = () => {
    try {
      swal(
        "Are you sure you'd like to repeal this amendment?\n\nBy starting the repeal process, you will create a revision with the intention of permanently deleting this amendment.",
        {
          buttons: {
            cancel: 'Back',
            confirm: 'Yes, Repeal',
          },
        },
      ).then(async value => {
        if (value === true) {
          const { activeCircle, circle, user } = props;
          const { title, text, id } = props.amendment;

          let numUsers = circle.users.length;
          let newRevision = {
            circle: activeCircle,
            user: user,
            title,
            oldText: null,
            newText: text,
            expires: moment()
              .add(Math.max(this.customSigm(numUsers), 61), 's')
              .format(),
            voterThreshold: Math.round(
              numUsers * this.ratifiedThreshold(numUsers),
            ),
            amendment: id,
            repeal: true,
          };
          this.createRevision(newRevision);
        }
      });
    } catch (err) {
      console.error(new Error(err));
      swal('Error', 'There was an error in the repeal process', 'error');
    }
  };
  const toggleEdit = e => {
    if (e.target.className !== 'editMask' && this.state.editMode) {
      return false;
    }
    this.setState({
      editMode: !this.state.editMode,
    });
  };
  const update = text => {
    this.setState({
      text: text,
    });
  };
  const addSub = () => {
    props.addSub(props.id);
    this.cancel();
  };
  const customSigm = x => {
    return 604800 / (1 + Math.pow(Math.E, -1 * (x - 10))) / 2;
  };
  // a minimum number of users in a circle must have voted on a revision to ratify it
  // this prevents someone from sneaking in a revision where only one person votes to support and no one rejects it
  ratifiedThreshold = n => {
    return 0.4 / (1 + Math.pow(Math.E, -1 * n * 0.2));
  };
  const save = async () => {
    // can be undefined if no changes
    if (props.amendment.text.trim() === this.state.text) {
      return;
    }

    const { activeCircle, circle, user } = props;
    const { title, text, id } = props.amendment;

    let numUsers = circle.users.length;
    let newRevision = {
      circle: activeCircle,
      user: user,
      title,
      oldText: text,
      newText: this.state.text.trim(),
      expires: moment()
        .add(Math.max(this.customSigm(numUsers), 61), 's')
        .format(),
      voterThreshold: Math.round(numUsers * this.ratifiedThreshold(numUsers)),
      amendment: id,
      repeal: false,
    };
    this.createRevision(newRevision);
  };

  const createRevision = async newRevision => {
    try {
      let hash = await sha(
        JSON.stringify({
          title: newRevision.title,
          text: newRevision.newText,
          circle: newRevision.circle,
          expires: newRevision.expires,
          voterThreshold: newRevision.voterThreshold,
        }),
      );

      let newRevisionRes = await props.createRevision({
        variables: {
          ...newRevision,
          hash,
        },
      });

      await props.addNewRevisionToAmendment({
        variables: {
          revision: newRevisionRes.data.createRevision.id,
          amendment: props.amendment.id,
          title: newRevision.title,
        },
      });
      newRevision.id = newRevisionRes.data.createRevision.id;

      const newVote = {
        circle: props.activeCircle,
        revision: newRevision.id,
        user: props.user,
        support: true,
      };

      await props.createVote({
        variables: {
          ...newVote,
        },
      });

      props.dispatch(updateRevision(newRevision.id));

      props.history.push(
        `/app/circle/${props.activeCircle}/revisions/${newRevision.id}`,
      );
    } catch (err) {
      if (
        !err.message.includes('unique constraint would be violated') ||
        !err.message.includes('hash')
      ) {
        console.error(new Error(err));
        swal('Error', err.message, 'error');
      }
    }
  };
  shouldComponentUpdate(nextProps, nextState) {
    return (
      nextProps !== props || nextState.editMode !== this.state.editMode
    );
  }
  
    const { text, editMode } = this.state;
    const { amendment, activeCircle } = props;
    const hasOutstandingRevision =
      amendment.revision !== null && amendment.revision.passed === null;
    return (
      <div>
        {editMode && hasOutstandingRevision === false ? (
          <AmendmentEdit
            save={this.save}
            cancel={this.cancel}
            update={this.update}
            amendment={amendment}
            toggleEdit={this.toggleEdit}
            text={text}
            repeal={this.repeal}
          />
        ) : (
          <AmendmentView
            amendment={amendment}
            toggleEdit={this.toggleEdit}
            text={text}
            editable={props.editable}
            circle={activeCircle}
          />
        )}
      </div>
    );
}
function mapStateToProps(state) {
  return {
    user: pull(state, 'user'),
    activeCircle: pull(state, 'activeCircle'),
  };
}
export default compose(
  graphql(CREATE_REVISION, { name: 'createRevision' }),
  graphql(CREATE_VOTE, { name: 'createVote' }),
  graphql(ADD_REVISION_TO_AMENDMENT, { name: 'addNewRevisionToAmendment' }),
)(withRouter(connect(mapStateToProps)(Amendment)));
