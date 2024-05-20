'use client';

import useSignalEvents from '@/hooks/useSignalEvents-sdk';
import { generateRTMToken } from '@/utils/generateRTMToken';
import { useEffect, useRef, useState } from 'react';
import CallingModal from '../CallingModal/CallingModal';

function PatientWaiting() {
	const patientId = String(Math.floor(Math.random() * (5 - 2) + 2));
	const token = generateRTMToken(patientId);
	const {
		isPatientLoggedIn,
		messageCallback,
		signalPatientLogin,
		acceptCallInvitation,
		declineCallInvitation,
		getUserSubscribeChannels,
		getOnlineUsersInChannel
	} = useSignalEvents();
	const wasCalled = useRef(false);
	const [modalOpen, setModalOpen] = useState(false);

	console.log('[Patient]: Message Event Callback', messageCallback);

	useEffect(() => {
		if (wasCalled.current) return;
		wasCalled.current = true;

		/* CODE THAT SHOULD RUN ONCE */
		signalPatientLogin(patientId, token);
		// eslint-disable-next-line
	}, []);

	useEffect(() => {
		if (Object.keys(messageCallback).length) {
			if (messageCallback?.message?.to) {
				setModalOpen(true);
			}
		}

		// eslint-disable-next-line
	}, [messageCallback, patientId]);

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
				/>
			)}
		</>
	);
}

export default PatientWaiting;
