import "reflect-metadata";
import { container } from "tsyringe";
import { MatchService } from "../../src/application/services/match.service";
import { IMatchRepository } from "../../src/application/interfaces/infrastructure/match.repository.interface";
import { Match } from "../../src/domain/entities/match";
import { Ok, Err } from "ts-results-es";
import { TYPES } from "../../src/application/dependencyInjection/container.types";
import { Id } from "../../src/domain/valueObjects/id";

const mockMatchRepository: jest.Mocked<IMatchRepository> = {
  recordMatch: jest.fn(),
  getMatchHistory: jest.fn(),
} as any;

let matchService: MatchService;

const assignedWorkerId = parseInt(process.env.WORKER_ID || '0', 10);
Id.configure({ workerId: assignedWorkerId });

beforeEach(() => {
  jest.clearAllMocks();

  container.registerInstance(TYPES.IMatchRepository, mockMatchRepository);

  matchService = container.resolve(MatchService);
});

describe("recordMatch", () => {
  it("should record a match successfully", async () => {
    // Arrange
    const userId = 123n;
    const targetUserId = 456n;

    mockMatchRepository.recordMatch.mockResolvedValueOnce();

    // Act
    await matchService.recordMatch(userId, targetUserId);

    // Assert
    expect(mockMatchRepository.recordMatch).toHaveBeenCalledWith(
      expect.objectContaining({
        userId,
        targetUserId,
        createdAt: expect.any(Date),
      })
    );
  });

  it("should throw an error if the repository fails", async () => {
    // Arrange
    const userId = 123n;
    const targetUserId = 456n;

    mockMatchRepository.recordMatch.mockRejectedValueOnce(new Error("Database error"));

    // Act & Assert
    await expect(matchService.recordMatch(userId, targetUserId)).rejects.toThrow("Database error");
    expect(mockMatchRepository.recordMatch).toHaveBeenCalledWith(
      expect.objectContaining({
        userId,
        targetUserId,
        createdAt: expect.any(Date),
      })
    );
  });
});

describe("getMatchHistory", () => {
  it("should return the match history for a user", async () => {
    // Arrange
    const userId = 123n;
    const mockMatchHistory = [
      new Match(userId, 456n, new Date()),
      new Match(userId, 789n, new Date()),
    ];

    mockMatchRepository.getMatchHistory.mockResolvedValueOnce(mockMatchHistory);

    // Act
    const result = await matchService.getMatchHistory(userId);

    // Assert
    expect(result).toBeInstanceOf(Ok);
    expect(result.unwrap()).toEqual(mockMatchHistory);
    expect(mockMatchRepository.getMatchHistory).toHaveBeenCalledWith(userId);
  });

  it("should return Err if no match history is found", async () => {
    // Arrange
    const userId = 123n;

    mockMatchRepository.getMatchHistory.mockResolvedValueOnce(null);

    // Act
    const result = await matchService.getMatchHistory(userId);

    // Assert
    expect(result).toBeInstanceOf(Err);
    expect(result.unwrapErr()).toBe("Match history not found.");
    expect(mockMatchRepository.getMatchHistory).toHaveBeenCalledWith(userId);
  });

  it("should throw an error if the repository fails", async () => {
    // Arrange
    const userId = 123n;

    mockMatchRepository.getMatchHistory.mockRejectedValueOnce(new Error("Database error"));

    // Act & Assert
    await expect(matchService.getMatchHistory(userId)).rejects.toThrow("Database error");
    expect(mockMatchRepository.getMatchHistory).toHaveBeenCalledWith(userId);
  });
});