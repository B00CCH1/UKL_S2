const adminMiddleware = (req, res, next) => {
  if (req.user?.role !== "ADMIN") {
    return res.status(403).json({
      message: "Access denied",
    });
  }

  return next();
};

export default adminMiddleware;
