import { act } from "react";
import SpaceTravelApi from "../services/SpaceTravelApi";

describe("App", () => {
  it("should render the HomePage when the app is launched", () => {
    custRender({ route: "/" });

    const homePageTitle = screen.getByText(
      "Space Travel: Expanding Horizons Beyond Earth"
    );

    expect(homePageTitle).toBeInTheDocument();
  });

  it("should render a loading screen when user clicks Spacecraft link", async () => {
    custRender({ route: "/" });

    await act(async () => {
      await userEvent.click(screen.getByText("🚀Spacecraft"));
    });

    vi.spyOn(SpaceTravelApi, "getSpacecrafts").mockResolvedValue({
      data: [
        {
          id: "prispax",
          name: "Prispax",
          capacity: 10000,
          description: "A revolutionary spacecraft.",
          pictureUrl: null,
          currentLocation: 2,
        },
      ],
    });

    // Check for the loading indicator
    const loadingElement = await screen.getByText("Loading...");
    expect(loadingElement).toBeInTheDocument();
  });

  it("should render the Spacecrafts page after loading indicator disappears", async () => {
    custRender({ route: "/" });

    await act(async () => {
      await userEvent.click(screen.getByText("🚀Spacecraft"));
    });

    vi.spyOn(SpaceTravelApi, "getSpacecrafts").mockResolvedValue({
      data: [
        {
          id: "prispax",
          name: "Prispax",
          capacity: 10000,
          description: "A revolutionary spacecraft.",
          pictureUrl: null,
          currentLocation: 2,
        },
      ],
    });

    // Check loading indicator has gone away and Spacecrafts page has rendered
    const spacecraftPage = await screen.findByText(/Build a Spacecraft/i);
    expect(spacecraftPage).toBeInTheDocument();
  });

  it("should render a loading screen when user clicks Planets link", async () => {
    custRender({ route: "/" });

    await act(async () => {
      await userEvent.click(screen.getByText("🪐Planets"));
    });

    vi.spyOn(SpaceTravelApi, "getPlanets").mockResolvedValue({
      data: [
        {
          id: 0,
          name: "Mercury",
          currentPopulation: 0,
          pictureUrl:
            "https://upload.wikimedia.org/wikipedia/commons/8/88/Reprocessed_Mariner_10_image_of_Mercury.jpg",
        },
      ],
    });

    // Check for the loading indicator
    const loadingElement = await screen.getByText(/Loading/i);
    expect(loadingElement).toBeInTheDocument();
  });

  it("should render the Planets page after the loading indicator disappears", async () => {
    custRender({ route: "/" });

    await act(async () => {
      await userEvent.click(screen.getByText("🪐Planets"));
    });

    vi.spyOn(SpaceTravelApi, "getPlanets").mockResolvedValue({
      data: [
        {
          id: 0,
          name: "Mercury",
          currentPopulation: 0,
          pictureUrl:
            "https://upload.wikimedia.org/wikipedia/commons/8/88/Reprocessed_Mariner_10_image_of_Mercury.jpg",
        },
      ],
    });

    // Check loading indicator has gone away and Planets page has rendered
    const planetsPage = await screen.getByText(/Mercury/i);
    expect(planetsPage).toBeInTheDocument();
  });
});
