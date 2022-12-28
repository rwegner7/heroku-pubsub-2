const Configuration = require('./utils/configuration.js'),
    WebSocketService = require('./services/webSocketService.js'),
    SalesforceClient = require('./services/salesforceClient.js'),
    PubSubService = require('./services/pubSubService.js'),
    CaseRestResource = require('./api/caseRestResource.js'),
    LWR = require('lwr');

const CASE_CDC_TOPIC = '/data/CaseChangeEvent';
const CASE_RESPONSE_PE_TOPIC = '/event/Case_Response__e';

async function start() {
    Configuration.checkConfig();

    // Configure server
    const lwrServer = LWR.createServer();
    const app = lwrServer.getInternalServer();
    const wss = new WebSocketService();

    // Connect to Salesforce with JWT auth
    const sfClient = new SalesforceClient();

    await sfClient.connect(
        Configuration.getSfLoginUrl(),
        Configuration.getSfUsername(),
        Configuration.getSfApiVersion(),
        Configuration.getSfClientId(),
        Configuration.getSfKey()
    );

    // Use Pub Sub API to retrieve streaming event schemas
    const pubSub = new PubSubService(
        Configuration.getPubSubProtoFilePath(),
        Configuration.getPubSubEndpoint(),
        sfClient.client
    );
    const [caseCdcSchema, responsePeSchema] = await Promise.all([
        pubSub.getEventSchema(CASE_CDC_TOPIC),
        pubSub.getEventSchema(CASE_RESPONSE_PE_TOPIC)
    ]);

    // Subscribe to Change Data Capture events on case records
    pubSub.subscribe(CASE_CDC_TOPIC, caseCdcSchema, 10, (cdcEvent) => {
        const status = cdcEvent.payload.Status?.string;
        console.log('received <<< ' + JSON.stringify(cdcEvent));
        const header = cdcEvent.payload.ChangeEventHeader;
        // Filter events related to case status updates
        if (status) {
            header.recordIds.forEach((caseId) => {
                // Notify client via WebSocket
                const message = {
                    type: 'caseEvent',
                    data: {
                        caseId,
                        status
                    }
                };
                wss.broadcast(JSON.stringify(message));
            });
        }
    });

    // Handle incoming WS events
    wss.addMessageListener(async (message) => {
        const { caseId, status } = message.data;
        const eventData = {
            CreatedDate: Date.now(),
            CreatedById: sfClient.client.userInfo.id,
            CaseId__c: { string: caseId },
            Status__c: { string: status }
        };
        await pubSub.publish(
            CASE_RESPONSE_PE_TOPIC,
            responsePeSchema,
            eventData
        );
        console.log('Published Case_Response__e', eventData);
    });

    // Setup REST resources
    const caseRest = new CaseRestResource(sfClient.client);
    app.get('/api/case', (request, response) => {
        caseRest.getCases(request, response);
    });
    app.get('/api/case/:caseId', (request, response) => {
        caseRest.getCase(request, response);
    });

    // HTTP and WebSocket Listen
    wss.connect(lwrServer.server);
    lwrServer
        .listen(({ port, serverMode }) => {
            console.log(
                `App listening on port ${port} in ${serverMode} mode\n`
            );
        })
        .catch((err) => {
            console.error(err);
            process.exit(1);
        });
}

start();
