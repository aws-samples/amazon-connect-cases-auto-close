const region = process.env.AWS_REGION;
const response = require('cfn-response');
const connectCaseConfiguration = require('./connectCaseConfiguration.js')

const domainId = process.env.CasesDomainId;

exports.handler = async (event, context) => {
  var result = {
    responseStatus: "FAILED",
    responseData: { Data: "Never updated" },
  };
  var outputData = {};
  
  console.info("received:", JSON.stringify(event));
  try {
    if(event.RequestType === 'Create'){

      console.info("started create process");
      await connectCaseConfiguration.updateCaseConfiguration(domainId);

      result.responseStatus = "SUCCESS";
      result.responseData["Data"] = "Successfully Updated Case Configuration";
    }
    else {
      // API to Delete Field is not available
      result.responseStatus = "SUCCESS";
      result.responseData["Data"] = "Successfully uploaded files";
    }
  } catch (error) {
    console.log(JSON.stringify(error));
    result.responseStatus = "FAILED";
    result.responseData["Data"] = "Failed to process event";
  }
  finally {
    return await responsePromise(event, context, result.responseStatus, result.responseData, `mainstack`);
  }
};

function responsePromise(event, context, responseStatus, responseData, physicalResourceId) {
  return new Promise(() => response.send(event, context, responseStatus, responseData, physicalResourceId));
}
