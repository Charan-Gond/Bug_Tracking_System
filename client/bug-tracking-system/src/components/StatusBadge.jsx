import React from 'react';

import { Link } from 'react-router-dom';
{/* <Link to="/pages/DashBoardPage">Dashboard</Link> */}
const StatusBadge = ({ status }) => {
  let color = 'bg-gray-300 text-gray-700';
  if (status === 'Open') color = 'bg-red-200 text-red-800';
  else if (status === 'Closed') color = 'bg-green-200 text-green-800';
  else if (status === 'In Progress') color = 'bg-yellow-200 text-yellow-800';

  return (
    <span className={`px-2 py-1 rounded-full text-sm font-medium ${color}`}>
      {status}
    </span>
  );
};

export default StatusBadge;
