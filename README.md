# Preparation for development

## Create a Google Apps Script project

- Log in to Google Drive
- Create a new Google Apps Script project

## Install npm modules

- run `make init`

## Create gapps.config.json

- create a gapps.config.json file from a sample file
  - cp gapps.config.json.sample gapps.config.json
- change `fileId` to an exact one that you created

## Authenticate your Google account

Skip this step if you already have a google developer project which enables Google Drive API

- Create a new project on [Google Developer Console](https://console.developers.google.com/)
- Enable `Google Drive API`
- Create a credential
- Download `client_secret.json`
- run `make auth`
- remove `client_secret.json`
  - client_secret.json is no longer needed once you are authenticated.

## Add dependent libraries

- SlackApp: M3W5Ut3Q39AaIwLquryEPMwV62A3znfOO
