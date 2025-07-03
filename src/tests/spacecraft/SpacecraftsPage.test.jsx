import { act } from "react";
import SpaceTravelApi from "../../services/SpaceTravelApi";

afterEach(() => {
  vi.restoreAllMocks();
});

describe("SpacecraftsPage", () => {
  it("should render a list of spacecrafts", async () => {
    // Mock API call
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

    custRender({ route: "/spacecrafts" });

    const buildSpacecraftBtn = await screen.findByText(/Build a Spacecraft/i);

    // Wait for spacecraft to be rendered
    const spacecraftName = await screen.findByText("Prispax");
    const spacecraftCapacity = await screen.findByText("Capacity: 10000");
    const viewDetailsBtn = await screen.findByText(/View Details/i);
    const decommissionBtn = await screen.findByText(/Decommission/i);

    // Ensure build a spacecraft button is rendered
    expect(buildSpacecraftBtn).toBeInTheDocument();

    // Check that the spacecraft are rendered with action buttons
    expect(spacecraftName).toBeInTheDocument();
    expect(spacecraftCapacity).toBeInTheDocument();
    expect(viewDetailsBtn).toBeInTheDocument();
    expect(decommissionBtn).toBeInTheDocument();
  });

  it("should only display a 'Build a Spacecraft' button if no spacecraft are present", async () => {
    vi.spyOn(SpaceTravelApi, "getSpacecrafts").mockResolvedValue({
      data: [],
    });

    custRender({ route: "/spacecrafts" });

    const buildSpacecraftBtn = await screen.findByText(/Build a Spacecraft/i);

    // Check to see if any spacecraft cards are rendered
    const spacecraftName = await screen.queryByText("Prispax");
    const spacecraftCapacity = await screen.queryByText("Capacity:");
    const viewDetailsBtn = await screen.queryByText(/View Details/i);
    const decommissionBtn = await screen.queryByText(/Decommission/i);

    // Check build a spacecraft button is present
    expect(buildSpacecraftBtn).toBeInTheDocument();

    // Check to see if spacecraft are not present
    expect(spacecraftName).not.toBeInTheDocument();
    expect(spacecraftCapacity).not.toBeInTheDocument();
    expect(viewDetailsBtn).not.toBeInTheDocument();
    expect(decommissionBtn).not.toBeInTheDocument();
  });

  it("should display a loading indicator while fetching spacecraft", async () => {
    // Mock the API call to delay the response
    vi.spyOn(SpaceTravelApi, "getSpacecrafts").mockImplementation(
      () =>
        new Promise((resolve) => setTimeout(() => resolve({ data: [] }), 1000))
    );

    // Render the SpacecraftsPage component
    custRender({ route: "/spacecrafts" });

    // Check for the loading indicator
    const loadingElement = await screen.findByText("Loading...");
    expect(loadingElement).toBeInTheDocument();
  });

  it('should navigate to the builder page when "Build a Spacecraft" button is clicked', async () => {
    // Mock the API call to return an empty array
    vi.spyOn(SpaceTravelApi, "getSpacecrafts").mockResolvedValue({
      data: [],
    });

    // Render the SpacecraftsPage component
    custRender({ route: "/spacecrafts" });

    const buildSpacecraftBtn = await screen.findByText(/Build a Spacecraft/i);
    await act(async () => {
      await userEvent.click(buildSpacecraftBtn);
    });

    const buildBtn = await screen.findByRole("button", { name: /Build 🏗️/i });
    expect(buildBtn).toBeInTheDocument();
  });

  it('should show loading state after clicking "View Details"', async () => {
    vi.spyOn(SpaceTravelApi, "getSpacecrafts").mockResolvedValue({
      data: [{ id: "prispax", name: "Prispax", capacity: 10000 }],
    });

    // Mock getSpacecraftById to return a pending promise
    vi.spyOn(SpaceTravelApi, "getSpacecraftById").mockImplementation(
      () => new Promise(() => {}) // Keeps the promise pending to simulate loading
    );

    custRender({ route: "/spacecrafts" });

    const viewDetailsBtn = await screen.findByText(/View Details/i);
    await act(async () => {
      await userEvent.click(viewDetailsBtn);
    });

    // Verify loading state appears
    expect(await screen.findByText("Loading...")).toBeInTheDocument();
  });

  it("should display spacecraft details after loading completes", async () => {
    // Mock spacecraft list API call
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

    custRender({ route: "/spacecrafts" });

    const viewDetailsBtn = await screen.findByText(/View Details/i);
    await act(async () => {
      await userEvent.click(viewDetailsBtn);
    });

    // Match a part of the spacecraft description
    const spacecraftDetails = await screen.findByText((content, element) => {
      return content.includes("Presenting the Astrolux Odyssey");
    });
    expect(spacecraftDetails).toBeInTheDocument();
  });

  it('should decommission a spacecraft when the "Decommission" button is clicked', async () => {
    // Initial mock for getSpacecrafts API call
    vi.spyOn(SpaceTravelApi, "getSpacecrafts").mockResolvedValueOnce({
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

    custRender({ route: "/spacecrafts" });

    // Wait for spacecraft to load
    await screen.findByText("Prispax");

    const decommissionBtn = await screen.findByText(/Decommission/i);
    await act(async () => {
      await userEvent.click(decommissionBtn);
    });

    // Wait for spacecraft list to update
    await screen.findByText(/Decommissioning.../i);
    await screen.findByText(/Loading.../i);
    await screen.findByText(/Build a Spacecraft/i);

    // Ensure spacecraft is gone
    const prispaxSpacecraft = screen.queryByText("Prispax");
    expect(prispaxSpacecraft).not.toBeInTheDocument();
  });

  it("display an error message if the API call fails", async () => {
    // Mock the API call to return an error
    vi.spyOn(SpaceTravelApi, "getSpacecrafts").mockRejectedValueOnce(
      new Error("API call failed")
    );

    custRender({ route: "/spacecrafts" });

    // Wait for the error message to be rendered
    const errorMessage = await screen.findByText(
      "Error fetching spacecraft. Please try again."
    );
    expect(errorMessage).toBeInTheDocument();
  });
});
