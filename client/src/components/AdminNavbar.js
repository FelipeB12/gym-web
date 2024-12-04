import React from 'react';
import { Link } from 'react-router-dom';

const AdminNavbar = () => {
    return (
        <nav className="admin-navbar">
            <ul>
                <li><Link to="/admin/home">Home</Link></li>
                <li><Link to="/admin/search">Search Trainers</Link></li>
                <li><Link to="/admin/dashboard">Dashboard</Link></li>
            </ul>
        </nav>
    );
};

export default AdminNavbar; 