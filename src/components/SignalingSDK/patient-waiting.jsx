'use client';

import useSignalEvents from '@/hooks/useSignalEvents-sdk';
import { useSearchParams } from 'next/navigation';
import { useEffect, useRef, useState } from 'react';

import CallingModal from '../CallingModal/CallingModal';

function PatientWaiting() {
	const patientId = useSearchParams().get('patientId');
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
	} = useSignalEvents();
	const wasCalled = useRef(false);
	const audioRef = useRef(new Audio('ringtone.mp3'));
	const [modalOpen, setModalOpen] = useState(false);
	const [isPatientResponding, setIsPatientResponding] = useState(false);

	const callRingtone = () => {
		audioRef.current.play();
		setModalOpen(true);

		setTimeout(() => {
			audioRef.current.pause();
			if (!isPatientResponding) {
				notAnsweringCall(messageCallback);
			}
			setModalOpen(false);
		}, 30000); // 30000 ,30 seconds in milliseconds
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
				/>
			)}
		</>
	);
}

export default PatientWaiting;
