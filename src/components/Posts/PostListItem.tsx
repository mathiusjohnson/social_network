import React, { useRef } from "react";
import Row from "@paljs/ui/Row";
import Col from "@paljs/ui/Col";
import { Card, CardBody } from "@paljs/ui/Card";
import { Link } from "@reach/router";
import { Button } from "@paljs/ui/Button";
import ContextConsumer from "../../context/context";
import "./PostListItem.scss";
import timeSince from "../../helpers/timeSince";

const classNames = require("class-names");

interface IProps {
  key: number;
  post: IPost;
  likes: ILikes;
  active: boolean;
  comments: IComments;
  comment: object;
  addLike: (post_id: number, liker_id: number) => void;
  removeLike: (post_id: number, liker_id: number) => void;
  onClick: () => void;
  id: number;
  data: any;
  users: IUsers;
  createComment: (
    post_id: number,
    commenter_id: number,
    text_body: string
  ) => void;
  onChange: () => void;
  then: () => void;
}

interface IUsers {
  [index: number]: { id: number; user_id: number; name: string };
}

interface IComments {
  [index: number]: { id: number; user_id: number; name: string };
}

interface ILikes {
  [index: number]: { id: number; user_id: number; name: string };
}

interface IPost {
  avatar: string;
  studentrating: string;
  text_body: string;
  active: boolean;
  time_posted: Date;
  stack: any;
  username: string;
  post_id: number;
  id: number;
}

export default function PostListItem(props: IProps) {
  const [value, setValue] = React.useState("Comment here...");

  const list = classNames("post_body__item-list");
  const commentStyle = classNames("post_body__item-comments");
  const commentAvatar = classNames("post_body__item-comment_avatar");

  const stack = props.post.stack.map((tech_stack, index) => {
    return (
      <li className={list} key={index}>
        {tech_stack}&nbsp;
      </li>
    );
  });

  const commentData = props.comments.filter((comment) => {
    if (props.post.post_id === comment.post_id) {
      return comment;
    }
  });

  const commentList = commentData.map((comment, index) => {
    return (
      <div key={index}>
        <img className={commentAvatar} src={comment.avatar} alt="avatar" />
        <div className={commentStyle}>
          <p>
            <b>{comment.username}</b>
          </p>
          <li>{comment.text_body}</li>
        </div>
      </div>
    );
  });

  const commentsLength = commentList.length;

  const postLikes = props.likes.filter(
    (like) => props.post.post_id === like.post_id
  );

  const likeSum = postLikes.length;

  const postBody = classNames("post_body");
  const textBody = classNames("post_body__item-text_body");
  const userLink = classNames("post_body__item-user_link");
  const messageButton = classNames("post_body__item-message_button");
  const commentListStyle = classNames("post_body__item-comment_list");
  const commentButton = classNames("post_body__item-comment_button");
  const userCard = classNames("post_body__item-user_card");
  const circle = classNames("post_body__item-circle");
  const inline = classNames("post_body__item-inline");
  const likesComments = classNames("post_body__item-likes_comments");
  const bg = classNames("post_body__item-bg");
  const floatRight = classNames("post_body__item-float_right");
  const blueButton = classNames("post_body__item-blue_button");
  const likeButton = classNames("post_body__item-like_button");
  return (
    <>
      <ContextConsumer>
        {({ data }) => {
          if (!data.state) return null;
          const currentUser = props.users.find(
            (user) => user.username === data.selected
          );

          const myLikes = postLikes.filter(
            (like) => currentUser.id === like.liker_id
          );

          const iAlreadyLikeThis = myLikes.length > 0;

          const onSave = () => {
            //check for empty input here
            props
              .createComment(props.post.post_id, currentUser.id, value)
              .then(() => {
                setValue("");
              });
          };

          const timeAgo = timeSince(props.post.time_posted);

          return (
            <div>
              <Row>
                <Col breakPoint={{ xs: 12 }}>
                  <Card>
                    <CardBody className={postBody}>
                      {/* POST TEXT BODY */}
                      <div className={floatRight}>
                        <small className={floatRight}>{timeAgo}</small>
                        <p className={textBody}>{props.post.text_body}</p>
                      </div>

                      {/* USERS DETAILS */}
                      <Link
                        className={userLink}
                        to={`/user-profiles/${props.post.username}`}
                      >
                        <div className={inline}>
                          <div className={circle}>
                            <img src={props.post.avatar} alt="avatar"></img>
                          </div>
                          <div className={userCard}>
                            <span className={bg}>
                              <h3>{props.post.username}</h3>
                            </span>

                            <span>
                              {props.active ? (
                                <h6>User is online</h6>
                              ) : (
                                <h6>User is offline</h6>
                              )}
                            </span>
                          </div>
                        </div>
                      </Link>

                      {/* MESSAGE BUTTON */}
                      <div className={messageButton}>
                        <Link
                          className={userLink}
                          to={`/messages/`}
                          state={{ username: props.post.username }}
                        >
                          <div className={blueButton}>Message User</div>
                        </Link>
                      </div>

                      {/* POST STACK LIST */}
                      <h5>Stack: {stack}</h5>

                      {/* BUTTON FOR LIKES */}

                      {iAlreadyLikeThis ? (
                        <div
                          className={likeButton}
                          onClick={() =>
                            props.removeLike(props.post.post_id, currentUser.id)
                          }
                        >
                          Unlike
                        </div>
                      ) : (
                        <div
                          className={likeButton}
                          onClick={() =>
                            props.addLike(props.post.post_id, currentUser.id)
                          }
                        >
                          Like
                        </div>
                      )}

                      <div className={likesComments}>
                        {/* LIKE COUNT */}
                        {likeSum > 1 ? (
                          <p>
                            <b>{likeSum} Likes</b>
                          </p>
                        ) : (
                          ""
                        )}
                        {likeSum === 1 ? (
                          <p>
                            <b>{likeSum} Like</b>
                          </p>
                        ) : (
                          ""
                        )}
                        {/* COMMENTS LIST FOR POST */}
                        {commentsLength > 1 ? (
                          <h6>{commentsLength} comments</h6>
                        ) : (
                          ""
                        )}
                        {commentsLength === 1 ? (
                          <h6>{commentsLength} comment</h6>
                        ) : (
                          ""
                        )}
                      </div>
                      <ul className={commentListStyle}>{commentList}</ul>

                      {/* FOR COMMENTING */}
                      <textarea
                        value={value}
                        onChange={(event) => {
                          setValue(event.target.value);
                        }}
                        rows="2"
                        cols="80"
                        placeholder="Leave a comment here.."
                      ></textarea>
                      <div className={commentButton}>
                        <Button onClick={() => onSave()}>Comment</Button>
                      </div>
                    </CardBody>
                  </Card>
                </Col>
              </Row>
            </div>
          );
        }}
      </ContextConsumer>
    </>
  );
}
