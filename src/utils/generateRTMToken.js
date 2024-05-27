import { RtmTokenBuilder } from 'agora-token';
import { rtmConfig } from './signaling.config';

export function generateRTMToken(uid) {
	const uId = typeof uid === 'number' ? uid.toString() : uid;
	const token = RtmTokenBuilder.buildToken(
		rtmConfig?.appId,
		rtmConfig?.appCertificate,
		uId,
		rtmConfig?.tokenExpiryTime
	);
	return token;
}
