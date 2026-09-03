import React, { useEffect, useState } from 'react';

const emptyForm = {
  firstName: '',
  lastName: '',
  email: '',
  phoneNumber: '',
  department: '',
  designation: '',
  salary: '',
  dateOfJoining: '',
};

function validate(form) {
  const errors = {};
  if (!form.firstName.trim()) errors.firstName = 'First name is required';
  if (!form.lastName.trim()) errors.lastName = 'Last name is required';
  if (!form.email.trim()) {
    errors.email = 'Email is required';
  } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(form.email)) {
    errors.email = 'Enter a valid email address';
  }
  if (form.phoneNumber && !/^[0-9+\-\s()]{7,15}$/.test(form.phoneNumber)) {
    errors.phoneNumber = 'Enter a valid phone number';
  }
  if (!form.department.trim()) errors.department = 'Department is required';
  if (!form.designation.trim()) errors.designation = 'Designation is required';
  if (!form.salary || Number(form.salary) <= 0) errors.salary = 'Salary must be a positive number';
  if (!form.dateOfJoining) errors.dateOfJoining = 'Date of joining is required';
  return errors;
}

export default function EmployeeFormPanel({ open, initialData, onClose, onSubmit, submitting }) {
  const [form, setForm] = useState(emptyForm);
  const [errors, setErrors] = useState({});
  const isEditing = Boolean(initialData);

  useEffect(() => {
    if (open) {
      setForm(
        initialData
          ? {
              firstName: initialData.firstName || '',
              lastName: initialData.lastName || '',
              email: initialData.email || '',
              phoneNumber: initialData.phoneNumber || '',
              department: initialData.department || '',
              designation: initialData.designation || '',
              salary: initialData.salary ?? '',
              dateOfJoining: initialData.dateOfJoining || '',
            }
          : emptyForm
      );
      setErrors({});
    }
  }, [open, initialData]);

  if (!open) return null;

  const handleChange = (field) => (e) => {
    setForm((prev) => ({ ...prev, [field]: e.target.value }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    const validationErrors = validate(form);
    setErrors(validationErrors);
    if (Object.keys(validationErrors).length > 0) return;

    onSubmit({
      ...form,
      salary: Number(form.salary),
    });
  };

  return (
    <div className="dialog-overlay" onClick={onClose}>
      <div className="panel" onClick={(e) => e.stopPropagation()}>
        <div className="panel-header">
          <h2>{isEditing ? 'Edit employee' : 'Add employee'}</h2>
          <button type="button" className="icon-btn" onClick={onClose} aria-label="Close">
            ×
          </button>
        </div>

        <form className="panel-form" onSubmit={handleSubmit} noValidate>
          <div className="form-row">
            <div className="field">
              <label htmlFor="firstName">First name</label>
              <input id="firstName" value={form.firstName} onChange={handleChange('firstName')} />
              {errors.firstName && <span className="field-error">{errors.firstName}</span>}
            </div>
            <div className="field">
              <label htmlFor="lastName">Last name</label>
              <input id="lastName" value={form.lastName} onChange={handleChange('lastName')} />
              {errors.lastName && <span className="field-error">{errors.lastName}</span>}
            </div>
          </div>

          <div className="field">
            <label htmlFor="email">Email</label>
            <input id="email" type="email" value={form.email} onChange={handleChange('email')} />
            {errors.email && <span className="field-error">{errors.email}</span>}
          </div>

          <div className="field">
            <label htmlFor="phoneNumber">Phone number</label>
            <input id="phoneNumber" value={form.phoneNumber} onChange={handleChange('phoneNumber')} placeholder="Optional" />
            {errors.phoneNumber && <span className="field-error">{errors.phoneNumber}</span>}
          </div>

          <div className="form-row">
            <div className="field">
              <label htmlFor="department">Department</label>
              <input id="department" value={form.department} onChange={handleChange('department')} />
              {errors.department && <span className="field-error">{errors.department}</span>}
            </div>
            <div className="field">
              <label htmlFor="designation">Designation</label>
              <input id="designation" value={form.designation} onChange={handleChange('designation')} />
              {errors.designation && <span className="field-error">{errors.designation}</span>}
            </div>
          </div>

          <div className="form-row">
            <div className="field">
              <label htmlFor="salary">Salary (annual)</label>
              <input id="salary" type="number" min="0" step="0.01" value={form.salary} onChange={handleChange('salary')} />
              {errors.salary && <span className="field-error">{errors.salary}</span>}
            </div>
            <div className="field">
              <label htmlFor="dateOfJoining">Date of joining</label>
              <input id="dateOfJoining" type="date" value={form.dateOfJoining} onChange={handleChange('dateOfJoining')} />
              {errors.dateOfJoining && <span className="field-error">{errors.dateOfJoining}</span>}
            </div>
          </div>

          <div className="panel-actions">
            <button type="button" className="btn btn--ghost" onClick={onClose} disabled={submitting}>
              Cancel
            </button>
            <button type="submit" className="btn btn--primary" disabled={submitting}>
              {submitting ? 'Saving…' : isEditing ? 'Save changes' : 'Add employee'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
