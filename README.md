# NEURONE Student Simulator Environment (NSE)

## Description

This repository contains the source code of an environment (interface) developed for the NEURONE Student Simulator (v2). It can be used to store multiple simulation settings and deploy the respective simulations, while presenting the user with a list of the actions performed by each simulated student. The environment also provides a drag-and-drop designer which can be used to create behavior models based on Markov Chains. These models are necessary for the simulations to be deployed.

## Main technologies used

Here's a list of the main technologies used for the environment. In certain cases, the version numbers used during development are mentioned, as well as the specific commands that were used to install said technologies. Further information on dependencies is available on the package.json files in both backend and frontend directories.

### Frontend

Web application framework:
- Angular v13.3.2 (with Angular CLI v13.3.2) (https://angular.io/)

For UI components:
- Angular Material [ng add @angular/material] (https://material.angular.io/)

For easier date formatting:
- Day.js [npm install --save dayjs] (https://day.js.org/)

For the simulation deploy timer:
- Angular-Cd-Timer [npm install angular-cd-timer] (https://www.npmjs.com/package/angular-cd-timer)

For internationalization:
- Angular Localize [ng add @angular/localize] (https://angular.io/api/localize)

For the behavior model drag-and-drop designer:
- JointJS [npm install --save jointjs] (https://www.jointjs.com/)
- jQuery [npm install --save jquery@3.6.0] (https://jquery.com/)
- Lodash [npm install --save lodash@4.17.21] (https://lodash.com/)
- Backbone.js [npm install --save backbone@1.4.0] (https://backbonejs.org/)
- JointJS types [npm install --save @types/jointjs]
- jQuery types [npm install --save @types/jquery]
- Lodash types [npm install --save @types/lodash]
- Backbone.js types [npm install --save @types/backbone]

### Backend

Javascript Runtime environment:
- NodeJS v16.15.1 (https://nodejs.org/)

Node.js framework:
- Express (https://expressjs.com/)

To prevent simultaneous backend operations which can conflict with each other:
- async-mutex [npm i async-mutex] (https://www.npmjs.com/package/async-mutex)

### Database

- MongoDB v4.2.3 (https://www.mongodb.com) (check the *Further notes* section for more information on the version number)

### Computer used for development

- Operating system: Linux Mint 20.3 "Una"
- Processor: Intel Core i3-7020U, 2 cores, 2.30 GHz
- 4 GB RAM

## Installation and configuration

1. Install the following technologies:
    - Node.js and npm (package manager)
    - MongoDB (tested with v4.2.3)
    - Angular
    - Docker (https://www.docker.com/)
2. Clone the NEURONE Student Simulator from the respective repo.
3. Install Docker, and create and start the simulator container by running the "runDocker.sh" script file in the simulator directory. As of August 2022, in a local environment, this exposes the `http://localhost:8000` port to communicate with the simulator (to start and stop simulation deploys).
4. Clone the NEURONE Student Simulator Environment from this repo.
5. Start the MongoDB service (tested with MongoDB v4.2.3).
6. In the "nse_backend" directory, open the "settings.env" file. Add the required settings: two MongoDB URLs (to respectively store the environment data and the student data generated by the simulator) and the URL to control the simulator (for example: `http://localhost:8000`). Note that both MongoDB URLs can reference the same MongoDB installation.
7. Run the "npm install" command inside the "nse_backend" directory.
8. Start the backend by running the "npm run dev" command. This will run the backend in development mode, but you can add more run configurations. If no problems are encountered, three messages will be displayed: one will state that the server is running, and the other two will report that the MongoDB connections were successful.
9. In the "nse_frontend" directory, open the "src/app/settings.ts" file. Add the required setting to point the frontend to the backend URL (for example: `http://localhost:4000`).
10. Run the "npm install" command inside the "nse_frontend" directory.
11. Start the frontend by running the "ng serve" command. This will run the frontend with a development server.
12. At this point, both the simulator environment and the simulator itself should be up and running. Use your browser to access the environment through the specific localhost port (for example: `http://localhost:4200`).
13. For internationalization, you will find a "messages.xlf" file in the "nse_frontend/src/locale" path. This file can be copied and modified to translate the interface into different languages. This contemplates all the text of the interfance, including date formatting and the paginator buttons (please do not delete or modify the "matpaginator-intl.ts" file, as it is necessary to facilitate the translation of the paginator). After creating the modified file, the "angular.json" file must be edited to add a new start configuration that will use the translated file. The frontend can then be started in a translated version.

## How to use

1. Begin by adding a behavior model, as no simulations can be created if there are no behavior models.
2. In the respective view, add nodes and connect them with links to create a behavior model. If you try to perform certain invalid actions, the interface will undo them and display an informative message. When finished, try to save the model. If there are any problems with the model you designed, a list of errors will be displayed below the diagram. You can fix them now or later, but the model will be labeled as invalid as long as errors exist.
3. Add a simulation. In the respective view, fill out the settings form and select the behavior model you created before. Save the simulation.
4. If the behavior model assigned to the simulation is not valid, the simulation will not be deployable. Make sure it is valid before trying to deploy.
5. Deploy the simulation. In the respective view, a list of student actions will appear and gradually increase in size. At some point, all simulated students will reach the end(s) of the behavior model, after which they will become inactive. However, this will not stop the simulation, per the design of the NEURONE Student Simulator.
6. If you try to leave the deploy view without manually stopping the simulation, a warning will be issued. If you choose to leave anyway, after a few seconds, the backend will stop the simulation by itself, having observed that the frontend has stopped making data requests (to add more actions to the student actions list).

## Explanation of main directories of the repo

### nse_backend
- config: Contains the "db.js" file, which creates the connections with the MongoDB database(s) needed for the environment and the simulator to work.
- controllers: Contains the controllers for simulations, behavior models, simulation deploy metadata, and the student data generated by the simulator.
- models: Contains the data models for simulations, behavior models, simulation deploy metadata, and the student data generated by the simulator.
- routes: Defines the URL routes to access the different controller methods.

### nse_frontend/src
- app: Contains the main frontend source code.
  - components: Contains the code of the different views the user sees when using the environment (TS, HTML and CSS files are included).
  - models: Contains the data models for simulations and behavior models.
  - services: Contains supplementary code that supports the components code.
    - JointJS: Contains code related to the behavior model drag-and-drop designer.
      - addNodes: Contains the code that defines each different type of node that can be added to a behavior model.
      - convertToJSON: Contains the code that takes a full behavior model (created with the JointJS library) and creates a simplified JSON from it, to be supplied to the NEURONE Student Simulator when deploying a simulation.
      - validateModel: Contains the code that checks a behavior model for numerous types of errors, from disconnected nodes and links, to illogical connections between nodes of different types.
- assets: Contains image files used in the interface.
- locale: Contains the files needed for internationalization settings (see the *Installation and configuration* section for more information).

## Further notes

- For the MongoDB database needed to store both the environment data and the student data generated by the NEURONE Student Simulator, version 4.2.3 was used, as when running the simulator using newer versions of Mongo, an error message appeared: "server returned error on SASL authentication step: BSON field 'saslContinue.mechanism' is an unknown field".
- For each simulation deploy, following the requeriments of the NEURONE Student Simulator, the environment creates a MongoDB database to store the simulator-generated data, adds a user with readWrite permissions to it, creates a simulation deploy metadata entry in a secondary MongoDB database, and deploys the simulation. After stopping the simulation, while the metadata entry is deleted, the database containing the simulator-generated data remains. This should potentially facilitate testing and monitoring of the environment and the simulator, as the generated-data won't immediately disappear once the simulation is stopped. Do keep in mind that the next time a simulation is deployed, all older databases (whose respective simulations have already been stopped) will be removed for cleanup. It's also worth mentioning that multiple simulations can be deployed simultaneously by one or more users, as both the environment and the simulator itself allow for this.
- **IMPORTANT**: In its present form, from the data stored by the NEURONE Student Simulator on MongoDB, it's possible to observe that, despite the fact the simulator allows the user to set intervals between student actions of less than one second, the simulator does not include millisecond granularity in its localTimestamp field for each saved student action. In other words, for all actions performed within the same second, it is not possible to tell which one came before the other. Even without the millisecond granularity, it would be possible to know the correct order if all actions were written into the same collection in order, but because they are spread through several collections, each one containing a different type of action, this is not possible. Therefore, given the current lack of millisecond granularity of the simulator, the student actions performed within the same second are not presented in order in the environment. However, all the actions that happened in a given second come before all actions that happened in the next second, and so on. If the NEURONE Student Simulator is modified to allow for millisecond granularity, no changes should be required in the environment for it to display the data correctly and in the proper order, as it is already formatted to display milliseconds, and it puts the data retrieved from MongoDB in order using the localTimestamp field.
- In both the frontend and backend source code, you will find multiple comments, containing explanations of what each function or method does, as well as each field of each data model. The comments also clarify other important aspects when this is considered necessary.
- As part of the creation of behavior models, the environment allows the user to store certain additional values for each node, such as the minimum and maximum transition times of the node. Currently, when converting a behavior model into the simplified JSON that the NEURONE Student Simulator requires, these additional values are not stored in said JSON, because, when testing a simulation deploy using the JSON with the additional properties in it, it was observed that the generation of actions by the simulator appeared to be interrupted before its expected end (based on the specific behavior model design). The code that allows these additional properties to be added to the simplified JSON remains, but is commented out. It can be found in certain files of the "convertToJSON" directory.

*This document was written on August 2022.*
