import { render, screen, fireEvent } from "@testing-library/react";
import { ForumHero } from "../components/ForumHero";
import { it } from "node:test";

describe("ForumHero", () => {
    it("renders title correctly", () => {
        render(<ForumHero />);
        expect(screen.getByText("Search For Places")).toBeInTheDocument();
    });

    it("renders search bar and button", () => {
        render(<ForumHero />);
        expect(screen.getByPlaceholderText("Find a place")).toBeInTheDocument();
        expect(screen.getByRole("button", { name: "Enter" })).toBeInTheDocument();
    });

    it("renders popular destinations", () => {
        render(<ForumHero />);
        expect(screen.getByText("Tokyo, Japan")).toBeInTheDocument();
        expect(screen.getByText("Santorini, Greece")).toBeInTheDocument();
    });

    it("allows typing into search bar", () => {
        render(<ForumHero />);
        const input = screen.getByPlaceholderText("Find a place");
        fireEvent.change(input, { target: { value: "Paris" } });
        expect(input.value).toBe("Paris");
    });
});