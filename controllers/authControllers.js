// Ensure a user is logged in
exports.requireLogin = (req, res, next) => {
  if (!req.isAuthenticated() || !req.user) {
    return res.status(403).send({ error: "You have to login first" });
  }
  return next();
};

// Log a user out
exports.logout = (req, res) => {
  req.logout();
  res.redirect("/");
};
