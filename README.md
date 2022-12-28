# Pub Sub API Demo

This demo is built with the Lightning Web Runtime and demonstrates the use of the Pub Sub API with Platform Events.

## Installation

You can either install the app on

-   [Heroku](#heroku-deploy) (quick deployment for demo purposes)
-   your [local machine](#local-setup) (prefered for development purposes)

### Heroku deploy

Click on this button and follow the instructions to deploy the app:

<p align="center">
  <a href="https://heroku.com/deploy?template=https://github.com/rwegner7/heroku-pubsub-2">
    <img src="https://www.herokucdn.com/deploy/button.svg" alt="Deploy">
  </a>
<p>

Once deployed, see the [configuration reference](#configuration-reference) section for configuring the environment variables.

### Local setup

1. Create a `.env` file at the root of the project:

    ```properties
    SALESFORCE_LOGIN_URL="https://test.salesforce.com"
    SALESFORCE_API_VERSION="55.0"
    SALESFORCE_USERNAME="YOUR_SALESFORCE_USERNAME"
    SALESFORCE_CLIENTID="YOUR_SALESFORCE_CONNECTED_APP_CLIENTID"
    SALESFORCE_KEY="YOUR_CERTIFICATE_PRIVATE_KEY"
    PUB_SUB_ENDPOINT="api.pubsub.salesforce.com:7443"
    PUB_SUB_PROTO_FILE="pubsub_api.proto"
    ```

1. Update the property values by referring to the [configuration reference](#configuration-reference) section

1. Install the project with `npm install`

1. Run the project with `npm start`

## Configuration reference

All variables are required.

| Variable                 | Description                                                                                                                                                                     | Example                          |
| ------------------------ | ------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- | -------------------------------- |
| `SALESFORCE_LOGIN_URL`   | The login URL of your Salesforce org:<br>`https://test.salesforce.com/` for scratch orgs and sandboxes<br/>`https://login.salesforce.com/` for Developer Edition and production | `https://test.salesforce.com`    |
| `SALESFORCE_API_VERSION` | The Salesforce API version.                                                                                                                                                     | `55.0`                           |
| `SALESFORCE_USERNAME`    | Your Salesforce username.                                                                                                                                                       | n/a                              |
| `SALESFORCE_CLIENTID`    | Your Salesforce connected app client id.                                                                                                                                        | n/a                              |
| `SALESFORCE_KEY`         | Your certificate's private key.                                                                                                                                                 | n/a                              |
| `PUB_SUB_ENDPOINT`       | The endpoint used by the Pub Sub API.                                                                                                                                           | `api.pubsub.salesforce.com:7443` |
| `PUB_SUB_PROTO_FILE`     | Path to the protobuf file.                                                                                                                                                      | `pubsub_api.proto`               |
