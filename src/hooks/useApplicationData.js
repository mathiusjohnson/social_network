import { useReducer, useEffect } from "react";
import { getStack, makeStackObj } from "../helpers/profileHelpers";
import axios from "axios";
import reducer, {
  SET_POINTS,
  SET_APPLICATION_DATA,
  SET_SELECTED_USER,
  SET_STUDENT_POINTS,
  SET_MENTOR_POINTS,
  SET_POSTS,
  SET_NEW_STACK,
  SET_NEW_INFO,
  SET_LIKES,
  SET_COMMENTS,
  ADD_TO_STACK,
  REMOVE_FROM_STACK,
} from "../reducers/application";

export default function useApplicationData() {
  const [state, dispatch] = useReducer(reducer, {
    comments: {},
    likes: [],
    mentor_stack: [],
    points: 0,
    posts: [],
    student_stack: [],
    tutor_experiences: [],
    user_profiles: [],
    users: [],
    mentor_points: [],
    student_points: [],
    stack_preferences: [],
    posts_stacks: [],
    avatars: [],
    selected: {},
  });

  // RETRIEVES API AND SETS IT WITH REDUCER
  useEffect(() => {
    Promise.all([
      axios.get("http://localhost:8001/api/comments"),
      axios.get("http://localhost:8001/api/likes"),
      axios.get("http://localhost:8001/api/mentor_stack"),
      axios.get("http://localhost:8001/api/posts"),
      axios.get("http://localhost:8001/api/student_stack"),
      axios.get("http://localhost:8001/api/tutor_experiences"),
      axios.get("http://localhost:8001/api/user_profiles"),
      axios.get("http://localhost:8001/api/users"),
      axios.get("http://localhost:8001/api/mentor_points"),
      axios.get("http://localhost:8001/api/student_points"),
      axios.get("http://localhost:8001/api/stack_preferences"),
      axios.get("http://localhost:8001/api/posts_stacks"),
      axios.get("http://localhost:8001/api/register/avatars"),
    ]).then((all) => {
      // console.log("all from applicatin data hook: ", all);
      const comments = all[0].data;
      const likes = all[1].data;
      const mentor_stack = all[2].data;
      const posts = all[3].data;
      const student_stack = all[4].data;
      const tutor_experiences = all[5].data;
      const user_profiles = all[6].data;
      const users = all[7].data;
      const mentor_points = all[8].data;
      const student_points = all[9].data;
      const stack_preferences = all[10].data;
      const posts_stacks = all[11].data;
      const avatars = all[12].data;
      const selected = {};
      dispatch({
        type: SET_APPLICATION_DATA,
        comments,
        likes,
        mentor_stack,
        posts,
        student_stack,
        tutor_experiences,
        user_profiles,
        users,
        mentor_points,
        student_points,
        stack_preferences,
        posts_stacks,
        avatars,
        selected,
      });
    });
  }, []);

  // FOR WEBSOCKET
  useEffect(() => {
    const socket = new WebSocket(process.env.REACT_APP_WEBSOCKET_URL);

    socket.onopen = () => socket.send("ping");
    socket.onmessage = (event) => {
      const data = JSON.parse(event.data);
      if (data.type === SET_POINTS) {
        dispatch(data);
      }
    };

    return () => {
      socket.close();
    };
  }, []);

  const editUserInfo = (newInfo) => {
    const url = `/api/mentor_points`;
    const promise = axios.put(url, { studentPoints }).then((req, res) => {
      dispatch({
        type: SET_POINTS,
        points: studentPoints,
        id: studentID,
      });
    });
    return promise;
  };

  const setSelectedUser = (userID) => {
    dispatch({
      type: SET_SELECTED_USER,
      userId: userID,
    });
  };
  const createPost = (postDetails, techStack, id) => {
    const newPost = {
      text_body: postDetails.text,
      active: true,
      owner_id: id,
      stack: [],
      time_posted: new Date().toISOString(),
      is_mentor: false,
      is_student: true,
    };

    if (!postDetails.mentor) {
      (newPost["is_mentor"] = true), (newPost["is_student"] = false);
    }
    for (let entry of techStack) {
      // console.log("stack name in hook", entry.name);
      newPost["stack"].push(entry.name);
    }

    const promise = axios
      .post(`http://localhost:8001/api/posts`, { newPost })
      .then((response) => {
        console.log("response.data in first .then", response.data);
        getNewPostId(response.data);

        dispatch({
          type: SET_POSTS,
          data: newPost,
        });
      });
    const getNewPostId = (res) => {
      console.log(res.id);
      axios
        .all(
          techStack.map((element) => {
            axios.post(`http://localhost:8001/api/posts_stacks`, {
              post_id: res.id,
              stack_id: element.id,
            });
          })
        )
        .then(
          axios.spread(function (...res) {
            // all requests are now complete
            console.log("success");
          })
        );
    };
    return promise;
  };

  const addLike = (postId, likerId) => {
    console.log("like data in hook: ", postId, likerId);
    const newLike = {
      post_id: postId,
      liker_id: likerId,
    };
    const promise = axios
      .post(`http://localhost:8001/api/likes`, { newLike })
      .then((response) => {
        console.log("response in likes hook: ", response);
        dispatch({
          type: SET_LIKES,
          data: newLike,
        });
      })
      .catch((error) => {
        console.log("I don't *like* this mess", error);
      });
    return promise;
  };

  const createComment = (postId, commenterId, commentDetails) => {
    console.log(" data in comment hook: ", postId, commenterId, commentDetails);
    const newComment = {
      post_id: postId,
      commenter_id: commenterId,
      text_body: commentDetails,
    };
    console.log("new comment in hook: ", newComment);

    const promise = axios
      .post(`http://localhost:8001/api/comments`, { newComment })
      .then((response) => {
        console.log("response.data in first .then", response.data[0]);
        dispatch({
          type: SET_COMMENTS,
          data: newComment,
        });
      })
      .catch((err) => {
        console.log("I don't *comment* this mess", err);
      });

    return promise;
  };

  const updateUserInfo = (newInfo, id) => {
    console.log(
      "here in create",
      state.user_profiles,
      state.mentor_stack,
      newInfo
    );
    dispatch({
      type: SET_NEW_INFO,
      data: newInfo,
      id: id,
    });
  };

  const updateMentorStack = (removed, added, id) => {
    const arrOfRemoved = makeStackObj(removed, id);
    const arrOfAdded = makeStackObj(added, id);

    if (arrOfRemoved.length !== 0) {
      axios
        .all(
          arrOfRemoved.map((element) => {
            axios.delete(`http://localhost:8001/api/mentor_stack`, {
              params: element,
            });
          })
        )
        .then(
          dispatch({
            type: REMOVE_FROM_STACK,
            removed: arrOfRemoved,
          })
        );
    }

    if (arrOfAdded.length !== 0) {
      axios
        .all(
          arrOfAdded.map((element) => {
            axios.post(`http://localhost:8001/api/mentor_stack`, element);
          })
        )
        .then(
          dispatch({
            type: ADD_TO_STACK,
            added: arrOfAdded,
          })
        );
    }
  };

  return {
    state,
    createPost,
    setSelectedUser,
    updateUserInfo,
    updateMentorStack,
    addLike,
    createComment,
  };
}
