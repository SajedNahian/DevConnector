import React, { Component } from "react";
import Moment from "react-moment";
class ProfileCreds extends Component {
  render() {
    const { experience, education } = this.props;
    const expItems = experience.map((exp, index) => (
      <li className="list-group-item" key={index}>
        <h4>{exp.company}</h4>
        <p>
          <Moment format="MM/DD/YYYY">{exp.from}</Moment> -{" "}
          {exp.current ? (
            "Current"
          ) : (
            <Moment format="YYYY/MM/DD">{exp.to}</Moment>
          )}
        </p>
        <p>
          <strong>Position:</strong> {exp.title}
        </p>
        {exp.location && (
          <p>
            <strong>Location:</strong> {exp.location}
          </p>
        )}
        {exp.description && (
          <p>
            <strong>Description:</strong> {exp.description}
          </p>
        )}
      </li>
    ));

    const eduItems = education.map((edu, index) => (
      <li className="list-group-item" key={index}>
        <h4>{edu.school}</h4>
        <p>
          <Moment format="MM/DD/YYYY">{edu.from}</Moment> -{" "}
          {edu.current ? (
            "Current"
          ) : (
            <Moment format="MM/DD/YYYY">{edu.to}</Moment>
          )}
        </p>
        <p>
          <strong>Degree: </strong>
          {edu.degree}
        </p>
        <p>
          <strong>Field Of Study: </strong>
          {edu.fieldofstudy}
        </p>
        {edu.description && (
          <p>
            <strong>Description: </strong>
            {edu.description}
          </p>
        )}
      </li>
    ));
    return (
      <div className="row">
        <div className="col-md-6">
          <h3 className="text-center text-info">Experience</h3>
          <ul className="list-group">
            {expItems.length > 0 ? (
              expItems
            ) : (
              <p className="text-center">No experience listed</p>
            )}
          </ul>
        </div>
        <div className="col-md-6">
          <h3 className="text-center text-info">Experience</h3>
          <ul className="list-group">
            {eduItems.length > 0 ? (
              eduItems
            ) : (
              <p className="text-center">No education listed</p>
            )}
          </ul>
        </div>
      </div>
    );
  }
}

export default ProfileCreds;
