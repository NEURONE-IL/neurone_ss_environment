# NEURONE Student Simulator Environment (NSE)

## Description

This repository contains the source code of an environment (interface) developed for the NEURONE Student Simulator (v2). It can be used to store multiple simulation settings, and deploy the respective simulations, while presenting the user with a list of the actions performed by each simulated student. The environment also provides a drag-and-drop designer which can be used to create behavior models based on Markov Chains. These models are necessary for the simulations to be deployed.

## Main technologies used

Here's a list of the main technologies used for the environment. In certain cases, the version numbers used during development are mentioned, as well as the specific commands that were used to install said technologies. Further information on dependencies is available on the package.json files in both backend and frontend directories.

### Frontend

Web application framework:
- Angular 13.3.2 (with Angular CLI 13.3.2)

For UI components:
- Angular Material [ng add @angular/material]

For easier date formatting:
- Day.js [npm install --save dayjs]

For the simulation deploy timer:
- Angular-Cd-Timer [npm install angular-cd-timer]

For internationalization:
- Angular Localize [ng add @angular/localize]

For the functionality of behavior model design:
- JointJS [npm install --save jointjs]
- jQuery [npm install --save jquery@3.6.0]
- Lodash [npm install --save lodash@4.17.21]
- Backbone [npm install --save backbone@1.4.0]
- JointJS types [npm install --save @types/jointjs]
- jQuery types [npm install --save @types/jquery]
- Lodash types [npm install --save @types/lodash]
- Backbone types [npm install --save @types/backbone]

### Backend

Javascript Runtime environment:
- NodeJS

NodeJS framework:
- Express

To prevent simultaneous backend operations which can conflict with each other:
- async-mutex [npm i async-mutex]

### Database

- MongoDB 4.2.3 (check the important notes section for more information on the version number)

## Installation and configuration

- Installation
- Configuration of settings files (FRONTEND: src/app/settings.ts) (BACKEND: settings.env)
- For internationalization, you will find a "messages.xlf" file in the "nse_frontend/src/locale" path. This file can be copied and modified to translate the interface into different languages. This contemplates all the text of the interface, including date formatting and the paginator buttons. Please do not delete or modify the "matpaginator-intl.ts" file, as it is necessary to facilitate the translation of the paginator.

## Notes

- For the MongoDB database needed to store both the environment data and the student data generated by the NEURONE Student Simulator, version 4.2.3 was used, as when running the simulator using newer versions of Mongo, an error message appeared: "server returned error on SASL authentication step: BSON field 'saslContinue.mechanism' is an unknown field".
- For each simulation deploy, following the requeriments of the NEURONE Student Simulator, the environment creates a MongoDB database to store the simulator-generated data, adds a user with readWrite permissions to it, creates a simulation deploy metadata entry in a secondary MongoDB database, and deploys the simulation. After stopping the simulation, while the metadata entry is deleted, the database containing the simulator-generated data remains. This should potentially facilitate testing and monitoring of the environment and the simulator, as the generated-data won't immediately disappear once the simulation is stopped. Do keep in mind that the next time a simulation is deployed, all older databases (whose respective simulations have already been stopped) will be removed for cleanup.
- **IMPORTANT**: In its present form, from the data stored by the NEURONE Student Simulator on MongoDB, it's possible to observe that, despite the fact the simulator allows the user to set intervals between student actions of less than one second, the simulator does not include millisecond granularity in its localTimestamp field for each saved student action. In other words, for all actions performed within the same second, it is not possible to tell which one came before the other. Even without the millisecond granularity, it would be possible to know the correct order if all actions were written into the same collection in order, but because they are spread through several collections, each one containing a different type of action, this is not possible. Therefore, given the current lack of millisecond granularity of the simulator, the student actions performed within the same second are not presented in order in the environment. However, all the actions that happened in a given second come before all actions that happened in the next second, and so on. If the NEURONE Student Simulator is modified to allow for millisecond granularity, no changes should be required in the environment for it to display the data correctly and in the proper order, as it is already formatted to display milliseconds, and it puts the data retrieved from MongoDB in order using the localTimestamp field.
- In both the frontend and backend source code, you will find multiple comments, containing explanations of what each function or method does, as well as each field of each data model. The comments also clarify other important aspects when this is considered necessary.
- Commented lines that allow addition of additional properties in simplified behavior model JSON

*This document was written on August 2022.*
