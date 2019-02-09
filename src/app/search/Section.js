import React from "react";
import { withRouter } from "react-router-dom";
import { closeSearch } from "../../store/ui/actions";
import { connect } from "react-redux";

const Section = props => {
  console.log(props);
  let { data } = props;
  // Filter the items of this type that contain the search criteria
  // limit it to 10 items per section
  //   data = data
  //     .filter(
  //       item =>
  //         item[props.searchOn]
  //           .toLowerCase()
  //           .indexOf(props.search.toLowerCase()) !== -1
  //     )
  //     .slice(0, 10);

  const navigate = e => {
    const item = e.currentTarget;
    const id = item.getAttribute("data-id");
    const chosenItem = data.find(item => item.id === id);
    console.log(item, id, chosenItem);

    if (chosenItem) {
      const { history } = props;

      switch (props.title) {
        case "circles":
          history.push(`/app/circle/${id}`);
          break;
        case "channels":
          history.push(`/app/circle/${chosenItem.circle.id}/channel/${id}`);
          break;
        case "amendments":
          history.push(
            `/app/circle/${chosenItem.circle.id}/constitution#${id}`
          );
          break;
        case "revisions":
          history.push(`/app/circle/${chosenItem.circle.id}/revision/${id}`);
          break;
        case "users":
          history.push(`/app/user/${id}`);
          break;
      }
      props.dispatch(closeSearch());
    }
  };
  // If the user hasn't entered any search terms, or there are no results for this section, don't display the section
  if (props.search.trim() === "" || data.length === 0) {
    return null;
  }
  return (
    <div id="suggestion-items-wrapper">
      <div className="suggestion-header">{props.title.toUpperCase()}</div>
      <div />
      <div id="suggestion-items">
        {data.map(item => {
          console.log(item);
          return (
            <div
              className="suggestion-item"
              key={item.id}
              onClick={navigate}
              data-id={item.id}
            >
              {props.title === "users" ? (
                <div className="suggestion-item-user">
                  <img src={item.icon} className="suggestion-item-user-image" />{" "}
                  <span>{item.firstName + " " + item.lastName + " "}</span>
                  {item.uname && <span>- {item.uname}</span>}{" "}
                </div>
              ) : (
                item[props.searchOn] +
                (props.title !== "circles" ? " - " + item.circle.name : "")
              )}
            </div>
          );
        })}
      </div>
    </div>
  );
};
function mapStateToProps(state) {
  return {};
}
export default connect(mapStateToProps)(withRouter(Section));
