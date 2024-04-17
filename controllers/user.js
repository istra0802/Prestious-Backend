const User  = require("../models/user")

async function handleGetAllUsers(req,res) {
   
        const allDbUsers = await User.find({});
       
        return res.json(allDbUsers);
  
}

async function getUserById(req,res) {
    const user = await User.findById(req.params.id)
    if (!user) {
        return res.status(404).json({ message: " user not found " })
    }
    return res.json(user)
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
    console.log('insid e post req')
    const body = req.body;
    // console.log(body, " ======================== n")
    if (!body, !body.first_name) {
        return res.status(400).json({ message: "enter the first name " })
    }
    
    const result = await User({
        firstName: body.first_name,
        lastName: body.last_name,
        email: body.email,
        gender: body.gender,
        jobTitle: body.job_title,

    })
    await result.save()
    console.log(result)
    return res.status(201).json({ message: " user created " })
}

module.exports = {
    handleGetAllUsers,
    getUserById,
    updateUserById,
    deleteUserById,
    createNewUser,

}