module.exports = function (requiredRole) {
  return (req, res, next) => {
    try {
      if (!req.user)
        return res
          .status(401)
          .json({ success: false, message: "Not authenticated" });
      const userRole = req.user.role;
      if (!requiredRole) return next();
      
      const roles = Array.isArray(requiredRole) ? requiredRole : [requiredRole];
      
      if (!roles.includes(userRole)) {
        return res.status(403).json({ success: false, message: "Forbidden: Access denied" });
      }
      next();
    } catch (err) {
      res.status(500).json({ success: false, message: "Server error" });
    }
  };
};
