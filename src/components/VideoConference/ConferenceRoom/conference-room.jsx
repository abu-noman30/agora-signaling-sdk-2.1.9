'use client';

import LocalUser from '../LocalUser';

import {
	LocalAudioTrack,
	RemoteUser,
	useLocalCameraTrack,
	useLocalMicrophoneTrack,
	usePublish,
	useRemoteUsers
} from 'agora-rtc-react';
import { useState } from 'react';

export default function ConferenceRoom() {
	const users = useRemoteUsers();
	const { localCameraTrack } = useLocalCameraTrack();
	const { localMicrophoneTrack } = useLocalMicrophoneTrack();

	const [isMuted, setIsMuted] = useState(false);

	usePublish([localCameraTrack, localMicrophoneTrack]);

	return (
		<>
			{users.length > 0 ? (
				<div className='w-full h-screen'>
					<RemoteUser user={users[0]} playAudio playVideo />
				</div>
			) : null}
			<LocalUser isMuted={isMuted} setIsMuted={setIsMuted} />
			<LocalAudioTrack track={localMicrophoneTrack} muted={isMuted} />
		</>
	);
}
