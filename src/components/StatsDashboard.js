import { Users, ListTodo, DollarSign, Calendar } from 'lucide-react';

export default function StatsDashboard({ numGroups, taskCount, amountPerDay, totalAmount }) {
    return (
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                {/* Total Groups Card */}
                <div className="bg-gradient-to-br from-blue-500 to-blue-600 rounded-xl shadow-lg p-6 text-white transform hover:scale-105 transition-transform">
                    <div className="flex items-center justify-between">
                        <div>
                            <p className="text-blue-100 text-sm font-medium mb-1">Total Groups</p>
                            <p className="text-4xl font-bold">{numGroups}</p>
                        </div>
                        <div className="bg-white bg-opacity-20 rounded-full p-3">
                            <Users className="w-8 h-8" />
                        </div>
                    </div>
                    <div className="mt-4 flex items-center text-sm text-blue-100">
                        <span className="mr-2">●</span>
                        Active workforce groups
                    </div>
                </div>

                {/* Total Tasks Card */}
                <div className="bg-gradient-to-br from-green-500 to-green-600 rounded-xl shadow-lg p-6 text-white transform hover:scale-105 transition-transform">
                    <div className="flex items-center justify-between">
                        <div>
                            <p className="text-green-100 text-sm font-medium mb-1">Total Tasks</p>
                            <p className="text-4xl font-bold">{taskCount}</p>
                        </div>
                        <div className="bg-white bg-opacity-20 rounded-full p-3">
                            <ListTodo className="w-8 h-8" />
                        </div>
                    </div>
                    <div className="mt-4 flex items-center text-sm text-green-100">
                        <span className="mr-2">●</span>
                        Scheduled tasks
                    </div>
                </div>

                {/* Amount Per Day Card */}
                <div className="bg-gradient-to-br from-purple-500 to-purple-600 rounded-xl shadow-lg p-6 text-white transform hover:scale-105 transition-transform">
                    <div className="flex items-center justify-between">
                        <div>
                            <p className="text-purple-100 text-sm font-medium mb-1">Rate/Day</p>
                            <p className="text-4xl font-bold">${amountPerDay}</p>
                        </div>
                        <div className="bg-white bg-opacity-20 rounded-full p-3">
                            <Calendar className="w-8 h-8" />
                        </div>
                    </div>
                    <div className="mt-4 flex items-center text-sm text-purple-100">
                        <span className="mr-2">●</span>
                        Per working day
                    </div>
                </div>

                {/* Total Amount Card */}
                <div className="bg-gradient-to-br from-orange-500 to-orange-600 rounded-xl shadow-lg p-6 text-white transform hover:scale-105 transition-transform">
                    <div className="flex items-center justify-between">
                        <div>
                            <p className="text-orange-100 text-sm font-medium mb-1">Total Amount</p>
                            <p className="text-4xl font-bold">${totalAmount.toLocaleString()}</p>
                        </div>
                        <div className="bg-white bg-opacity-20 rounded-full p-3">
                            <DollarSign className="w-8 h-8" />
                        </div>
                    </div>
                    <div className="mt-4 flex items-center text-sm text-orange-100">
                        <span className="mr-2">●</span>
                        Total revenue
                    </div>
                </div>
            </div>
        </div>
    );
}
