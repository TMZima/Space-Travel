import { act } from "react";
import SpaceTravelApi from "../../services/SpaceTravelApi";

describe("SpacecraftDetailsPage", () => {
  it('should display a "Go Back" button after page renders', async () => {
    vi.spyOn(SpaceTravelApi, "getSpacecraftById").mockResolvedValueOnce({
      data: {
        id: "prispax",
        name: "Prispax",
        capacity: 10000,
        description: "A revolutionary spacecraft.",
        pictureUrl: null,
        currentLocation: 2,
      },
    });

    custRender({ route: "/spacecrafts/prispax" });

    await screen.getByText(/Loading.../i);
    await screen.findByText("Prispax");

    const goBackBtn = screen.getByText(/Go Back/i);
    expect(goBackBtn).toBeInTheDocument();
  });

  it("should display spacecraft details after page renders", async () => {
    vi.spyOn(SpaceTravelApi, "getSpacecraftById").mockResolvedValueOnce({
      data: {
        id: "prispax",
        name: "Prispax",
        capacity: 10000,
        description: "A revolutionary spacecraft.",
        pictureUrl: null,
        currentLocation: 2,
      },
    });

    custRender({ route: "/spacecrafts/prispax" });

    const details = await screen.findByText("A revolutionary spacecraft.");
    expect(details).toBeInTheDocument();
  });

  it('should navigate to spacecrafts page when "Go Back" button is clicked', async () => {
    vi.spyOn(SpaceTravelApi, "getSpacecraftById").mockResolvedValueOnce({
      data: {
        id: "prispax",
        name: "Prispax",
        capacity: 10000,
        description: "A revolutionary spacecraft.",
        pictureUrl: null,
        currentLocation: 2,
      },
    });

    custRender({ route: "/spacecrafts/prispax" });

    const backBtn = await screen.findByText(/Go Back/i);
    await act(async () => {
      userEvent.click(backBtn);
    });

    await screen.findByText(/Loading.../i);
    await screen.findByText("Prispax");

    const spacecraftPage = await screen.findByText(/Build a Spacecraft/i);
    expect(spacecraftPage).toBeInTheDocument();
  });
});
