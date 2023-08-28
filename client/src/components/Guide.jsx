import React from 'react'
import '../styles/guide.css';
const Guide = () => {
  return (
    <div className="bgguide">
      <div className="title"><h1>Guidelines</h1></div>
      <div className="boxguide">
        <ol>
          <li>As you are here, we can assume you have successfully logged in with a lobby Room No 'x' . Tell your friend on the other side to do the same but with same Room no. </li>

          <li>Now, the first person to join the room will get a button to call the friend on the other side . Press the button to Call him  </li>
          <li>Now , your friend will see a sendStream button in purple color . Press the button to connect for a video Call</li>
          <li>Hooray 💫💫 ! you are both connected . Enjoy the Call  . This application is made such that you can use sign language and the friend on the other side will get english subtitle of your sign language for easy communication </li>

          <br />
          <ul>
            <li>if you want to log-out , press the  bottom-left button </li>
            <li>if you want to return to video , press the video icon button</li>
            <li>if you want to go to guidelines , well you are here </li>
          </ul>
        </ol>
      </div>
    </div>
  )
}

export default Guide
