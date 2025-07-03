import { render } from "@testing-library/react";
import Footer from "../../components/Footer/Footer";

describe("Footer", () => {
  it("should render the footer with correct text and emojis", () => {
    render(<Footer />);
    expect(
      screen.getByText("The solar system: the new home.")
    ).toBeInTheDocument();
    expect(screen.getByText("🌎🚀🧑‍🚀🪐")).toBeInTheDocument();
  });
});
