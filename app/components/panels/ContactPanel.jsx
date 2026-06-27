'use client';

import { useState } from 'react';
import { useTheme } from '../../context/ThemeContext';
import { useForm } from '../../hooks/useForm';
import SectionTitle from '../shared/SectionTitle';

const validate = (values) => {
  const errors = {};

  if (!values.name.trim()) {
    errors.name = 'Name is required';
  }

  if (!values.email.trim()) {
    errors.email = 'Email is required';
  } else if (
    !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(values.email)
  ) {
    errors.email = 'Enter a valid email';
  }

  if (!values.message.trim()) {
    errors.message = 'Message is required';
  } else if (values.message.trim().length < 10) {
    errors.message = 'Message must be at least 10 characters';
  }

  return errors;
};

const ContactPanel = () => {
  const { theme } = useTheme();
  const dark = theme === 'dark';

  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState('');

  const {
    values,
    errors,
    touched,
    handleChange,
    handleBlur,
    handleSubmit,
    reset
  } = useForm(
    { name: '', email: '', message: '' },
    validate
  );

  const submitForm = async (formData) => {
    setLoading(true);
    try {
      const res = await fetch('/api/contact', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify(formData)
      });

      const data = await res.json();
      if (!res.ok) throw new Error(data.message || 'Failed to send message');

      reset();
      setSuccess('Message sent successfully!');
    } catch (err) {
      alert(err.message || 'Something went wrong');
    } finally {
      setLoading(false);
    }
  };

  const inputClass = "w-full p-3 mb-1 rounded-lg border bg-[var(--bg)] text-[var(--text-primary)] border-[var(--border)] text-sm focus:outline-none focus:ring-2 focus:ring-blue-500/50 transition-shadow";

  if (success) {
    return (
      <div>
        <SectionTitle title="Contact Us" />
        <div className="max-w-[560px] mx-auto bg-[var(--surface)] p-8 rounded-xl border border-[var(--border)] text-center shadow-sm">
          <h2 className="!text-green-400 mb-4 text-2xl font-bold">✅ Thank You!</h2>
          <p className="!text-green-400 mb-6 leading-relaxed">
            Your message has been sent successfully. We appreciate your feedback.
          </p>
          <button
            onClick={() => setSuccess('')}
            className="px-5 py-3 bg-blue-500 hover:bg-blue-600 text-white border-none rounded-lg font-semibold cursor-pointer transition-colors"
          >
            Send Another Message
          </button>
        </div>
      </div>
    );
  }

  return (
    <div>
      <SectionTitle title="Contact Us" />
      <div className="max-w-[560px] mx-auto bg-[var(--surface)] p-8 rounded-xl border border-[var(--border)] shadow-sm">
        <form onSubmit={handleSubmit(submitForm)} className="flex flex-col">
          <input
            className={inputClass}
            name="name"
            placeholder="Your Name"
            value={values.name}
            onChange={handleChange}
            onBlur={handleBlur}
            aria-invalid={touched.name && !!errors.name}
          />
          {touched.name && errors.name && (
            <p className="!text-red-400 mb-4 mt-1 text-[13px]" role="alert">{errors.name}</p>
          )}

          <input
            className={inputClass}
            name="email"
            type="email"
            placeholder="Your Email"
            value={values.email}
            onChange={handleChange}
            onBlur={handleBlur}
            aria-invalid={touched.email && !!errors.email}
          />
          {touched.email && errors.email && (
            <p className="!text-red-400 mb-4 mt-1 text-[13px]" role="alert">{errors.email}</p>
          )}

          <textarea
            className={`${inputClass} min-h-[120px] resize-y`}
            name="message"
            placeholder="Your message"
            value={values.message}
            onChange={handleChange}
            onBlur={handleBlur}
            aria-invalid={touched.message && !!errors.message}
          />
          {touched.message && errors.message && (
            <p className="!text-red-400 mb-4 mt-1 text-[13px]" role="alert">{errors.message}</p>
          )}

          <button
            type="submit"
            disabled={loading}
            className={`w-full p-3 mt-4 text-white border-none rounded-lg font-semibold transition-colors ${
              loading ? 'bg-blue-400 cursor-not-allowed' : 'bg-blue-500 hover:bg-blue-600 cursor-pointer'
            }`}
          >
            {loading ? 'Sending...' : 'Send Message'}
          </button>
        </form>
      </div>
    </div>
  );
};

export default ContactPanel;
