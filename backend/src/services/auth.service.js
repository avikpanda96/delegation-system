
const userRepo = require("../repositories/user.repo");
const { hashPassword, comparePassword } = require("../utils/hash");
const { signToken } = require("../config/jwt");

exports.register = async (data) => {
  const hash = await hashPassword(data.password);

  await userRepo.createUser(
    data.name,
    data.email,
    hash,
    "user"
  );
};

exports.login = async (data) => {
  
  const user = await userRepo.findByEmail(data.email);

  if (!user) throw "User not found";

  const ok = await comparePassword(
    data.password,
    user.password
  );

  if (!ok) throw "Wrong password";

  const token = signToken({
    id: user.id,
    role: user.role,
  });

  return token;
};