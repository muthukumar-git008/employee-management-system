import React from 'react';
import { BrowserRouter, Routes, Route } from 'react-router-dom';
import Sidebar from './components/Sidebar';
import EmployeeListPage from './pages/EmployeeListPage';
import EmployeeDetailsPage from './pages/EmployeeDetailsPage';

export default function App() {
  return (
    <BrowserRouter>
      <div className="app-shell">
        <Sidebar />
        <main className="app-main">
          <Routes>
            <Route path="/" element={<EmployeeListPage />} />
            <Route path="/employees/:id" element={<EmployeeDetailsPage />} />
          </Routes>
        </main>
      </div>
    </BrowserRouter>
  );
}
