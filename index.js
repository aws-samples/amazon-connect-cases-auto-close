const queueUrl = process.env.QueueUrl;
const deleteSQS = require('./sqs/deleteSQS.js') 
const caseInfo = require('./dynamodb/caseInfo.js')
const constants = require('./common/constants.js') 
const caseCommonFunction = require('./common/caseCommonFunction.js')

exports.handler = async (event) => {
    // TODO implement
    console.info('received:', JSON.stringify(event) );
    
    for (let i = 0; i < event.Records.length; i++) {
        const eventJson = JSON.parse(event.Records[i].body)
        await deleteSQS.delete(queueUrl, event.Records[i].receiptHandle);
        await processRecords(eventJson);
    }
};

async function processRecords(eventJson){
    const eventType = eventJson.detail.eventType;

    if(eventType.includes('CASE.')){
        console.log('eventType', eventType);

        // Case Created Event
        if(eventType.includes('CASE.CREATED')){
            const caseId = eventJson.detail.case.caseId ? eventJson.detail.case.caseId : ''
            const templateId = eventJson.detail.case.templateId ? eventJson.detail.case.templateId : ''
            var createdDateTime = eventJson.detail.case.createdDateTime;
            var createdDateTimeNumber = Date.parse(createdDateTime);

            console.log('Adding row in Dynamodb Table ');
            await caseInfo.createCase(
                caseId, 
                templateId, 
                createdDateTime, 
                createdDateTimeNumber,
                constants.caseStatusOpen
            );
        }

        // Case Update Event
        else if (eventType.includes('CASE.UPDATED')){
            await update(eventJson);
        }

        // Case Deleted
        else if (eventType.includes('CASE.DELETED')){

        }

    }
}
async function update(eventJson) {
    // If case is Closed or Reopened
    if(eventJson.detail.changedFieldIds && caseCommonFunction.findCaseEventField(eventJson.detail.changedFieldIds, 'status')){
        console.log('case status is changed');
         
        if(eventJson.detail.case.fields && eventJson.detail.case.fields.status && eventJson.detail.case.fields.status.value.stringValue === constants.caseStatusClosed){
            console.log('case status is close');
            await caseInfo.updateCaseStatus(eventJson.detail.case.caseId, constants.caseStatusClosed);
        }
    }
}