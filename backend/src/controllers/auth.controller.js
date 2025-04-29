const authService = require("../services/auth.service");
const jwt = require("jsonwebtoken");
const nodemailer = require("nodemailer");

exports.register = async (req, res, next) => {
  try {
    await authService.register(req.body);
    res.status(201).json({ message: "User registered successfully" });
  } catch (error) {
    if (
      error.message === "Username already exists" ||
      error.message === "Email already exists"
    ) {
      return res.status(400).json({ message: error.message });
    }
    next(error);
  }
};

exports.login = async (req, res, next) => {
  try {
    const result = await authService.login(req.body);
    res.status(200).json(result);
  } catch (error) {
    if (error.message === "Invalid username or password") {
      console.error("Login error:", error);
      return res.status(401).json({ message: error.message });
    }
    next(error);
  }
};

exports.forgotPassword = async (req, res) => {
  try {
    const { email } = req.body;
    const user = await authService.findByEmail(email);

    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    const resetToken = jwt.sign({ email }, process.env.SG_JWT_SECRET, {
      expiresIn: "1h",
    });

    const transporter = nodemailer.createTransport({
      host: "smtp.sendgrid.net",
      port: 587,
      auth: {
        user: "apikey",
        pass: process.env.SG_KEY,
      },
    });

    const resetUrl = `${process.env.APP_URL}/change-password?token=${resetToken}`;

    const mailOptions = {
      from: process.env.EMAIL_FROM,
      to: email,
      subject: "Password Reset Request - 日本語 Vocabulary Builder",
      html: `
        <!DOCTYPE html>
        <html lang="en">
        <head>
          <meta charset="UTF-8">
          <meta name="viewport" content="width=device-width, initial-scale=1.0">
          <title>Password Reset</title>
          <style>
            body, html {
              margin: 0;
              padding: 0;
              font-family: 'Helvetica Neue', Helvetica, Arial, sans-serif;
              color: #333333;
              line-height: 1.6;
            }
            .container {
              max-width: 600px;
              margin: 0 auto;
              padding: 20px;
              background-color: #ffffff;
            }
            .header {
              text-align: center;
              padding: 20px 0;
              border-bottom: 1px solid #f0f0f0;
            }
            .logo {
              font-size: 24px;
              font-weight: bold;
              color: #2563eb;
              margin-bottom: 5px;
            }
            .logo span {
              color: #333333;
            }
            .content {
              padding: 30px 20px;
              background-color: #ffffff;
            }
            .title {
              font-size: 22px;
              font-weight: bold;
              color: #333333;
              margin-bottom: 20px;
            }
            .message {
              font-size: 16px;
              margin-bottom: 30px;
            }
            .button {
              display: inline-block;
              padding: 14px 30px;
              background-color: #2563eb;
              color: #ffffff !important;
              text-decoration: none;
              border-radius: 6px;
              font-weight: bold;
              font-size: 16px;
              text-align: center;
              margin: 20px 0;
            }
            .button:hover {
              background-color: #1d4ed8;
            }
            .footer {
              padding: 20px;
              text-align: center;
              font-size: 14px;
              color: #666666;
              border-top: 1px solid #f0f0f0;
              margin-top: 20px;
            }
            .note {
              font-size: 14px;
              color: #666666;
              margin-top: 30px;
              padding-top: 20px;
              border-top: 1px solid #f0f0f0;
            }
            @media only screen and (max-width: 600px) {
              .container {
                width: 100% !important;
              }
              .content {
                padding: 20px 15px !important;
              }
              .button {
                display: block !important;
                width: 100% !important;
              }
            }
          </style>
        </head>
        <body>
          <div class="container">
            <div class="header">
              <div class="logo">日本語 <span>Vocabulary Builder</span></div>
              <div style="font-size: 14px; color: #666666;">Your Japanese Learning Companion</div>
            </div>
            
            <div class="content">
              <div class="title">Password Reset Request</div>
              
              <div class="message">
                <p>こんにちは ${user.username} さん,</p>
                <p>We received a request to reset your password for your 日本語 Vocabulary Builder account. To complete the process, please click the button below:</p>
              </div>
              
              <div style="text-align: center;">
                <a href="${resetUrl}" class="button">Reset My Password</a>
              </div>
              
              <div class="message">
                <p>If the button doesn't work, you can also copy and paste the following link into your browser:</p>
                <p style="word-break: break-all; font-size: 14px; color: #2563eb;">${resetUrl}</p>
              </div>
              
              <div class="note">
                <p>This link will expire in 1 hour for security reasons.</p>
                <p>If you didn't request a password reset, please ignore this email.</p>
              </div>
            </div>
            
            <div class="footer">
              <p>&copy; ${new Date().getFullYear()} 日本語 Vocabulary Builder. All rights reserved.</p>
              <p>This is an automated email, please do not reply.</p>
            </div>
          </div>
        </body>
        </html>
      `,
    };

    await transporter.sendMail(mailOptions);
    res.status(200).json({ message: "Password reset email sent" });
  } catch (error) {
    console.error("Password reset error:", error);
    res.status(500).json({ message: "Error sending reset email" });
  }
};

exports.changePassword = async (req, res) => {
  try {
    const { token } = req.query;
    const { newPassword } = req.body;

    const decoded = jwt.verify(token, process.env.SG_JWT_SECRET);
    const user = await authService.findByEmail(decoded.email);

    if (!user) {
      return res.status(400).json({ message: "Invalid token" });
    }
    user.password = newPassword;
    await user.save();

    res.status(200).json({ message: "Password updated successfully" });
  } catch (error) {
    console.error("Password change error:", error);
    if (error.name === "TokenExpiredError") {
      return res.status(400).json({ message: "Reset link expired" });
    }
    res.status(400).json({ message: "Invalid token" });
  }
};
