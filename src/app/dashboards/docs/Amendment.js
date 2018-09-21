import React from "react";
import AmendmentEdit from "./AmendmentEdit";
import AmendmentView from "./AmendmentView";

export default class Amendment extends React.Component {
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
    if (e.target.className !== "editMask" && this.state.editMode) {
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
  save = () => {
    // can be undefined if no changes ?
    console.log(this.state.text);

    // this.props.updateItem(this.props.id, this.state.text);
    // this.setState({
    // 	editMode: !this.state.editMode
    // });
  };
  shouldComponentUpdate(nextProps, nextState) {
    return (
      nextProps !== this.props || nextState.editMode !== this.state.editMode
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
