import React, { Component } from "react";

class ProfileAbout extends Component {
  render() {
    const { profile } = this.props;
    const firstName = profile.user.name.split(" ")[0];
    const skills = profile.skills.map((skill, index) => (
      <div className="p-3" key={index}>
        <i className="fa fa-check" />
        <span className="ml-1">{skill}</span>
      </div>
    ));
    return (
      <div className="row">
        <div className="col-md-12">
          <div className="card card-body bg-light mb-3">
            {profile.bio && (
              <div>
                <h3 className="text-center text-info">{firstName}'s Bio</h3>
                <p className="lead">{profile.bio}</p>
                <hr />
              </div>
            )}
            <h3 className="text-center text-info">Skill Set</h3>
            <div className="row">
              <div className="d-flex flex-wrap justify-content-center align-items-center">
                {skills}
              </div>
            </div>
          </div>
        </div>
      </div>
    );
  }
}

export default ProfileAbout;
