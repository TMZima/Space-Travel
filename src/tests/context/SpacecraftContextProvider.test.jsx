import { render } from "@testing-library/react";
import { act } from "react";
import SpacecraftContextProvider from "../../context/SpacecraftContextProvider";
import SpacecraftContext from "../../context/SpacecraftContext";
import SpaceTravelApi from "../../services/SpaceTravelApi";

const mockSpacecrafts = [
  { id: "1", name: "Apollo 11" },
  { id: "2", name: "Challenger" },
];

describe("SpacecraftContextProvider", () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it("should fetch and provide spacecraft data", async () => {
    vi.spyOn(SpaceTravelApi, "getSpacecrafts").mockResolvedValueOnce({
      data: mockSpacecrafts,
    });

    const TestComponent = () => {
      const { spacecrafts, loading, error } =
        React.useContext(SpacecraftContext);
      if (loading) return <div>Loading...</div>;
      if (error) return <div>{error}</div>;
      return (
        <ul>
          {spacecrafts.map((craft) => (
            <li key={craft.id}>{craft.name}</li>
          ))}
        </ul>
      );
    };

    render(
      <SpacecraftContextProvider>
        <TestComponent />
      </SpacecraftContextProvider>
    );

    for (const craft of mockSpacecrafts) {
      expect(await screen.findByText(craft.name)).toBeInTheDocument();
    }
  });

  it("should handle errors when fetching spacecraft data", async () => {
    vi.spyOn(SpaceTravelApi, "getSpacecrafts").mockRejectedValueOnce(
      new Error("Error fetching spacecraft")
    );

    const TestComponent = () => {
      const { loading, error } = React.useContext(SpacecraftContext);
      if (loading) return <div>Loading...</div>;
      if (error) return <div>{error}</div>;
      return null;
    };

    render(
      <SpacecraftContextProvider>
        <TestComponent />
      </SpacecraftContextProvider>
    );

    expect(
      await screen.findByText("Error fetching spacecraft. Please try again.")
    ).toBeInTheDocument();
  });

  it("should handle spacecraft decommissioning", async () => {
    vi.spyOn(SpaceTravelApi, "getSpacecrafts").mockResolvedValueOnce({
      data: mockSpacecrafts,
    });
    vi.spyOn(SpaceTravelApi, "destroySpacecraftById").mockResolvedValueOnce({});

    const TestComponent = () => {
      const { spacecrafts, handleDestroySpacecraft } =
        React.useContext(SpacecraftContext);
      return (
        <div>
          <ul>
            {spacecrafts.map((craft) => (
              <li key={craft.id}>{craft.name}</li>
            ))}
          </ul>
          <button onClick={() => handleDestroySpacecraft("1")}>
            Decommission Apollo 11
          </button>
        </div>
      );
    };

    render(
      <SpacecraftContextProvider>
        <TestComponent />
      </SpacecraftContextProvider>
    );

    for (const craft of mockSpacecrafts) {
      expect(await screen.findByText(craft.name)).toBeInTheDocument();
    }

    const button = screen.getByText("Decommission Apollo 11");
    await act(async () => {
      await userEvent.click(button);
    });

    expect(await screen.queryByText("Apollo 11")).not.toBeInTheDocument();
  });
});
