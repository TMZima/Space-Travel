## API 🔌

Our back-end engineers have developed an API for the web application. For this project, you are given a mock API in the starter code that stores the data in the local storage. You shouldn't touch the `/services/SpaceTravelMockApi.js` file, which mimics the back-end. Instead, you should use `/services/SpaceTravelApi.js`, which uses the API. In real life, you should create such a file that uses the `axios` library to use an API.

Hint: You can clear the local storage to start from scratch.

### Data Structures

#### Response

```JavaScript
{
  isError: <boolean>,
  data: <any>
}
```

#### Planet

```JavaScript
{
  id: <int>, // means data type is an integer
  name: <string>,
  currentPopulation: <int>,
  pictureUrl: [<string>] // means optional
}
```

#### Spacecraft

```JavaScript
{
  id: <string>,
  name: <string>,
  capacity: <int>,
  description: <string>,
  pictureUrl: [<string>],
  currentLocation: <int>
}
```

### Methods

#### getPlanets

`getPlanets (): Array<planet>`
Fetches all planets.

#### getSpacecrafts

`getSpacecrafts (): Array<spacecraft>`
Fetches all spacecraft.

#### getSpacecraftById

`getSpacecraftById ({id: <string>}): <spacecraft>`
Fetches a spacecraft by its ID.

#### buildSpacecraft

`createSpacecraft ({name: <string>, capacity: <int>, description <string>, pictureUrl: [<string>]}): void // means pictureUrl is optional`
Builds a spacecraft on the Earth by generating an ID.

#### destroySpacecraftById

`destroySpacecraftById ({id: <int>}): void`
Deletes a spacecraft by its ID.

#### sendSpacecraftToPlanet

`sendSpacecraftToPlanet ({spacecraftId: <string>, targetPlanetId: <int>}): void`
Transfer people by sending the spacecraft from its currently located planet to the target planet.

- If the capacity is greater than the current population of the currently located planet, it fills as much as it gets.
- Throws an error if the target planet is the same as the currently located planet.

## Folder Structure

The folder structure designed by our software architects ensures adherence to best practices:

- `components`: Contains components that are used as building blocks for pages.
- `context`: Contains providers that enable consuming components to subscribe to context changes.
- `pages`: Contains components that are used as a page. Pages are the components used to be rendered by a route.
- `routes`: Contains components that have route rendering logic.
- `services`: Contains services to reach external APIs.

This project employs CSS modules for component-specific styling and embraces the BEM methodology for naming conventions. Aspired developers are encouraged to explore these practices further.

View the rubric for this assessment [here](https://storage.googleapis.com/hatchways.appspot.com/employers/springboard/student_rubrics/Space%20Travel%20Rubric.pdf)
