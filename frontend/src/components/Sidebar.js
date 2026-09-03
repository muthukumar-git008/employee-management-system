import React from 'react';
import { Link } from 'react-router-dom';

export default function Sidebar() {
  return (
    <aside className="sidebar">
      <div className="sidebar-brand">
        <span className="sidebar-brand-mark">R</span>
        <div>
          <div className="sidebar-brand-name">Roster</div>
          <div className="sidebar-brand-sub">Employee Records</div>
        </div>
      </div>

      <nav className="sidebar-nav">
        <Link to="/" className="sidebar-nav-item sidebar-nav-item--active">
          All employees
        </Link>
      </nav>

      <div className="sidebar-footer">
        <div className="sidebar-footer-label">Connected to</div>
        <div className="sidebar-footer-value">employee_management · MySQL</div>
      </div>
    </aside>
  );
}
