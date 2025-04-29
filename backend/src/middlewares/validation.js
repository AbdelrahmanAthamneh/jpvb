exports.validateRegister = (req, res, next) => {
  const { username, password, email } = req.body;
  const errors = {};

  if (!username || !username.trim()) {
    errors.username = "Username is required";
  } else if (username.length < 3) {
    errors.username = "Username must be at least 3 characters";
  }

  if (!email || !email.trim()) {
    errors.email = "Email is required";
  } else if (!/\S+@\S+\.\S+/.test(email)) {
    errors.email = "Email is invalid";
  }

  if (!password) {
    errors.password = "Password is required";
  } else if (password.length < 8) {
    errors.password = "Password must be at least 8 characters";
  }

  if (Object.keys(errors).length > 0) {
    return res.status(400).json({ message: "Validation failed", errors });
  }

  next();
};

exports.validateLogin = (req, res, next) => {
  const { username, password } = req.body;
  const errors = {};

  if (!username || !username.trim()) {
    errors.username = "Username or Email is required";
  }

  if (!password) {
    errors.password = "Password is required";
  }

  if (Object.keys(errors).length > 0) {
    return res.status(400).json({ message: "Validation failed", errors });
  }

  next();
};

exports.validateForgotPassword = (req, res, next) => {
  const { email } = req.body;
  const errors = {};

  if (!email || !email.trim()) {
    errors.email = "Email is required";
  } else if (!/\S+@\S+\.\S+/.test(email)) {
    errors.email = "Email is invalid";
  }

  if (Object.keys(errors).length > 0) {
    return res.status(400).json({ message: "Validation failed", errors });
  }

  next();
};

exports.validateChangePassword = (req, res, next) => {
  const { newPassword } = req.body;
  const errors = {};

  if (!newPassword) {
    errors.newPassword = "New password is required";
  } else if (newPassword.length < 8) {
    errors.newPassword = "Password must be at least 8 characters";
  }

  if (Object.keys(errors).length > 0) {
    return res.status(400).json({ message: "Validation failed", errors });
  }

  next();
};

exports.validateVocabulary = (req, res, next) => {
  const { word } = req.body;
  if (!word || !word.trim()) {
    return res.status(400).json({ message: "Word is required" });
  }
  next();
};
