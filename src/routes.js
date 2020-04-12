import React from "react";
import { Switch, Route } from "react-router";
import UserManagaer from "./containers/UserManager/index";
import EntriesMnaager from "./containers/EntriesManager/index";
import CompactEntries from "./containers/EntriesManager/compactIndex";

export default (
    <Switch>
        <Route exact path="/" component={EntriesMnaager} />
        <Route exact path="/user-manager" component={CompactEntries} />
    </Switch>
);
