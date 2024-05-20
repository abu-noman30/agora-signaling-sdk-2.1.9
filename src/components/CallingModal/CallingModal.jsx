'use client';

import { useRouter } from 'next/navigation';

function CallingModal({
	messageCallback,
	acceptCallInvitation,
	getUserSubscribeChannels,
	getOnlineUsersInChannel,
	declineCallInvitation
}) {
	// const { contentObject, acceptInvitation, declineInvitation } = remoteInvitationResponse;

	const router = useRouter();

	const joinConferenceHandler = () => {
		acceptCallInvitation(messageCallback);

		/* setTimeout(() => {
			router.push('/video-conference');
		}, 3000); */
  };
  
  const declineCallInvitationHandler = () => { 
    declineCallInvitation(messageCallback);
  };
	return (
		<div className='w-full min-h-screen flex items-center justify-center bg-gray-300 absolute z-50 top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2'>
			<div className='max-w-sm p-6 bg-white border border-gray-200 rounded-lg shadow'>
				<a href='#'>
					<h5 className='mb-2 text-2xl font-bold tracking-tight text-gray-900'>Name: </h5>
				</a>
				<p className='mb-3 font-normal text-gray-700'>#Id: </p>
				<p className='mb-3 font-normal text-gray-700'>Description: </p>
				<div className='flex justify-center items-center gap-5 mb-5'>
					<div
						onClick={joinConferenceHandler}
						className='w-full cursor-pointer  whitespace-nowrap	 inline-flex items-center px-3 py-2 text-sm font-medium text-center text-white bg-blue-700 rounded-lg hover:bg-blue-800 focus:ring-4 focus:outline-none focus:ring-blue-300'>
						Join Conference
					</div>
					<div
						onClick={declineCallInvitationHandler}
						className='w-full cursor-pointer whitespace-nowrap	 inline-flex items-center px-3 py-2 text-sm font-medium text-center text-white bg-blue-700 rounded-lg hover:bg-blue-800 focus:ring-4 focus:outline-none focus:ring-blue-300'>
						Decline Conference
					</div>
				</div>
				<div className='flex flex-col items-center justify-center gap-5 '>
					<button
						className='w-full cursor-pointer border-2 border-black p-1'
						onClick={() => getUserSubscribeChannels(messageCallback?.message?.to)}>
						Subscribe User Channel
					</button>
					<button
						className='w-full cursor-pointer border-2 border-black p-1'
						onClick={() => getOnlineUsersInChannel(messageCallback?.message?.channelName)}>
						Channel Online Users
					</button>
				</div>
			</div>
		</div>
	);
}

export default CallingModal;
