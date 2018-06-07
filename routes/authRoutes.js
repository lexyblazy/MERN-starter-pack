const router = require("express").Router();
const passport = require("passport");
const { logout } = require("../controllers/authControllers");

router.get("/auth/twitter", passport.authenticate("twitter"));

router.get(
  "/auth/twitter/callback",
  passport.authenticate("twitter", { failureRedirect: "/api" }),
  (req, res) => {
    // Successful authentication, redirect home.
    res.redirect("/");
  }
);
router.get(
  "/auth/google",
  passport.authenticate("google", { scope: ["profile", "email"] })
);
router.get(
  "/auth/google/callback",
  passport.authenticate("google", {
    failureRedirect: "back",
    successRedirect: ""
  }),
  (req, res) => {
    res.redirect("/");
  }
);
// fetch the current user
router.get("/api/current_user", (req, res) => {
  res.send(req.user);
});

router.get("/api/logout", logout);

module.exports = router;
