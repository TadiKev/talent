import React, { useState, useEffect } from 'react';
import axios from 'axios';
import './TalentVerifyUpdateCompanyForm.css';

const TalentVerifyUpdateCompanyForm = () => {
  const [formData, setFormData] = useState({
    name: '',
    registration_date: '',
    registration_number: '',
    address: '',
    contact_person: '',
    contact_phone: '',
    email: '',
    company_id: null
  });
  const [message, setMessage] = useState('');
  const [error, setError] = useState('');

  useEffect(() => {
    // Fetch company data if company_id is provided initially (for update scenario)
    if (formData.company_id) {
      fetchCompanyData();
    }
  }, [formData.company_id]);

  const fetchCompanyData = async () => {
    try {
      const response = await axios.get(`http://localhost:8000/api/companies/${formData.company_id}/`);
      const companyData = response.data;
      setFormData({
        ...companyData,
        company_id: companyData.id
      });
    } catch (error) {
      console.error('Error fetching company data:', error);
      setError('Failed to fetch company data');
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const response = await axios.post('http://localhost:8000/api/save-or-update-company/', formData);

      console.log('Response:', response.data);
      setMessage(formData.company_id ? 'Company updated successfully' : 'Company added successfully');
      setError('');
      setFormData({
        name: '',
        registration_date: '',
        registration_number: '',
        address: '',
        contact_person: '',
        contact_phone: '',
        email: '',
        company_id: response.data.company_id || null
      });
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

  const handleDelete = async () => {
    if (!formData.company_id) {
      alert('No company selected to delete.');
      return;
    }

    try {
      const response = await axios.delete(
        `http://localhost:8000/api/companies/${formData.company_id}/`
      );

      console.log('Company deleted:', response.data);
      setMessage('Company deleted successfully!');
      setError('');
      setFormData({
        name: '',
        registration_date: '',
        registration_number: '',
        address: '',
        contact_person: '',
        contact_phone: '',
        email: '',
        company_id: null
      });
    } catch (error) {
      console.error('Error deleting company:', error.response?.data);
      setError('Error deleting company!');
    }
  };

  return (
    <div className="update-company-form">
      <h2>{formData.company_id ? 'Update Company Information' : 'Add New Company'}</h2>
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
        <button type="submit">{formData.company_id ? 'Update Company' : 'Add Company'}</button>
        {formData.company_id && (
          <button type="button" onClick={handleDelete}>Delete Company</button>
        )}
      </form>
      {message && <p className="success-message">{message}</p>}
      {error && <p className="error-message">{error}</p>}
    </div>
  );
};

export default TalentVerifyUpdateCompanyForm;
