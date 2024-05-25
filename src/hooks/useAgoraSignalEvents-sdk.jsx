import { generateRTMToken } from '@/utils/generateRTMToken';
import { rtmConfig } from '@/utils/signaling.config';
import AgoraRTM from 'agora-rtm-sdk';
import { useState } from 'react';

let signalEngine = null;

export default function useAgoraSignalEvents() {
  const [isDoctorLoggedIn, setIsDoctorLoggedIn] = useState(false);
  const [isPatientLoggedIn, setIsPatientLoggedIn] = useState(false);
  const [patientQueue, setPatientQueue] = useState([]);
  const [eventCallback, setEventCallback] = useState({});
  const [messageCallback, setMessageCallback] = useState({});

  const setupSignalingEngine = async (uid) => {
    try {
      signalEngine = new AgoraRTM.RTM(rtmConfig?.appId, uid, {
        token: generateRTMToken(uid)
      });

      signalingPresenceEvent();
      signalMessageEvent();

      console.log('Signal Engine:', signalEngine);
    } catch (error) {
      console.log('Error:', error);
    }
  };

  const subscribeChannel = async () => {
    try {
      const subscribeOptions = {
        withMessage: true,
        withPresence: true, // Enable presence notifications
        withMetadata: true,
        withLock: true
      };

      await signalEngine.subscribe(rtmConfig?.channelName, subscribeOptions);
    } catch (error) {
      console.log(error);
    }
  };

  const signalDoctorLogin = async (uid) => {
    try {
      await setupSignalingEngine(uid);
      if (!!signalEngine) {
        await signalEngine.login();
        await subscribeChannel();
        setIsDoctorLoggedIn(true);
      }
    } catch (error) {
      console.log(error);
    }
  };

  const signalPatientLogin = async (uid) => {
    try {
      await setupSignalingEngine(uid);
      if (!!signalEngine) {
        await signalEngine.login();
        await subscribeChannel();
        setIsPatientLoggedIn(true);
      }
    } catch (error) {
      console.log(error);
    }
  };

  const signalingPresenceEvent = () => {
    if (!signalEngine) return;

    signalEngine.addEventListener('presence', (eventArgs) => {
      if (eventArgs.eventType === 'SNAPSHOT') {
        console.log('[SNAPSHOT Event]:', eventArgs);
        setEventCallback(eventArgs);
      }
      // Update the queue state based on the event type (REMOTE_JOIN)
      else if (eventArgs.eventType === 'REMOTE_JOIN') {
        console.log('[REMOTE_JOIN Event]:', eventArgs);
        setEventCallback(eventArgs);
        setPatientQueue((prevQueue) => [...new Set([...prevQueue, eventArgs.publisher])]);
      }
      // Update the queue state based on the event type (REMOTE_LEAVE )
      else if (eventArgs.eventType === 'REMOTE_LEAVE') {
        console.log('[REMOTE_LEAVE Event]:', eventArgs);
        setEventCallback(eventArgs);
        setPatientQueue((prevQueue) => prevQueue.filter((user) => user !== eventArgs.publisher));
      } else if (eventArgs.eventType === 'REMOTE_STATE_CHANGED') {
        console.log('[REMOTE_STATE_CHANGED Event]:', eventArgs);
        setEventCallback(eventArgs);
      } else {
        console.log('Presence Event:', eventArgs);
        setEventCallback(eventArgs);
      }
    });
  };

  const signalMessageEvent = async () => {
    if (!signalEngine) return;
    signalEngine.addEventListener('message', (eventArgs) => {
      console.log('Message Event:', eventArgs);
      setMessageCallback({ ...eventArgs, message: { ...JSON.parse(eventArgs.message) } });
    });
  };

  const getUserSubscribeChannels = async (uId) => {
    try {
      if (!signalEngine) return;

      const userChannels = await signalEngine.presence.getUserChannels(uId);
      console.log('userChannels:', userChannels);
    } catch (error) {
      console.log('Error:', error);
    }
  };

  const getOnlineUsersInChannel = async (channelName) => {
    try {
      if (!signalEngine) return;

      const onlineUsers = await signalEngine.presence.getOnlineUsers(channelName, 'MESSAGE', {
        includedUserId: true
      });
      console.log('Online Users:', onlineUsers);
    } catch (error) {
      console.log('Error:', error);
    }
  };

  const sendCallInvitation = async (doctorId, remoteUid) => {
    try {
      if (!signalEngine) return;

      await signalEngine.subscribe(`inbox_d${doctorId}_p${remoteUid}`);

      const message = JSON.stringify({
        type: 'call-invitation',
        from: doctorId,
        to: remoteUid,
        channelName: `inbox_d${doctorId}_p${remoteUid}`
      });

      // Send a private message to the user with the UserID "Lily"
      await signalEngine.publish(rtmConfig?.channelName, message);
    } catch (error) {
      console.error('Error sending call invitation:', error);
    }
  };

  const acceptCallInvitation = async (privateChannel) => {
    try {
      if (!signalEngine) return;

      // await signalEngine.subscribe(privateChannel?.message?.channelName);

      const message = JSON.stringify({
        type: 'call-invitation-accepted',
        from: privateChannel?.message?.from,
        to: privateChannel?.message?.to,
        channelName: privateChannel?.message?.channelName
      });

      // Send a private message to the user with the UserID "Lily"
      await signalEngine.publish(privateChannel?.message?.channelName, message);
    } catch (error) {
      console.error('Error accepting call invitation:', error);
    }
  };

  const declineCallInvitation = async (privateChannel) => {
    try {
      if (!signalEngine) return;

      // await signalEngine.subscribe(privateChannel?.message?.channelName);

      const message = JSON.stringify({
        type: 'call-invitation-declined',
        from: privateChannel?.message?.from,
        to: privateChannel?.message?.to,
        channelName: privateChannel?.message?.channelName
      });

      // Send a private message to the user with the UserID "Lily"
      await signalEngine.publish(privateChannel?.message?.channelName, message);
    } catch (error) {
      console.error('Error declining call invitation:', error);
    }
  };

  const notAnsweringCall = async (privateChannel) => {
    const message = JSON.stringify({
      type: 'call-not-answered',
      from: privateChannel?.message?.from,
      to: privateChannel?.message?.to,
      channelName: privateChannel?.message?.channelName
    });

    // Send a private message to the user with the UserID "Lily"
    await signalEngine.publish(privateChannel?.message?.channelName, message);
  };

  const setUserStatus = async (status, channelName, channelType) => {
    try {
      if (!signalEngine) return;

      const status = { mood: 'pumped', isTyping: 'false' };
      const result = await signalEngine.presence.setState(rtmConfig?.channelName, 'MESSAGE', status);
      console.log('Set User Status:', result);
    } catch (error) {
      console.error('Error setting user status:', error);
    }
  };

  const getUserStatus = async (userId, channelName, channelType) => {
    try {
      const result = await signalEngine.presence.getState(userId, channelName, channelType);
      console.log('Get User State:', result);
    } catch (error) {
      console.log(error);
    }
  };

  const removeUserStatus = async (channelName, channelType) => {
    try {
      const result = await signalEngine.presence.removeState(channelName, channelType);
      console.log('Remove User State:', result);
    } catch (error) {
      console.error('Error removing user status:', error);
    }
  };

  return {
    isDoctorLoggedIn,
    isPatientLoggedIn,
    signalDoctorLogin,
    signalPatientLogin,
    patientQueue,
    sendCallInvitation,
    acceptCallInvitation,
    declineCallInvitation,
    notAnsweringCall,
    eventCallback,
    messageCallback,
    getUserSubscribeChannels,
    getOnlineUsersInChannel,
    setUserStatus,
    getUserStatus
  };
}
