import dynamic from 'next/dynamic';

export const DoctorCallingPatient = dynamic(() => import('@/components/SignalingSDK/doctor-calling-patient'), {
	ssr: false
});
export const PatientWaiting = dynamic(() => import('@/components/SignalingSDK/patient-waiting'), { ssr: false });
export const VideoConferenceRoom = dynamic(() => import('@/components/VideoConference/video-conference'), {
	ssr: false
});
