const caseInfo = require('../dynamodb/caseInfo.js')
const constants = require('../common/constants.js') 
const connectCase = require('./connectCase.js') 

const CasesAutoCloseDays = process.env.CasesAutoCloseDays;
const domainId = process.env.CasesDomainId;

exports.handler = async function (event, context, callback) {
    console.log("INPUT -  ", JSON.stringify(event));
    var result = {};

    let autoCloseDayTimeStamp = Date.now() - parseInt(CasesAutoCloseDays)*1000*60*60*24;

    let oldCasesOpenList = await caseInfo.searchCaseByStatusTimestamp(constants.caseStatusOpen, autoCloseDayTimeStamp) 

    if (oldCasesOpenList && oldCasesOpenList.Count > 0) {
        
        for (let index = 0; index < oldCasesOpenList.Items.length; index++) {
            const oldCase = oldCasesOpenList.Items[index];
            console.log(JSON.stringify(oldCase));
            await connectCase.updateCaseStringField(domainId,  oldCase.caseId , 'status', 'closed');
            
        }
    }

    callback(null, result);
};
