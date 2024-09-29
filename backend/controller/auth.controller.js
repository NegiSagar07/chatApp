import User from '../models/user.models.js';
import bcrypt from 'bcryptjs';



export const signup = async (req, res) => {
  const { name, email, password, gender } = req.body;
  try {

    const username = await User.findOne({name});
    if(username) {
      return res.status(400).json({message: "username already exist"});
    }

    const hashedPassword = await bcrypt.hash(password, 10); // Hash the password before saving
    const boyProfilePic = `https://avatar.iran.liara.run/public/boy?username=${name}`;
    const girlProfilePic = `https://avatar.iran.liara.run/public/girl?username=${name}`;

    const newuser = new User({ name, email, password: hashedPassword, gender, profilePic : gender === "male"? boyProfilePic : girlProfilePic});

    await newuser.save();

    res.status(201).json({ message: "User created successfully" });
    console.log({ name, email });
    
  } catch (error) {
    console.error("Error: ", error)
    res.status(500).json({ error: "Error creating user" });
  }
};



export const login = async (req, res) => {
  const {name, password} = req.body;
  try {
    const username = await User.findOne({name});
    if(!username) {
      return res.status(400).json({message : "invalid username or password"});
    }
    const isPasswordValid = await bcrypt.compare(password, username.password);
    if (!isPasswordValid) {
      return res.status(400).json({ message: "Invalid email or password" });
    }
    res.status(200).json({message : "login successfully"});
  } catch (error) {
    console.error("Error: ",error);
  }
};

export const logout = (req, res) => {
  console.log("User logged out");
  res.status(200).json({ message: "Logout successful" });
};
