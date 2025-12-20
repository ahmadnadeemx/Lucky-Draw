export const formatEmail = (email) => {
  return email.trim().toLowerCase();
};

export const isValidEmail = (email) => {
  const emailRegex = /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/;
  return emailRegex.test(email);
};

export const formatMobileNumber = (value) => {
  value = value.replace(/\D/g, "");
  if (value.length > 11) {
    value = value.slice(0, 11);
  }
  if (value.length > 4) {
    value = `${value.slice(0, 4)}-${value.slice(4)}`;
  }
  return value;
};

export const isValidMobileNumber = (no) => {
    return no.length === 12;
  };
  

export function formatCNIC(value) {
  value = value.replace(/\D/g, "");
  if (value.length > 13) {
    value = value.slice(0, 13);
  }
  if (value.length > 5 && value.length <= 12) {
    value = `${value.slice(0, 5)}-${value.slice(5)}`;
  } else if (value.length > 12) {
    value = `${value.slice(0, 5)}-${value.slice(5, 12)}-${value.slice(12)}`;
  }
  return value;
}

export const isValidCNIC = (cnic) => {
  return cnic.length === 15;
};
