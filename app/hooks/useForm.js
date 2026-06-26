'use client';

import { useState } from 'react';

export function useForm(initialValues, validate) {
  const [values, setValues] = useState(initialValues);
  const [errors, setErrors] = useState({});
  const [touched, setTouched] = useState({});

  const handleChange = (e) => {
    const { name, value } = e.target;

    const updatedValues = {
      ...values,
      [name]: value
    };

    setValues(updatedValues);

    // Revalidate immediately if field was already touched
    if (touched[name] && validate) {
      setErrors(validate(updatedValues));
    }
  };

  const handleBlur = (e) => {
    const { name } = e.target;

    setTouched(prev => ({
      ...prev,
      [name]: true
    }));

    if (validate) {
      setErrors(validate(values));
    }
  };

  const handleSubmit = (onSubmit) => (e) => {
    e.preventDefault();

    let allErrors = {};
    if (validate) {
      allErrors = validate(values);
      setErrors(allErrors);
    }

    setTouched(
      Object.keys(values).reduce(
        (acc, key) => ({
          ...acc,
          [key]: true
        }),
        {}
      )
    );

    if (Object.keys(allErrors).length === 0) {
      onSubmit(values);
    }
  };

  const reset = () => {
    setValues(initialValues);
    setErrors({});
    setTouched({});
  };

  return {
    values,
    errors,
    touched,
    handleChange,
    handleBlur,
    handleSubmit,
    reset
  };
}
