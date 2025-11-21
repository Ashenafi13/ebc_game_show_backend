const authService = require("../services/authService");

const login = async (req, res, next) => {
  try {
   
    const data = await authService.login(req.body);
    res.success(data, "success");
  } catch (error) {
    next(error);
  }
};

const register = async (req, res, next) => {
  try {
    const data = await authService.register(req.body);
    res.success(data, "success");
  } catch (error) {
    next(error);
  }
};

const getProfile = async (req, res, next) => {
  try {
    const userId = req.user.id;
    const data = await authService.getProfile(userId);
    res.success(data, "success");
  } catch (error) {
    next(error);
  }
};

module.exports = {
  login,
  register,
  getProfile
};
