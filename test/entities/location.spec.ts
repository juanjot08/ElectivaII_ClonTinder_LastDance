import { Location } from "../../src/domain/valueObjects/location";

describe("Location", () => {
  it("should create a Location object with valid city and country", () => {
    // Arrange
    const city = "New York";
    const country = "USA";

    // Act
    const location = new Location(city, country);

    // Assert
    expect(location.city).toBe(city);
    expect(location.country).toBe(country);
  });

  it("should handle empty strings for city and country", () => {
    // Arrange
    const city = "";
    const country = "";

    // Act
    const location = new Location(city, country);

    // Assert
    expect(location.city).toBe(city);
    expect(location.country).toBe(country);
  });

  it("should handle special characters in city and country", () => {
    // Arrange
    const city = "São Paulo";
    const country = "Brasil";

    // Act
    const location = new Location(city, country);

    // Assert
    expect(location.city).toBe(city);
    expect(location.country).toBe(country);
  });
});