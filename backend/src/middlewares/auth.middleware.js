const jwt = require("jsonwebtoken");

const JWT_SECRET = process.env.JWT_SECRET;

if (!JWT_SECRET) {
  throw new Error("Falta la variable de entorno JWT_SECRET");
}

const requireAuth = (req, res, next) => {
  try {
    const authHeader = req.headers.authorization;

    if (!authHeader) {
      return res.status(401).json({
        ok: false,
        message: "Token requerido",
      });
    }

    const [scheme, token] = authHeader.split(" ");

    if (scheme !== "Bearer" || !token) {
      return res.status(401).json({
        ok: false,
        message: "Token inválido",
      });
    }

    const decoded = jwt.verify(token, JWT_SECRET);

    req.user = {
      userId: decoded.userId,
      role: decoded.role,
    };

    next();
  } catch (error) {
    return res.status(401).json({
      ok: false,
      message: "Token inválido o expirado",
    });
  }
};

const requireAdmin = (req, res, next) => {
  if (!req.user) {
    return res.status(401).json({
      ok: false,
      message: "Usuario no autenticado",
    });
  }

  if (req.user.role !== "ADMIN") {
    return res.status(403).json({
      ok: false,
      message: "Acceso no autorizado",
    });
  }

  next();
};

module.exports = {
  requireAuth,
  requireAdmin,
};