import React, { useEffect, useState } from 'react';
import api from '../api/axios';
import { Bug, FolderGit2, CheckCircle, Clock } from 'lucide-react';
import { Link } from 'react-router-dom';

const StatCard = ({ title, count, icon: Icon, color }) => (
    <div className="bg-gray-800 p-6 rounded-xl border border-gray-700 shadow-lg">
        <div className="flex items-center justify-between">
            <div>
                <p className="text-gray-400 text-sm font-medium">{title}</p>
                <h3 className="text-3xl font-bold text-white mt-2">{count}</h3>
            </div>
            <div className={`p-3 rounded-lg ${color} bg-opacity-20`}>
                <Icon size={24} className={color.replace('bg-', 'text-')} />
            </div>
        </div>
    </div>
);

const Dashboard = () => {
    // Mock data for now, ideally fetch from backend
    const [stats, setStats] = useState({
        totalBugs: 0,
        openBugs: 0,
        projects: 0,
        completedBugs: 0
    });
    const [recentBugs, setRecentBugs] = useState([]);

    useEffect(() => {
        const fetchData = async () => {
            try {
                // Determine endpoints based on backend or aggregate on frontend
                // For now, let's just fetch projects and bugs count if possible
                const [projectsRes, bugsRes] = await Promise.all([
                    api.get('/project'),
                    api.get('/bug')
                ]);

                const projects = projectsRes.data;
                const bugs = bugsRes.data;

                setStats({
                    projects: projects.length,
                    totalBugs: bugs.length,
                    openBugs: bugs.filter(b => b.status === 'OPEN').length,
                    completedBugs: bugs.filter(b => b.status === 'CLOSED').length // Assuming status enum
                });

                setRecentBugs(bugs.slice(0, 5)); // Get first 5
            } catch (error) {
                console.error("Failed to fetch dashboard data", error);
            }
        };
        fetchData();
    }, []);

    return (
        <div className="space-y-6">
            <div className="flex items-center justify-between">
                <h1 className="text-2xl font-bold text-white">Dashboard</h1>
            </div>

            {/* Stats Grid */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                <StatCard
                    title="Total Projects"
                    count={stats.projects}
                    icon={FolderGit2}
                    color="text-blue-500 bg-blue-500"
                />
                <StatCard
                    title="Total Bugs"
                    count={stats.totalBugs}
                    icon={Bug}
                    color="text-red-500 bg-red-500"
                />
                <StatCard
                    title="Open Bugs"
                    count={stats.openBugs}
                    icon={Clock}
                    color="text-yellow-500 bg-yellow-500"
                />
                <StatCard
                    title="Resolved Bugs"
                    count={stats.completedBugs}
                    icon={CheckCircle}
                    color="text-green-500 bg-green-500"
                />
            </div>

            {/* Recent Activity / Bugs */}
            <div className="bg-gray-800 rounded-xl border border-gray-700 overflow-hidden">
                <div className="p-6 border-b border-gray-700 flex justify-between items-center">
                    <h2 className="text-lg font-semibold text-white">Recent Bugs</h2>
                    <Link to="/bugs" className="text-blue-400 hover:text-blue-300 text-sm">View All</Link>
                </div>
                <div className="overflow-x-auto">
                    <table className="w-full text-left">
                        <thead className="bg-gray-900/50 text-gray-400 text-xs uppercase">
                            <tr>
                                <th className="px-6 py-3 font-medium">Title</th>
                                <th className="px-6 py-3 font-medium">Status</th>
                                <th className="px-6 py-3 font-medium">Priority</th>
                                <th className="px-6 py-3 font-medium">Assigned To</th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-gray-700">
                            {recentBugs.length > 0 ? (
                                recentBugs.map(bug => (
                                    <tr key={bug.id} className="hover:bg-gray-700/50 transition-colors">
                                        <td className="px-6 py-4 text-white font-medium">{bug.title}</td>
                                        <td className="px-6 py-4">
                                            <span className={`px-2 py-1 rounded-full text-xs font-medium ${bug.status === 'OPEN' ? 'bg-yellow-500/10 text-yellow-400' :
                                                    bug.status === 'CLOSED' ? 'bg-green-500/10 text-green-400' : 'bg-gray-500/10 text-gray-400'
                                                }`}>
                                                {bug.status}
                                            </span>
                                        </td>
                                        <td className="px-6 py-4">
                                            <span className={`px-2 py-1 rounded-full text-xs font-medium ${bug.priority === 'CRITICAL' ? 'bg-red-500/10 text-red-400' :
                                                    bug.priority === 'HIGH' ? 'bg-orange-500/10 text-orange-400' :
                                                        'bg-blue-500/10 text-blue-400'
                                                }`}>
                                                {bug.priority}
                                            </span>
                                        </td>
                                        <td className="px-6 py-4 text-gray-300">
                                            {/* We only have ID, ideally component needs to fetch user or backend populate it */}
                                            User #{bug.assignedTo}
                                        </td>
                                    </tr>
                                ))
                            ) : (
                                <tr>
                                    <td colSpan="4" className="px-6 py-8 text-center text-gray-500">
                                        No bugs found.
                                    </td>
                                </tr>
                            )}
                        </tbody>
                    </table>
                </div>
            </div>
        </div>
    );
};

export default Dashboard;
