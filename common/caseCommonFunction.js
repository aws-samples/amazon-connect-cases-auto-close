const caseCommonFunction = {

    findCaseEventField(changedFieldIdsList, fieldName){
		var statusUpdated = false;
		for (let i = 0; i < changedFieldIdsList.length; i++) {
			console.log(changedFieldIdsList[i] , fieldName);
			if(changedFieldIdsList[i] === fieldName){
				statusUpdated = true;
			}
		}
		console.log('statusUpdated',statusUpdated);
		return statusUpdated;
	}
}
module.exports = caseCommonFunction;