const API_Table_URL = 'https://api.airtable.com/v0/appz1m76C8vzI7806/Everything';
const API_Key = 'keydLH6vSFDd0LUhg';

chrome.runtime.onMessage.addListener(function(request,sender,callback) {

	if (request.msg == "CLOUTREVIEW_SAVE_REVIEW"){
		SaveReview(request.saveObj);
	}
	
	if (request.msg == "CLOUTREVIEW_SAVE_PRIVATEREVIEW"){
		SavePrivateReview(request.saveObj);
	}	
	
	if (request.msg == "CLOUTREVIEW_UPDATE_PRIVATEREVIEW"){
		UpdatePrivateReview(request.saveObj);
	}		

	if (request.msg == "CLOUTREVIEW_GET_REVIEWS"){
		
		GetAllReviews(request.userNik, request.userPublicKey, callback);

        return true;
	}	
});	


async function GetAllReviews(sNik, sPublicKey, callback) {
	var totalReviews = {};
		totalReviews.records = [];
	var sOffset = "";
		
	for (var i = 0; i < 100; i++){
		var currData = await GetReviews(sNik, sPublicKey, sOffset);	
			
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


function GetReviews(sNik, sPublicKey, sOffset) {
    return new Promise(function (resolve, reject) {
		//var sFormula = '{ReviewedUsername}="' + sNik + '"';
		var sFormula = '{ReviewedKey}="' + sPublicKey + '"';		
        //var requestUrl = "https://api.airtable.com/v0/appz1m76C8vzI7806/tblGb8lG6OxM02Hhr";
		var requestUrl = API_Table_URL;
		requestUrl = requestUrl + "?" + "filterByFormula=" + encodeURIComponent(sFormula);
			if (sOffset != ""){
				requestUrl = requestUrl + "&offset=" + sOffset;
			}
			
		var request = new XMLHttpRequest();		
		request.open("GET", requestUrl, true);
		//request.setRequestHeader("Authorization", "Bearer keykPaMI0f35E6hcW");		
		request.setRequestHeader("Authorization", "Bearer " + API_Key);
		
		request.setRequestHeader("Content-type", "application/json");
		
		request.onload = function () {
			if (request.status = 200) {
				var tobj = JSON.parse(request.responseText);
				console.log(tobj);
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


function SavePrivateReview(saveObj){
	//var requestUrl = "https://api.airtable.com/v0/appz1m76C8vzI7806/tblGb8lG6OxM02Hhr";
	var requestUrl = API_Table_URL;
 
	var request = new XMLHttpRequest();
	request.open("POST", requestUrl, true);	
	//request.setRequestHeader("Authorization", "Bearer keykPaMI0f35E6hcW");
	request.setRequestHeader("Authorization", "Bearer " + API_Key);
	request.setRequestHeader("Content-type", "application/json");
	
    request.onload = function () {
        if (request.status = 200) {
				//var tobj = JSON.parse(request.responseText);
        } else {
            console.log("Error SavePrivateReview" + request.status + " " + request.statusText);
        }		
    }

    request.onerror = function () {
        console.log("airtable. Error while SavePrivateReview. Request failed");
    };	

	var fields_ = {};
	fields_["Author"] = saveObj.author;
	fields_["AuthorKey"] = saveObj.authorPublicKey;
	fields_["ReviewedUsername"] = saveObj.reviewedusername;
	fields_["ReviewedKey"] = saveObj.revieweduserPublicKey;
	fields_["PrivateReview"] = saveObj.privateReviewText;
	
	var postbody = JSON.stringify({fields : fields_});
  	
	request.send(postbody);		
}


function UpdatePrivateReview(saveObj){
	var requestUrl = API_Table_URL + "/" + saveObj.recordID;
 
	var request = new XMLHttpRequest();
	request.open("PATCH", requestUrl, true);	
	request.setRequestHeader("Authorization", "Bearer " + API_Key);
	request.setRequestHeader("Content-type", "application/json");
	
    request.onload = function () {
        if (request.status = 200) {
				//var tobj = JSON.parse(request.responseText);
        } else {
            console.log("Error UpdatePrivateReview" + request.status + " " + request.statusText);
        }		
    }

    request.onerror = function () {
        console.log("airtable. Error while UpdatePrivateReview. Request failed");
    };	

	var fields_ = {};
	fields_["PrivateReview"] = saveObj.privateReviewText;
	
	var postbody = JSON.stringify({fields : fields_});
  	
	request.send(postbody);		
}


function SaveReview(saveObj){
	//var requestUrl = "https://api.airtable.com/v0/appz1m76C8vzI7806/tblGb8lG6OxM02Hhr";
	var requestUrl = API_Table_URL;
 
	var request = new XMLHttpRequest();
	request.open("POST", requestUrl, true);	
	//request.setRequestHeader("Authorization", "Bearer keykPaMI0f35E6hcW");
	request.setRequestHeader("Authorization", "Bearer " + API_Key);
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
	fields_["AuthorKey"] = saveObj.authorPublicKey;
	fields_["ReviewedUsername"] = saveObj.reviewedusername;
	fields_["ReviewedKey"] = saveObj.revieweduserPublicKey;
	fields_["Rating"] = saveObj.iRating;
	fields_["Title"] = saveObj.title;
	fields_["PublicReview"] = saveObj.reviewtext;
	
	var postbody = JSON.stringify({fields : fields_});
  	
	request.send(postbody);	
}	