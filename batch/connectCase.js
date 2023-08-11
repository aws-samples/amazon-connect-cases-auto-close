const { ConnectCasesClient, UpdateCaseCommand} = require("@aws-sdk/client-connectcases");

const region = process.env.AWS_REGION;
const connectCasesClient = new ConnectCasesClient({ region: region });
const connectCase = {
  async updateCaseStringField(domainId, caseId, fieldIdText, fieldIdTextValue) {
    var input = {};
    input.caseId = caseId;
    input.domainId = domainId;
    input.fields = [];
    var field1 = {};
    field1.id = fieldIdText;
    var field1Value = {};
    field1Value.stringValue = fieldIdTextValue;
    field1.value = field1Value;
    var fieldArray = [];
    fieldArray.push(field1);
    input.fields = fieldArray;
    console.log(JSON.stringify(input));
    const command = new UpdateCaseCommand(input);
    const response = await connectCasesClient.send(command);
    console.log(response);
    return response;
  },
};
module.exports = connectCase;
