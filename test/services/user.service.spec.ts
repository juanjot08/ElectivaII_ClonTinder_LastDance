import "reflect-metadata";
import { container } from "tsyringe";
import { UsersService } from "../../src/application/services/users.service";
import { IUsersRepository } from "../../src/application/interfaces/infrastructure/users.repository.interface";
import { IUserImagesRepository } from "../../src/application/interfaces/infrastructure/user.images.repository";
import { ISwipeService } from "../../src/application/interfaces/services/swipe.service.interface";
import { User } from "../../src/domain/entities/user";
import { Ok, Err } from "ts-results-es";
import { IUserResponseDTO } from "../../src/application/interfaces/dtos/users/serviceResponse/user.response";
import { TYPES } from "../../src/application/dependencyInjection/container.types";
import { Id } from "../../src/domain/valueObjects/id";
import { IUsePhotoRepositoryResponse } from "../../src/application/interfaces/dtos/users/repositoryResponse/createProfilePhoto.response";
import appsettings from "../../src/appsettings.json"
import { FindPotentialMatchesResult } from "../../src/application/interfaces/dtos/users/repositoryResponse/potentialMatches.response";
import { Swipe } from "../../src/domain/entities/swipe";
import { SwipeAction } from "../../src/domain/enumerables/swipeAction.enum";
import { UpdateUserDTO } from "../../src/application/interfaces/dtos/users/serviceRequest/updateuser.dto";
// Mocks de dependencias
const mockUsersRepository: jest.Mocked<IUsersRepository> = {
  createUser: jest.fn(),
  getUser: jest.fn(),
  updateUser: jest.fn(),
  getUserByIdentityId: jest.fn(),
  getPotentialMatches: jest.fn(),
} as any;

const mockUserImagesRepository: jest.Mocked<IUserImagesRepository> = {
  createProfilePhoto: jest.fn(),
  createAdditionalProfilePhoto: jest.fn(),
} as any;

const mockSwipeService: jest.Mocked<ISwipeService> = {
  getSwipeHistory: jest.fn(),
} as any;

let usersService: UsersService;

const assignedWorkerId = parseInt(process.env.WORKER_ID || '0', 10);
Id.configure({ workerId: assignedWorkerId });

beforeEach(() => {
	jest.clearAllMocks();

	container.registerInstance(TYPES.IUserRepository, mockUsersRepository);
	container.registerInstance(TYPES.IUserImagesRepository, mockUserImagesRepository);
	container.registerInstance(TYPES.ISwipeService, mockSwipeService);

	usersService = container.resolve(UsersService);
});

describe("createInitialProfile", () => {
  it("debería crear un usuario y devolver Ok(IUserResponseDTO)", async () => {
    // Arrange
    const identityId = 123n;
    const mockUser = new User(identityId);
    const mockResponse = new IUserResponseDTO(mockUser);

    mockUsersRepository.createUser.mockResolvedValueOnce(mockUser);

    // Act
    const result = await usersService.createInitialProfile(identityId);

    // Assert
    expect(result).toBeInstanceOf(Ok);
    expect(result.unwrap()).toStrictEqual(mockResponse);
    expect(mockUsersRepository.createUser).toHaveBeenCalledTimes(1);
  });
});

