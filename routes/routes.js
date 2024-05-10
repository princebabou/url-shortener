const express = require("express");
const router = express.Router();
const {
  ShortenUrl,
  getShortCode,
  getHistoryById,
} = require("../controllers/urlcontroller.js");

router.post("/shorten", ShortenUrl);

router.get("/:shortCode", getShortCode);

router.get("/user/:id", getHistoryById);

module.exports = router;
