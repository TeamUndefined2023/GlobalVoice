# GLOBALVOICE
 ## Use Case: Empowering Specialy abled persion with the global-voice 🌟
   Introducing Global Voice, the revolutionary video calling web app tailored to empower and bridge the gap of communication between individuals who can't talk and the persons who can talk  . At its core, Global 
   Voice is driven by the promise of gesture-enhanced communication – a groundbreaking feature that enables a more expressive and immersive way of connecting. 💪

# Global Voice Web App: Overview 🌐🗣️

*sign language communication:* Step beyond the boundaries of language and words. With Global Voice, you can effortlessly convey your emotions and thoughts using real-time hand gestures during video calls. This innovative approach transforms conversations into dynamic and engaging interactions. 🙌🤙

Accessibility and Inclusivity: Our commitment to inclusivity drives the design of Global Voice. Whether you face speech challenges, are mute, or simply seek an innovative way to connect, the platform caters to your unique needs. Embrace the power of communication without barriers. 🌈♿

Crystal-Clear Video Quality: Immerse yourself in the conversation with high-definition video calls powered by WebRTC. Say goodbye to blurry visuals and hello to lifelike, vivid interactions. Experience the magic of being present, no matter the distance. 📷🎥


# Demo and proofs :
  ## Live Demo: 
   Visit https://globalvoice.el.r.appspot.com (deployed on GCP)
  ## GlobalVoice UI Demo :
   https://github.com/TeamUndefined2023/globalvoice/assets/114691472/2a5a6780-82e1-47d9-8582-34aa0d9aa980

  ## ML Model Correctly prediction Hand gestures (American Sign Language (ASL)) with 99% Accuracy :
   Showing C for C (made with Hand Gestures)
   ![WhatsApp Image 2023-08-28 at 08 54 22](https://github.com/TeamUndefined2023/globalvoice/assets/93094139/aaced96b-873f-46da-ac75-ad5e44183ddd)
   ![poc](https://github.com/TeamUndefined2023/globalvoice/assets/57730879/a759d540-2634-41f6-916d-2bffa9dadd15)

   
  ## Youtube Explanation of our Project :
    https://youtu.be/HRch__wnf_o?si=Az3jvHMeiCZTNBDV

  ## Screenshots
  ### The App
  ![Screenshot (250)](https://github.com/TeamUndefined2023/globalvoice/assets/57730879/06b9ed0d-7799-4bca-88ad-a0a8198ac488)
  ### Nodejs Websocket Backend deployment on Google Cloud Platform
  ![Screenshot (249)](https://github.com/TeamUndefined2023/globalvoice/assets/57730879/8be81d44-e88f-4e69-8ccb-2a91ea23e435)
  ### ReactJS Frontend deployment on Google Cloud Platform
  ![Screenshot (251)](https://github.com/TeamUndefined2023/globalvoice/assets/57730879/065635c8-b05b-4f25-b182-48a70edaa4ef)

    
# Challenges We Ran Into 🔍🚧
    .Challenge : Our team faced difficulties in working with webRTC and socket.io , as these technologies were completely new to us and we have to read numerous documentations and go through many tutorials to                     implement it in our project
     Solution : Our problem solving ability helped us to solve bugs and resolves issues we developed till now , and to implement and made a fully functional video calling app
     
    .Challenge: our team faced difficulties in integrating ml model to webRTC and socket io
     Solution: Our dedicated team invested significant effort in refining the gesture recognition algorithms. Rigorous testing, meticulous data collection, and precision fine-tuning led us to achieve    
                exceptional accuracy. Collaborating with gesture recognition experts further enriched our solution.

# 💻 Built With
      auth0 - to authenticate users
      React -  For crafting a seamless and dynamic frontend UI.
      WebSocket - Enabling real-time, bidirectional communication between clients and the server.
      WebRTC - Facilitating top-notch real-time audio and video interactions.
      TensorFlow - Elevating gesture recognition accuracy and responsiveness.
      Flask -  Backing our machine learning model integration for gesture recognition.
      Google Cloud Platform - Deployed on the Google Cloud Platform

   # Team Members: 
      .Raja 
      .Saif Hussain
      .Subhamoy Sarkar
      .Sinjini


# Installation
To run the app in your local machine, install the dependencies in the respective directories:
  # server:
  ```
  cd server
  npm i
  npm start
  ```
  # Client:
  ```
  cd client
  npm i
  npm start
  ```
