import "reflect-metadata";
import { container } from "tsyringe";
import { SwipeService } from "../../src/application/services/swipe.service";
import { ISwipeRepository } from "../../src/application/interfaces/infrastructure/swipe.repository.interface";
import { IMatchService } from "../../src/application/interfaces/services/match.service.interface";
import { Swipe } from "../../src/domain/entities/swipe";
import { SwipeAction } from "../../src/domain/enumerables/swipeAction.enum";
import { Ok, Err } from "ts-results-es";
import { TYPES } from "../../src/application/dependencyInjection/container.types";

const mockSwipeRepository: jest.Mocked<ISwipeRepository> = {
  recordSwipe: jest.fn(),
  getSwipeHistory: jest.fn(),
  getSwipeByUserIdAndTargetId: jest.fn(),
} as any;

const mockMatchService: jest.Mocked<IMatchService> = {
  recordMatch: jest.fn(),
} as any;

let swipeService: SwipeService;

beforeEach(() => {
  jest.clearAllMocks();

  container.registerInstance(TYPES.ISwipeRepository, mockSwipeRepository);
  container.registerInstance(TYPES.IMatchService, mockMatchService);

  swipeService = container.resolve(SwipeService);
});

describe("recordSwipe", () => {
  it("should return Err if the user swipes on themselves", async () => {
    // Arrange
    const userId = 123n;
    const targetUserId = 123n;
    const swipeType = SwipeAction.LIKE;

    // Act
    const result = await swipeService.recordSwipe(userId, targetUserId, swipeType);

    // Assert
    expect(result).toBeInstanceOf(Err);
    expect(result.unwrapErr()).toBe("You cannot swipe on yourself.");
  });

  it("should return Err if the user has already swiped the target user with the same swipe type", async () => {
    // Arrange
    const userId = 123n;
    const targetUserId = 456n;
    const swipeType = SwipeAction.LIKE;
    const existingSwipe = new Swipe(userId, targetUserId, swipeType, new Date());

    mockSwipeRepository.getSwipeByUserIdAndTargetId.mockResolvedValueOnce(existingSwipe);

    // Act
    const result = await swipeService.recordSwipe(userId, targetUserId, swipeType);

    // Assert
    expect(result).toBeInstanceOf(Err);
    expect(result.unwrapErr()).toBe("You have already swiped this user.");
    expect(mockSwipeRepository.getSwipeByUserIdAndTargetId).toHaveBeenCalledWith(userId, targetUserId);
  });

  it("should record a swipe and return Ok with isMatch = false if there is no mutual like", async () => {
    // Arrange
    const userId = 123n;
    const targetUserId = 456n;
    const swipeType = SwipeAction.LIKE;

    mockSwipeRepository.getSwipeByUserIdAndTargetId.mockResolvedValueOnce(null); // No existing swipe
    mockSwipeRepository.getSwipeByUserIdAndTargetId.mockResolvedValueOnce(null); // No mutual like
    mockSwipeRepository.recordSwipe.mockResolvedValueOnce();

    // Act
    const result = await swipeService.recordSwipe(userId, targetUserId, swipeType);

    // Assert
    expect(result).toBeInstanceOf(Ok);
    expect(result.unwrap()).toEqual({ isMatch: false });
    expect(mockSwipeRepository.recordSwipe).toHaveBeenCalledWith(expect.any(Swipe));
  });

  it("should record a swipe and return Ok with isMatch = true if there is a mutual like", async () => {
    // Arrange
    const userId = 123n;
    const targetUserId = 456n;
    const swipeType = SwipeAction.LIKE;
    const mutualSwipe = new Swipe(targetUserId, userId, SwipeAction.LIKE, new Date());

    mockSwipeRepository.getSwipeByUserIdAndTargetId.mockResolvedValueOnce(null); // No existing swipe
    mockSwipeRepository.getSwipeByUserIdAndTargetId.mockResolvedValueOnce(mutualSwipe); // Mutual like
    mockSwipeRepository.recordSwipe.mockResolvedValueOnce();
    mockMatchService.recordMatch.mockResolvedValueOnce();

    // Act
    const result = await swipeService.recordSwipe(userId, targetUserId, swipeType);

    // Assert
    expect(result).toBeInstanceOf(Ok);
    expect(result.unwrap()).toEqual({ isMatch: true });
    expect(mockSwipeRepository.recordSwipe).toHaveBeenCalledWith(expect.any(Swipe));
    expect(mockMatchService.recordMatch).toHaveBeenCalledWith(userId, targetUserId);
  });
});

describe("getSwipeHistory", () => {
  it("should return the swipe history for a user", async () => {
    // Arrange
    const userId = 123n;
    const mockSwipeHistory = [
      new Swipe(userId, 456n, SwipeAction.LIKE, new Date()),
      new Swipe(userId, 789n, SwipeAction.DISLIKE, new Date()),
    ];

    mockSwipeRepository.getSwipeHistory.mockResolvedValueOnce(mockSwipeHistory);

    // Act
    const result = await swipeService.getSwipeHistory(userId);

    // Assert
    expect(result).toEqual(mockSwipeHistory);
    expect(mockSwipeRepository.getSwipeHistory).toHaveBeenCalledWith(userId);
  });

  it("should return null if no swipe history is found", async () => {
    // Arrange
    const userId = 123n;

    mockSwipeRepository.getSwipeHistory.mockResolvedValueOnce(null);

    // Act
    const result = await swipeService.getSwipeHistory(userId);

    // Assert
    expect(result).toBeNull();
    expect(mockSwipeRepository.getSwipeHistory).toHaveBeenCalledWith(userId);
  });
});