import "reflect-metadata";
import { container } from "tsyringe";
import { MessageService } from "../../src/application/services/message.service";
import { IMessageRepository } from "../../src/application/interfaces/infrastructure/message.repository.interface";
import { Message } from "../../src/domain/entities/message";
import { Ok, Err } from "ts-results-es";
import { TYPES } from "../../src/application/dependencyInjection/container.types";
import { Id } from "../../src/domain/valueObjects/id";

const mockMessageRepository: jest.Mocked<IMessageRepository> = {
  getMessagesByMatchId: jest.fn(),
  createMessage: jest.fn(),
  deleteMessage: jest.fn(),
} as any;

let messageService: MessageService;

const assignedWorkerId = parseInt(process.env.WORKER_ID || '0', 10);
Id.configure({ workerId: assignedWorkerId });

beforeEach(() => {
  jest.clearAllMocks();

  container.registerInstance(TYPES.IMessageRepository, mockMessageRepository);

  messageService = container.resolve(MessageService);
});

describe("getMessagesByMatchId", () => {
  it("should return messages for a valid match ID", async () => {
    // Arrange
    const matchId = 123n;
    const mockMessages = [
      new Message(1n, "Hello", matchId, new Date()),
      new Message(2n, "Hi", matchId, new Date()),
    ];

    mockMessageRepository.getMessagesByMatchId.mockResolvedValueOnce(mockMessages);

    // Act
    const result = await messageService.getMessagesByMatchId(matchId);

    // Assert
    expect(result).toBeInstanceOf(Ok);
    expect(result.unwrap()).toEqual(mockMessages);
    expect(mockMessageRepository.getMessagesByMatchId).toHaveBeenCalledWith(matchId);
  });

  it("should return Err if no messages are found for the match ID", async () => {
    // Arrange
    const matchId = 123n;

    mockMessageRepository.getMessagesByMatchId.mockResolvedValueOnce(null);

    // Act
    const result = await messageService.getMessagesByMatchId(matchId);

    // Assert
    expect(result).toBeInstanceOf(Err);
    expect(result.unwrapErr()).toBe("No messages found for this match.");
    expect(mockMessageRepository.getMessagesByMatchId).toHaveBeenCalledWith(matchId);
  });
});

describe("createMessage", () => {
  it("should create a new message successfully", async () => {
    // Arrange
    const senderId = 1n;
    const matchId = 123n;
    const content = "Hello!";
    const mockMessage = new Message(senderId, content, matchId, new Date());

    mockMessageRepository.createMessage.mockResolvedValueOnce(mockMessage);

    // Act
    const result = await messageService.createMessage(senderId, matchId, content);

    // Assert
    expect(result).toBeInstanceOf(Ok);
    expect(result.unwrap()).toEqual(mockMessage);
    expect(mockMessageRepository.createMessage).toHaveBeenCalledWith(
      expect.objectContaining({
        senderId,
        matchId,
        content,
      })
    );
  });

  it("should return Err if message creation fails", async () => {
    // Arrange
    const senderId = 1n;
    const matchId = 123n;
    const content = "Hello!";

    mockMessageRepository.createMessage.mockResolvedValueOnce(null);

    // Act
    const result = await messageService.createMessage(senderId, matchId, content);

    // Assert
    expect(result).toBeInstanceOf(Err);
    expect(result.unwrapErr()).toBe("Failed to create message.");
    expect(mockMessageRepository.createMessage).toHaveBeenCalledWith(
      expect.objectContaining({
        senderId,
        matchId,
        content,
      })
    );
  });
});