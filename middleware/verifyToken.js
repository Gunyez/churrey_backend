import jwt from "jsonwebtoken";

export const verifyToken = (req, res, next) => {

  let token;

  // ✅ First check cookie
  if (req.cookies.access_token) {
    token = req.cookies.access_token;
  }

  // ✅ Then check Authorization header
  if (
    req.headers.authorization &&
    req.headers.authorization.startsWith("Bearer ")
  ) {
    token = req.headers.authorization.split(" ")[1];
  }

  if (!token) {
    return res.status(401).json("Not authenticated");
  }

  jwt.verify(token, process.env.JWT_SECRET, (err, user) => {

    if (err) {
      return res.status(403).json("Token invalid");
    }

    req.user = user;

    next();
  });
};

export const verifyUser = (req, res, next) => {

  verifyToken(req, res, () => {

    if (
      req.user.id === req.params.id ||
      req.user.isAdmin
    ) {
      next();
    } else {
      return res.status(403).json("Not authorized");
    }

  });
};

export const verifyAdmin = (req, res, next) => {

  verifyToken(req, res, () => {

    if (req.user.isAdmin) {
      next();
    } else {
      return res.status(403).json("Admin only");
    }

  });
};