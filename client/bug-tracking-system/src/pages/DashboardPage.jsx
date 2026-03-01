import React from 'react';

import { Link } from 'react-router-dom';
{/* <Link to="/">main</Link> */}
import Sidebar from '../components/Sidebar';
import Navbar from '../components/Navbar';
import StatusBadge from '../components/statusBadge';

const DashboardPage = () => {
  const stats = {
    total: 128,
    open: 64,
    closed: 44,
    inProgress: 20,
  };

  const recentBugs = [
    { id: 1, title: 'Login fails on invalid session', status: 'Open' },
    { id: 2, title: 'Dashboard crashes on reload', status: 'In Progress' },
    { id: 3, title: 'UI overlap in mobile view', status: 'Closed' },
  ];

  return (
    <div className="flex min-h-screen bg-gray-100">
      <Sidebar />
      <div className="flex-1">
        <Navbar />
        <div className="p-6 space-y-6">
          <h1 className="text-3xl font-bold">Dashboard</h1>

          {/* Stats Section */}
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-4">
            <StatCard title="Total Bugs" count={stats.total} color="bg-blue-500" />
            <StatCard title="Open" count={stats.open} color="bg-red-500" />
            <StatCard title="Closed" count={stats.closed} color="bg-green-500" />
            <StatCard title="In Progress" count={stats.inProgress} color="bg-yellow-500" />
          </div>

          {/* Recent Bugs Section */}
          <div>
            <h2 className="text-xl font-semibold mb-4">Recent Bugs</h2>
            <div className="bg-white shadow rounded-lg divide-y">
              {recentBugs.map(bug => (
                <div key={bug.id} className="p-4 hover:bg-gray-50 flex justify-between items-center">
                  <span>{bug.title}</span>
                  <StatusBadge status={bug.status} />
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

const StatCard = ({ title, count, color }) => (
  <div className={`p-4 rounded-lg shadow text-white ${color}`}>
    <h3 className="text-sm uppercase">{title}</h3>
    <p className="text-2xl font-bold">{count}</p>
  </div>
);

export default DashboardPage;
