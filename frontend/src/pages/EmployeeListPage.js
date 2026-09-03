import React, { useEffect, useMemo, useState, useCallback } from 'react';
import { Link } from 'react-router-dom';
import { employeeApi } from '../api/employeeApi';
import EmployeeFormPanel from '../components/EmployeeFormPanel';
import ConfirmDialog from '../components/ConfirmDialog';
import Toast from '../components/Toast';

const PAGE_SIZE = 8;

const currencyFormatter = new Intl.NumberFormat('en-US', {
  style: 'currency',
  currency: 'USD',
  maximumFractionDigits: 0,
});

export default function EmployeeListPage() {
  const [employees, setEmployees] = useState([]);
  const [loading, setLoading] = useState(true);
  const [loadError, setLoadError] = useState(null);
  const [search, setSearch] = useState('');
  const [page, setPage] = useState(1);

  const [panelOpen, setPanelOpen] = useState(false);
  const [editingEmployee, setEditingEmployee] = useState(null);
  const [submitting, setSubmitting] = useState(false);

  const [deleteTarget, setDeleteTarget] = useState(null);
  const [deleting, setDeleting] = useState(false);

  const [toast, setToast] = useState(null);
  const showToast = (message, type = 'success') => setToast({ message, type });

  const loadEmployees = useCallback(async () => {
    setLoading(true);
    setLoadError(null);
    try {
      const data = await employeeApi.getAll();
      setEmployees(data);
    } catch (err) {
      setLoadError(err.message);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    loadEmployees();
  }, [loadEmployees]);

  const filtered = useMemo(() => {
    const term = search.trim().toLowerCase();
    if (!term) return employees;
    return employees.filter((emp) =>
      [emp.firstName, emp.lastName, emp.email, emp.department, emp.designation]
        .filter(Boolean)
        .some((field) => field.toLowerCase().includes(term))
    );
  }, [employees, search]);

  const totalPages = Math.max(1, Math.ceil(filtered.length / PAGE_SIZE));
  const currentPage = Math.min(page, totalPages);
  const pageItems = filtered.slice((currentPage - 1) * PAGE_SIZE, currentPage * PAGE_SIZE);

  const openAddPanel = () => {
    setEditingEmployee(null);
    setPanelOpen(true);
  };

  const openEditPanel = (employee) => {
    setEditingEmployee(employee);
    setPanelOpen(true);
  };

  const closePanel = () => {
    if (submitting) return;
    setPanelOpen(false);
  };

  const handleFormSubmit = async (formValues) => {
    setSubmitting(true);
    try {
      if (editingEmployee) {
        const updated = await employeeApi.update(editingEmployee.id, formValues);
        setEmployees((prev) => prev.map((e) => (e.id === updated.id ? updated : e)));
        showToast(`Updated ${updated.firstName} ${updated.lastName}`);
      } else {
        const created = await employeeApi.create(formValues);
        setEmployees((prev) => [created, ...prev]);
        showToast(`Added ${created.firstName} ${created.lastName}`);
      }
      setPanelOpen(false);
    } catch (err) {
      showToast(err.message, 'error');
    } finally {
      setSubmitting(false);
    }
  };

  const confirmDelete = (employee) => setDeleteTarget(employee);

  const handleDelete = async () => {
    if (!deleteTarget) return;
    setDeleting(true);
    try {
      await employeeApi.remove(deleteTarget.id);
      setEmployees((prev) => prev.filter((e) => e.id !== deleteTarget.id));
      showToast(`Removed ${deleteTarget.firstName} ${deleteTarget.lastName}`);
      setDeleteTarget(null);
    } catch (err) {
      showToast(err.message, 'error');
    } finally {
      setDeleting(false);
    }
  };

  return (
    <div className="page">
      <header className="page-header">
        <div>
          <h1>All employees</h1>
          <p className="page-subtitle">
            {loading ? 'Loading…' : `${filtered.length} of ${employees.length} employee${employees.length === 1 ? '' : 's'}`}
          </p>
        </div>
        <button type="button" className="btn btn--primary" onClick={openAddPanel}>
          + Add employee
        </button>
      </header>

      <div className="toolbar">
        <input
          type="search"
          className="search-input"
          placeholder="Search by name, email, department…"
          value={search}
          onChange={(e) => {
            setSearch(e.target.value);
            setPage(1);
          }}
        />
      </div>

      {loading && <div className="state-panel">Loading employees…</div>}

      {!loading && loadError && (
        <div className="state-panel state-panel--error">
          Couldn't load employees: {loadError}
          <button type="button" className="btn btn--ghost" onClick={loadEmployees}>
            Retry
          </button>
        </div>
      )}

      {!loading && !loadError && filtered.length === 0 && (
        <div className="state-panel">
          {employees.length === 0
            ? 'No employees yet. Add your first one to get started.'
            : 'No employees match your search.'}
        </div>
      )}

      {!loading && !loadError && pageItems.length > 0 && (
        <>
          <div className="table-wrap">
            <table className="table">
              <thead>
                <tr>
                  <th>Name</th>
                  <th>Department</th>
                  <th>Designation</th>
                  <th>Salary</th>
                  <th>Joined</th>
                  <th aria-label="Actions" />
                </tr>
              </thead>
              <tbody>
                {pageItems.map((emp) => (
                  <tr key={emp.id}>
                    <td>
                      <Link to={`/employees/${emp.id}`} className="table-name-link">
                        {emp.firstName} {emp.lastName}
                      </Link>
                      <div className="table-subtext">{emp.email}</div>
                    </td>
                    <td>{emp.department}</td>
                    <td>{emp.designation}</td>
                    <td className="mono">{currencyFormatter.format(emp.salary)}</td>
                    <td className="mono">{emp.dateOfJoining}</td>
                    <td className="table-actions">
                      <button type="button" className="link-btn" onClick={() => openEditPanel(emp)}>
                        Edit
                      </button>
                      <button type="button" className="link-btn link-btn--danger" onClick={() => confirmDelete(emp)}>
                        Delete
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          {totalPages > 1 && (
            <div className="pagination">
              <button
                type="button"
                className="btn btn--ghost"
                disabled={currentPage === 1}
                onClick={() => setPage((p) => Math.max(1, p - 1))}
              >
                Previous
              </button>
              <span className="pagination-label">
                Page {currentPage} of {totalPages}
              </span>
              <button
                type="button"
                className="btn btn--ghost"
                disabled={currentPage === totalPages}
                onClick={() => setPage((p) => Math.min(totalPages, p + 1))}
              >
                Next
              </button>
            </div>
          )}
        </>
      )}

      <EmployeeFormPanel
        open={panelOpen}
        initialData={editingEmployee}
        onClose={closePanel}
        onSubmit={handleFormSubmit}
        submitting={submitting}
      />

      <ConfirmDialog
        open={Boolean(deleteTarget)}
        title="Remove employee?"
        message={
          deleteTarget
            ? `This will permanently remove ${deleteTarget.firstName} ${deleteTarget.lastName} from the system.`
            : ''
        }
        confirmLabel={deleting ? 'Removing…' : 'Remove'}
        onConfirm={handleDelete}
        onCancel={() => !deleting && setDeleteTarget(null)}
      />

      <Toast toast={toast} onDismiss={() => setToast(null)} />
    </div>
  );
}
