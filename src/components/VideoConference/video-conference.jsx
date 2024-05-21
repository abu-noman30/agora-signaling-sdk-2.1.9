'use client';

import { useRouter } from 'next/navigation';

function VideoConferenceRoom() {
	// const {  } = useSignalEvents();
	const router = useRouter();
	const handlerOnClick = () => {
		// signalPatientLogout();
		// signalDoctorLogout();
		router.push('/');
	};
	return (
		<div className='min-h-screen flex items-center justify-center'>
			<h1 className='border-2 border-black rounded-lg p-10 cursor-pointer' onClick={handlerOnClick}>
				End Call
			</h1>
		</div>
	);
}

export default VideoConferenceRoom;