describe("updateProfilePhoto", () => {
  it("debería subir una foto de perfil y actualizar el usuario", async () => {
    // Arrange
    const userId = 123n;
    const mockFile = {} as Express.Multer.File;
    const mockUser = new User(123n);
    const mockUploadResult = { url: "https://example.com/photo.jpg", blobName: "test" } satisfies IUsePhotoRepositoryResponse;

    mockUsersRepository.getUser.mockResolvedValueOnce(mockUser);
    mockUserImagesRepository.createProfilePhoto.mockResolvedValueOnce(Ok(mockUploadResult));
    mockUsersRepository.updateUser.mockResolvedValueOnce(mockUser);

    // Act
    const result = await usersService.updateProfilePhoto(userId, mockFile);

    // Assert
    expect(result).toBeInstanceOf(Ok);
    expect(result.unwrap()).toBe("Profile photo uploaded successfully");
    expect(mockUserImagesRepository.createProfilePhoto).toHaveBeenCalledWith(userId, mockFile);
    expect(mockUsersRepository.updateUser).toHaveBeenCalledWith(userId, { profilePhoto: mockUploadResult.url });
  });

  it("debería devolver Err si el usuario no existe", async () => {
    // Arrange
    const userId = 123n;
    const mockFile = {} as Express.Multer.File;

    mockUsersRepository.getUser.mockResolvedValueOnce(null);

    // Act
    const result = await usersService.updateProfilePhoto(userId, mockFile);

    // Assert
    expect(result).toBeInstanceOf(Err);
    expect(result.unwrapErr()).toBe("User not found");
  });

	it("debería devolver Err si la carga de la foto falla", async () => {
	// Arrange
		const userId = 123n;
		const mockFile = {} as Express.Multer.File;
		const mockUser = new User(123n);

		mockUsersRepository.getUser.mockResolvedValueOnce(mockUser);
		mockUserImagesRepository.createProfilePhoto.mockResolvedValueOnce(Err("Upload failed"));

		// Act
		const result = await usersService.updateProfilePhoto(userId, mockFile);

		// Assert
		expect(result).toBeInstanceOf(Err);
		expect(result.unwrapErr()).toBe("Upload failed");
	});
});

describe("getPotentialMatches", () => {
  it("debería devolver matches potenciales", async () => {
    // Arrange
    const userId = 123n;
    const mockUser = new User(123n);
    mockUser.preferences = { minAge: 18, maxAge: 30, interestedInGender: "female", maxDistance: 50 };

    const mockSwipeHistory = [{ userId, targetUserId: 456n, swipeType: SwipeAction.LIKE, timestamp: new Date  }] satisfies Swipe[];
    const mockPotentialMatches: FindPotentialMatchesResult = {
      users: [new IUserResponseDTO(new User(789n))],
      nextCursor: { lastId: 789n },
    };

    mockUsersRepository.getUser.mockResolvedValueOnce(mockUser);
    mockSwipeService.getSwipeHistory.mockResolvedValueOnce(mockSwipeHistory);
    mockUsersRepository.getPotentialMatches.mockResolvedValueOnce(mockPotentialMatches);

    // Act
    const result = await usersService.getPotentialMatches(userId);

    // Assert
    expect(result).toBeInstanceOf(Ok);
    expect(result.unwrap()).toEqual(mockPotentialMatches);
    expect(mockUsersRepository.getPotentialMatches).toHaveBeenCalledWith(
      mockUser,
      [456n, userId],
      appsettings.businessRules.limitForPotentialMatches,
      undefined
    );
  });

  it("debería devolver Err si el usuario no tiene preferencias", async () => {
    // Arrange
    const userId = 123n;
    const mockUser = new User(123n);
    mockUser.preferences = undefined;

    mockUsersRepository.getUser.mockResolvedValueOnce(mockUser);

    // Act
    const result = await usersService.getPotentialMatches(userId);

    // Assert
    expect(result).toBeInstanceOf(Err);
    expect(result.unwrapErr()).toBe("User preferences not set");
  });

	it("should return Err if the user is not found", async () => {
    // Arrange
    const userId = 123n;

    mockUsersRepository.getUser.mockResolvedValueOnce(null);

    // Act
    const result = await usersService.getPotentialMatches(userId);

    // Assert
    expect(result).toBeInstanceOf(Err);
    expect(result.unwrapErr()).toBe("User not found");
    expect(mockUsersRepository.getUser).toHaveBeenCalledWith(userId);
  });

  it("should return Err if no potential matches are found", async () => {
    // Arrange
    const userId = 123n;
    const mockUser = new User(userId);
    mockUser.preferences = { minAge: 18, maxAge: 30, interestedInGender: "female", maxDistance: 50 };

    const mockSwipeHistory = [{ userId, targetUserId: 456n, swipeType: SwipeAction.LIKE, timestamp: new Date() }] satisfies Swipe[];
    const mockPotentialMatches: FindPotentialMatchesResult = { users: null, nextCursor: { lastId: null } };

    mockUsersRepository.getUser.mockResolvedValueOnce(mockUser);
    mockSwipeService.getSwipeHistory.mockResolvedValueOnce(mockSwipeHistory);
    mockUsersRepository.getPotentialMatches.mockResolvedValueOnce(mockPotentialMatches);

    // Act
    const result = await usersService.getPotentialMatches(userId);

    // Assert
    expect(result).toBeInstanceOf(Err);
    expect(result.unwrapErr()).toBe("No potential matches found, adjust your preferences.");
    expect(mockUsersRepository.getPotentialMatches).toHaveBeenCalledWith(
      mockUser,
      [456n, userId],
      appsettings.businessRules.limitForPotentialMatches,
      undefined
    );
  });
});

