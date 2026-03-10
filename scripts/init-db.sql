-- Create profiles table for WhatsApp OTP authentication
CREATE TABLE IF NOT EXISTS profiles (
  id SERIAL PRIMARY KEY,
  phone_number VARCHAR(20) UNIQUE NOT NULL,
  otp_code VARCHAR(6),
  otp_expires_at TIMESTAMP,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Create index on phone_number for faster lookups
CREATE INDEX IF NOT EXISTS idx_profiles_phone ON profiles(phone_number);

-- Create index on otp_code for OTP verification
CREATE INDEX IF NOT EXISTS idx_profiles_otp ON profiles(otp_code);
