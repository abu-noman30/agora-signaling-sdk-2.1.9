'use client';

import useSignalEvents from '@/hooks/useSignalEvents-sdk';
import { generateRTMToken } from '@/utils/generateRTMToken';
import { useRouter } from 'next/navigation';
import { useEffect, useRef, useState } from 'react';

function DoctorCallingPatient() {
	const doctorId = '1';
	const token = generateRTMToken(doctorId);
	const { eventCallback, messageCallback, signalDoctorLogin, patientQueue, sendCallInvitation, getUserSubscribeChannels } = useSignalEvents();

	const wasCalled = useRef(false);
	const [modalOpen, setModalOpen] = useState(false);
	const router = useRouter();

	console.log('[Doctor]: Message Event Callback', messageCallback);

	useEffect(() => {
		if (wasCalled.current) return;
		wasCalled.current = true;

		/* CODE THAT SHOULD RUN ONCE */
		signalDoctorLogin(doctorId, token);

		// eslint-disable-next-line
	}, []);

/* 	useEffect(() => {
		if (!!doctorNotification) {
			router.push('/video-conference');
		}

		// eslint-disable-next-line
	}, [doctorNotification]); */

	useEffect(() => {
		if (patientQueue.length) {
			console.log('Patients:', patientQueue);
		}
	}, [patientQueue]);

	return (
		<div className='min-h-screen w-full flex  items-center justify-center'>
			<button onClick={()=>getUserSubscribeChannels(doctorId)}>Get Subscribe User Channels</button>
			<div className='flex flex-col items-start justify-center gap-10'>
				{patients?.map((patient, i) => (
					<div
						onClick={() => {
							sendCallInvitation(doctorId, patient?.uid);
						}}
						key={i}
						className='cursor-pointer border-2 border-black p-5 rounded-md'>
						<h1>Name: {patient?.name}</h1>
						<h1>uid: {patient?.uid}</h1>
					</div>
				))}
			</div>
		</div>
	);
}

export default DoctorCallingPatient;

const patients = [
	{
		name: 'Abu Noman',
		uid: '2'
	},
	{
		name: 'Fuhad Hasan',
		uid: '3'
	},
	{
		name: 'Sohag Hasan',
		uid: '4'
	},
	{
		name: 'Mahbub Alam',
		uid: '5'
	}
];
