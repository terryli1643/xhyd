import React from "react";
import { Router, Route, browserHistory } from "react-router";
import myLayout from "./routes/pages/Layout";
import NotFound from "./routes/errors/NotFound";
import NotPermission from "./routes/errors/NotPermission";
import Login from "./routes/pages/Login";
import Home from "./routes/pages/Home";
import UnPrint from "./routes/pages/UnPrint";
import Printed from "./routes/pages/Printed";
import SingleSend from "./routes/pages/SingleSend";
import Unsent from "./routes/pages/unsent";
import Reused from "./routes/pages/Reused";
import Check from "./routes/pages/check";
import  Test from "./routes/pages/test";

export const ReactRouter = () => {
    return (
        <Router history={ browserHistory }>
            <Route path="/" component={myLayout}>
                <Route path="login" component={Login} />
                <Route path="dashboard" component={Home} />
                <Route path="home" component={Home} />
                <Route path="unPrint" component={UnPrint} />
                <Route path="printed" component={Printed} />
                <Route path="singleSent" component={SingleSend} />
                <Route path="unsent" component={Unsent} />
                <Route path="reused" component={Reused} />
                <Route path="check" component={Check} />
                <Route path="test" component={Test} />
            </Route>
            <Route path="/nopermission" component={NotPermission} />
            <Route path="*" component={NotFound} />
        </Router>
    )
};
