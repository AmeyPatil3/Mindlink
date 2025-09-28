
import React from 'react';
import { CalendarDaysIcon } from '../ui/icons';

const SchedulePage: React.FC = () => {
    return (
        <div>
            <div className="mb-8">
                <h1 className="text-4xl font-bold text-gray-900">Your Schedule</h1>
                <p className="mt-2 text-lg text-gray-600">Manage your appointments and availability.</p>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                <div className="lg:col-span-2 bg-white rounded-xl shadow-md p-6">
                    <h2 className="text-2xl font-bold text-gray-800 mb-4">Weekly Calendar</h2>
                    <div className="text-center text-gray-500 py-24">
                        <CalendarDaysIcon className="w-16 h-16 mx-auto mb-4" />
                        <p>A full calendar component would be displayed here.</p>
                        <p className="text-sm">This is a placeholder for a scheduling tool integration.</p>
                    </div>
                </div>
                <div className="bg-white rounded-xl shadow-md p-6">
                    <h2 className="text-2xl font-bold text-gray-800 mb-4">Upcoming</h2>
                    <ul className="space-y-4">
                        <li className="p-4 bg-blue-50 rounded-lg border-l-4 border-blue-500">
                            <p className="font-semibold text-blue-800">11:00 AM</p>
                            <p className="text-sm text-gray-700">Session with Alex Johnson</p>
                        </li>
                        <li className="p-4 bg-blue-50 rounded-lg border-l-4 border-blue-500">
                            <p className="font-semibold text-blue-800">2:00 PM</p>
                            <p className="text-sm text-gray-700">Session with Samantha C.</p>
                        </li>
                         <li className="p-4 bg-gray-50 rounded-lg">
                            <p className="font-semibold text-gray-600">Tomorrow - 9:00 AM</p>
                            <p className="text-sm text-gray-500">Session with Michael B.</p>
                        </li>
                    </ul>
                </div>
            </div>
        </div>
    );
};

export default SchedulePage;
