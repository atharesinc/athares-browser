import React from "react";
import { withRouter } from "react-router-dom";
import { closeSearch, clearSearch } from "../store/ui/actions";
import { connect } from "react-redux";
import moment from "moment";

const Section = props => {
  let { data } = props;

  const navigate = e => {
    const item = e.currentTarget;
    const id = item.getAttribute("data-id");
    const chosenItem = data.find(item => item.id === id);

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
        default:
          break;
      }
      props.dispatch(closeSearch());
      props.dispatch(clearSearch());
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
          return (
            <div
              className="suggestion-item"
              key={item.id}
              onClick={navigate}
              data-id={item.id}
            >
              {props.title === "users" ? (
                <div className="suggestion-item-user">
                  <img
                    src={item.icon}
                    className="suggestion-item-user-image"
                    alt=""
                  />{" "}
                  <span>{item.firstName + " " + item.lastName + " "}</span>
                  {item.uname && <span>- {item.uname}</span>}{" "}
                </div>
              ) : (
                <div className="flex flex-column justify-around h-100">
                  <div>
                    {item[props.searchOn] +
                      (props.title !== "circles"
                        ? " - " + item.circle.name
                        : "")}
                  </div>
                  {props.title !== "circles" && (
                    <div className="f7">{moment(item.createdAt).fromNow()}</div>
                  )}
                </div>
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
