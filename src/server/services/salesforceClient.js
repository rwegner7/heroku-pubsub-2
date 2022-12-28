const jsforce = require('jsforce');
const { getToken } = require('sf-jwt-token');

module.exports = class SalesforceClient {
    client;

    /**
     * Connects to Salesforce using jsForce
     * @param {string} loginUrl
     * @param {string} username
     * @param {string} password
     * @param {string} version
     */
    async connect(loginUrl, username, password, version) {
        try {
            const client = new jsforce.Connection({
                loginUrl,
                version
            });
            const loginResult = await client.login(username, password);
            console.log(
                `Connected to Salesforce org ${loginResult.organizationId}: ${client.instanceUrl}`
            );
            this.client = client;
        } catch (err) {
            throw new Error(`Failed to connect to Salesforce: ${err}`);
        }
    }

    async jwtConnect(loginUrl, username, version, clientId, privateKey) {
        try {
            const conn = new jsforce.Connection({
                loginUrl,
                version
            });

            const loginRes = await getToken({
                iss: clientId,
                sub: username,
                aud: loginUrl,
                privateKey: privateKey
            });

            console.log(JSON.stringify(loginRes));

            conn.initialize({
                instanceUrl: loginRes.instance_url,
                accessToken: loginRes.access_token
            });
        } catch (err) {
            throw new Error(`Failed to connect with jwt to Salesforce: ${err}`);
        }
    }
};
