import type { Request, Response } from "express";
import { userService } from "../services/user.service";
import { CreateUserDTO, UpdateUserDTO } from "../models/user.model";

class UserController {
  public async getAllUsers(req: Request, res: Response): Promise<void> {
    try {
      const users = await userService.getAllUsers();

      res.status(200).json({
        success: true,
        data: users,
        count: users.length,
      });
    } catch (error) {
      res.status(500).json({
        success: false,
        error: "Failed to fetch users",
        message: error instanceof Error ? error.message : "Unknown error",
      });
    }
  }

  public async getUserById(req: Request, res: Response): Promise<void> {
    try {
      const id = parseInt(req.params.id as string, 10);

      if (isNaN(id)) {
        res.status(400).json({
          success: false,
          error: "Invalid user ID",
        });
        return;
      }

      const user = await userService.getUserById(id);
      if (!user) {
        res.status(404).json({
          success: false,
          error: "User not found",
        });
        return;
      }

      res.status(200).json({
        success: true,
        data: user,
      });
    } catch (error) {
      res.status(500).json({
        success: false,
        error: "Failed to fetch user",
        message: error instanceof Error ? error.message : "Unknown error",
      });
    }
  }

  public async createUser(req: Request, res: Response): Promise<void> {
    try {
      const userData: CreateUserDTO = req.body;

      if (
        !userData.email ||
        !userData.password ||
        !userData.firstName ||
        !userData.lastName
      ) {
        res.status(400).json({
          success: false,
          error: "Missing required fields",
          required: ["email", "password", "firstName", "lastName"],
        });

        return;
      }

      const newUser = await userService.createUser(userData);

      res.status(201).json({
        success: true,
        data: newUser,
        message: "User created successfully",
      });
    } catch (error) {
      if (error instanceof Error && error.message.includes("already exists")) {
        res.status(409).json({
          success: false,
          error: error.message,
        });
        return;
      }

      res.status(500).json({
        success: false,
        error: "Failed to create user",
        message: error instanceof Error ? error.message : "Unknown error",
      });
    }
  }

  public async updatedUser(req: Request, res: Response): Promise<void> {
    try {
      const id = parseInt(req.params.id as string, 10);

      if (!isNaN(id)) {
        res.status(400).json({
          success: false,
          error: "Invalid user ID",
        });
        return;
      }

      const updateData: UpdateUserDTO = req.body;
      const updatedUser = await userService.updateUser(id, updateData);

      if (!updatedUser) {
        res.status(404).json({
          success: false,
          error: "User not found",
        });
        return;
      }

      res.status(200).json({
        success: true,
        data: updatedUser,
        message: "User updated successfully",
      });
    } catch (error) {
      res.status(500).json({
        success: false,
        error: "Faied to update user",
        message: error instanceof Error ? error.message : "Unknown error",
      });
    }
  }

  public async deleteUser(req: Request, res: Response): Promise<void> {
    try {
      const id = parseInt(req.params.id as string, 10);

      if (isNaN(id)) {
        res.status(400).json({
          success: false,
          error: "Invalid user ID",
        });
        return;
      }

      const deleted = await userService.deleteUser(id);

      if (!deleted) {
        res.status(404).json({
          success: false,
          error: "User not found",
        });
        return;
      }

      res.status(200).json({
        success: true,
        message: "User deleted successfully",
      });
    } catch (error) {
      res.status(500).json({
        success: false,
        error: "Failed to delete user",
        message: error instanceof Error ? error.message : "Unknown error",
      });
    }
  }
}

export const userController = new UserController();
