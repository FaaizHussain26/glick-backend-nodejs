import { FilterQuery, UpdateQuery } from "mongoose";
import User from "../database/models/users";

export const createUser = async (data: {
  firstName: string;
  lastName: string;
  email: string;
  extraData?: Record<string, any>;
}) => {
  const user = new User(data);
  return await user.save();
};

export const getUserById = async (id: string) => User.findById(id);

export const getUsers = async (
  filter: FilterQuery<typeof User> = {},
  limit = 50,
  skip = 0
) => User.find(filter).limit(limit).skip(skip);

export const deleteUser = async (id: string) => User.findByIdAndDelete(id);
