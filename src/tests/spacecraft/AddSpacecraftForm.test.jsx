import { act } from "react";
import SpaceTravelApi from "../../services/SpaceTravelApi";

describe("AddSpacecraftForm", () => {
  it("should display a back button, a form, and a build button when rendered", () => {
    custRender({ route: "/spacecrafts/builder" });

    const backBtn = screen.getByText(/Back/i);
    const name = screen.getByLabelText("Name:");
    const capacity = screen.getByLabelText("Capacity:");
    const description = screen.getByLabelText("Description:");
    const pictureUrl = screen.getByLabelText("Picture URL:");
    const buildBtn = screen.getByText(/Build/i);

    expect(backBtn).toBeInTheDocument();
    expect(name).toBeInTheDocument();
    expect(capacity).toBeInTheDocument();
    expect(description).toBeInTheDocument();
    expect(pictureUrl).toBeInTheDocument();
    expect(buildBtn).toBeInTheDocument();
  });

  it('should display error text if "name" is empty', async () => {
    custRender({ route: "/spacecrafts/builder" });

    const buildingBtn = await screen.findByRole("button", {
      name: /Building.../i,
    });
    expect(buildingBtn).toBeInTheDocument();

    const buildBtn = await screen.findByText(/Build 🏗️/i);
    await act(async () => {
      await userEvent.click(buildBtn);
    });

    const nameError = await screen.findByText("Name is required");
    expect(nameError).toBeInTheDocument();
  });

  it('should display error text if "capacity" is empty', async () => {
    custRender({ route: "/spacecrafts/builder" });

    const buildingBtn = await screen.findByRole("button", {
      name: /Building.../i,
    });
    expect(buildingBtn).toBeInTheDocument();

    const buildBtn = await screen.findByText(/Build 🏗️/i);
    await act(async () => {
      await userEvent.click(buildBtn);
    });

    const capacityError = await screen.findByText(
      "Capacity must be a positive number"
    );
    expect(capacityError).toBeInTheDocument();
  });

  it('should display error text if "capacity" is not a positive number', async () => {
    custRender({ route: "/spacecrafts/builder" });

    const buildingBtn = await screen.findByRole("button", {
      name: /Building.../i,
    });
    expect(buildingBtn).toBeInTheDocument();

    const capacityInput = await screen.findByLabelText("Capacity:");
    const buildBtn = await screen.findByText(/Build 🏗️/i);
    await act(async () => {
      await userEvent.type(capacityInput, "-110");
      await userEvent.click(buildBtn);
    });

    const capacityError = await screen.findByText(
      "Capacity must be a positive number"
    );
    expect(capacityError).toBeInTheDocument();
  });

  it('should display error text if "description" is empty', async () => {
    custRender({ route: "/spacecrafts/builder" });

    const buildingBtn = await screen.findByRole("button", {
      name: /Building.../i,
    });
    expect(buildingBtn).toBeInTheDocument();

    const buildBtn = await screen.findByText(/Build 🏗️/i);
    await act(async () => {
      await userEvent.click(buildBtn);
    });

    const capacityError = await screen.findByText("Description is required");
    expect(capacityError).toBeInTheDocument();
  });

  it("should display error message if building spacecraft fails", async () => {
    // Mock API call to simulate a failure
    vi.spyOn(SpaceTravelApi, "buildSpacecraft").mockRejectedValueOnce(
      new Error("Faild to create spacecraft")
    );

    custRender({ route: "/spacecrafts/builder" });

    const nameInput = screen.getByLabelText("Name:");
    const capacityInput = screen.getByLabelText("Capacity:");
    const descriptionInput = screen.getByLabelText("Description:");

    const buildBtn = await screen.findByText(/Build 🏗️/i);

    // Fill in the form fields with valid data
    await act(async () => {
      await userEvent.type(nameInput, "Test Spacecraft");
      await userEvent.type(capacityInput, "100");
      await userEvent.type(descriptionInput, "Test Description");

      // Submit the form
      await userEvent.click(buildBtn);
    });

    const errorMessage = await screen.findByText(
      "Failed to create spacecraft. Please try again."
    );
    expect(errorMessage).toBeInTheDocument();
  });

  it("should navigate back to spacecrafts page upon success and display list of spacecraft including newly built spacecraft", async () => {
    // Mock the API call to simulate successful spacecraft creation
    vi.spyOn(SpaceTravelApi, "buildSpacecraft").mockResolvedValueOnce({
      data: {
        id: "test spacecraft",
        name: "Test Spacecraft",
        capacity: 100,
        description: "Test Description",
      },
    });

    // Mock the API call to fetch list of spacecraft
    vi.spyOn(SpaceTravelApi, "getSpacecrafts")
      .mockResolvedValueOnce({
        data: [
          {
            id: "prispax",
            name: "Prispax",
            capacity: 10000,
            description: "A revolutionary spacecraft...",
          },
        ],
      })
      .mockResolvedValueOnce({
        data: [
          {
            id: "prispax",
            name: "Prispax",
            capacity: 10000,
            description: "A revolutionary spacecraft...",
          },
          {
            id: "test spacecraft",
            name: "Test Spacecraft",
            capacity: 100,
            description: "Test Description",
          },
        ],
      });

    custRender({ route: "/spacecrafts/builder" });

    const nameInput = screen.getByLabelText("Name:");
    const capacityInput = screen.getByLabelText("Capacity:");
    const descriptionInput = screen.getByLabelText("Description:");

    const buildBtn = await screen.findByText(/Build 🏗️/i);

    // Fill in the form fields with valid data
    await act(async () => {
      await userEvent.type(nameInput, "Test Spacecraft");
      await userEvent.type(capacityInput, "100");
      await userEvent.type(descriptionInput, "Test Description");

      // Submit the form
      await userEvent.click(buildBtn);
    });

    const newSpacecraft = await screen.findByText("Test Spacecraft");
    expect(newSpacecraft).toBeInTheDocument();
  });
});
