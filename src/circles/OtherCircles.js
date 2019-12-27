import React, { useGlobal } from "reactn";
import Circle from "./Circle";
import { withRouter } from "react-router-dom";
import { Scrollbars } from "react-custom-scrollbars";

import { GET_CIRCLES_BY_USER_ID } from "../graphql/queries";
import { Query } from "react-apollo";

function OtherCircles(props) {
  const [user] = useGlobal("user");
  const [activeCircle, setActiveCircle] = useGlobal("activeCircle");

  const setActive = id => {
    setActiveCircle(id);
    props.history.push(`/app/circle/${id}`);
  };

  let circles = [];
  return (
    <Query
      query={GET_CIRCLES_BY_USER_ID}
      variables={{ id: user || "" }}
      pollInterval={3000}
    >
      {({ data = {} }) => {
        if (data.User) {
          circles = data.User.circles;
        }
        return (
          <div id="other-circles">
            <Scrollbars
              style={{ width: "100%", height: "100%" }}
              className="splash"
              autoHide
              autoHideTimeout={1000}
              autoHideDuration={200}
              universal={true}
            >
              {circles.map(circle => (
                <Circle
                  key={circle.id}
                  {...circle}
                  isActive={circle.id === activeCircle}
                  selectCircle={setActive}
                />
              ))}
            </Scrollbars>
          </div>
        );
      }}
    </Query>
  );
}

export default withRouter(OtherCircles);
