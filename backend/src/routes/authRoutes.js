import { Router } from "express";
import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";
import prisma from "../config/prismaClient.js";
import sendEmail from "../utils/sendEmail.js";

const authRouter = Router();

// create the auth routes
//
// register

authRouter.post("/register", async (req, res) => {
  const { email, name, password, phone, role } = req.body;
  const hashedPassword = await bcrypt.hash(password, 10);
  try {
    const user = await prisma.user.create({
      data: {
        email,
        name,
        password: hashedPassword,
        phone,
        role,
      },
    });
    const token = jwt.sign(
      { id: user.id, role: user.role },
      process.env.JWT_SECRET,
      {
        expiresIn: "1h",
      },
    );
    const html = `
      <body style="font-family: Arial, sans-serif; margin: 0; padding: 0; background-color: #f4f4f4;">
        <div style="max-width: 600px; margin: 40px auto; background-color: #ffffff; padding: 30px; border-radius: 8px; box-shadow: 0 2px 8px rgba(0,0,0,0.1);">
          <h2 style="color: #1a73e8; font-size: 24px; margin-bottom: 20px;">Welcome to ShuttleX!</h2>

          <p style="font-size: 16px; color: #333333; margin: 12px 0;">Hi {{name}},</p>

          <p style="font-size: 16px; color: #333333; margin: 12px 0;">
            Thanks for signing up to <strong>ShuttleX</strong> — your trusted shuttle booking platform. We’re thrilled to have you on board!
          </p>

          <p style="font-size: 16px; color: #333333; margin: 12px 0;">
            With ShuttleX, you can:
          </p>

          <ul style="font-size: 16px; color: #333333; padding-left: 20px; margin: 12px 0;">
            <li>📅 Book shuttles easily from anywhere</li>
            <li>🧾 Receive instant email receipts</li>
            <li>💳 Pay quickly with MoMo</li>
            <li>📊 Access your booking history</li>
          </ul>

          <p style="font-size: 16px; color: #333333; margin-top: 24px;">
            To get started, click below:
          </p>

          <!-- Uncomment this section when you're ready to include the button -->
          <!--
          <p style="text-align: center; margin: 20px 0;">
            <a href="{{dashboard_url}}" style="background-color: #1a73e8; color: white; text-decoration: none; padding: 12px 24px; border-radius: 5px; display: inline-block; font-weight: bold;">
              Go to My Dashboard
            </a>
          </p>
          -->

          <p style="font-size: 16px; color: #333333; margin: 12px 0;">
            If you have any questions, feel free to reply to this email or contact our support team.
          </p>

          <p style="font-size: 16px; color: #333333; margin: 20px 0;">
            Happy riding!<br>
            — The ShuttleX Team
          </p>

          <div style="font-size: 12px; color: #888888; margin-top: 30px; text-align: center;">
            &copy; 2025 ShuttleX, All rights reserved.
          </div>
        </div>
      </body>

    `.replace("{{name}}", user.name);
    await sendEmail(email, "Welcome to Shuttle System", html);
    //  I will chceck this
    res.status(201).json({ token, user: { userId: user.id } });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Internal server error" });
  }
});

// login
authRouter.post("/login", async (req, res) => {
  const { email, password } = req.body;
  try {
    const user = await prisma.user.findUnique({
      where: {
        email,
      },
    });
    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }
    const isPasswordValid = await bcrypt.compare(password, user.password);
    if (!isPasswordValid) {
      return res.status(401).json({ message: "Invalid credentials" });
    }
    const token = jwt.sign(
      { id: user.id, role: user.role },
      process.env.JWT_SECRET,
      {
        expiresIn: "1h",
      },
    );
    res.status(200).json({ token, user: { userId: user.id } });
    console.log("User logged in successfully");
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Internal server error" });
  }
});

export default authRouter;
