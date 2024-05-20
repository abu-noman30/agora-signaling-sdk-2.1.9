import { rtmConfig } from '@/utils/signaling.config';
import AgoraRTM from 'agora-rtm-sdk';
import { useState } from 'react';

// The Signaling RTMEngine instance
let signalEngine = null;
let signalChannel = null;

export default function SignalingRoom() {
	const [isDoctorLoggedIn, setIsDoctorLoggedIn] = useState(false);
	const [isPatientLoggedIn, setIsPatientLoggedIn] = useState(false);

	const [patientQueue, setPatientQueue] = useState([]);

	const [eventCallback, setEventCallback] = useState({});
	const [messageCallback, setMessageCallback] = useState({});

	const setupSignalingEngine = async (uid, token) => {
		try {
			signalEngine = new AgoraRTM.RTM(rtmConfig?.appId, uid, {
				token: token
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

			const subscribeRes = await signalEngine.subscribe(rtmConfig?.channelName, subscribeOptions);

			console.log('subscribeRes:', subscribeRes);
		} catch (error) {
			console.log(error);
		}
	};

	const signalDoctorLogin = async (uid, token) => {
		try {
			await setupSignalingEngine(uid, token);
			if (!!signalEngine) {
				await signalEngine.login();
				await subscribeChannel();
				setIsDoctorLoggedIn(true);
			}
		} catch (error) {
			console.log(error);
		}
	};

	const signalPatientLogin = async (uid, token) => {
		try {
			await setupSignalingEngine(uid, token);
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
				console.log('Snapshot Event:', eventArgs);
				setEventCallback({
					eventArgs
				});
			}
			// Update the queue state based on the event type (REMOTE_JOIN)
			else if (eventArgs.eventType === 'REMOTE_JOIN') {
				console.log('Remote Join Event:', eventArgs);
				setEventCallback({
					eventArgs
				});
				setPatientQueue((prevQueue) => [...prevQueue, eventArgs.publisher]);
			}
			// Update the queue state based on the event type (REMOTE_LEAVE )
			else if (eventArgs.eventType === 'REMOTE_LEAVE') {
				console.log('Remote Leave Event:', eventArgs);
				setEventCallback({
					eventArgs
				});
				setPatientQueue((prevQueue) => prevQueue.filter((user) => user !== eventArgs.publisher));
			} else {
				console.log('Presence Event:', eventArgs);
				setEventCallback({
					eventArgs
				});
			}
		});
	};

	const signalMessageEvent = async () => {
		if (!signalEngine) return;
		signalEngine.addEventListener('message', (eventArgs) => {
			console.log('Message Event:', eventArgs);
			setMessageCallback({ eventArgs, message: JSON.parse(eventArgs.message) });
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

	const getOnlineUsersInChannel = async () => {
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
	
	}

	return {
		isDoctorLoggedIn,
		isPatientLoggedIn,
		signalDoctorLogin,
		signalPatientLogin,
		patientQueue,
		sendCallInvitation,
		acceptCallInvitation,
		declineCallInvitation,
		eventCallback,
		messageCallback,
		getUserSubscribeChannels,
		getOnlineUsersInChannel
	};
}
