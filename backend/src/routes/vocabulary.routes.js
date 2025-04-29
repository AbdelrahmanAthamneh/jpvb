const express = require("express");
const router = express.Router();
const vocabularyController = require("../controllers/vocabulary.controller");
const { authenticate } = require("../middlewares/auth");
const { validateVocabulary } = require("../middlewares/validation");

router.get("/", authenticate, vocabularyController.getAllVocabulary);

router.post(
  "/",
  authenticate,
  validateVocabulary,
  vocabularyController.addVocabulary
);

router.put(
  "/:id",
  authenticate,
  validateVocabulary,
  vocabularyController.updateVocabulary
);

router.delete("/:id", authenticate, vocabularyController.deleteVocabulary);

module.exports = router;
