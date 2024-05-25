'use client';

import { VideoConferenceRoom } from '@/utils/dynamic-import/dynamic-import';
import AgoraRTC, { useRTCClient } from 'agora-rtc-react';
import { createContext, useContext } from 'react';

const AgoraVideoConferenceContext = createContext(null);

export const AgoraVideoConferenceProvider = ({ children }) => {
  const rtcEngine = useRTCClient(AgoraRTC.createClient({ codec: 'vp8', mode: 'rtc' }));

  return (
    <AgoraVideoConferenceContext.Provider value={rtcEngine}>
      {/* <AgoraRTCProvider client={rtcEngine}>{children}</AgoraRTCProvider> */}
      <VideoConferenceRoom rtcEngine={rtcEngine} />
    </AgoraVideoConferenceContext.Provider>
  );
};

const useAgoraVideoConferenceContext = () => {
  const context = useContext(AgoraVideoConferenceContext);

  if (!context) {
    throw new Error('useStickyCartContext must be used within StickyCartProvider');
  }
  return context;
};

export default useAgoraVideoConferenceContext;
