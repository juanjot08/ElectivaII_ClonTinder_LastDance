import "reflect-metadata";
import { container } from "tsyringe";
import { AuthService } from "../../src/application/services/auth.service";
import { IIdentityRepository } from "../../src/application/interfaces/infrastructure/identity.repository.interface";
import { IUsersService } from "../../src/application/interfaces/services/users.service.interface";
import { Identity } from "../../src/domain/entities/identity";
import { Ok, Err } from "ts-results-es";
import { TYPES } from "../../src/application/dependencyInjection/container.types";
import { CryptUtils } from "../../src/domain/cryptography/crypt.utils";
import jwt from "jsonwebtoken";
import appsettings from "../../src/appsettings.json";
import { ICreateIdentityUserRequestDTO } from "../../src/application/interfaces/dtos/identity/serviceRequest/createIdentityUser.request";
import { ILoginRequestDTO } from "../../src/application/interfaces/dtos/identity/serviceRequest/login.request";
import { ILoginResponseDTO } from "../../src/application/interfaces/dtos/identity/serviceResponse/login.response";
import { IUserResponseDTO } from "../../src/application/interfaces/dtos/users/serviceResponse/user.response";
import { User } from "../../src/domain/entities/user";
import { Id } from "../../src/domain/valueObjects/id";

const mockIdentityRepository: jest.Mocked<IIdentityRepository> = {
  createIdentityUser: jest.fn(),
  findIdentityUserByEmail: jest.fn(),
} as any;

const mockUsersService: jest.Mocked<IUsersService> = {
  createInitialProfile: jest.fn(),
  getUserByIdentityId: jest.fn(),
} as any;

let authService: AuthService;

const assignedWorkerId = parseInt(process.env.WORKER_ID || '0', 10);
Id.configure({ workerId: assignedWorkerId });

beforeEach(() => {
  jest.clearAllMocks();

  container.registerInstance(TYPES.IIdentityRepository, mockIdentityRepository);
  container.registerInstance(TYPES.IUserService, mockUsersService);

  authService = container.resolve(AuthService);
});

describe("createIdentityUser", () => {
  it("should create a new identity user and return Ok", async () => {
    // Arrange
    const identityRequest: ICreateIdentityUserRequestDTO = {
      email: "test@example.com",
      password: "password123",
      authProvider: "local",
    };

		const mockUser = new User(123n);
		const mockResponseUser = new IUserResponseDTO(mockUser);

    mockIdentityRepository.findIdentityUserByEmail.mockResolvedValueOnce(null);
    mockUsersService.createInitialProfile.mockResolvedValueOnce(Ok(mockResponseUser));

    // Act
    const result = await authService.createIdentityUser(identityRequest);

    // Assert
    expect(result).toBeInstanceOf(Ok);
    expect(result.unwrap()).toBe("Identity created successfully");
    expect(mockIdentityRepository.createIdentityUser).toHaveBeenCalledWith(
      expect.objectContaining({
        email: identityRequest.email,
        authProvider: identityRequest.authProvider,
      })
    );
    expect(mockUsersService.createInitialProfile).toHaveBeenCalled();
  });

  it("should return Err if the identity already exists", async () => {
    // Arrange
    const identityRequest: ICreateIdentityUserRequestDTO = {
      email: "test@example.com",
      password: "password123",
      authProvider: "local",
    };

    const existingIdentity = new Identity(identityRequest.email, "hashedPassword", identityRequest.authProvider);
    mockIdentityRepository.findIdentityUserByEmail.mockResolvedValueOnce(existingIdentity);

    // Act
    const result = await authService.createIdentityUser(identityRequest);

    // Assert
    expect(result).toBeInstanceOf(Err);
    expect(result.unwrapErr()).toBe("Identity already exists");
  });
});

