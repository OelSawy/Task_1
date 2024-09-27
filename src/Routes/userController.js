// #Task route solution
const userModel = require('../Models/User.js');
const { default: mongoose } = require('mongoose');

const createUser = async (req, res) => {
   const { name, email, age } = req.body;

   try {
      // Check if the email already exists
      const existingUser = await userModel.findOne({ Email: email }); // Use capitalized Email
      if (existingUser) {
         return res.status(400).json({
            success: false,
            message: `User with email ${email} already exists`
         });
      }

      // Create a new user with capitalized fields
      const user = new userModel({ Name: name, Email: email, Age: age });

      // Save the new user
      await user.save();

      // Send success response
      res.status(201).json({
         success: true,
         message: `User created successfully: ${user}`,
         data: user // Sending back the created user object
      });
   } catch (err) {
      console.error('Error creating user:', err);

      // Send error response
      res.status(500).json({
         success: false,
         message: 'Error creating user',
         error: err.message
      });
   }
};


const getUsers = async (req, res) => {
   try {
      const users = await userModel.find();

      res.status(200).json({
         success: true,
         data: users
      });
   } catch (err) {
      console.error('Error fetching users:', err);

      res.status(500).json({
         success: false,
         message: 'Error fetching users',
         error: err.message
      });
   }
}


const updateUser = async (req, res) => {
   const { email, name, age } = req.body;

   try {
       const user = await userModel.findOne({ Email: email });
       if (!user) {
           return res.status(404).json({
               success: false,
               message: `User with email ${email} not found`
           });
       }

       const updateData = {};
       if (name) {
           updateData.Name = name;
       }
       if (age) {
           updateData.Age = age;
       }

       const updatedUser = await userModel.findOneAndUpdate(
           { Email: email },
           updateData,
           { new: true, runValidators: true }
       );

       res.status(200).json({
           success: true,
           message: 'User updated successfully',
           data: updatedUser
       });
   } catch (err) {
       console.error('Error updating user:', err);

       res.status(500).json({
           success: false,
           message: 'Error updating user',
           error: err.message
       });
   }
};

const deleteUser = async (req, res) => {
   const { name } = req.body;

   try {
      const result = await userModel.deleteOne({ "Name": name });

      if (result.deletedCount === 0) {
         return res.status(404).json({
            success: false,
            message: `No user found with name: ${name}`,
         });
      }

      res.status(200).json({
         success: true,
         data: 'User Deleted'
      });
      
   } catch (err) {
      console.error('Error deleting user:', err);

      res.status(500).json({
         success: false,
         message: 'Error deleting user',
         error: err.message
      });
   }
}


module.exports = { createUser, getUsers, updateUser, deleteUser };
