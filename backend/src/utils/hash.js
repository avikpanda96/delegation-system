
const bcrypt = require("bcrypt");

const hashPassword = async (password) => {
  return await bcrypt.hash(password, 10);
};

const comparePassword = async (pass, hash) => {
  return await bcrypt.compare(pass, hash);
};

module.exports = { hashPassword, comparePassword };