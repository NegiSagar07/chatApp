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
    
  } catch (error) {
    console.error("Error: ", error)
    res.status(500).json({ error: "Error creating user" });
  }
};

export const login = async (req, res) => {
  const {name, password} = req.body;
  try {
    const user = await User.findOne({name});
    if(!user) {
      return res.status(400).json({message : "invalid username or password"});
    }
    const isPasswordValid = await bcrypt.compare(password, user.password);
    if (!isPasswordValid) {
      return res.status(400).json({ message: "Invalid email or password"});
    }
    res.status(200).json({message : "login successfully", user});
  } catch (error) {
    console.error("Error: ",error);
  }
};

export const logout = (req, res) => {
  console.log("User logged out");
  res.status(200).json({ message: "Logout successful" });
};

export const friends = async(req, res)=>{
  const { username } = req.body;
  try {
    const user = await User.findOne({ name: username }).populate('friends');
    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }
    res.status(200).json(user.friends);
  } catch (error) {
    console.error('Error fetching friends:', error);
    res.status(500).json({ message: 'Server error' });
  }
}

export const searchResults = async(req, res)=>{
  const { searchTerm } = req.body;
  if(!searchTerm){
    return res.status(400).json({ message: 'search Term is required for the searches...' });
  }
  try {
    const userslist = await User.find({name: {$regex: searchTerm, $options:'i' }
    });
    return res.status(200).json({ userslist });
  } catch (error) {
    console.error('error fetching search results..');
    res.status(500).json({message: 'server error'});
  }
}

export const addFriend = async(req, res) =>{
  const { newFriend, userId } = req.body;
  try {
    const user = await User.findByIdAndUpdate(
      userId,
      { $addToSet: { friends: newFriend } },
      { new: true }
    );
    res.status(200).json({message: "friend added successfully", user});
    
  } catch (error) {
    console.error("error adding friend.");
    res.status(500).json({message:'server error!'});    
  } 
}