describe("updateUser", () => {
  it("debería actualizar un usuario y devolver Ok", async () => {
    // Arrange
    const userId = 123n;
    const updateUserDto: UpdateUserDTO = { name: "Nuevo Nombre" };
    const mockUser = new User(userId);
    const mockResponseUser = new IUserResponseDTO(mockUser);

    mockUsersRepository.updateUser.mockResolvedValueOnce(mockUser);

    // Act
    const result = await usersService.updateUser(userId, updateUserDto);

    // Assert
    expect(result).toBeInstanceOf(Ok);
    expect(result.unwrap()).toEqual(mockResponseUser);
    expect(mockUsersRepository.updateUser).toHaveBeenCalledWith(userId, updateUserDto);
  });

  it("debería devolver Err si el usuario no existe", async () => {
    // Arrange
    const userId = 123n;
    const updateUserDto: UpdateUserDTO = { name: "Nuevo Nombre" };

    mockUsersRepository.updateUser.mockResolvedValueOnce(null);

    // Act
    const result = await usersService.updateUser(userId, updateUserDto);

    // Assert
    expect(result).toBeInstanceOf(Err);
    expect(result.unwrapErr()).toBe("User not found");
    expect(mockUsersRepository.updateUser).toHaveBeenCalledWith(userId, updateUserDto);
  });
});

describe("postUser", () => {
  it("should create a user and return the created user", async () => {
    const mockUser = new User(123n);

    mockUsersRepository.createUser.mockResolvedValueOnce(mockUser);

    const result = await usersService.postUser(mockUser);

    expect(result).toEqual(mockUser);
    expect(mockUsersRepository.createUser).toHaveBeenCalledWith(mockUser);
  });

  it("should return null if user creation fails", async () => {
    const mockUser = new User(123n);

    mockUsersRepository.createUser.mockResolvedValueOnce(null);

    const result = await usersService.postUser(mockUser);

    expect(result).toBeNull();
    expect(mockUsersRepository.createUser).toHaveBeenCalledWith(mockUser);
  });
});

describe("getUserByIdentityId", () => {
  it("should return a user if found", async () => {
    const identityId = 123n;
    const mockUser = new User(identityId);

    mockUsersRepository.getUserByIdentityId.mockResolvedValueOnce(mockUser);

    const result = await usersService.getUserByIdentityId(identityId);

    expect(result.isOk()).toBe(true);
    expect(result.unwrap()).toEqual(mockUser);
    expect(mockUsersRepository.getUserByIdentityId).toHaveBeenCalledWith(identityId);
  });

  it("should return Err if the user is not found", async () => {
    const identityId = 123n;

    mockUsersRepository.getUserByIdentityId.mockResolvedValueOnce(null);

    const result = await usersService.getUserByIdentityId(identityId);

    expect(result.isErr()).toBe(true);
    expect(result.unwrapErr()).toBe("User not found");
    expect(mockUsersRepository.getUserByIdentityId).toHaveBeenCalledWith(identityId);
  });
});

