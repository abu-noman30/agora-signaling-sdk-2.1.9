import { generateRTCToken } from '@/utils/generateRTCToken';
import { rtmConfig } from '@/utils/signaling.config';
import { LocalVideoTrack, useJoin, useLocalCameraTrack } from 'agora-rtc-react';
import { useSearchParams } from 'next/navigation';
import { useEffect, useState } from 'react';

export default function LocalUser({ isMuted, setIsMuted }) {
	const uid = useSearchParams().get('uid');
	// const token =  generateRTCToken('publisher', rtmConfig?.channelName, uid)

	const { localCameraTrack } = useLocalCameraTrack();

	const [isJoined, setIsJoined] = useState(false);


	useJoin(
		{
			uid: uid,
			appid: rtmConfig?.appId,
			token: generateRTCToken('publisher', rtmConfig?.channelName, uid),
			channel: rtmConfig?.channelName
		},
		isJoined
	);

	useEffect(() => {
		setIsJoined((prev) => (prev = true));
	}, []);

	return (
		<>
			<div className='absolute w-[150px] h-[200px] border right-[30px] bottom-[70px]'>
				<LocalVideoTrack track={localCameraTrack} play />
			</div>
			<div className='flex gap-3 absolute w-full justify-center bottom-[20px] z-10'>
				<button
					type='button'
					className='border py-1 px-3 text-xs'
					onClick={() => setIsJoined((prev) => (prev = false))}>
					END CALL
				</button>
				<button
					type='button'
					className='border py-1 px-3 text-xs'
					onClick={() => setIsMuted((prev) => (prev = !prev))}>
					{!isMuted ? 'MUTE' : 'MUTED'}
				</button>
			</div>
		</>
	);
}
