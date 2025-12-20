export const generateRandomString = (length = 8) => {
  const characters =
    "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789";
  let result = "";
  for (let i = 0; i < length; i++) {
    result += characters.charAt(Math.floor(Math.random() * characters?.length));
  }
  return result;
};

export const removeExtraSpaces = (str) => {
  return str.replace(/\s+/g, " ").trim();
};

export const contains = (str, search) => {
  return str.toLowerCase().includes(search.toLowerCase());
};

export const truncate = (str, maxLength) => {
  if (str?.length > maxLength) {
    return str.slice(0, maxLength) + "...";
  }
  return str;
};

// Capitalize the first letter of each word
export const capitalizeWords = (str) => {
  if (!str) return "";
  return str
    .split(" ")
    .map((word) => word.charAt(0).toUpperCase() + word.slice(1).toLowerCase())
    .join(" ");
};




export function camelToReadable(text) {
  return text.replace(/([a-z])([A-Z])/g, '$1 $2').replace(/^./, str => str.toUpperCase());
}