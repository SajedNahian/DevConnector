import React, { Component } from "react";
import { BrowserRouter as Router, Route, Switch } from "react-router-dom";
import { Provider } from "react-redux";
import store from "./store";
import Navbar from "./components/layout/Navbar";
import Footer from "./components/layout/Footer";
import Landing from "./components/layout/Landing";
import Register from "./components/auth/Register";
import Login from "./components/auth/Login";
import Dashboard from "./components/dashboard/Dashboard";
import "./App.css";
import jwt_decode from "jwt-decode";
import setAuthToken from "./utils/setAuthToken";
import { setCurrentUser, logoutUser } from "./actions/authAction";
import { clearCurrentProfile } from "./actions/profileActions";
import PrivateRoute from "./components/common/PrivateRoute";
import CreateProfile from "./components/create-profile/CreateProfile";
import EditProfile from "./components/edit-profile/EditProfile";
import AddExperience from "./components/add-credentials/AddExperience";
import AddEducation from "./components/add-credentials/AddEducation";
import Profiles from "./components/profiles/Profiles";
import Profile from "./components/profile/Profile";
import NotFound from "./components/not-found/NotFound";
import Posts from "./components/posts/Posts";
import Post from "./components/post/Post";

if (localStorage.jwtToken) {
  setAuthToken(localStorage.jwtToken);
  const decoded = jwt_decode(localStorage.jwtToken);
  const currentTime = Date.now() / 1000;
  if (decoded.exp < currentTime) {
    window.location.href = "/login";
    store.dispatch(logoutUser());
    store.dispatch(clearCurrentProfile());
  } else {
    store.dispatch(setCurrentUser(decoded));
  }
}

export default class App extends Component {
  render() {
    return (
      <Provider store={store}>
        <Router>
          <div className="App" store={store}>
            <Navbar />
            <Route path="/" component={Landing} exact />
            <div className="container">
              <Switch>
                <Route path="/profiles" component={Profiles} />
                <Route path="/profile/:handle" component={Profile} />
                <Route path="/register" component={Register} exact />
                <PrivateRoute
                  path="/create-profile"
                  component={CreateProfile}
                />

                <PrivateRoute path="/dashboard" component={Dashboard} exact />

                <PrivateRoute
                  path="/add-experience"
                  component={AddExperience}
                  exact
                />

                <PrivateRoute
                  path="/add-education"
                  component={AddEducation}
                  exact
                />

                <PrivateRoute
                  path="/edit-profile"
                  component={EditProfile}
                  exact
                />

                <PrivateRoute path="/feed" component={Posts} exact />
                <PrivateRoute path="/post/:id" component={Post} exact />
                <Route path="/login" component={Login} exact />
                <Route component={NotFound} />
              </Switch>
            </div>
            <Footer />
          </div>
        </Router>
      </Provider>
    );
  }
}
