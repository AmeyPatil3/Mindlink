
import React from 'react';
import { CalendarDaysIcon, UsersIcon } from '../ui/icons';

const StatCard: React.FC<{ title: string; value: string; icon: React.ReactNode }> = ({ title, value, icon }) => (
    <div className="bg-white rounded-xl shadow-md p-6">
        <div className="flex items-center">
            <div className="p-3 bg-blue-100 rounded-lg">
                {icon}
            </div>
            <div className="ml-4">
                <p className="text-sm text-gray-500">{title}</p>
                <p className="text-2xl font-bold text-gray-800">{value}</p>
            </div>
        </div>
    </div>
);

const TherapistDashboardPage: React.FC = () => {
    return (
        <div>
            <div className="mb-12">
                <h1 className="text-4xl font-bold text-gray-900">Welcome, Dr. Reed</h1>
                <p className="mt-2 text-lg text-gray-600">Here's a summary of your activity today.</p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mb-8">
                <StatCard title="Today's Appointments" value="5" icon={<CalendarDaysIcon className="w-8 h-8 text-blue-600" />} />
                <StatCard title="New Messages" value="3" icon={<UsersIcon className="w-8 h-8 text-blue-600" />} />
                <StatCard title="Pending Requests" value="2" icon={<UsersIcon className="w-8 h-8 text-blue-600" />} />
            </div>

            <div className="bg-white rounded-xl shadow-md p-6">
                <h2 className="text-2xl font-bold text-gray-800 mb-4">Upcoming Appointments</h2>
                <ul className="space-y-4">
                    <li className="flex items-center justify-between p-4 bg-gray-50 rounded-lg">
                        <div>
                            <p className="font-semibold text-gray-700">Alex Johnson</p>
                            <p className="text-sm text-gray-500">11:00 AM - 11:50 AM</p>
                        </div>
                        <button className="bg-blue-600 text-white font-semibold py-2 px-4 rounded-lg hover:bg-blue-700">Join Call</button>
                    </li>
                    <li className="flex items-center justify-between p-4 bg-gray-50 rounded-lg">
                        <div>
                            <p className="font-semibold text-gray-700">Samantha Carter</p>
                            <p className="text-sm text-gray-500">2:00 PM - 2:50 PM</p>
                        </div>
                        <button className="bg-blue-600 text-white font-semibold py-2 px-4 rounded-lg hover:bg-blue-700">Join Call</button>
                    </li>
                     <li className="flex items-center justify-between p-4 bg-gray-50 rounded-lg">
                        <div>
                            <p className="font-semibold text-gray-700">Ben Richards</p>
                            <p className="text-sm text-gray-500">4:30 PM - 5:20 PM</p>
                        </div>
                        <button className="bg-blue-600 text-white font-semibold py-2 px-4 rounded-lg hover:bg-blue-700">Join Call</button>
                    </li>
                </ul>
            </div>
        </div>
    );
};

export default TherapistDashboardPage;
