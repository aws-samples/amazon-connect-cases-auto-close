const AWS = require('aws-sdk');
const docClient = new AWS.DynamoDB.DocumentClient({
	apiVersion: '2012-08-10',
	sslEnabled: false,
	paramValidation: false,
	convertResponseTypes: false
});
const tableName = process.env.CasesTable;

const caseInfo = {
    async createCase(caseId, templateId, createdDateTime, createdDateTimeNumber, status) {
        var inputTextToDB = '{"caseId": "' + caseId +
            '","templateId": "' + templateId +
            '","createdDateTime": "' + createdDateTime +
            '","createdDateTimeNumber": ' + createdDateTimeNumber +
            ',"caseStatus" : "' + status + 
            '"}';
    
        var paramsIns = {
            TableName: tableName,
            Item: JSON.parse(inputTextToDB)
        };
        
        console.log('dynamodbEvent saveCaseUpdate paramsIns : ' , paramsIns);
        const response = await docClient.put(paramsIns).promise();
        return response;
    },
    async searchCaseId(caseId) {
		var params = {
			TableName : tableName,
			KeyConditionExpression: "#caseId = :caseId",
			ExpressionAttributeNames:{
				"#caseId": "caseId"
			},
			ExpressionAttributeValues: {
				":caseId": caseId
			}
		};
		
		var output = await docClient.query(params).promise();
		return output;
    },
    async updateCaseStatus(caseId, fieldId1Value) {
        const paramsIns = {
            TableName: tableName,
            Key: {
                "caseId": caseId
            },
            UpdateExpression: "set caseStatus = :fieldId1Value",
            ExpressionAttributeValues: {
                ":fieldId1Value": fieldId1Value
            }
        };
        console.log('dynamodbEvent updateCase paramsIns : ' , paramsIns);
        var response = await docClient.update(paramsIns).promise();
        return response;
    },
    async searchCaseByStatusTimestamp(caseStatus, createdTime) {
		var params = {
			TableName : tableName,
			FilterExpression: "caseStatus = :caseStatus and createdDateTimeNumber < :createdTime ",
			ExpressionAttributeValues: {
    			":caseStatus": caseStatus,
    			":createdTime": createdTime,
			},
            ScanIndexForward: false
		};
        console.log('searchCaseByTimestamp', params);

        let items = await docClient.scan(params).promise();

        return items;
    }
}
module.exports = caseInfo;