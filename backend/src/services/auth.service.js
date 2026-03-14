// backend/src/services/auth.service.js
const userRepo = require("../repositories/user.repo");
const { hashPassword, comparePassword } = require("../utils/hash");
const { signToken } = require("../config/jwt");

exports.register = async (data) => {
  // Check if user already exists
  const existing = await userRepo.findByEmail(data.email);
  if (existing) {
    throw new Error("User already exists with this email");
  }

  // Hash the password
  const hashed = await hashPassword(data.password);

  // Create the user with default role "user"
  await userRepo.create({
    name: data.name,
    email: data.email,
    password: hashed,
    role: data.role || "user",
  });

  return true;
};

exports.login = async (data) => {
  // Find user by email
  const user = await userRepo.findByEmail(data.email);
  if (!user) throw new Error("User not found");

  // Compare passwords
  const valid = await comparePassword(data.password, user.password);
  if (!valid) throw new Error("Wrong password");

  // Generate JWT token
  const token = signToken({
    id: user.id,
    name: user.name,
    email: user.email,
    role: user.role,
  });

  return token;
};
