'use client';

import { ConferenceRoom } from '@/utils/dynamic-import/dynamic-import';
import AgoraRTC, { AgoraRTCProvider, useRTCClient } from 'agora-rtc-react';
import { useRouter } from 'next/navigation';

function VideoConferenceRoom() {
	const rtcEngine = useRTCClient(
    AgoraRTC.createClient({ codec: "vp8", mode: "rtc" })
  );


	// const {  } = useSignalEvents();
	const router = useRouter();
	const handlerOnClick = () => {
		// signalPatientLogout();
		// signalDoctorLogout();
		router.push('/');
	};
	return (
		<div className='min-h-screen flex items-center justify-center'>
			{/* <h1 className='border-2 border-black rounded-lg p-10 cursor-pointer' onClick={handlerOnClick}>
				End Call
			</h1> */}

			<AgoraRTCProvider client={rtcEngine}>
				<ConferenceRoom />
			</AgoraRTCProvider>
		</div>
	);
}

export default VideoConferenceRoom;
