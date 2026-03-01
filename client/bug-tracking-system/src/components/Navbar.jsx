import React from 'react';

import { Link } from 'react-router-dom';
{/* <Link to="/pages">Dashboard</Link> */}
import '../css/Navbar.css'


const Navbar = () => (
  <div className="bg-white shadow px-6 py-4 flex justify-between items-center">
    <div className="text-xl font-bold">Welcome Back!</div>
    <div className="flex items-center gap-4">
      <span>Charan Gond</span>
      <img src="/avatar.png" alt="User" className="w-8 h-8 rounded-full" />
    </div>
  </div>
);

export default Navbar;
