'use client';

import useAgoraSignalEvents from '@/hooks/useAgoraSignalEvents-sdk';
import { useSearchParams } from 'next/navigation';
import { useEffect, useRef, useState } from 'react';

import CallingModal from '../CallingModal/CallingModal';

function PatientWaiting() {
	const patientId = useSearchParams().get('uid');
	const {
		isPatientLoggedIn,
		eventCallback,
		messageCallback,
		signalPatientLogin,
		acceptCallInvitation,
		declineCallInvitation,
		notAnsweringCall,
		getUserSubscribeChannels,
		getOnlineUsersInChannel
	} = useAgoraSignalEvents();
	const wasCalled = useRef(false);
	const audioRef = useRef(new Audio('ringtone.mp3'));
	const [modalOpen, setModalOpen] = useState(false);
	const [isPatientResponding, setIsPatientResponding] = useState(false);

	const callRingtone = () => {
		audioRef.current.play();
		setModalOpen(true);
		console.log('PatientRespnding:', isPatientResponding);
	};

	useEffect(() => {
		if (wasCalled.current) return;
		wasCalled.current = true;

		/* CODE THAT SHOULD RUN ONCE */
		signalPatientLogin(patientId);
		// eslint-disable-next-line
	}, []);

	useEffect(() => {
		if (Object.keys(messageCallback).length) {
			if (messageCallback?.message?.to === patientId) {
				callRingtone();
			}
		}
	}, [messageCallback, patientId]);

	useEffect(() => {
		let timeoutId;
		if (modalOpen) {
			timeoutId = setTimeout(() => {
				if (!isPatientResponding) {
					audioRef.current.pause();
					setModalOpen(false);
					notAnsweringCall(messageCallback);
				}
			}, 30000); // 180000 milliseconds = 3 minutes
		}

		return () => {
			clearTimeout(timeoutId);
		};
	}, [modalOpen, isPatientResponding, messageCallback]);

	useEffect(() => {
		if (isPatientResponding) {
			audioRef.current.pause();
			setModalOpen(false);
		}
	}, [isPatientResponding]);

	// console.log('[Patient]: Event Callback', eventCallback);
	// console.log('[Patient]: Message Callback', messageCallback);

	return (
		<>
			<div className='min-h-screen flex items-center justify-center'>
				<h1 className='border-2 border-black rounded-lg p-10'>Waiting.... For Doctor&apos;s Call</h1>
			</div>

			{modalOpen && (
				<CallingModal
					messageCallback={messageCallback}
					acceptCallInvitation={acceptCallInvitation}
					declineCallInvitation={declineCallInvitation}
					getUserSubscribeChannels={getUserSubscribeChannels}
					getOnlineUsersInChannel={getOnlineUsersInChannel}
					setModalOpen={setModalOpen}
					setIsPatientResponding={setIsPatientResponding}
					audioRef={audioRef}
					patientId={patientId}
				/>
			)}
		</>
	);
}

export default PatientWaiting;
