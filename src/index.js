import React from "react";
import ReactDOM from "react-dom";
import { createBrowserHistory } from "history";
import { Router, Route, Switch, Redirect } from "react-router-dom";

// core components
import Admin from "layouts/Admin.jsx";
import Login from "layouts/Login.jsx";
import RecuperarSenha from "layouts/RecuperarSenha.jsx";
import TermosUso from "layouts/TermosUso.jsx";

//auth
import { isAuthenticated } from "./services/auth";

import "assets/css/material-dashboard-react.css?v=1.7.0";

const hist = createBrowserHistory();

const PrivateRoute = ({ component: Component, ...rest }) => (
  <Route
    {...rest}
    render={props =>
      isAuthenticated() ? (
        <Component {...props} />
      ) : (
        <Redirect
          to={{ pathname: "/login", state: { from: props.location } }}
        />
      )
    }
  />
);

const PublicRoute = ({ component: Component, ...rest }) => (
  <Route
    {...rest}
    render={props =>
      isAuthenticated() ? (
        <Redirect
          to={{
            pathname: "admin/dashboard",
            state: { from: props.location }
          }}
        />
      ) : (
        <Component {...props} />
      )
    }
  />
);

ReactDOM.render(
  <Router history={hist}>
    <Switch>
      <PrivateRoute path="/admin" component={Admin} />
      <PublicRoute path="/login" component={Login} />
      <PublicRoute
        path="/alterar_senha/:token/:email"
        component={RecuperarSenha}
      />
      <PublicRoute path="/termouso" component={TermosUso} />
      <Redirect from="/" to="/login" />
    </Switch>
  </Router>,
  document.getElementById("root")
);
