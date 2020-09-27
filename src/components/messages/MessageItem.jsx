import React from 'react';
import timeSince from '../../helpers/timeSince';

export default function MessageItem(props) {

  const firstInitial = props.username[0].toUpperCase();

  let messageBody;
  if (props.recentMessage.textBody.length > 25) {
    messageBody = props.recentMessage.textBody.slice(0, 25) + '...'
  } else {
    messageBody = props.recentMessage.textBody;
  }

  const timeAgo = timeSince(props.recentMessage.timeSent) + ' ago';

  let avatar;
  for (let item of props.avatarList) {
    if (item.username === props.username) {
      avatar = item.avatar;
    }
  }

  return (
    <div className='message-item-container' onClick={() => props.clickMe(props.username)}>
      <div className="message-icon-container">
        <div className='message-icon'>
          <img src={avatar} alt="" />
        </div>
      </div>
      <div className="message-username-text">
        <p className='message-username'>{props.username}</p>
        <p className='message-last'>{messageBody}</p>
      </div>
      <div className="message-time">
        {timeAgo}
      </div>
    </div>
  )

}