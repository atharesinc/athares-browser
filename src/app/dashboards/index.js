import React, { Component } from "react";
import GroupChat from "./chat";
import DM from "./dmChat";
import createCircle from "./createCircle";
import createChannel from "./createChannel";
import createDM from "./createDM";
import Dashboard from "./dashboard";
import AddUser from "./addUser";
import Docs from "./docs";
import createAmendment from "./createAmendment";
import User from "./user";
import Revisions from "./revisions";
import { Switch, Route } from "react-router-dom";
import NoMatch from "../../404";

const Dashboards = props => {
  const { match } = props;
  return (
    <Switch>
      <Route
        exact
        path={`${match.path}/circle/:id/channel/:id`}
        component={GroupChat}
      />
      <Route exact path={`/app/channel/:id`} component={DM} />
      <Route exact path={`${match.path}/`} component={Dashboard} />
      <Route exact path={`${match.path}/new/circle`} component={createCircle} />
      <Route
        exact
        path={`${match.path}/circle/:id/new/channel`}
        component={createChannel}
      />
      <Route exact path={`${match.path}/new/message`} component={createDM} />
      <Route
        exact
        path={`${match.path}/circle/:id/add/user`}
        component={AddUser}
      />
      <Route
        exact
        path={`${match.path}/circle/:id/constitution/`}
        component={Docs}
      />
      <Route
        exact
        path={`${match.path}/circle/:id/add/amendment`}
        component={createAmendment}
      />
      <Route
        path={`${match.path}/user`}
        component={props => <User {...props} />}
      />
      <Route
        path={`${match.path}/circle/:id/revisions`}
        component={props => <Revisions {...props} />}
      />
      <Route
        component={props => {
          props.history.push("/app");
          return null;
        }}
      />
    </Switch>
  );
};

export default Dashboards;
