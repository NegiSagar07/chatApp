import Signup from '../models/signup.models.js';
import bcrypt from 'bcryptjs';

export const signup = async (req, res) => {
  const { name, email, password } = req.body;
  try {
    const hashedPassword = await bcrypt.hash(password, 10); // Hash the password before saving
    const newuser = new Signup({ name, email, password: hashedPassword });
    await newuser.save();
    res.status(201).json({ message: "User created successfully" });
    console.log({ name, email });
  } catch (error) {
    console.error("Error: ", error);
    res.status(500).json({ error: "Error creating user" });
  }
};

export const login = (req, res) => {
  console.log("User login");
  res.status(200).json({ message: "Login successful" });
};

export const logout = (req, res) => {
  console.log("User logged out");
  res.status(200).json({ message: "Logout successful" });
};
