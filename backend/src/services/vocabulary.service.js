const User = require("../models/user.model");

exports.getAllVocabulary = async (userId) => {
  const user = await User.findById(userId);
  if (!user) {
    throw new Error("User not found");
  }

  return user.vocabulary;
};

exports.addVocabulary = async (userId, vocabularyData) => {
  if (!vocabularyData.word || !vocabularyData.word.trim()) {
    throw new Error("Word is required");
  }

  const user = await User.findById(userId);
  if (!user) {
    throw new Error("User not found");
  }

  user.vocabulary.push(vocabularyData);
  await user.save();

  return user.vocabulary[user.vocabulary.length - 1];
};

exports.updateVocabulary = async (userId, vocabularyId, vocabularyData) => {
  if (!vocabularyData.word || !vocabularyData.word.trim()) {
    throw new Error("Word is required");
  }

  const user = await User.findById(userId);
  if (!user) {
    throw new Error("User not found");
  }

  const vocabIndex = user.vocabulary.findIndex(
    (v) => v._id.toString() === vocabularyId
  );
  if (vocabIndex === -1) {
    throw new Error("Vocabulary not found");
  }

  user.vocabulary[vocabIndex] = {
    ...user.vocabulary[vocabIndex].toObject(),
    ...vocabularyData,
  };

  await user.save();
  return user.vocabulary[vocabIndex];
};

exports.deleteVocabulary = async (userId, vocabularyId) => {
  const user = await User.findById(userId);
  if (!user) {
    throw new Error("User not found");
  }

  const vocabIndex = user.vocabulary.findIndex(
    (v) => v._id.toString() === vocabularyId
  );
  if (vocabIndex === -1) {
    throw new Error("Vocabulary not found");
  }

  user.vocabulary.splice(vocabIndex, 1);
  await user.save();

  return { message: "Vocabulary deleted successfully" };
};
