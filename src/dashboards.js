import React from "react";
import GroupChat from "./chat";
import DM from "./dmChat";
import CreateCircle from "./createCircle";
import CreateChannel from "./createChannel";
import CreateDM from "./createDM";
import Dashboard from "./default";
import AddUser from "./addUser";
import Docs from "./docs";
import CreateAmendment from "./createAmendment";
import User from "./user";
import Revisions from "./revisions";
import Settings from "./circleSettings";
import News from "./news";

import { Switch, Route } from "react-router-dom";

const Dashboards = props => {
  const { match } = props;
  return (
    <Switch>
      <Route
        exact
        path={`${match.path}/circle/:id/channel/:id`}
        render={props => <GroupChat {...props} />}
      />
      <Route
        exact
        path={`${match.path}/circle/:id/settings`}
        render={props => <Settings {...props} />}
      />
      <Route
        exact
        path={`${match.path}/new/circle`}
        render={() => <CreateCircle {...props} />}
      />
      <Route
        exact
        path={`${match.path}/circle/:id/new/channel`}
        render={props => <CreateChannel {...props} />}
      />
      <Route
        exact
        path={`${match.path}/new/message`}
        render={() => <CreateDM />}
      />
      <Route
        exact
        path={`${match.path}/channel/:id`}
        render={props => <DM {...props} />}
      />
      <Route
        exact
        path={`${match.path}/circle/:id/add/user`}
        render={props => <AddUser {...props} />}
      />
      <Route
        exact
        path={`${match.path}/circle/:id/constitution/`}
        render={props => <Docs {...props} />}
      />
      <Route
        exact
        path={`${match.path}/circle/:id/add/amendment`}
        render={() => <CreateAmendment />}
      />
      <Route
        path={`${match.path}/user`}
        render={props => <User {...props} />}
      />
      <Route
        path={`${match.path}/circle/:id/revisions`}
        render={props => <Revisions {...props} />}
      />
      <Route
        path={`${match.path}/`}
        render={props => <Dashboard {...props} />}
      />
      <Route render={props => <News {...props} />} />
    </Switch>
  );
};

export default Dashboards;
