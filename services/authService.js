const userModel = require("../models/userModel");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");

const register =  async (userData) => {
  const userbody = {
    username: userData.username,
    fullName: userData.fullName,
    password: userData.password,
    status: 1,
    createdAt: new Date(),
    updatedAt: new Date(),
  };

   const checkUser = await userModel.getUserByUsername(userData.username);
  if (checkUser) {
    throw new Error("ተጠቃሚው ከዚህ በፊት ተመዝግቧል!!");
  }

  const hashedPassword = await bcrypt.hash(userbody.password, 8);
  userbody.password = hashedPassword;
  await userModel.createUser(userbody);
  delete userbody.password;
  return userbody;
}


const login = async (userData) => {
  const user = await userModel.getUserByUsername(userData.username);
  if (!user) {
    throw new Error("ተጠቃሚው አልተመዘገበም!!");
  }
  const isMatch = await bcrypt.compare(userData.password, user.password);
  if (!isMatch) {
    throw new Error("የይለፍ ቃል የተሳሳተ ነው!!");
  }
  const token = jwt.sign({ id: user.id }, process.env.JWT_SECRET, {
    expiresIn: "1d",
  });
  delete user.password;
  user.token = token;
  return user;
}

module.exports = {
  register,
  login,
};
