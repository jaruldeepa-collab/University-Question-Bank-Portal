import validator from "validator";

export const validateRegister = (data) => {
  const errors = {};

  // Name
  if (!data.name || data.name.trim() === "") {
    errors.name = "Name is required";
  }

  // Email
  if (!data.email || data.email.trim() === "") {
    errors.email = "Email is required";
  } else if (!validator.isEmail(data.email)) {
    errors.email = "Please enter a valid email";
  }

  // Password
  if (!data.password) {
    errors.password = "Password is required";
  } else if (!validator.isLength(data.password, { min: 6 })) {
    errors.password = "Password must be at least 6 characters";
  }

  return {
    isValid: Object.keys(errors).length === 0,
    errors,
  };
};

export const validateLogin = (data) => {
  const errors = {};

  // Email
  if (!data.email || data.email.trim() === "") {
    errors.email = "Email is required";
  } else if (!validator.isEmail(data.email)) {
    errors.email = "Please enter a valid email";
  }

  // Password
  if (!data.password) {
    errors.password = "Password is required";
  }

  return {
    isValid: Object.keys(errors).length === 0,
    errors,
  };
};