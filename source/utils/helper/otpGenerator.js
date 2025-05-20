import crypto from 'crypto';

/**
 * Generate a secure random OTP
 * @param {number} length - The desired length of the OTP (default is 6 digits)
 * @returns {string} - The generated OTP as a string
 */
const generateOtp = (length = 6) => {
  if (length <= 0) {
    throw new Error('OTP length must be greater than 0');
  }

  // Generate a random number and ensure it's within the range of digits
  const otp = crypto.randomInt(0, Math.pow(10, length)).toString();

  // Pad the OTP with leading zeros if it's shorter than the desired length
  return otp.padStart(length, '0');
};


export default generateOtp;