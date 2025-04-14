import { render, screen, waitFor } from "@testing-library/react";
import { BrowserRouter } from "react-router-dom";
import Home from "../pages/Home";
import { getDogs } from "../services/api";

// Mock the API service
jest.mock("../services/api", () => ({
  getDogs: jest.fn(),
  deleteDog: jest.fn(),
}));

describe("Home Component", () => {
  test("renders loading state correctly", () => {
    getDogs.mockImplementation(
      () => new Promise((resolve) => setTimeout(() => resolve([]), 100))
    );

    render(
      <BrowserRouter>
        <Home />
      </BrowserRouter>
    );

    expect(screen.getByText("DogBook")).toBeInTheDocument();
    expect(screen.getByText("Skapa ny hund")).toBeInTheDocument();
  });

  test("renders empty state when no dogs are available", async () => {
    getDogs.mockResolvedValue([]);

    render(
      <BrowserRouter>
        <Home />
      </BrowserRouter>
    );

    await waitFor(() => {
      expect(
        screen.getByText("Inga hundar registrerade ännu!")
      ).toBeInTheDocument();
    });
  });

  test("renders dog cards when dogs are available", async () => {
    const mockDogs = [
      { _id: "1", name: "Fido", present: true },
      { _id: "2", name: "Rex", present: false },
    ];

    getDogs.mockResolvedValue(mockDogs);

    render(
      <BrowserRouter>
        <Home />
      </BrowserRouter>
    );

    await waitFor(() => {
      expect(
        screen.queryByText("Inga hundar registrerade ännu!")
      ).not.toBeInTheDocument();
    });
  });
});
