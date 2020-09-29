import React, { useState, useEffect } from "react";
import { Card, CardBody, CardHeader, CardFooter } from "@paljs/ui/Card";
import Row from "@paljs/ui/Row";
import Col from "@paljs/ui/Col";
import Editor from "./Editor";
import PostList from "./PostList";
import UserInfo from "./UserInfo";
import EditUserInfo from "./EditUserInfo";
import Experience from "./UserExperience";
import ContextConsumer from '../../context/context'
import { getUser, getUserPosts, getStack } from "../../helpers/profileHelpers";
import useVisualMode from "../../hooks/useVisualMode";
import useApplicationData from "../../hooks/useApplicationData";

const SHOW = "SHOW";
const CONFIRM = "CONFIRM";
const SAVING = "SAVING";
const EDITING = "EDITING";
const ERROR_SAVE = "ERROR_SAVE";
const ERROR_DELETE = "ERROR_DELETE";

function UserProfileItem(props) {

  const { state, createPost } = useApplicationData();
  const { mode, transition, back } = useVisualMode(SHOW);

  const senderID = document.cookie.split("=")[1];

  const posts = getUserPosts(state.posts, senderID);
  const user = getUser(state.user_profiles, senderID);
  const mentor_stack = getStack(state.mentor_stack, senderID);

  function onEdit() {
    transition(EDITING);
  }

  function onCancel() {
    console.log("WOW");
    back();
  }

  // const users = state.users;
  console.log("props in user item: ", state.selected);
  const currentUser = state.users.find(
    (user) => user.id === props.userId || user.username === props.userId
  );

  
  if (!currentUser) return null;

  return (
    <>
      <Row>
        <Col breakPoint={{ xs: 12 }}>
          <Card>
            <header>Profile</header>
            <CardBody>
              {mode === SHOW && (
                <>
                <ContextConsumer>
                  {({ data, set }) => {
                  <UserInfo
                    user={currentUser}
                    loggedInUser={data.selected}
                    onEdit={onEdit}
                    mentor_stack={mentor_stack}
                  />
                        }}
                </ContextConsumer>
                </>
              )}
              {mode === EDITING && (
                <>
                  <EditUserInfo
                    user={currentUser}
                    avatar={user.avatar}
                    location={user.location}
                    username={user.username}
                    is_mentor={user.is_mentor}
                    is_student={user.is_student}
                    mentor_stack={mentor_stack}
                    // onSave={onSave}
                    onCancel={onCancel}
                  />
                </>
              )}

              <Experience
                mentor={currentUser.mentorrating}
                student={currentUser.studentrating}
                user={currentUser}
                // userId={state.user.id}
                // username={state.user.username}
              />

              <Row>
                <Col breakPoint={{ xs: 12, md: 12 }}>
                  <Editor id={user.id} createPost={createPost} />
                </Col>
              </Row>
              <Row>
                <Col breakPoint={{ xs: 12, md: 12 }}>
                  <header>Recent Posts</header>
                </Col>
              </Row>
              <PostList posts={posts} />
            </CardBody>
          </Card>
        </Col>
      </Row>
    </>
  );
}

export default UserProfileItem;
