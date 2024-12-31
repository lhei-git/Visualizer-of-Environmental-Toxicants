# Visualizer of Environmental Health Risks (previously VET)
![Build Status](https://github.com/lhei-git/ToxicantVisualizer/actions/workflows/deploy.yml/badge.svg)

Fall 2023 Capstone Project

## Contributing
1. Select an issue to write code for. If no issue exists for the addition you would like to make, create one. 
2. Create a branch based on your name or the feature you would like to work on, off of `main` with a format such as `feature/*` (ex. `feature/maps`). Keep branch names short: the suffix should be a one or two-word descriptor for the feature you are writing.
3. Make incremental commits to this branch. Smaller, more frequent commits are recommended. 
4. Create a Pull Request into `main` once your work is completed. PR candidate code must run without errors.
    4.1. Add at least one reviewer to your PR. Anyone can review, but a PR requires at least one approval before it can be merged. 
5. Once a PR is approved, either the approving reviewer or the creator of the PR can merge it into `main`. 

## Development

### Requirements
- Docker
- Docker-compose
- `.env` file in frontend/ ([see frontend/README.md](frontend/README.md))
- pg_dump file of VET postgres database in backend/pg_dump/

### Docker

Docker is a container runtime that allows fine control over the development and production environment. We will use it to run the frontend, backend, and sql database in unison to match the remote environment.

https://www.docker.com/products/docker-desktop
https://docs.docker.com/compose/ 

The [docker-compose.yml](docker-compose.yml) file includes services for the React.js frontend development server, the Django backend development server, a Postgres database, and an Nginx server hosting the static files created by a production build of the frontend (for presentations). 

After installation of Docker and Docker-compose, the application can be run by opening a terminal window and navigating to the directory of the project folder. Type and enter `docker-compose up` to get the project loaded into Docker. 

After the process has completed, go to the Docker Desktop application and click on the Containers tab. Here, you will see the project container and be able to press the play button to start the application. Once all 4 parts of the container are running, open a new browser tab and enter `localhost:3000` into the URL.

### EPH API

Beginning with the Fall 2023 Capstone group, this project obtains data from the CDC's Environmental Public Health Tracking API. If any more endpoints are added to they code, they should include our teams unique API token at the end of the endpoint as follows:

[API endpoint]?apiToken=BDB5CA62-FE5C-4608-A621-D4B198DF7744

The user guide and more information on the API can be found at the link below:

https://ephtracking.cdc.gov/apihelp
