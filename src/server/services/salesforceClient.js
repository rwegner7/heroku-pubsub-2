const jsforce = require('jsforce');
const { getToken } = require('sf-jwt-token');

module.exports = class SalesforceClient {
    client;

    /**
     * Connects to Salesforce using jsForce
     * @param {string} loginUrl
     * @param {string} username
     * @param {string} version
     * @param {string} clientId
     * @param {string} privateKey
     */

    async connect(loginUrl, username, version, clientId, privateKey) {
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

            const responseId = loginRes.id;
            const organizationId = responseId.substring(
                responseId.indexOf('id') + 3,
                responseId.lastIndexOf('/')
            );

            console.log(
                'Jwt connected to Salesforce org: ' + loginRes.instance_url
            );
            console.log('Tenant Id: ' + organizationId);

            conn.initialize({
                instanceUrl: loginRes.instance_url,
                accessToken: loginRes.access_token
            });

            this.client = conn;
            this.client.organizationId = organizationId;
        } catch (err) {
            throw new Error(`Jwt failed to connect to Salesforce: ${err}`);
        }
    }
};
