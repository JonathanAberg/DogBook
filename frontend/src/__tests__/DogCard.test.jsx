import { render, screen, fireEvent } from "@testing-library/react";
import { BrowserRouter } from "react-router-dom";
import DogCard from "../components/DogCard";

// Mock the API service
jest.mock("../services/api", () => ({
  deleteDog: jest.fn().mockResolvedValue({ message: "Dog deleted" }),
}));

describe("DogCard Component", () => {
  const mockDog = {
    _id: "123",
    name: "Fido",
    age: 5,
    present: true,
    imagePath: "/uploads/test.jpg",
  };

  const mockOnDelete = jest.fn();

  test("renders dog information correctly", () => {
    render(
      <BrowserRouter>
        <DogCard dog={mockDog} onDelete={mockOnDelete} />
      </BrowserRouter>
    );

    expect(screen.getByText("@Fido")).toBeInTheDocument();
    expect(screen.getByRole("img")).toHaveAttribute("alt", mockDog.name);
  });

  test("calls onDelete when delete button is clicked", () => {
    render(
      <BrowserRouter>
        <DogCard dog={mockDog} onDelete={mockOnDelete} />
      </BrowserRouter>
    );

    fireEvent.click(screen.getByRole("button"));
    expect(mockOnDelete).toHaveBeenCalledTimes(1);
  });
});
