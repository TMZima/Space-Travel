import { act } from "react";
import SpaceTravelApi from "../../services/SpaceTravelApi";

const mockSpacecrafts = [
  {
    id: "spacecraft1",
    name: "Spacecraft 1",
    capacity: 100,
    currentLocation: "planet1",
  },
  {
    id: "spacecraft2",
    name: "Spacecraft 2",
    capacity: 200,
    currentLocation: "planet2",
  },
];

const mockPlanets = [
  {
    id: "planet1",
    name: "Planet 1",
    currentPopulation: 1000,
    pictureUrl: "http://example.com/planet1.jpg",
  },
  {
    id: "planet2",
    name: "Planet 2",
    currentPopulation: 2000,
    pictureUrl: "http://example.com/planet2.jpg",
  },
];

describe("PlanetsPage", () => {
  beforeEach(() => {
    vi.spyOn(SpaceTravelApi, "getPlanets").mockResolvedValue({
      data: mockPlanets,
    });
    vi.spyOn(SpaceTravelApi, "getSpacecrafts").mockResolvedValue({
      data: mockSpacecrafts,
    });
  });

  it("should render correctly with initial state", async () => {
    custRender({ route: "/planets" });

    screen.getByText(/Loading.../i);

    const planet1 = await screen.findByText("Planet 1");
    const planet2 = await screen.findByText("Planet 2");

    expect(planet1).toBeInTheDocument();
    expect(planet2).toBeInTheDocument();
  });

  it("should display loading state while fetching data", async () => {
    custRender({ route: "/planets" });

    expect(screen.getByText(/Loading.../i)).toBeInTheDocument();
  });

  it("should display error message if fetching planets fails", async () => {
    vi.spyOn(SpaceTravelApi, "getPlanets").mockRejectedValueOnce(
      new Error("Error fetching Planets")
    );

    custRender({ route: "/planets" });

    screen.findByText(/Loading.../i);

    const errorMessage = await screen.findByText(
      "Error fetching Planets. Please try again"
    );
    expect(errorMessage).toBeInTheDocument();
  });

  it("should display the list of planets correctly", async () => {
    custRender({ route: "/planets" });

    const planet1 = await screen.findByText("Planet 1");
    const planet2 = await screen.findByText("Planet 2");

    expect(planet1).toBeInTheDocument();
    expect(planet2).toBeInTheDocument();
  });

  it("should handle spacecraft selection and movement correctly", async () => {
    vi.spyOn(SpaceTravelApi, "sendSpacecraftToPlanet").mockResolvedValue({
      isError: false,
    });

    vi.spyOn(SpaceTravelApi, "getPlanets").mockResolvedValueOnce({
      data: mockPlanets,
    });

    custRender({ route: "/planets" });

    await screen.findByText(/Loading.../i);

    await screen.findByText("Planet 1");
    await screen.findByText("Planet 2");

    const spacecraft1 = screen.getByText("Spacecraft 1");
    await act(async () => {
      await userEvent.click(spacecraft1);
    });

    const planet2 = screen.getByText("Planet 2");
    await act(async () => {
      await userEvent.click(planet2);
    });

    const updatedPlanet1 = screen.getByText("Population: 900");
    const updatedPlanet2 = screen.getByText("Population: 2100");

    expect(updatedPlanet1).toBeInTheDocument();
    expect(updatedPlanet2).toBeInTheDocument();
  });
});
