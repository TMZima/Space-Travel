import { render } from "@testing-library/react";
import PlanetCard from "../../components/Planets/PlanetCard";
import { act } from "react";

const mockSpacecrafts = [
  {
    id: "spacecraft1",
    name: "Spacecraft 1",
    capacity: 100,
    pictureUrl: "",
  },
  {
    id: "spacecraft2",
    name: "Spacecraft 2",
    capacity: 200,
    pictureUrl: "",
  },
];

// Mock the CSS module
vi.mock("../../components/Planets/PlanetCard.module.css", () => ({
  planetCard: "planetCard",
  selected: "selected",
  spacecraftCard: "spacecraftCard",
  selectedSpacecraft: "selectedSpacecraft",
}));

describe("PlanetCard", () => {
  it("should render correctly with the provided props", () => {
    render(
      <PlanetCard
        name="Planet 1"
        currentPopulation={1000}
        pictureUrl="http://example.com/planet1.jpg"
        onClick={vi.fn()}
        isSelected={false}
        spacecrafts={mockSpacecrafts}
        onSpacecraftClick={vi.fn()}
        selectedSpacecraftId=""
      />
    );

    expect(screen.getByText("Planet 1")).toBeInTheDocument();
    expect(screen.getByText("Population: 1000")).toBeInTheDocument();
    expect(screen.getByAltText("Picture of Planet 1")).toBeInTheDocument();
    expect(screen.getByText("Spacecraft 1")).toBeInTheDocument();
    expect(screen.getByText("Spacecraft 2")).toBeInTheDocument();
  });

  it("should call onClick handler when the planet card is clicked", async () => {
    const onClickMock = vi.fn();
    render(
      <PlanetCard
        name="Planet 1"
        currentPopulation={1000}
        pictureUrl="http://example.com/planet1.jpg"
        onClick={onClickMock}
        isSelected={false}
        spacecrafts={mockSpacecrafts}
        onSpacecraftClick={vi.fn()}
        selectedSpacecraftId=""
      />
    );

    const planetCard = screen.getByText("Planet 1");
    await act(async () => {
      await userEvent.click(planetCard);
    });

    expect(onClickMock).toHaveBeenCalled();
  });

  it("should call onSpacecraftClick handler when a spacecraft is clicked", async () => {
    const onSpacecraftClickMock = vi.fn();
    render(
      <PlanetCard
        name="Planet 1"
        currentPopulation={1000}
        pictureUrl="http://example.com/planet1.jpg"
        onClick={vi.fn()}
        isSelected={false}
        spacecrafts={mockSpacecrafts}
        onSpacecraftClick={onSpacecraftClickMock}
        selectedSpacecraftId=""
      />
    );

    const spacecraft1 = screen.getByText("Spacecraft 1");
    await act(async () => {
      await userEvent.click(spacecraft1);
    });

    expect(onSpacecraftClickMock).toHaveBeenCalledWith(mockSpacecrafts[0]);
  });

  it("should apply selected state to the planet card and spacecraft", () => {
    render(
      <PlanetCard
        name="Planet 1"
        currentPopulation={1000}
        pictureUrl="http://example.com/planet1.jpg"
        onClick={vi.fn()}
        isSelected={true}
        spacecrafts={mockSpacecrafts}
        onSpacecraftClick={vi.fn()}
        selectedSpacecraftId="spacecraft1"
      />
    );

    const planetCard = screen.getByTestId("planet-card");
    expect(planetCard).toHaveClass(/selected/);

    const spacecraft1 = screen.getByTestId("spacecraft-card-spacecraft1");
    expect(spacecraft1).toHaveClass(/selectedSpacecraft/);
  });
});
