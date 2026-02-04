import {
  User,
  CreateUserDTO,
  UpdateUserDTO,
  UserResponse,
  UserRole,
} from "../models/user.model";

class UserService {
  private users: User[] = [
    {
      id: 1,
      email: "admin@taskmaster.com",
      password: "hashed_password_1",
      firstName: "Admin",
      lastName: "User",
      role: UserRole.ADMIN,
      isActive: true,
      createdAt: new Date("2026-01-01"),
      updatedAt: new Date("2026-01-01"),
    },
    {
      id: 2,
      email: "manager@taskmaster.com",
      password: "hashed_password_2",
      firstName: "Manager",
      lastName: "User",
      role: UserRole.MANAGER,
      isActive: true,
      createdAt: new Date("2026-01-15"),
      updatedAt: new Date("2026-01-15"),
    },
    {
      id: 3,
      email: "member@taskmaster.com",
      password: "hashed_password_3",
      firstName: "Member",
      lastName: "User",
      role: UserRole.MEMBER,
      isActive: true,
      createdAt: new Date("2026-02-01"),
      updatedAt: new Date("2026-02-01"),
    },
  ];

  private nextId = 4;

  public async getAllUsers(): Promise<UserResponse[]> {
    return this.users.map(this.toUserResponse);
  }

  public async getUserById(id: number): Promise<UserResponse | null> {
    const user = this.users.find((u) => u.id === id);
    return user ? this.toUserResponse(user) : null;
  }

  public async getUserByEmail(email: string): Promise<User | null> {
    const user = this.users.find((u) => u.email === email);
    return user || null;
  }

  public async createUser(data: CreateUserDTO): Promise<UserResponse> {
    const existingUser = await this.getUserByEmail(data.email);

    if (existingUser) {
      throw new Error("User with this email already exists");
    }

    const newUser: User = {
      id: this.nextId++,
      email: data.email,
      password: data.password,
      firstName: data.firstName,
      lastName: data.lastName,
      role: data.role || UserRole.MANAGER,
      isActive: true,
      createdAt: new Date(),
      updatedAt: new Date(),
    };
    this.users.push(newUser);
    return this.toUserResponse(newUser);
  }

  public async updateUser(
    id: number,
    data: UpdateUserDTO,
  ): Promise<UserResponse | null> {
    const userIndex = this.users.findIndex((u) => u.id === id);

    if (userIndex === -1) {
      return null;
    }

    this.users[userIndex] = {
      ...this.users[userIndex],
      ...data,
      updatedAt: new Date(),
    };
    return this.toUserResponse(this.users[userIndex]);
  }

  public async deleteUser(id: number): Promise<boolean> {
    const userIndex = this.users.findIndex((u) => u.id === id);

    if (userIndex === -1) {
      return false;
    }

    this.users[userIndex].isActive = false;
    this.users[userIndex].updatedAt = new Date();

    return true;
  }

  private toUserResponse(user: User): UserResponse {
    const { password, ...userWithoutPassword } = user;
    return userWithoutPassword;
  }
}

export const userService = new UserService();
