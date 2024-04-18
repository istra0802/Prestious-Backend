const User  = require("../models/user")

async function handleGetAllUsers(req,res) {
   
        const allDbUsers = await User.find({});
       
        return res.json(allDbUsers);
  
}

 
async function getUser(req, res) {
    try {
      const users = await User.find();
      console.log("userss",users)
      // Send the users as a JSON response
      const totalCount = await User.countDocuments(); // Get the total count of users
      
      // Set the X-Total-Count header in the response
      res.setHeader('X-Total-Count', totalCount);

      const formattedUsers = users.map(user => ({
        id: user._id.toString(), // Convert ObjectId to string
        ...user.toObject(), // Include other user fields
      }));
      
      res.json({ data: formattedUsers });
    } catch (error) {
      console.error('Error fetching user list:', error);
      res.status(500).json({ message: 'Internal Server Error' });
    }
  }
  
async function updateUserById(req, res) {
    const user = await User.findByIdAndUpdate(req.params.id, {lastName : "Changed" })

    if (!user) {
        return res.status(404).json({ message: " user not found " })
    }
    return res.status(200).json({ status: "success" })
}

async function deleteUserById(req, res) {
    const user = await User.findByIdAndDelete(req.params.id)

    if (!user) {
        return res.status(404).json({ message: " user not found " })
    }
    return res.status(200).json({ status: "success" })
}

async function createNewUser(req,res) {
    console.log('inside post req')  
    try{
        const {name, email, number, subject, message}=req.body;
        if (!name) {
            return res.status(400).json({ message: "enter the first name " })
        }
        const newUser = new User({
                name,
                number,
                email,
                subject,
                message,       
            })
            await newUser.save()
             return res.status(201).json({ message: "user created" })
    } catch (error) {
        console.error("An error occurred:", error);
        res.status(500).json({ message: "Internal Server Error" });
      }        
}

module.exports = {
    handleGetAllUsers,
    getUser,
    updateUserById,
    deleteUserById,
    createNewUser,
}