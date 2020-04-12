import React from "react";
import { Switch, Route } from "react-router";
import EntriesMnaager from "./containers/EntriesManager/index";

export default (
    <Switch>
        <Route exact path="/" component={EntriesMnaager} />
    </Switch>
);
