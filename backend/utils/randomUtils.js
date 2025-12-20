exports.getRandomNumber = (min, max) => {
  if (min > max) throw new Error("Min value cannot be greater than max value");
  return Math.floor(Math.random() * (max - min + 1)) + min;
};

exports.getRandomFloat = (min, max) => {
  if (min > max) throw new Error("Min value cannot be greater than max value");
  return Math.random() * (max - min) + min;
};

exports.getRandomBoolean = () => Math.random() < 0.5;

exports.generateOTP = (length = 6) => {
  const digits = "0123456789";
  let otp = "";

  for (let i = 0; i < length; i++) {
    otp += digits[Math.floor(Math.random() * digits.length)];
  }

  return Number(otp);
};
