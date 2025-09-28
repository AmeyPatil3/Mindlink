import React, { useState, useEffect } from 'react';
import RoomCard from '../ui/RoomCard';
import { PlusIcon } from '../ui/icons';
import api from '../../services/api';
import type { Room } from '../../types';
import RoomCardSkeleton from '../ui/skeletons/RoomCardSkeleton';
import CreateRoomModal from '../ui/CreateRoomModal';

const RoomsPage: React.FC = () => {
    const [rooms, setRooms] = useState<Room[]>([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState('');
    const [isCreateRoomModalOpen, setIsCreateRoomModalOpen] = useState(false);

    useEffect(() => {
        const fetchRooms = async () => {
            setLoading(true);
            try {
                // Simulate network delay
                await new Promise(resolve => setTimeout(resolve, 1500));
                const { data } = await api.get('/rooms');
                setRooms(data);
            } catch (err) {
                setError('Could not fetch rooms. Please try again.');
            } finally {
                setLoading(false);
            }
        };
        fetchRooms();
    }, []);

    const handleCreateRoom = (newRoomData: { name: string; topic: string; }) => {
        const newRoom: Room = {
            _id: `room_${Date.now()}`,
            roomId: `custom-${Math.random().toString(36).substr(2, 9)}`,
            participantsCount: 1,
            ...newRoomData,
        };
        setRooms(prevRooms => [newRoom, ...prevRooms]);
        setIsCreateRoomModalOpen(false);
    };

    return (
        <div>
            <div className="flex justify-between items-center mb-8">
                <div>
                    <h1 className="text-4xl font-bold text-gray-900">Live Global Rooms</h1>
                    <p className="mt-2 text-lg text-gray-600">Join a room to connect with peers anonymously.</p>
                </div>
                <button 
                    onClick={() => setIsCreateRoomModalOpen(true)}
                    className="flex items-center bg-blue-600 text-white font-semibold py-3 px-5 rounded-lg hover:bg-blue-700 transition-colors duration-300"
                >
                    <PlusIcon className="w-5 h-5 mr-2" />
                    Create Private Room
                </button>
            </div>

            {error && <p className="text-red-500">{error}</p>}

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                {loading ? (
                    Array.from({ length: 3 }).map((_, index) => <RoomCardSkeleton key={index} />)
                ) : (
                    rooms.map(room => (
                        <RoomCard key={room._id} room={room} />
                    ))
                )}
            </div>

            <CreateRoomModal
                isOpen={isCreateRoomModalOpen}
                onClose={() => setIsCreateRoomModalOpen(false)}
                onCreateRoom={handleCreateRoom}
            />
        </div>
    );
};

export default RoomsPage;