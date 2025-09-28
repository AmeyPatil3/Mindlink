import React, { useState } from 'react';
import Modal from './Modal';
import { LockClosedIcon } from './icons';

interface CreateRoomModalProps {
    isOpen: boolean;
    onClose: () => void;
    onCreateRoom: (roomData: { name: string; topic: string; password?: string }) => void;
}

const CreateRoomModal: React.FC<CreateRoomModalProps> = ({ isOpen, onClose, onCreateRoom }) => {
    const [name, setName] = useState('');
    const [topic, setTopic] = useState('');
    const [password, setPassword] = useState('');

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        if (!name || !topic) return;
        onCreateRoom({ name, topic, password });
        // Reset form
        setName('');
        setTopic('');
        setPassword('');
    };

    return (
        <Modal isOpen={isOpen} onClose={onClose} title="Create a Private Room">
            <form onSubmit={handleSubmit} className="space-y-4">
                <div>
                    <label htmlFor="room-name" className="block text-sm font-medium text-gray-700">Room Name</label>
                    <input
                        type="text"
                        id="room-name"
                        value={name}
                        onChange={(e) => setName(e.target.value)}
                        required
                        className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:ring-blue-500 focus:border-blue-500"
                        placeholder="e.g., Evening Wind-Down"
                    />
                </div>
                <div>
                    <label htmlFor="room-topic" className="block text-sm font-medium text-gray-700">Topic</label>
                    <input
                        type="text"
                        id="room-topic"
                        value={topic}
                        onChange={(e) => setTopic(e.target.value)}
                        required
                        className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:ring-blue-500 focus:border-blue-500"
                        placeholder="e.g., Managing work stress"
                    />
                </div>
                <div className="relative">
                    <label htmlFor="room-password" className="block text-sm font-medium text-gray-700">Password (Optional)</label>
                    <div className="relative mt-1">
                        <div className="pointer-events-none absolute inset-y-0 left-0 flex items-center pl-3">
                            <LockClosedIcon className="h-5 w-5 text-gray-400" aria-hidden="true" />
                        </div>
                        <input
                            type="password"
                            id="room-password"
                            value={password}
                            onChange={(e) => setPassword(e.target.value)}
                            className="block w-full rounded-md border-gray-300 pl-10 shadow-sm focus:border-blue-500 focus:ring-blue-500"
                            placeholder="Make it secure"
                        />
                    </div>
                </div>
                <div className="pt-4">
                    <button
                        type="submit"
                        disabled={!name || !topic}
                        className="w-full bg-blue-600 text-white font-semibold py-2.5 px-4 rounded-lg hover:bg-blue-700 disabled:bg-gray-300 transition-colors"
                    >
                        Create and Join Room
                    </button>
                </div>
            </form>
        </Modal>
    );
};

export default CreateRoomModal;
