import React, { useState, useEffect, useMemo } from 'react';
import type { Therapist } from '../../types';
import TherapistCard from '../ui/TherapistCard';
import BookingModal from '../ui/BookingModal';
import TherapistCardSkeleton from '../ui/skeletons/TherapistCardSkeleton';
import api from '../../services/api';

const TherapistDirectoryPage: React.FC = () => {
    const [therapists, setTherapists] = useState<Therapist[]>([]);
    const [searchTerm, setSearchTerm] = useState('');
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState('');

    const [isBookingModalOpen, setIsBookingModalOpen] = useState(false);
    const [selectedTherapist, setSelectedTherapist] = useState<Therapist | null>(null);

    useEffect(() => {
        const fetchTherapists = async () => {
            setLoading(true);
            try {
                // Simulate network delay
                await new Promise(resolve => setTimeout(resolve, 1500));
                const { data } = await api.get('/therapists');
                setTherapists(data);
            } catch (err) {
                setError('Failed to load therapists. Please try again later.');
            } finally {
                setLoading(false);
            }
        };
        fetchTherapists();
    }, []);

    const handleBookSession = (therapist: Therapist) => {
        setSelectedTherapist(therapist);
        setIsBookingModalOpen(true);
    };

    const filteredTherapists = useMemo(() => {
        if (!searchTerm) return therapists;
        return therapists.filter(therapist =>
            therapist.fullName.toLowerCase().includes(searchTerm.toLowerCase()) ||
            therapist.specialties.some(s => s.toLowerCase().includes(searchTerm.toLowerCase()))
        );
    }, [searchTerm, therapists]);

    if (error) return <div className="text-center p-8 text-red-600">{error}</div>;

    return (
        <div>
            <h1 className="text-3xl font-bold text-center mb-2">Find a Therapist</h1>
            <p className="text-center text-gray-600 mb-8">Connect with a professional who can help.</p>
            <div className="mb-8 max-w-lg mx-auto">
                <input
                    type="text"
                    placeholder="Search by name or specialty (e.g., Anxiety)"
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
                />
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                {loading ? (
                    Array.from({ length: 6 }).map((_, index) => <TherapistCardSkeleton key={index} />)
                ) : (
                    filteredTherapists.map(therapist => (
                        <TherapistCard key={therapist._id} therapist={therapist} onBook={handleBookSession} />
                    ))
                )}
            </div>
             {filteredTherapists.length === 0 && !loading && (
                <div className="text-center col-span-full py-16">
                    <p className="text-gray-500 text-lg">No therapists found matching your search.</p>
                </div>
            )}

            {selectedTherapist && (
                <BookingModal
                    isOpen={isBookingModalOpen}
                    onClose={() => setIsBookingModalOpen(false)}
                    therapist={selectedTherapist}
                />
            )}
        </div>
    );
};

export default TherapistDirectoryPage;