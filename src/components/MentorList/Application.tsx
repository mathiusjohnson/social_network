import React from "react";
import useApplicationData from "../../hooks/useApplicationData";
import MentorList from './MentorList'

function Application(props) {
  
  const mentors = props.mentors;
  console.log("mentors in mentorlist: ", mentors);
  
  return (
    <div className="App">
        <MentorList
          mentors={mentors}
          setSelectedUser={props.setSelectedUser}
        />
    </div>
  );
}

export default Application;
