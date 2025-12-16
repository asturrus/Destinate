import { render, screen, fireEvent } from "@testing-library/react";
import { describe, it, expect } from "vitest";
import { ForumHero } from "../ForumHero";

describe("ForumHero", () => {
    it("renders popular destinations", () => {
        render(<ForumHero />);
        expect(screen.getByText("Tokyo, Japan")).toBeInTheDocument();
        expect(screen.getByText("Santorini, Greece")).toBeInTheDocument();
    });
});