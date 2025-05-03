import { Preferences } from "../../src/domain/valueObjects/preferences";

describe("Preferences", () => {
  it("should create a Preferences object with valid values", () => {
    // Arrange
    const minAge = 18;
    const maxAge = 30;
    const interestedInGender = "female";
    const maxDistance = 50;

    // Act
    const preferences = new Preferences(minAge, maxAge, interestedInGender, maxDistance);

    // Assert
    expect(preferences.minAge).toBe(minAge);
    expect(preferences.maxAge).toBe(maxAge);
    expect(preferences.interestedInGender).toBe(interestedInGender);
    expect(preferences.maxDistance).toBe(maxDistance);
  });

  it("should handle edge cases for minAge and maxAge", () => {
    // Arrange
    const minAge = 0;
    const maxAge = 120;

    // Act
    const preferences = new Preferences(minAge, maxAge, "any", 100);

    // Assert
    expect(preferences.minAge).toBe(minAge);
    expect(preferences.maxAge).toBe(maxAge);
  });

  it("should handle empty strings for interestedInGender", () => {
    // Arrange
    const interestedInGender = "";

    // Act
    const preferences = new Preferences(18, 30, interestedInGender, 50);

    // Assert
    expect(preferences.interestedInGender).toBe(interestedInGender);
  });

  it("should handle special characters in interestedInGender", () => {
    // Arrange
    const interestedInGender = "non-binary";

    // Act
    const preferences = new Preferences(18, 30, interestedInGender, 50);

    // Assert
    expect(preferences.interestedInGender).toBe(interestedInGender);
  });

  it("should handle edge cases for maxDistance", () => {
    // Arrange
    const maxDistance = 0;

    // Act
    const preferences = new Preferences(18, 30, "female", maxDistance);

    // Assert
    expect(preferences.maxDistance).toBe(maxDistance);
  });
});