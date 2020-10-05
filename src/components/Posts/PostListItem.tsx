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
    text_body: string,
    comment_details: (avatar: any, username: any) => void
  ) => void;
  removeComment: (
    post_id: number,
    commenter_id: number,
    text_body: string
  ) => void;
  editComment: (
    post_id: number,
    commenter_id: number,
    text_body: string,
    value: string
  ) => void;
  onChange: () => void;
  then: () => void;
}

interface IUsers {
  [index: number]: { id: number; user_id: number; name: string };
}

interface IComments {
  [index: number]: { id: number; user_id: number; name: string, post_id: number, text_body: string };
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
  owner_id: number;
}

export default function PostListItem(props: IProps) {
  const [value, setValue] = React.useState("Comment here...");

  const stack = props.post.stack.map((tech_stack, index) => {
    return (
      <li className="list" key={index}>
        {tech_stack}&nbsp;
      </li>
    );
  });

  const postComments = props.comments.filter((comment) => {
    if (typeof props.post === 'undefined' || typeof comment === 'undefined') return null;
    if (props.post.post_id === comment.post_id) {
      return true;
    }
  });

  const postLikes = props.likes.filter(
    (like) => props.post.post_id === like.post_id
  );

  const likeSum = postLikes.length;



  return (
    <>
      <ContextConsumer>
        {({ data }) => {
          if (!data.state) return null;
          if (!data.selected) return null;
          const currentUser = props.users.find(
            (user) => user.id === data.selected
          );

          const myLikes = postLikes.filter(
            (like) => currentUser.id === like.liker_id
          );

          const iAlreadyLikeThis = myLikes.length > 0;
          
          const commentList = postComments.map((comment, index) => {

          const myComment = currentUser.id === comment.commenter_id;

          const myCommentOrPost = currentUser.id === comment.commenter_id || currentUser.id === props.post.owner_id ;
            
          const onRemove = () => {
            //check for empty input here
            props.removeComment(props.post.post_id, currentUser.id, comment.id);
          };

          return (
            <div key={index}>
              <img
                className="comment-avatar"
                src={comment.avatar}
                alt="avatar"
              />
              <div className="comments">
                <div className="flex">
                  {/* {myCommentOrPost ? (
                    <p onClick={() => onEdit()} className={deleteButton}>
                      Edit
                    </p>
                  ) : (
                    ""
                  )} */}
                  {myCommentOrPost ? (
                    <p onClick={() => onRemove()} className="delete-button">
                      Delete
                    </p>
                  ) : (
                    ""
                  )}
                </div>

                <li>
                  <b>{comment.username}</b>
                </li>
                <li>{comment.text_body}</li>
              </div>
            </div>
          );
        });
          
          const commentsLength = commentList.length;
          const commentObj = {
            avatar: currentUser.avatar,
            username: currentUser.username,
          };
          // FOR COMMENTS
          const onSave = () => {
            //check for empty input here
            console.log("props post id: ", props.post.post_id);
            
            props
              .createComment(
                props.post.post_id,
                currentUser.id,
                value,
                commentObj
              )
              .then(() => {
                setValue("");
              });
          };

          // const onEdit = () => {
          //   //check for empty input here
          //   props.editComment(props.comment.post_id, currentUser.id, value, props.comment.text_body);
          // };

          const onRemove = () => {
            //check for empty input here
            props.removeComment(props.post.post_id, currentUser.id, value);
          };

          const timeAgo = timeSince(props.post.time_posted);

          return (
            <div>
              <Card>
                <CardBody className="post-body">
                
                  {/* USERS DETAILS */}

                  <Link className="user-link" to={`/user-profiles/${props.post.username}`}>
                    <div className="user-card">
                      <div className="circle">
                        <img src={props.post.avatar} alt="avatar"></img>
                      </div>    
                      <span className="bg">
                        <h3>{props.post.username}</h3>
                      </span>
                    </div>
                  </Link>
                  <Link className="online-link" to={`/user-profiles/${props.post.username}`}>
                    <span>{props.post.active ? <h6>User is online</h6> : <h6>User is offline</h6>}
                    </span>
                  </Link>
                  {/* MESSAGE BUTTON */}
                  <div className="message-button">
                    <Link
                      className="user-link"
                      to={`/messages/`}
                      state={{ username: props.post.username }}
                    >
                      <div className="blue-button">Message User</div>
                    </Link>
                  </div>
                  <small className="float-right">{timeAgo}</small>

                  {/* POST TEXT BODY */}
                  <p className="text-body">{props.post.text_body}</p>

                  {/* POST STACK LIST */}
                  <h5>Stack: {stack}</h5>

                  {/* BUTTON FOR LIKES */}

                  {iAlreadyLikeThis ? (
                  <div
                    className="like-button"
                    onClick={() => props.removeLike(props.post.post_id, currentUser.id)}
                    >Unlike</div>
                  ) : (
                  <div
                    className="like-button"
                    onClick={() => props.addLike(props.post.post_id, currentUser.id)}
                    >Like</div>
                  )}

                  <div className="likes-comments">
                    {/* LIKE COUNT */}
                    {likeSum > 1 ? <p><b>{likeSum} Likes</b></p> : ""}
                    {likeSum === 1 ? <p><b>{likeSum} Like</b></p> : ""}
                    {/* COMMENTS LIST FOR POST */}
                    {commentsLength > 1 ? <h6>{commentsLength} comments</h6> : ""}
                    {commentsLength === 1 ? <h6>{commentsLength} comment</h6> : ""}
                  </div>
                  <ul className="comment-list">{commentList}</ul>

                  {/* FOR COMMENTING */}
                  <textarea
                    value={value}
                    onChange={(event) => {setValue(event.target.value);}} 
                    rows="2" cols="80" placeholder="Leave a comment here.."
                  ></textarea>
                  <div className="comment-button"onClick={() => onSave()}>Comment</div>
                </CardBody>
              </Card>
            </div>
          );
        }}
      </ContextConsumer>
    </>
  );
}
