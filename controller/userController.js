import { userInfoModel, userModel } from "../postgres/postgres.js";
import jwtGenerator from "../utils/jwtGenerator.js";

import bcrypt from "bcrypt";

export const getAllEmp = async (req, res) => {
  try {
    const users = await userModel.findAll();

    if (users.length === 0) {
      return res.status(404).json({ message: "No employees found." });
    }
    return res.status(200).json(users);
  } catch (error) {
    console.error(error);
    return res.status(500).json({ error: "Internal Server Error" });
  }
};

export const addEmp = async (req, res) => {
  try {
    const { name, email, designation, empId } = req.body;

    if (empId != null) {
      // Check if the employee with the provided empId already exists
      const existingUser = await userModel.findOne({ where: { empId: empId } });
      if (existingUser) {
        return res
          .status(409)
          .json({ message: "Employee with this ID already exists." });
      } else {
        // Create the new employee since it doesn't already exist
        const newEmployee = await userModel.create({
          name,
          email,
          designation,
          empId,
        });
        return res.status(201).json(newEmployee);
      }
    }
  } catch (error) {
    console.error(error);
    return res.status(500).json({ error: "Internal Server Error" });
  }
};

export const getById = async (req, res) => {
  try {
    const id = req.params.id;
    const user = await userModel.findOne({ where: { id: id } });
    if (!user) {
      return res.status(404).json({ message: "Employee not found." });
    }
    return res.status(200).json(user);
  } catch (error) {
    console.error(error);
    return res.status(500).json({ error: "Internal Server Error" });
  }
};

export const updateEmp = async (req, res) => {
  try {
    const id = req.params.id;
    const { name, email, designation } = req.body;
    const updateEmployee = await userModel.update(
      { name, email, designation },
      { where: { id } }
    );
    if (!updateEmployee) {
      return res.status(404).json({ message: "Employee not found." });
    }
    return res.status(200).json(updateEmployee[0]);
  } catch (error) {
    console.error(error);
    return res.status(500).json({ error: "Internal Server Error" });
  }
};

export const deleteEmp = async (req, res) => {
  try {
    const id = req.params.id;
    const deletedCount = await userModel.destroy({ where: { id } });

    if (!deletedCount) {
      return res.status(404).json({ message: "Employee not found." });
    }
    return res.status(200).json({ message: "Employee deleted successfully." });
  } catch (error) {
    console.error(error);
    return res.status(500).json({ error: "Internal Server Error" });
  }
};

export const userRegister = async (req, res) => {
  try {
    const { name, email, password } = req.body;

    // Check if user already exists
    const userExists = await userInfoModel.findOne({
      where: { user_email: email },
    });
    if (userExists) {
      return res.status(400).json({ message: "User already exists" });
    }

    // Hash password
    const saltRound = 10;
    const bcryptPassword = await bcrypt.hash(password, saltRound);

    // Create user
    const newUser = await userInfoModel.create({
      user_name: name,
      user_email: email,
      user_password: bcryptPassword,
    });

    // Generate JWT token
    const token = jwtGenerator(newUser.user_id);

    res.json({ token });
  } catch (err) {
    console.error(err.message);
    res.status(500).send("Server Error");
  }
};

export const userLogin = async (req, res) => {
  try {
    const { email, password } = req.body;

    // Find user by email
    const user = await userInfoModel.findOne({ where: { user_email: email } });

    // If user not found, return unauthorized
    if (!user) {
      return res.status(401).json("Password or Email is incorrect");
    }

    // Check if the provided password matches the hashed password in the database
    const validPassword = await bcrypt.compare(password, user.user_password);

    // If passwords don't match, return unauthorized
    if (!validPassword) {
      return res.status(401).json("Password or Email is incorrect");
    }

    // Generate JWT token
    const token = jwtGenerator(user.user_id);

    // Return token as response
    res.json({ token });
  } catch (err) {
    console.error(err.message);
    res.status(500).send("Server Error");
  }
};

export const updatePassword = async (req, res) => {
  try {
    const { id } = req.params;
    const { currentPassword, newPassword } = req.body;

    // Find the user by ID
    const user = await userInfoModel.findByPk(id);

    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    // Check if the current password matches the password in the database
    const validPassword = await bcrypt.compare(
      currentPassword,
      user.user_password
    );

    // If passwords don't match, return unauthorized
    if (!validPassword) {
      return res.status(401).json({ message: "password is incorrect" });
    }

    // Hash the new password
    const hashedPassword = await bcrypt.hash(newPassword, 10);

    // Update user's password in the database
    await user.update({ user_password: hashedPassword });
    return res.status(200).json(updateEmployee[0]);

    // res.status(200).json({ message: "Password updated successfully" });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "Internal Server Error" });
  }
};

export const updateProfile = async (req, res) => {
  try {
    const { id } = req.params;
    const { user_name, user_email } = req.body;

    const updateUserProfile = await userInfoModel.update(
      { user_name, user_email },
      { where: { user_id: id } }
    );

    if (!updateUserProfile) {
      return res.status(404).json({ message: "User not found." });
    }
    return res.status(200).json({ message: "Profile updated successfully." });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "Internal Server Error" });
  }
};
