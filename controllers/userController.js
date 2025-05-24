import User from "../models/user.js";
import TaskModel from "../models/Tasks.js";
import bcrypt from "bcrypt";

const getUserbyTask = async (req, res, next) => {
  const { id } = req.params;

  try {
    const task = await TaskModel.find({ assignee: id }).populate(
      'assignee',
      'lastName firstName email'
    );
    res.status(200).json(task);
  } catch (error) {
    next(error);
  }
};

const getAllUser = async (req, res, next) => {
  try {
    const user = await User.find();
    res.status(200).json(user);
  } catch (error) {
    next(error);
  }
};

const DeleteUser = async (req, res, next) => {
  const { id } = req.params;

  try {
    const user = await User.findByIdAndDelete(id);
    res.json({ message: 'user deleted successfully' });
  } catch (error) {
    next(error);
  }
};

const UpdateUser = async (req, res, next) => {
  const { id } = req.params;
  const updates = req.body;

  try {
    if (updates.password) {
      const salt = await bcrypt.genSalt(12);
      updates.password = await bcrypt.hash(updates.password, salt);
    }

    const updateUser = await User.findByIdAndUpdate(id, updates, {
      new: true,
      runValidators: true,
    });

    if (!updateUser) {
      res.status(404).json({ message: 'user not found' });
    }

    res.status(200).json({ message: "User updated successfully", user: updateUser });
  } catch (error) {
    next(error);
  }
};

export { getUserbyTask, DeleteUser, getAllUser, UpdateUser };
