module.exports = class CaseRestResource {
    constructor(sfdc) {
        this.sfdc = sfdc;
    }

    getCases(request, response) {
        const soql = `SELECT Id, Name, Account.Name, Status FROM Case WHERE Status='New'`;
        this.sfdc.query(soql, (err, result) => {
            if (err) {
                console.error(err);
                response.sendStatus(500);
            } else {
                response.send(result.records);
            }
        });
    }

    getCase(request, response) {
        const { caseId } = request.params;
        const soql = `SELECT Id, Name, Account.Name, Status FROM Case WHERE Id='${caseId.replace(
            "'",
            ''
        )}'`;
        this.sfdc.query(soql, (err, result) => {
            if (err) {
                console.error(err);
                response.sendStatus(500);
            } else if (result.records.length === 0) {
                response.status(404).send('Case not found.');
            } else {
                const data = result.records[0];
                response.send({ data });
            }
        });
    }
};
