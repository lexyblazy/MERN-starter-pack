const router = require("express").Router({ mergeParams: true });

router.get("/auth/twitter", (req, res) => {
  res.send("This will handle twitter authentication");
});

router.get("/auth/twitter/callback", (req, res) => {
  res.send("This will handle the callback");
});

module.exports = router;
