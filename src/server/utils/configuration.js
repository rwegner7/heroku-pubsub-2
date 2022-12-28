// Load  config
require('dotenv').config();

module.exports = class Configuration {
    static checkConfig() {
        [
            'SALESFORCE_LOGIN_URL',
            'SALESFORCE_API_VERSION',
            'SALESFORCE_USERNAME',
            'SALESFORCE_PASSWORD',
            'SALESFORCE_TOKEN',
            'SALESFORCE_CLIENTID',
            'SALESFORCE_JWT_KEY',
            'PUB_SUB_ENDPOINT',
            'PUB_SUB_PROTO_FILE'
        ].forEach((varName) => {
            if (!process.env[varName]) {
                console.error(`ERROR: Missing ${varName} environment variable`);
                process.exit(-1);
            }
        });
    }

    static getSfLoginUrl() {
        return process.env.SALESFORCE_LOGIN_URL;
    }

    static getSfApiVersion() {
        return process.env.SALESFORCE_API_VERSION;
    }

    static getSfUsername() {
        return process.env.SALESFORCE_USERNAME;
    }

    static getSfClientId() {
        return process.env.SALESFORCE_CLIENTID;
    }

    static getSfJwtKey() {
        return process.env.SALESFORCE_JWT_KEY;
    }

    static getSfSecuredPassword() {
        return process.env.SALESFORCE_PASSWORD + process.env.SALESFORCE_TOKEN;
    }

    static getPubSubEndpoint() {
        return process.env.PUB_SUB_ENDPOINT;
    }

    static getPubSubProtoFilePath() {
        return process.env.PUB_SUB_PROTO_FILE;
    }
};
