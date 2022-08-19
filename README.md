# NEURONE Student Simulator Environment (NSE)
*Developed in 2022 by Mateo Sepúlveda*

## Description

## Technologies employed

### Frontend

Framework:
- Angular (and Angular CLI)

For UI components:
- Angular Material [ng add @angular/material]

For easier date formatting:
- Day.js [npm install --save dayjs]

For the simulation deploy timer:
- Angular-Cd-Timer [npm install angular-cd-timer]

For internationalization:
- Angular Localize

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

- NodeJS
- Express
- async-mutex

### Database

- MongoDB

## Installation and configuration

- Installation
- Configuration of settings files (FRONTEND: src/app/settings.ts) (BACKEND: settings.env)
- Internationalization

## Operation

For each deploy, the environment creates a database, adds a readWrite user, creates a metadata entry in another table, and deploys using said database. After stopping the simulation, the database remains but is deleted when the next deploy is started.

## Important notes

- MongoDB version used
- Timestamps from simulator
- Comments on each function and a few additional explanatory comments
- Commented lines that allow addition of additional properties in simplified behavior model JSON

## Further reading

- Thesis
