import SignUp from './models/signup.models.js'; 


export const signup = async (req, res) => {
    const { name, email, password } = req.body;
  try {
    const newuser = new SignUp({ name, email, password });
    await newuser.save();
    res.status(201).json({ message: "User created successfully" });
    console.log({ name, email, password });
  } catch (error) {
    console.error("Error: ", error);
    res.status(500).json({ error: "Error creating user" });
  }
}


export const login = (req, res) => {
    console.log("user login");
}


export const logout = (req, res) => {
    console.log("logout user");
}