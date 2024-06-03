import { User } from "../models/user";

const getAllUsers = async () => {
  return await User.findAll();
};

const createUser = async (userData: Partial<UserType>) => {
  return await User.create(userData);
};

export default { getAllUsers, createUser };
