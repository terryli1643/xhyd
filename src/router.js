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

export const ReactRouter = () => {
    return (
        <Router history={ browserHistory }>
            <Route path="/" component={myLayout}>
                <Route path="login" component={Login} />
                <Route path="home" component={Home} />
                <Route path="unprint" component={UnPrint} />
                <Route path="printed" component={Printed} />
                <Route path="singlesend" component={SingleSend} />
            </Route>
            <Route path="/nopermission" component={NotPermission} />
            <Route path="*" component={NotFound} />
        </Router>
    )
};
