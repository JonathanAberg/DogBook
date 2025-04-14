import { render, screen, waitFor } from "@testing-library/react";
import { BrowserRouter } from "react-router-dom";
import Profile from "../pages/Profile";
import { getDogById, getDogs } from "../services/api";

// Mock react-router-dom's useParams
jest.mock("react-router-dom", () => ({
  ...jest.requireActual("react-router-dom"),
  useParams: () => ({ id: "123" }),
  Link: ({ children, to }) => <a href={to}>{children}</a>,
}));

// Mock the API service
jest.mock("../services/api", () => ({
  getDogById: jest.fn(),
  getDogs: jest.fn(),
  deleteDog: jest.fn(),
  addFriend: jest.fn(),
  removeFriend: jest.fn(),
}));

describe("Profile Component", () => {
  test("renders loading state when dog data is being fetched", () => {
    getDogById.mockImplementation(
      () => new Promise((resolve) => setTimeout(() => resolve({}), 100))
    );
    getDogs.mockResolvedValue([]);

    render(<Profile />);

    expect(screen.getByText("Laddar...")).toBeInTheDocument();
  });

  test("displays dog profile information correctly", async () => {
    const mockDog = {
      _id: "123",
      name: "Fido",
      nick: "Fi",
      age: 5,
      present: true,
      bio: "Friendly dog",
      friends: [],
    };

    getDogById.mockResolvedValue(mockDog);
    getDogs.mockResolvedValue([]);

    render(<Profile />);

    await waitFor(() => {
      expect(screen.getByText("Fido 🐶")).toBeInTheDocument();
      expect(screen.getByText("Smeknamn: Fi")).toBeInTheDocument();
      expect(screen.getByText("Ålder: 5")).toBeInTheDocument();
      expect(screen.getByText("🐶 Är på dagis")).toBeInTheDocument();
      expect(screen.getByText("Friendly dog")).toBeInTheDocument();
      expect(screen.getByText("Inga vänner än!")).toBeInTheDocument();
    });
  });
});
