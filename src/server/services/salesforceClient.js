const jsforce = require('jsforce');
const { getToken } = require('salesforce-jwt-bearer-token-flow');

module.exports = class SalesforceClient {
    client;

    /**
     * Connects to Salesforce using jsForce
     * @param {string} loginUrl
     * @param {string} username
     * @param {string} clientId
     * @param {string} jwtKey
     */
    async connect(loginUrl, username, clientId, jwtKey) {
        try {
            const client = new jsforce.Connection();

            getToken({
              iss: clientId,
              sub: username,
              aud: loginUrl,
              privateKey: jwtKey
            }, function(err, response) {
                if (err) {
                  console.error(err);
                } else {
                  client.initialize({
                    instanceUrl: response.instance_url,
                    accessToken: response.access_token
                  });
                  console.log('Successfully connected to Org');
                  this.client = client;
                }
              }
            );


            //const loginResult = await client.login(username, password);
            //console.log(
              //  `Connected to Salesforce org ${loginResult.organizationId}: ${client.instanceUrl}`
            //);
            //this.client = client;
        } catch (err) {
            throw new Error(`Failed to connect to Salesforce: ${err}`);
        }
    }
};
