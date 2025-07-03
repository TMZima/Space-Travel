import { render } from "@testing-library/react";
import { act } from "react";
import SpacecraftCard from "../../components/Spacecraft/SpacecraftCard";
import SpaceTravelApi from "../../services/SpaceTravelApi";
import { beforeEach } from "vitest";

describe("SpacecraftCard", () => {
  const mockProps = {
    id: "prispax",
    name: "Prispax",
    capacity: 10000,
    pictureUrl: null,
    onViewDetails: vi.fn(),
    onDecommission: vi.fn(),
    onError: vi.fn(),
  };

  beforeEach(() => {
    vi.clearAllMocks();
  });

  it("should render the spacecraft card with default picture", () => {
    render(<SpacecraftCard {...mockProps} />);

    expect(screen.getByText("🚀")).toBeInTheDocument();
    expect(screen.getByText("Prispax")).toBeInTheDocument();
    expect(screen.getByText("Capacity: 10000")).toBeInTheDocument();
  });

  it("should call onViewDetails when 'View Details' button is clicked", async () => {
    render(<SpacecraftCard {...mockProps} />);

    await userEvent.click(screen.getByText(/View Details/i));
    expect(mockProps.onViewDetails).toHaveBeenCalled();
  });

  it("should call onDecommission and handle loading state when 'Decommission' button is clicked", async () => {
    vi.spyOn(SpaceTravelApi, "destroySpacecraftById").mockResolvedValueOnce({
      isError: false,
    });

    render(<SpacecraftCard {...mockProps} />);
    const decommissionButton = await screen.findByRole("button", {
      name: /Decommission/i,
    });

    await act(async () => {
      userEvent.click(decommissionButton);
    });

    expect(await screen.findByText(/Decommissioning.../i)).toBeInTheDocument();
    expect(SpaceTravelApi.destroySpacecraftById).toHaveBeenCalledWith({
      id: "prispax",
    });

    expect(await screen.findByText(/Decommission/i)).toBeInTheDocument();
    expect(mockProps.onDecommission).toHaveBeenCalledWith("prispax");
  });

  it("should call onError if decommissioning fails", async () => {
    vi.spyOn(SpaceTravelApi, "destroySpacecraftById").mockRejectedValue(
      new Error("Error decommissioning spacecraft")
    );

    render(<SpacecraftCard {...mockProps} />);
    const decommissionButton = screen.getByRole("button", {
      name: /Decommission/i,
    });

    await act(async () => {
      await userEvent.click(decommissionButton);
    });

    await screen.findByText(/Decommission/i);

    expect(mockProps.onError).toHaveBeenCalledWith(
      "Failed to decommission spacecraft. Please try again."
    );
  });
});
