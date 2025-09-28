
import React from 'react';
import type { Participant } from '../../types';
import { UserIcon, MicOffIcon } from './icons';

interface VideoParticipantProps {
    participant: Participant;
    isLocal: boolean;
}

const VideoParticipant: React.FC<VideoParticipantProps> = ({ participant, isLocal }) => {
    return (
        <div className="bg-gray-800 rounded-lg relative overflow-hidden flex items-center justify-center aspect-video">
            {!participant.isCameraOff ? (
                <div className="w-full h-full bg-gray-700 flex items-center justify-center">
                    <UserIcon className="w-16 h-16 text-gray-500" />
                </div>
            ) : (
                 <div className="w-full h-full bg-black flex items-center justify-center">
                    <UserIcon className="w-16 h-16 text-gray-600" />
                </div>
            )}
            
            <div className="absolute bottom-0 left-0 bg-black bg-opacity-50 px-3 py-1.5 rounded-tr-lg">
                <span className="text-white text-sm font-medium">{participant.name}</span>
            </div>

            {participant.isMuted && (
                <div className="absolute top-2 right-2 bg-black bg-opacity-50 p-2 rounded-full">
                    <MicOffIcon className="w-5 h-5 text-red-500" />
                </div>
            )}
        </div>
    );
};

export default VideoParticipant;
