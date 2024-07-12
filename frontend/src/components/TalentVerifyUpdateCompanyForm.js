import React, { useState, useEffect } from 'react';
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
  const [csrfToken, setCsrfToken] = useState('');

  useEffect(() => {
    const getCsrfToken = async () => {
      try {
        const response = await axios.get('http://localhost:8000/api/csrf-token/', { withCredentials: true });
        setCsrfToken(response.data.csrfToken);
      } catch (error) {
        console.error('Failed to fetch CSRF token:', error);
      }
    };

    getCsrfToken();
  }, []);

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!formData.registration_date) {
      setError('Registration date cannot be empty');
      return;
    }
    console.log('Submitting data:', formData);
  
    try {
      const response = await axios.post(
        'http://localhost:8000/api/save-or-update-company/', // Corrected URL without registration_number in path
        formData,
        { headers: { 'X-CSRFToken': csrfToken }, withCredentials: true }
      );
      console.log('Response:', response.data);
      setMessage(formData.registration_number ? 'Company updated successfully' : 'Company added successfully');
      setError('');
      setFormData(initialFormData); // Reset form fields after successful submission
    } catch (error) {
      console.error('Failed to submit company:', error);
      setMessage('');
      setError(error.response?.data?.error || 'Failed to submit company');
    }
  };
  

  const handleFetch = async () => {
    try {
      const response = await axios.get(`http://localhost:8000/api/company/${formData.registration_number}/`, { withCredentials: true });
      setFormData(response.data);
      setMessage('Company fetched successfully');
      setError('');
    } catch (error) {
      console.error('Failed to fetch company:', error);
      setMessage('');
      setError(error.response?.data?.error || 'Failed to fetch company');
    }
  };

  const handleDelete = async () => {
    try {
      const response = await axios.delete(
        `http://localhost:8000/api/delete-company/${formData.registration_number}/`,
        { headers: { 'X-CSRFToken': csrfToken }, withCredentials: true }
      );
      console.log('Response:', response.data);
      setMessage('Company deleted successfully');
      setError('');
      setFormData(initialFormData); // Reset form fields after successful deletion
    } catch (error) {
      console.error('Failed to delete company:', error);
      setMessage('');
      setError(error.response?.data?.error || 'Failed to delete company');
    }
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    if (name === 'registration_date') {
      const formattedDate = new Date(value).toISOString().split('T')[0]; // Ensure correct format
      setFormData({
        ...formData,
        [name]: formattedDate,
      });
    } else {
      setFormData({
        ...formData,
        [name]: value,
      });
    }
  };

  return (
    <div className="update-company-form">
      <h2>{formData.registration_number ? 'Update Company Information' : 'Add New Company'}</h2>
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
        <button type="submit">{formData.registration_number ? 'Update Company' : 'Add Company'}</button>
        <button type="button" onClick={handleFetch}>Fetch Company</button>
        <button type="button" onClick={handleDelete}>Delete Company</button>
      </form>
      {message && <p style={{ color: 'green' }}>{message}</p>}
      {error && <p style={{ color: 'red' }}>{error}</p>}
    </div>
  );
};

export default TalentVerifyUpdateCompanyForm;
