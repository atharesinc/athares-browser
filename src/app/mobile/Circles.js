import React from "react";

import FeatherIcon from "feather-icons-react";
import { Scrollbars } from "react-custom-scrollbars";
import Circle from "./Circle";
import { Link } from "react-router-dom";
import { Query } from "react-apollo";
import { GET_CIRCLES_BY_USER_ID } from "../../graphql/queries";

const Circles = ({ setActive, user, ...props }) => {
  let circles = [];
  return (
    <Query
      query={GET_CIRCLES_BY_USER_ID}
      variables={{ id: user || "" }}
      pollInterval={3000}
    >
      {({ loading, err, data }) => {
        if (data.User) {
          circles = data.User.circles;
        }
        return (
          <div className="mobile-top-nav w-100 v-mid bg-theme flex flex-row justify-between items-center pv0 ph3">
            <Link
              to={user ? "/app/new/circle" : "/login"}
              className="flex flex-row justify-between items-center"
            >
              <FeatherIcon
                icon="plus-circle"
                className={`${user ? "white" : "theme-dark"} w2 h2 mr2`}
                style={{
                  height: "1.5em",
                  width: "1.5em",
                  lineHeight: "100%"
                }}
              />
            </Link>
            <Scrollbars
              style={{
                width: "80vw",
                height: "100%",
                display: "flex",
                justifyContent: "flex-start",
                alignItems: "center"
              }}
              autoHide
              autoHideTimeout={1000}
              autoHideDuration={200}
              universal={true}
            >
              <div className="flex flex-row justify-left items-center h-100">
                {circles.map(circle => (
                  <Circle
                    key={circle.id}
                    {...circle}
                    isActive={circle.id === props.activeCircle}
                    selectCircle={setActive}
                  />
                ))}
              </div>
            </Scrollbars>
          </div>
        );
      }}
    </Query>
  );
};

export default Circles;
