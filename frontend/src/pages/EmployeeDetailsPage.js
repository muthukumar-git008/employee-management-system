import React, { useEffect, useState } from 'react';
import { useParams, Link } from 'react-router-dom';
import { employeeApi } from '../api/employeeApi';

const currencyFormatter = new Intl.NumberFormat('en-US', {
  style: 'currency',
  currency: 'USD',
  maximumFractionDigits: 0,
});

export default function EmployeeDetailsPage() {
  const { id } = useParams();
  const [employee, setEmployee] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    let active = true;
    setLoading(true);
    setError(null);
    employeeApi
      .getById(id)
      .then((data) => {
        if (active) setEmployee(data);
      })
      .catch((err) => {
        if (active) setError(err.message);
      })
      .finally(() => {
        if (active) setLoading(false);
      });
    return () => {
      active = false;
    };
  }, [id]);

  return (
    <div className="page">
      <Link to="/" className="back-link">
        ← Back to all employees
      </Link>

      {loading && <div className="state-panel">Loading employee…</div>}
      {!loading && error && <div className="state-panel state-panel--error">Couldn't load employee: {error}</div>}

      {!loading && !error && employee && (
        <div className="details-card">
          <div className="details-header">
            <div className="avatar-badge">
              {employee.firstName[0]}
              {employee.lastName[0]}
            </div>
            <div>
              <h1>
                {employee.firstName} {employee.lastName}
              </h1>
              <p className="page-subtitle">
                {employee.designation} · {employee.department}
              </p>
            </div>
          </div>

          <dl className="details-grid">
            <div>
              <dt>Email</dt>
              <dd>{employee.email}</dd>
            </div>
            <div>
              <dt>Phone</dt>
              <dd>{employee.phoneNumber || '—'}</dd>
            </div>
            <div>
              <dt>Department</dt>
              <dd>{employee.department}</dd>
            </div>
            <div>
              <dt>Designation</dt>
              <dd>{employee.designation}</dd>
            </div>
            <div>
              <dt>Salary</dt>
              <dd className="mono">{currencyFormatter.format(employee.salary)}</dd>
            </div>
            <div>
              <dt>Date of joining</dt>
              <dd className="mono">{employee.dateOfJoining}</dd>
            </div>
          </dl>
        </div>
      )}
    </div>
  );
}