describe("updateAdditionalProfilePhotos", () => {
  it("should upload additional profile photos and update the user", async () => {
    // Arrange
    const userId = 123n;
    const mockFiles = [
      { buffer: Buffer.from("file1"), originalname: "photo1.jpg" } as Express.Multer.File,
      { buffer: Buffer.from("file2"), originalname: "photo2.jpg" } as Express.Multer.File,
    ];
    const mockUser = new User(userId);
    const mockUploadResults = [
      { url: "https://example.com/photo1.jpg", blobName: "photo1" },
      { url: "https://example.com/photo2.jpg", blobName: "photo2" },
    ];

    mockUsersRepository.getUser.mockResolvedValueOnce(mockUser);
    mockUserImagesRepository.createAdditionalProfilePhoto
      .mockResolvedValueOnce(Ok(mockUploadResults[0]))
      .mockResolvedValueOnce(Ok(mockUploadResults[1]));
    mockUsersRepository.updateUser.mockResolvedValueOnce(mockUser);

    // Act
    const result = await usersService.updateAdditionalProfilePhotos(userId, mockFiles);

    // Assert
    expect(result).toBeInstanceOf(Ok);
    expect(result.unwrap()).toBe("Additional profile photos uploaded successfully");
    expect(mockUsersRepository.getUser).toHaveBeenCalledWith(userId);
    expect(mockUserImagesRepository.createAdditionalProfilePhoto).toHaveBeenCalledTimes(2);
    expect(mockUsersRepository.updateUser).toHaveBeenCalledWith(userId, {
      additionalPhotos: mockUploadResults.map((r) => r.url),
    });
  });

  it("should return Err if the user does not exist", async () => {
    // Arrange
    const userId = 123n;
    const mockFiles = [
      { buffer: Buffer.from("file1"), originalname: "photo1.jpg" } as Express.Multer.File,
    ];

    mockUsersRepository.getUser.mockResolvedValueOnce(null);

    // Act
    const result = await usersService.updateAdditionalProfilePhotos(userId, mockFiles);

    // Assert
    expect(result).toBeInstanceOf(Err);
    expect(result.unwrapErr()).toBe("User not found");
    expect(mockUsersRepository.getUser).toHaveBeenCalledWith(userId);
  });

  it("should return Err if any photo upload fails", async () => {
    // Arrange
    const userId = 123n;
    const mockFiles = [
      { buffer: Buffer.from("file1"), originalname: "photo1.jpg" } as Express.Multer.File,
      { buffer: Buffer.from("file2"), originalname: "photo2.jpg" } as Express.Multer.File,
    ];
    const mockUser = new User(userId);

    mockUsersRepository.getUser.mockResolvedValueOnce(mockUser);
    mockUserImagesRepository.createAdditionalProfilePhoto
      .mockResolvedValueOnce(Ok({ url: "https://example.com/photo1.jpg", blobName: "photo1" }))
      .mockResolvedValueOnce(Err("Upload failed"));

    // Act
    const result = await usersService.updateAdditionalProfilePhotos(userId, mockFiles);

    // Assert
    expect(result).toBeInstanceOf(Err);
    expect(result.unwrapErr()).toBe("Upload failed");
    expect(mockUsersRepository.getUser).toHaveBeenCalledWith(userId);
    expect(mockUserImagesRepository.createAdditionalProfilePhoto).toHaveBeenCalledTimes(2);
  });
});

describe("getUser", () => {
  it("should return a user if found", async () => {
    // Arrange
    const userId = 123n;
    const mockUser = new User(userId);
    const mockResponseUser = new IUserResponseDTO(mockUser);

    mockUsersRepository.getUser.mockResolvedValueOnce(mockUser);

    // Act
    const result = await usersService.getUser(userId);

    // Assert
    expect(result).toBeInstanceOf(Ok);
    expect(result.unwrap()).toEqual(mockResponseUser);
    expect(mockUsersRepository.getUser).toHaveBeenCalledWith(userId);
  });

  it("should return Err if the user is not found", async () => {
    // Arrange
    const userId = 123n;

    mockUsersRepository.getUser.mockResolvedValueOnce(null);

    // Act
    const result = await usersService.getUser(userId);

    // Assert
    expect(result).toBeInstanceOf(Err);
    expect(result.unwrapErr()).toBe("User not found");
    expect(mockUsersRepository.getUser).toHaveBeenCalledWith(userId);
  });
});