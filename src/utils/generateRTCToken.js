import { RtcRole, RtcTokenBuilder } from 'agora-token';
import { rtmConfig } from './signaling.config';

export function generateRTCToken(role, channelName, uid) {
	const uId = typeof uid === 'number' ? uid.toString() : uid;

	return RtcTokenBuilder.buildTokenWithUid(
		rtmConfig?.appId,
		rtmConfig?.appCertificate,
		channelName,
		uId,
		role === 'publisher' ? RtcRole.PUBLISHER : RtcRole.SUBSCRIBER,
		86400, //24 hours in seconds
		86400 //24 hours in seconds
	);
}
