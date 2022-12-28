import { LightningElement, api } from 'lwc';

export default class CaseCard extends LightningElement {
    @api caseId;
    @api case;

    handleStatusClick(event) {
        event.preventDefault();
        event.stopPropagation();
        this.template.querySelector('.card').classList.add('slide-right');

        const { status } = event.currentTarget.dataset;
        const eventData = { detail: { caseId: this.caseId, status } };
        this.dispatchEvent(new CustomEvent('statuschange', eventData));
    }
}
