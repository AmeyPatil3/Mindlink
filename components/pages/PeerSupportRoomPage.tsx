
import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import type { Participant, ChatMessage as ChatMessageType } from '../../types';
import VideoParticipant from '../ui/VideoParticipant';
import RoomControls from '../ui/RoomControls';
import ChatPanel from '../ui/ChatPanel';

const generateMockParticipants = (count: number): Participant[] => {
    return Array.from({ length: count }, (_, i) => ({
        id: `user-${i + 2}`,
        name: `Anonymous User ${i + 1}`,
        isMuted: Math.random() > 0.5,
        isCameraOff: Math.random() > 0.7,
    }));
};

const PeerSupportRoomPage: React.FC = () => {
    const { roomId } = useParams();
    const navigate = useNavigate();
    const [participants, setParticipants] = useState<Participant[]>([]);
    
    // Local user's state
    const [isMuted, setIsMuted] = useState(false);
    const [isCameraOff, setIsCameraOff] = useState(false);

    // Chat state
    const [isChatVisible, setIsChatVisible] = useState(false);
    const [messages, setMessages] = useState<ChatMessageType[]>([]);


    useEffect(() => {
        // Simulate fetching participants for the room
        const mockParticipantCount = Math.floor(Math.random() * 8) + 1; // 1 to 8 other participants
        setParticipants(generateMockParticipants(mockParticipantCount));

        // Add a welcome message to the chat
        setMessages([
            { id: 'system-1', senderName: 'System', text: `Welcome to the chat! This is a safe space for respectful conversation.`, isLocal: false }
        ]);
    }, [roomId]);

     // Effect to simulate receiving messages from other participants
    useEffect(() => {
        if (messages.length > 0 && messages[messages.length - 1].isLocal) {
            const timer = setTimeout(() => {
                const randomParticipant = participants[Math.floor(Math.random() * participants.length)];
                if (randomParticipant) {
                    const reply: ChatMessageType = {
                        id: `msg-${Date.now()}`,
                        senderName: randomParticipant.name,
                        text: 'Thank you for sharing that.',
                        isLocal: false,
                    };
                    setMessages(prev => [...prev, reply]);
                }
            }, 1500);
            return () => clearTimeout(timer);
        }
    }, [messages, participants]);
    
    const handleSendMessage = (text: string) => {
        const newMessage: ChatMessageType = {
            id: `msg-${Date.now()}`,
            senderName: 'You',
            text,
            isLocal: true,
        };
        setMessages(prev => [...prev, newMessage]);
    };
    
    const allParticipants = [
        { id: 'local-user', name: 'You', isMuted, isCameraOff },
        ...participants
    ];

    const gridCols = `grid-cols-${Math.min(Math.ceil(Math.sqrt(allParticipants.length)), 4)}`;

    return (
        <div className="flex h-[calc(100vh-4rem)] bg-gray-900 rounded-lg overflow-hidden">
            <div className="flex-grow flex flex-col relative">
                <div className="flex-grow p-4">
                    <div className={`grid gap-4 h-full ${gridCols} grid-rows-${Math.ceil(allParticipants.length / Math.ceil(Math.sqrt(allParticipants.length)))}`}>
                        {allParticipants.map((p, index) => (
                             <VideoParticipant 
                                key={p.id} 
                                participant={p} 
                                isLocal={index === 0} 
                            />
                        ))}
                    </div>
                </div>

                <RoomControls
                    isMuted={isMuted}
                    isCameraOff={isCameraOff}
                    onToggleMute={() => setIsMuted(prev => !prev)}
                    onToggleCamera={() => setIsCameraOff(prev => !prev)}
                    onLeave={() => navigate('/app/member/rooms')}
                    onToggleChat={() => setIsChatVisible(prev => !prev)}
                />
            </div>

            {isChatVisible && (
                <ChatPanel 
                    messages={messages}
                    onSendMessage={handleSendMessage}
                    onClose={() => setIsChatVisible(false)}
                />
            )}
        </div>
    );
};

export default PeerSupportRoomPage;
