'use client';
import useSignalEvents from '@/hooks/useSignalEvents-sdk';
import { callInvitation } from '@/utils/constants/constans';
import { rtmConfig } from '@/utils/signaling.config';
import { useRouter, useSearchParams } from 'next/navigation';
import { useEffect, useRef } from 'react';

function DoctorCallingPatient() {
  const doctorId = useSearchParams().get('uid');
  const {
    eventCallback,
    messageCallback,
    signalDoctorLogin,
    patientQueue,
    sendCallInvitation,
    getUserSubscribeChannels,
    getOnlineUsersInChannel,
    setUserStatus
  } = useSignalEvents();

  const wasCalled = useRef(false);
  const router = useRouter();
  const audioRef = useRef(new Audio('ringtone.mp3'));
  // const networkQuality = useNetworkQuality();

  // console.log('Network Quality:', networkQuality);

  const callRingtone = () => {
    audioRef.current.play();

    setTimeout(() => {
      audioRef.current.pause();
    }, 30000); // // 30000 ,30 seconds in milliseconds
  };

  useEffect(() => {
    if (wasCalled.current) return;
    wasCalled.current = true;

    /* CODE THAT SHOULD RUN ONCE */
    signalDoctorLogin(doctorId);

    // eslint-disable-next-line
  }, []);

  useEffect(() => {
    if (!!messageCallback) {
      if (
        messageCallback?.message?.type === callInvitation.ACCEPTED ||
        messageCallback?.message?.type === callInvitation.DECLINED
      ) {
        audioRef.current.pause();
        if (messageCallback?.message?.type === callInvitation.ACCEPTED) {
          router.push(`/video-conference?uid=${doctorId}`);
        }
      } else if (messageCallback?.message?.type === callInvitation.NOT_ANSWERED) {
        audioRef.current.pause();
        console.log('PATIENT IS NOT ANSWERING THE CALL');
      }
    }
  }, [messageCallback]);

  useEffect(() => {
    // if (patientQueue.length || Object.keys(eventCallback).length || Object.keys(messageCallback).length) {
    if (patientQueue.length) {
      console.log('Patients:', patientQueue);
    }
  }, [patientQueue]);

  // console.log('[Doctor]: Event Callback', messageCallback);
  // console.log('[Doctor]: Message Callback', messageCallback);

  return (
    <div className='min-h-screen w-full flex  items-center justify-center gap-10'>
      <div className='flex flex-col items-center justify-center gap-5'>
        <button
          className='border-2 rounded-md p-2 bg-blue-800 text-white w-full'
          onClick={() => getUserSubscribeChannels(doctorId)}
        >
          Subscribe Channels
        </button>
        <button
          className='border-2 rounded-md p-2 bg-blue-800 text-white w-full'
          onClick={() => getOnlineUsersInChannel(rtmConfig?.channelName)}
        >
          Channel Online Users
        </button>
      </div>
      <div className='flex flex-col items-start justify-center gap-5'>
        {/* {patients?.map((patient, i) => (
					<div
						onClick={() => {
							sendCallInvitation(doctorId, patient?.uid);
							// callRingtone();
						}}
						key={i}
						className='cursor-pointer border-2 border-black p-2 rounded-md w-full'>
						<h1>
							{patient?.name} - ({patient?.uid})
						</h1>
					</div>
				))} */}

        {patientQueue?.map((patientId, i) => (
          <div className='w-full' key={i}>
            {patientId == 2 && (
              <div
                onClick={() => {
                  sendCallInvitation(doctorId, patientId);
                  callRingtone();
                }}
                key={i}
                className='cursor-pointer border-2 border-black p-2 rounded-md w-full'
              >
                <h1>Noman - ({patientId})</h1>
              </div>
            )}

            {patientId == 3 && (
              <div
                onClick={() => {
                  sendCallInvitation(doctorId, patientId);
                  callRingtone();
                }}
                key={i}
                className='cursor-pointer border-2 border-black p-2 rounded-md w-full'
              >
                <h1>Fuhad - ({patientId})</h1>
              </div>
            )}
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
  }
];
