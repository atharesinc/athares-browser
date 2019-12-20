import React, { useGlobal, useState } from "react";
import AmendmentEdit from "./AmendmentEdit";
import AmendmentView from "./AmendmentView";
import moment from "moment";
import { withRouter } from "react-router-dom";
import swal from "sweetalert";
import { graphql } from "react-apollo";
import compose from "lodash.flowright";
import {
  CREATE_REVISION,
  CREATE_VOTE,
  ADD_REVISION_TO_AMENDMENT
} from "../graphql/mutations";
import sha from "simple-hash-browser";

function Amendment(props) {
  const [editMode, setEditMode] = useState(false);
  const [text, setText] = useState(props.text);
  const [user] = useGlobal("user");

  const [activeCircle] = useGlobal("activeCircle");
  const [, setActiveRevision] = useGlobal("activeRevision");

  const cancel = () => {
    setEditMode(false);
    setText(props.text);
  };
  const repeal = () => {
    try {
      swal(
        "Are you sure you'd like to repeal this amendment?\n\nBy starting the repeal process, you will create a revision with the intention of permanently deleting this amendment.",
        {
          buttons: {
            cancel: "Back",
            confirm: "Yes, Repeal"
          }
        }
      ).then(async value => {
        if (value === true) {
          const { circle } = props;
          const { title, text, id } = props.amendment;

          let numUsers = circle.users.length;
          let newRevision = {
            circle: activeCircle,
            user: user,
            title,
            oldText: null,
            newText: text,
            expires: moment()
              .add(Math.max(customSigm(numUsers), 61), "s")
              .format(),
            voterThreshold: Math.round(numUsers * ratifiedThreshold(numUsers)),
            amendment: id,
            repeal: true
          };
          createRevision(newRevision);
        }
      });
    } catch (err) {
      console.error(new Error(err));
      swal("Error", "There was an error in the repeal process", "error");
    }
  };
  const toggleEdit = e => {
    if (e.target.className !== "editMask" && editMode) {
      return false;
    }
    setEditMode(!editMode);
  };

  const addSub = () => {
    props.addSub(props.id);
    cancel();
  };
  const customSigm = x => {
    return 604800 / (1 + Math.pow(Math.E, -1 * (x - 10))) / 2;
  };
  // a minimum number of users in a circle must have voted on a revision to ratify it
  // this prevents someone from sneaking in a revision where only one person votes to support and no one rejects it
  const ratifiedThreshold = n => {
    return 0.4 / (1 + Math.pow(Math.E, -1 * n * 0.2));
  };
  const save = async () => {
    // can be undefined if no changes
    if (props.amendment.text.trim() === text) {
      return;
    }

    const { circle } = props;
    const { title, text, id } = props.amendment;

    let numUsers = circle.users.length;
    let newRevision = {
      circle: activeCircle,
      user: user,
      title,
      oldText: text,
      newText: text.trim(),
      expires: moment()
        .add(Math.max(customSigm(numUsers), 61), "s")
        .format(),
      voterThreshold: Math.round(numUsers * ratifiedThreshold(numUsers)),
      amendment: id,
      repeal: false
    };
    createRevision(newRevision);
  };

  const createRevision = async newRevision => {
    try {
      let hash = await sha(
        JSON.stringify({
          title: newRevision.title,
          text: newRevision.newText,
          circle: newRevision.circle,
          expires: newRevision.expires,
          voterThreshold: newRevision.voterThreshold
        })
      );

      let newRevisionRes = await props.createRevision({
        variables: {
          ...newRevision,
          hash
        }
      });

      await props.addNewRevisionToAmendment({
        variables: {
          revision: newRevisionRes.data.createRevision.id,
          amendment: props.amendment.id,
          title: newRevision.title
        }
      });
      newRevision.id = newRevisionRes.data.createRevision.id;

      const newVote = {
        circle: props.activeCircle,
        revision: newRevision.id,
        user: props.user,
        support: true
      };

      await props.createVote({
        variables: {
          ...newVote
        }
      });

      setActiveRevision(newRevision.id);

      props.history.push(
        `/app/circle/${props.activeCircle}/revisions/${newRevision.id}`
      );
    } catch (err) {
      if (
        !err.message.includes("unique constraint would be violated") ||
        !err.message.includes("hash")
      ) {
        console.error(new Error(err));
        swal("Error", err.message, "error");
      }
    }
  };

  const { amendment } = props;
  const hasOutstandingRevision =
    amendment.revision !== null && amendment.revision.passed === null;
  return (
    <div>
      {editMode && hasOutstandingRevision === false ? (
        <AmendmentEdit
          save={save}
          cancel={cancel}
          update={setText}
          amendment={amendment}
          toggleEdit={toggleEdit}
          text={text}
          repeal={repeal}
        />
      ) : (
        <AmendmentView
          amendment={amendment}
          toggleEdit={toggleEdit}
          text={text}
          editable={props.editable}
          circle={activeCircle}
        />
      )}
    </div>
  );
}

export default compose(
  graphql(CREATE_REVISION, { name: "createRevision" }),
  graphql(CREATE_VOTE, { name: "createVote" }),
  graphql(ADD_REVISION_TO_AMENDMENT, { name: "addNewRevisionToAmendment" })
)(withRouter(Amendment));
