const vocabularyService = require("../services/vocabulary.service");

exports.getAllVocabulary = async (req, res, next) => {
  try {
    const vocabulary = await vocabularyService.getAllVocabulary(req.user.id);
    res.status(200).json(vocabulary);
  } catch (error) {
    next(error);
  }
};

exports.addVocabulary = async (req, res, next) => {
  try {
    const vocabulary = await vocabularyService.addVocabulary(
      req.user.id,
      req.body
    );
    res
      .status(201)
      .json({ message: "Vocabulary added successfully", vocabulary });
  } catch (error) {
    if (error.message === "Word is required") {
      return res.status(400).json({ message: error.message });
    }
    next(error);
  }
};

exports.updateVocabulary = async (req, res, next) => {
  try {
    const vocabulary = await vocabularyService.updateVocabulary(
      req.user.id,
      req.params.id,
      req.body
    );
    res
      .status(200)
      .json({ message: "Vocabulary updated successfully", vocabulary });
  } catch (error) {
    if (error.message === "Vocabulary not found") {
      return res.status(404).json({ message: error.message });
    }
    if (error.message === "Word is required") {
      return res.status(400).json({ message: error.message });
    }
    next(error);
  }
};

exports.deleteVocabulary = async (req, res, next) => {
  try {
    await vocabularyService.deleteVocabulary(req.user.id, req.params.id);
    res.status(200).json({ message: "Vocabulary deleted successfully" });
  } catch (error) {
    if (error.message === "Vocabulary not found") {
      return res.status(404).json({ message: error.message });
    }
    next(error);
  }
};
