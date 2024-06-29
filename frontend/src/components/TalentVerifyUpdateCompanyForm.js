import React, { useState } from 'react';
import axios from 'axios';
import './TalentVerifyUpdateCompanyForm.css';

const TalentVerifyUpdateCompanyForm = () => {
  const initialFormData = {
    name: '',
    registration_date: '',
    registration_number: '',
    address: '',
    contact_person: '',
    contact_phone: '',
    email: '',
  };

  const [formData, setFormData] = useState(initialFormData);
  const [message, setMessage] = useState('');
  const [error, setError] = useState('');

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const response = await axios.post('http://localhost:8000/api/save-or-update-company/', formData);

      console.log('Response:', response.data);
      setMessage(formData.id ? 'Company updated successfully' : 'Company added successfully');
      setError('');
      setFormData(initialFormData); // Reset form fields after successful submission
    } catch (error) {
      console.error('Failed to submit company:', error);
      setMessage('');
      setError(error.response?.data?.error || 'Failed to submit company');
    }
  };

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
  };

  return (
    <div className="update-company-form">
      <h2>{formData.id ? 'Update Company Information' : 'Add New Company'}</h2>
      <form onSubmit={handleSubmit}>
        <div className="form-group">
          <input
            type="text"
            name="name"
            value={formData.name}
            onChange={handleChange}
            placeholder="Enter Company Name"
            required
          />
          <label>Name</label>
        </div>
        <div className="form-group">
          <input
            type="date"
            name="registration_date"
            value={formData.registration_date}
            onChange={handleChange}
            required
          />
          <label>Registration Date</label>
        </div>
        <div className="form-group">
          <input
            type="text"
            name="registration_number"
            value={formData.registration_number}
            onChange={handleChange}
            placeholder="Enter Registration Number"
            required
          />
          <label>Registration Number</label>
        </div>
        <div className="form-group">
          <textarea
            name="address"
            value={formData.address}
            onChange={handleChange}
            placeholder="Enter Company Address"
            required
          />
          <label>Address</label>
        </div>
        <div className="form-group">
          <input
            type="text"
            name="contact_person"
            value={formData.contact_person}
            onChange={handleChange}
            placeholder="Enter Contact Person"
            required
          />
          <label>Contact Person</label>
        </div>
        <div className="form-group">
          <input
            type="text"
            name="contact_phone"
            value={formData.contact_phone}
            onChange={handleChange}
            placeholder="Enter Contact Phone"
            required
          />
          <label>Contact Phone</label>
        </div>
        <div className="form-group">
          <input
            type="email"
            name="email"
            value={formData.email}
            onChange={handleChange}
            placeholder="Enter Email"
            required
          />
          <label>Email</label>
        </div>
        <button type="submit">{formData.id ? 'Update Company' : 'Add Company'}</button>
      </form>
      {message && <p className="success-message">{message}</p>}
      {error && <p className="error-message">{error}</p>}
    </div>
  );
};

export default TalentVerifyUpdateCompanyForm;
