const { ConnectCasesClient, PutCaseEventConfigurationCommand,} = require("@aws-sdk/client-connectcases");
const region = process.env.AWS_REGION;
const connectCasesClient = new ConnectCasesClient({ region: region});

const connectCaseConfiguration = {
  async updateCaseConfiguration(domainId) {
    var input = {};
    var eventBridge = {};
    eventBridge.enabled = true;

    var includedData = {};
    includedData.caseData = {};
    var fields = [];
    var field1 = {};
    field1.id = "status";
    fields.push(field1);
    includedData.caseData.fields = fields;
    includedData.relatedItemData = {};
    includedData.relatedItemData.includeContent = false;

    eventBridge.includedData = includedData;

    input.domainId = domainId;
    input.eventBridge = eventBridge;

    console.log('PutCaseEventConfigurationCommand input',JSON.stringify(input));

    const command = new PutCaseEventConfigurationCommand(input);
    await connectCasesClient.send(command);

    console.log('completed');
  }
};
module.exports = connectCaseConfiguration;
