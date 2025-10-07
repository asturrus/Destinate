import { render, screen, fireEvent } from "@test-library/react";
import { ForumHero } from "../components/ForumHero";

describe("ForumHero", () => {
    it("renders title correctly", () => {
        render(<ForumHero />);
        expect(screen.getByText("Search For Places")).toBeInTheDocument();
    });
});