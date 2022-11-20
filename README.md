# Gateways Project

This is a project that allows the storage, creation, update and deletion of gateway devices. It uses mongoBD as a database to store gateways and its associated peripherals. It is made with MUI and TailwindCSS for visual components.

### Prerequisites
You need create a .env file that contains the variable:
REACT_APP_API: Backend url for the aplication.

## Getting Started
To get you started you can simply clone the repository:

```
git clone https://github.com/tonysantana1492/gateways-frontend
```
and install the dependencies
```
npm install
```

## Run

To run the program just press the command
```
npm start
``` 

## Test

This project uses 2 different technologies to test the components. Testing-library and Jest are used for some unit tests and the rest of the unit, integration and e2e tests are done with Cypress. To run the tests of the testing library, the following command must be put in the console:
```
npm run test
```
and follow the instructions. It must be verified that all the tests passed correctly.

To see the cover test run the command:
```
npm run test:cov
```
To test the Cypress tests, it can be done in two different ways: the first is to run the tests in the background and obtain a report on the console of the tests carried out, this is done with the command:
```
npx cypress run
```

The second way is by setting up a visual interface and running the tests manually, selecting a predefined browser and seeing everything as if it were a user interacting with the application. To use this way, use the command:
```
npx cypress open
```

## File and folder structure

"**/**": It contains the package.json files with the project dependencies, the gitignore to select the files or folders that are not included in version control, and this README file.

"**/cypress**": It contains all the configuration and tests for Cypress.

"**/node_modules**": It contains all the node modules needed to run the application.

"**/public**": It contains the images for the PWA creation for the application and the index.html where the React application is mounted.

"**/src/\_\_test\_\_**": Contains all the tests of the application.

"**/src/components**": It is where all the global components of the application are located.

"**/src/pages**": It is where all the pages of the application are located.

"**/src/utils**": Contains custom hook for http request and constant definitions.

"**src/styles**": Contains components styles.