describe("validateIdentityUser", () => {
  it("should validate the user and return a token", async () => {
    // Arrange
    const loginRequest: ILoginRequestDTO = {
      email: "test@example.com",
      password: "password123",
    };

    const identity = new Identity(loginRequest.email, CryptUtils.hashPassword(loginRequest.password), "local");
    const mockUser = new User(123n);


    mockIdentityRepository.findIdentityUserByEmail.mockResolvedValueOnce(identity);
    mockUsersService.getUserByIdentityId.mockResolvedValueOnce(Ok(mockUser));
    jest.spyOn(jwt, "sign").mockImplementation(() => "mockedToken");

    // Act
    const result = await authService.validateIdentityUser(loginRequest);

    // Assert
    expect(result).toBeInstanceOf(Ok);
    expect(result.unwrap()).toEqual({ token: "mockedToken" });
    expect(mockIdentityRepository.findIdentityUserByEmail).toHaveBeenCalledWith(loginRequest.email);
    expect(mockUsersService.getUserByIdentityId).toHaveBeenCalledWith(identity.id);
  });

  it("should return Err if the identity user is not found", async () => {
    // Arrange
    const loginRequest: ILoginRequestDTO = {
      email: "test@example.com",
      password: "password123",
    };

    mockIdentityRepository.findIdentityUserByEmail.mockResolvedValueOnce(null);

    // Act
    const result = await authService.validateIdentityUser(loginRequest);

    // Assert
    expect(result).toBeInstanceOf(Err);
    expect(result.unwrapErr()).toBe("User not found");
  });

  it("should return Err if the password is invalid", async () => {
    // Arrange
    const loginRequest: ILoginRequestDTO = {
      email: "test@example.com",
      password: "wrongPassword",
    };

		const mockUser = new User(123n);

    const identity = new Identity(loginRequest.email, CryptUtils.hashPassword("password123"), "local");
    mockIdentityRepository.findIdentityUserByEmail.mockResolvedValueOnce(identity);
		mockUsersService.getUserByIdentityId.mockResolvedValueOnce(Ok(mockUser));

    // Act
    const result = await authService.validateIdentityUser(loginRequest);

    // Assert
    expect(result).toBeInstanceOf(Err);
    expect(result.unwrapErr()).toBe("Invalid password");
  });
});

describe("findIdentityUserByEmail", () => {
  it("should return the identity user if found", async () => {
    // Arrange
    const email = "test@example.com";
    const identity = new Identity(email, "hashedPassword", "local");

    mockIdentityRepository.findIdentityUserByEmail.mockResolvedValueOnce(identity);

    // Act
    const result = await authService.findIdentityUserByEmail(email);

    // Assert
    expect(result).toBeInstanceOf(Ok);
    expect(result.unwrap()).toEqual(identity);
    expect(mockIdentityRepository.findIdentityUserByEmail).toHaveBeenCalledWith(email);
  });

  it("should return Err if the identity user is not found", async () => {
    // Arrange
    const email = "test@example.com";

    mockIdentityRepository.findIdentityUserByEmail.mockResolvedValueOnce(null);

    // Act
    const result = await authService.findIdentityUserByEmail(email);

    // Assert
    expect(result).toBeInstanceOf(Err);
    expect(result.unwrapErr()).toBe("User not found");
  });
});

describe("validateToken", () => {
  it("should validate a token and return the userId", () => {
    // Arrange
    const token = "validToken";
    const decoded = { userId: 123n };
    jest.spyOn(jwt, "verify").mockImplementation(() => decoded);

    // Act
    const result = authService.validateToken(token);

    // Assert
    expect(result).toBeInstanceOf(Ok);
    expect(result.unwrap()).toBe(decoded.userId);
    expect(jwt.verify).toHaveBeenCalledWith(token, appsettings.auth.jwtsecret);
  });

  it("should return Err if the token is invalid", () => {
    // Arrange
    const token = "invalidToken";
    jest.spyOn(jwt, "verify").mockImplementation(() => {
      throw new Error("Invalid token");
    });

    // Act
    const result = authService.validateToken(token);

    // Assert
    expect(result).toBeInstanceOf(Err);
    expect(result.unwrapErr()).toContain("Invalid token");
  });
});