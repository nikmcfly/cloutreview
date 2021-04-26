chrome.runtime.onMessage.addListener(function(request,sender,callback) {

	if (request.msg == "CLOUTREVIEW_SAVE_REVIEW"){
		SaveReview(request.saveObj);
	}

	if (request.msg == "CLOUTREVIEW_GET_REVIEWS"){
		
		GetAllReviews(request.userNik, callback);

        return true;
	}	
});	


async function GetAllReviews(sNik, callback) {
	var totalReviews = {};
		totalReviews.records = [];
	var sOffset = "";
		
	for (var i = 0; i < 100; i++){
		var currData = await GetReviews(sNik, sOffset);	
			
			for (var j = 0; j < currData.records.length; j++){
				totalReviews.records.push(currData.records[j]);
			}
            
			if (currData.offset){
				sOffset = currData.offset;
			} else {
				console.log("no more data");	
				break;
			}					
	}
		//console.log(totalReviews);			
		callback(totalReviews);	
}


function GetReviews(sNik, sOffset) {
    return new Promise(function (resolve, reject) {
		var sFormula = '{ReviewedUsername}="' + sNik + '"';
        var requestUrl = "https://api.airtable.com/v0/appz1m76C8vzI7806/tblGb8lG6OxM02Hhr";
		requestUrl = requestUrl + "?" + "filterByFormula=" + encodeURIComponent(sFormula);
			if (sOffset != ""){
				requestUrl = requestUrl + "&offset=" + sOffset;
			}
			
		var request = new XMLHttpRequest();		
		request.open("GET", requestUrl, true);	
		request.setRequestHeader("Authorization", "Bearer keykPaMI0f35E6hcW");
		request.setRequestHeader("Content-type", "application/json");
		
		request.onload = function () {
			if (request.status = 200) {
				var tobj = JSON.parse(request.responseText);
				//console.log(tobj);
				resolve(tobj);				
			} else {
				console.log("Error SaveReview" + request.status + " " + request.statusText);
				reject(false);
			}		
		}

		request.onerror = function () {
			console.log("airtable. Error while SaveReview. Request failed");
			reject(false);
		};	

		request.send();	
    });
}


function SaveReview(saveObj){
	var requestUrl = "https://api.airtable.com/v0/appz1m76C8vzI7806/tblGb8lG6OxM02Hhr";
 
	var request = new XMLHttpRequest();
	request.open("POST", requestUrl, true);	
	request.setRequestHeader("Authorization", "Bearer keykPaMI0f35E6hcW");
	request.setRequestHeader("Content-type", "application/json");
	
    request.onload = function () {
        if (request.status = 200) {
				//var tobj = JSON.parse(request.responseText);
        } else {
            console.log("Error SaveReview" + request.status + " " + request.statusText);
        }		
    }

    request.onerror = function () {
        console.log("airtable. Error while SaveReview. Request failed");
    };	

	var fields_ = {};
	fields_["Author"] = saveObj.author;
	fields_["ReviewedUsername"] = saveObj.reviewedusername;
	fields_["Rating"] = saveObj.iRating;
	fields_["Title"] = saveObj.title;
	fields_["PublicReview"] = saveObj.reviewtext;
	
	var postbody = JSON.stringify({fields : fields_});
  	
	request.send(postbody);	
}	