// helper function to check if the specified elements are present in the document.
const checkElements = (elements) => {
  elements.forEach((element) => {
    expect(screen.getByText(element)).toBeInTheDocument();
  });
};

// test data
const heading = "Space Travel: Expanding Horizons Beyond Earth";

const subheadings = [
  "🌌 Journey into the Future",
  "🌎 From Neglect to Innovation",
  "🚀 Enter Space Travel: Where Dreams Take Flight",
  "🔧 Engineer, Explorer, Leader",
  "🌠 A Universe of Possibilities Awaits",
];

const paragraphs = [
  "In a world where the impossible has become reality, where the stars are no longer out of reach, welcome to the future of humanity's survival and exploration. Witness the evolution of technology as it transforms barren planets into thriving havens, all made possible by the wonders of innovation and human determination.",
  "Once the cradle of civilization, Earth now stands as a solemn reminder of the consequences of neglect and environmental decline. But fear not, for the ingenuity of mankind has soared to new heights. With our relentless pursuit of advancement, we have not only healed our scars but extended our reach across the cosmos.",
  `Embark on an extraordinary journey with our groundbreaking web application, aptly named "Space Travel." As a commander engineer, the fate of humanity's exodus rests in your capable hands. Prepare to face the ultimate challenge: evacuating humankind from their birthplace and guiding them towards a future among the stars.`,
  "Space Travel empowers you to engineer, design, and even dismantle spacecraft. Craft vessels that defy the boundaries of imagination, envisioning a future where life flourishes beyond the stars. But remember, your role extends beyond construction - you are a leader, an explorer, a commander steering humanity's destiny.",
  "Immerse yourself in the thrill of exploration as you chart interplanetary courses within our solar system. Seamlessly navigate your fleet of spacecraft, hurtling through the cosmic void from one celestial body to another. The universe becomes your playground, and every planet a potential new home.",
];

describe("HomePage", () => {
  it("should render the heading", () => {
    custRender({ route: "/" });

    checkElements([heading]);
  });

  it("should render the subheadings when app is launched", () => {
    custRender({ route: "/" });

    checkElements(subheadings);
  });

  it("should render the paragraphs when app is launched", () => {
    custRender({ route: "/" });

    checkElements(paragraphs);
  });
});
