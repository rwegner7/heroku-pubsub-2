/* eslint-disable no-console */
import { LightningElement, track, wire } from 'lwc';
import { WebSocketClient } from 'utils/webSocketClient';
import getCases from 'data/wireCases';

const DELETE_ANIMATION_DURATION = 1500;

export default class App extends LightningElement {
    @track cases = [];

    @wire(getCases)
    getCases({ error, data }) {
        if (data) {
            this.cases = data;
        } else if (error) {
            console.error('Failed to retrieve cases', JSON.stringify(error));
        }
    }

    connectedCallback() {
        // Get WebSocket URL
        const wsUrl =
            (window.location.protocol === 'http:' ? 'ws://' : 'wss://') +
            window.location.host +
            '/websockets';
        // Connect WebSocket
        this.ws = new WebSocketClient(wsUrl);
        this.ws.connect();
        this.ws.addMessageListener((message) => {
            this.handleWsMessage(message);
        });
    }

    disconnectedCallback() {
        this.ws.close();
    }

    handleWsMessage(message) {
        if (message?.type === 'caseEvent') {
            const { caseId, status } = message.data;
            if (status === 'New') {
                this.removeCase(caseId);
            } else if (status === 'Escalated') {
                this.loadCase(caseId);
            }
        }
    }

    loadCase(caseId) {
        const index = this.cases.findIndex((c) => c.Id === caseId);
        if (index === -1) {
            fetch(`/api/case/${caseId}`)
                .then((response) => {
                    if (!response.ok) {
                        throw new Error('No response from server');
                    }
                    return response.json();
                })
                .then((result) => {
                    this.cases.push(result.data);
                });
        }
    }

    removeCase(caseId) {
        const index = this.cases.findIndex((c) => c.Id === caseId);
        // eslint-disable-next-line @lwc/lwc/no-async-operation
        setTimeout(() => {
            this.cases.splice(index, 1);
        }, DELETE_ANIMATION_DURATION);
    }

    handleStatusChange(event) {
        const { caseId } = event.detail;
        const index = this.cases.findIndex((c) => c.Id === caseId);
        if (index !== -1) {
            const eventData = {
                type: 'manufacturingEvent',
                data: event.detail
            };
            console.log('WS send: ', eventData);
            this.ws.send(JSON.stringify(eventData));
            this.removeCase(caseId);
        }
    }

    get hasCases() {
        return this.cases.length > 0;
    }
}
