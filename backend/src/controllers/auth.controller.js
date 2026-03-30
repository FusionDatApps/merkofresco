const { registerUser, loginUser } = require("../services/auth.service");
const { registerSchema, loginSchema } = require("../validators/auth.validator");

const register = async (req, res, next) => {
  try {
    const validatedData = registerSchema.parse(req.body);

    const user = await registerUser(validatedData);

    return res.status(201).json({
      ok: true,
      data: user,
    });
  } catch (error) {
    next(error);
  }
};

const login = async (req, res, next) => {
  try {
    const validatedData = loginSchema.parse(req.body);

    const result = await loginUser(validatedData);

    return res.status(200).json({
      ok: true,
      data: result,
    });
  } catch (error) {
    next(error);
  }
};

module.exports = {
  register,
  login,
};