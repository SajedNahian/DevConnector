import React, { Component } from "react";
import { connect } from "react-redux";
import { getProfileByHandle } from "../../actions/profileActions";
import ProfileHeader from "./ProfileHeader";
import ProfileAbout from "./ProfileAbout";
import ProfileCreds from "./ProfileCreds";
import ProfileGithub from "./ProfileGithub";
import Spinner from "./../common/Spinner";
import { Link } from "react-router-dom";

class Profile extends Component {
  componentDidMount() {
    if (this.props.match.params.handle) {
      this.props.getProfileByHandle(this.props.match.params.handle);
    }
  }

  render() {
    const { profile, loading } = this.props.profile;
    let profileContent;

    if (loading) {
      profileContent = <Spinner />;
    } else {
      if (!profile) {
        profileContent = (
          <div>
            <h1 className="display-4">Page Not Found</h1>
            <p>Sorry, a user with that handle does not exist</p>
          </div>
        );
      } else {
        profileContent = (
          <div>
            <ProfileHeader profile={profile} />
            <ProfileAbout profile={profile} />
            <ProfileCreds
              education={profile.education}
              experience={profile.experience}
            />
            {profile.githubusername && (
              <ProfileGithub username={profile.githubusername} />
            )}
          </div>
        );
      }
    }
    return (
      <div className="container">
        <Link to="/profiles" className="btn btn-light">
          View All Profiles
        </Link>
        <div className="col-md-6" />
        <div className="row">
          <div className="col-md-12">{profileContent}</div>
        </div>
      </div>
    );
  }
}

const mapStateToProps = state => ({
  profile: state.profile
});

export default connect(
  mapStateToProps,
  { getProfileByHandle }
)(Profile);
