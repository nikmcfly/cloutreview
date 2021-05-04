var divReviews;

var iRating = 0;

var iPreviousTab = 0;

var sAuthorPublicKey = "";
var sPrivateReviewText = "";
var sPrivateReviewRecordID = "";


$id = function(id){return document.getElementById(id)};

function observePage(mutationRecords){
	mutationRecords.forEach(function(mutation) {
		
		if (mutation.addedNodes.length > 0){
			for (i=0; i < mutation.addedNodes.length; i++){					
				
				if (mutation.addedNodes[i].nodeName == "CREATOR-PROFILE-TOP-CARD"){
					AddOurTab();
				}				
			}	
		}	
	});
}	


function ReceiveCallback(obj){
	console.log(obj);
	var sReviewHTML = "";
	var sPrivateReviewHTML = ""; 
	var raiting = 0.0;
	var starsCount = 0;
	var iPublicReviewCount = 0;
	
		/*var elementCurrUser = document.querySelector('#changeAccountSelectorRoot');
		var sCurrUser = "";
		if (elementCurrUser){
			sCurrUser = elementCurrUser.textContent.trim();
		}	*/
		
	var sCurrUser = GetLoggedUserNik();	
		
	var bAllowReview = ((sCurrUser != "") && (sCurrUser != GetProfileNik()));
	
	if (bAllowReview){	
		sPrivateReviewHTML = '<div id="idPrivateReview" style="width:100%; text-align: center; padding-top: 5px;">' +
			'<textarea id="idPrivateReviewText" rows="3" placeholder="A note about this user will be visible only for you. &#13;&#10;Click to enter text" style="width:98%; overflow-y: scroll; resize: none;"></textarea>' + 
		'</div>';	
	}	
	
	for (var i = 0; i < obj.records.length; i++){
		if (obj.records[i].fields.Rating){
			iPublicReviewCount++;
		} else {
			if (obj.records[i].fields.PrivateReview){
				sPrivateReviewText = obj.records[i].fields.PrivateReview;
			} else {
				sPrivateReviewText = "";
			}			
			sPrivateReviewRecordID = obj.records[i].id;
		}
	}
	
	
	if (iPublicReviewCount == 0){
		if (bAllowReview){	
			sReviewHTML = '<div id="idReview1" style="width:100%; height:270px; text-align: center; padding-top: 50px; background: url('+ chrome.extension.getURL('images/no_reviews_yet.png') +') no-repeat center;">' +
			'<div style="font-size: x-large; font-weight: bold; line-height: normal; margin-bottom: 20px;">No reviews yet</div>' + 
			'<button id="idWriteFeedback" class="btn-primary" style="width:40%; height: 50px; vertical-align: middle; border-radius: 0.5em; margin-top: 15px;">Write a feedback</button>' + 
			'</div>';	
		}	
	} else {
		var sReviewHTML = '<div id="idReview1">  <div>'; 
		
		if (bAllowReview){
			sReviewHTML = sReviewHTML + '<div style="width:100%; text-align: center;">' + 
			'<button id="idWriteFeedback" class="btn-primary" style="width:90%; height: 50px; vertical-align: middle; border-radius: 0.5em; margin-top: 15px;">Your turn! Review ' + GetProfileNik() + '</button>' +
			'</div>';			
		}	
		
		sReviewHTML = sReviewHTML + '<div style="width:100%; text-align: left; padding-left: 24px; padding-top: 30px; border-bottom: 2px solid lightgrey;">' + 
		'<h5 style="font-weight: bold;">Detailed ratings</h5>' + 
		'<div id="idRating" style="color: #32CD32;"></div>' +
		'</div></div>';
		
		var TolalRaiting = 0;
		
		for (var i = obj.records.length - 1; i >= 0; i--){
			if (obj.records[i].fields.Rating){			
				TolalRaiting = TolalRaiting + obj.records[i].fields.Rating;
			
				var sGurrRatingImg = '';
				var sGurrRatingText = '';
			
				switch (obj.records[i].fields.Rating) {
					case 1:
						sGurrRatingImg = chrome.extension.getURL('images/cross-mark.png');
						sGurrRatingText = 'Bad';
						break;
					case 2:
						sGurrRatingImg = chrome.extension.getURL('images/ok-hand.png');
						sGurrRatingText = 'Okay';
						break;
					case 3:
						sGurrRatingImg = chrome.extension.getURL('images/check-mark-button.png');
						sGurrRatingText = 'Good';
						break;
				}	

				var sPublicReview = 'no comment left';
				if (obj.records[i].fields.PublicReview){
					sPublicReview = obj.records[i].fields.PublicReview;
				}
			
				var sReviewTitle = "";
				if (obj.records[i].fields.Title){
					sReviewTitle = obj.records[i].fields.Title;
				}			
			
				var sOneReview = '<div style="width:100%; text-align: left; padding-left: 24px; border-bottom: 1px solid lightgrey;">' +
				'<div class="fc-default font-weight-bold" style="margin-top: 10px;">' + obj.records[i].fields.Author + '</div>' + 
				'<div style="vertical-align: middle;"><img src="' + sGurrRatingImg + '" width="14px" height="14px" style="margin-right: 8px;"><div style="display : inline-block">' + sGurrRatingText + '</div></div>' + 
				'<h5 style="font-weight: bold;">' + sReviewTitle + '</h5>' + 	
				'<div class="roboto-regular mt-1" style="overflow-wrap: anywhere; -ms-word-break: break-all; word-break: break-all; word-break: break-word; outline: none;" tabindex="0">' + sPublicReview + '</div>' +
				'</div>';			
			
				sReviewHTML = sReviewHTML + sOneReview;	
			}
		}
		
		raiting = (((TolalRaiting/iPublicReviewCount)/3)*5).toFixed(1);
		
		console.log('TolalRaiting=' + TolalRaiting);
		console.log('raiting=' + raiting);
		
		sReviewHTML = sReviewHTML + '</div>'; 
	}
	
	if (bAllowReview){
		var sAddReview1 = '<div id = "idAddReview1" style="display: none; width:95%; border: 2px solid lightgrey; border-radius: 0.8em; text-align: center; height: 230px; padding-top: 50px; margin-left: auto; margin-right: auto; margin-top: 20px;">' + 
		'<div style="font-size: x-large; font-weight: bold; line-height: normal; margin-bottom: 20px;">How did your interaction<br> with the person go?</div>' + 
		'<div>' + 
		'<button id="idButtonGood" style="height: 45px; width : 90px; border-radius: 0.5em;"><img src="' + chrome.extension.getURL('images/check-mark-button.png') + '" width="14px" height="14px" style="margin-right: 4px;">Good</button>' + 
		'<button id="idButtonOkay" style="height: 45px; width : 90px; margin-left: 10px; margin-right: 10px; border-radius: 0.5em;"><img src="' + chrome.extension.getURL('images/ok-hand.png') + '" width="14px" height="14px" style="margin-right: 4px;">Okay</button>' + 
		'<button id="idButtonBad" style="height: 45px; width : 90px; border-radius: 0.5em;"><img src="' + chrome.extension.getURL('images/cross-mark.png') + '" width="14px" height="14px" style="margin-right: 4px;">Bad</button></div>' + 
		'</div>';		
		
		var sAddReview2 = '<div id = "idAddReview2" style="display: none; width:100%; text-align: left; padding-left: 24px; border-bottom: 1px solid lightgrey;">' +
		'<div id="idCurrUser" class="fc-default font-weight-bold" style="margin-top: 10px;">' + sCurrUser + '</div>' + 
		'<div style="vertical-align: middle;"><img id="idRatingIcon" src="#" width="14px" height="14px" style="margin-right: 8px;">' + 
		'<div id="idRatingText" style="display : inline-block">Good</div></div>' + 
		'<div>' +
		'<input id="idReviewTitle" type="text" placeholder="Title" style="width:98%; font-size: large;">' + 
		'<textarea id="idReviewText" rows="10" placeholder="Review text" style="width:98%;"></textarea>' + 
		'</div>' + 				
		'<div style="width:100%; text-align: right; margin-bottom: 20px;">' + 
		'<button id="idPostFeedback" class="btn-primary" style="width:70px; height: 34px; vertical-align: middle; border-radius: 0.5em; margin-right: 15px;">Post</button>' +
		'</div>'+
		
		'</div>';	
	
		$id("idCloutReviews").innerHTML = sPrivateReviewHTML + sReviewHTML + sAddReview1 + sAddReview2;
		
		$id("idPrivateReviewText").value = sPrivateReviewText;
		
		if (iPublicReviewCount > 0){
			starsCount = Math.round(raiting);
			var ratingText = "";
			for (var j=1; j <= 5; j++){
				if (j <= starsCount){
					ratingText = ratingText + "★";	
				} else {
					ratingText = ratingText + "☆";	
				}	
			}
			
			$id("idRating").textContent = ratingText + " " + raiting.toString();
		}
		
		$id("idWriteFeedback").onclick = async function() {
			$id("idReview1").style.display = "none";
			$id("idAddReview1").style.display = "block";
			
		}	

		$id("idButtonGood").onclick = function() {
			$id("idAddReview1").style.display = "none";
			$id("idAddReview2").style.display = "block";
			iRating = 3;
			$id("idRatingText").textContent = "Good"; 
			$id("idRatingIcon").src = chrome.extension.getURL('images/check-mark-button.png');
		}

		$id("idButtonOkay").onclick = function() {
			$id("idAddReview1").style.display = "none";
			$id("idAddReview2").style.display = "block";
			iRating = 2;
			$id("idRatingText").textContent = "Okay"; 
			$id("idRatingIcon").src = chrome.extension.getURL('images/ok-hand.png');
		}

		$id("idButtonBad").onclick = function() {
			$id("idAddReview1").style.display = "none";
			$id("idAddReview2").style.display = "block";
			iRating = 1;
			$id("idRatingText").textContent = "Bad"; 
			$id("idRatingIcon").src = chrome.extension.getURL('images/cross-mark.png');
		}

		$id("idPostFeedback").onclick = SavePublicReview;	
		
		$id("idPrivateReviewText").onchange = PrivateReviewChange;	
		
	}
}


async function AddOurTab(){
	
	var tabSelectorEl = document.querySelectorAll('tab-selector')[0];
	var parentEl = tabSelectorEl.firstChild;
	
	if (parentEl.children[0].children[1].classList.contains("tab-underline-active")){
		iPreviousTab = 0;
		console.log('iPreviousTab = 0');
	}
	
	if (parentEl.children[1].children[1].classList.contains("tab-underline-active")){
		iPreviousTab = 1;
		console.log('iPreviousTab = 1');
	}
	
	var newEl = document.querySelectorAll('tab-selector')[0].firstChild.children[1].cloneNode(true);

	newEl.children[0].textContent = "CloutReview";
	
	newEl.children[1].classList.remove("tab-underline-active");	
	newEl.children[1].classList.add("tab-underline-inactive");	
	
	newEl.onclick = OurTabClick;

	parentEl.appendChild(newEl); 

	newEl.parentElement.children[0].onclick = FirstTab1Click;
	newEl.parentElement.children[1].onclick = SecondTab1Click;
	

		firstTab = document.querySelectorAll('tab-selector ~ div')[0]
		divReviews = firstTab.cloneNode(false);
		divReviews.id = "idCloutReviews";
		divReviews.style.display = "none";
		firstTab.parentElement.appendChild(divReviews); 
		
		var elementCurrUser = document.querySelector('#changeAccountSelectorRoot');
		var sCurrUser = "";
		if (elementCurrUser){
			sCurrUser = elementCurrUser.textContent.trim();
		}
		
	sAuthorPublicKey = await GetLoggedUserPublicKey(GetLoggedUserNik());
	
	sPrivateReviewRecordID = "";
	sPrivateReviewText = "";

	console.log('sAuthorPublicKey =' + sAuthorPublicKey);
		
	var msgObj = {};
	msgObj.msg = 'CLOUTREVIEW_GET_REVIEWS';
	msgObj.userNik = GetProfileNik();
	msgObj.userPublicKey = GetProfilePublicKey();
	
	chrome.extension.sendMessage(msgObj, ReceiveCallback);				
}


function PrivateReviewChange(){
	console.log('PrivateReviewChange');
	if (sPrivateReviewRecordID != ""){
		UpdatePrivateReview();
	} else {
		SavePrivateReview();
	}	
}


function SavePrivateReview(){
	var msgObj = {};
	msgObj.msg = 'CLOUTREVIEW_SAVE_PRIVATEREVIEW';
	msgObj.saveObj = {};
	msgObj.saveObj.author = $id("idCurrUser").textContent;
	msgObj.saveObj.authorPublicKey = sAuthorPublicKey;
	msgObj.saveObj.reviewedusername = GetProfileNik();	
	msgObj.saveObj.revieweduserPublicKey = GetProfilePublicKey();	
	msgObj.saveObj.privateReviewText = $id("idPrivateReviewText").value;	
	chrome.extension.sendMessage(msgObj);		
}


function UpdatePrivateReview(){
	var msgObj = {};
	msgObj.msg = 'CLOUTREVIEW_UPDATE_PRIVATEREVIEW';
	msgObj.saveObj = {};
	msgObj.saveObj.recordID = sPrivateReviewRecordID;	
	msgObj.saveObj.privateReviewText = $id("idPrivateReviewText").value;	
	chrome.extension.sendMessage(msgObj);		
}


function SavePublicReview(){
	//console.log('SavePublicReview');
	
	var msgObj = {};
	msgObj.msg = 'CLOUTREVIEW_SAVE_REVIEW';
	msgObj.saveObj = {};
	msgObj.saveObj.iRating = iRating;
	msgObj.saveObj.author = $id("idCurrUser").textContent;
	//msgObj.saveObj.authorPublicKey = await GetLoggedUserPublicKey(GetLoggedUserNik());
	msgObj.saveObj.authorPublicKey = sAuthorPublicKey;
	msgObj.saveObj.reviewedusername = GetProfileNik();
	msgObj.saveObj.revieweduserPublicKey = GetProfilePublicKey();
	msgObj.saveObj.title = $id("idReviewTitle").value;
	msgObj.saveObj.reviewtext = $id("idReviewText").value;
	
	chrome.extension.sendMessage(msgObj);	
	
	$id("idPostFeedback").disabled = true;
	$id("idPostFeedback").style.backgroundColor = "lightgrey";
	
	$id("idCloutReviews").innerHTML = '';
	
	var msgObj2 = {};
	msgObj2.msg = 'CLOUTREVIEW_GET_REVIEWS';
	msgObj2.userNik = GetProfileNik();
	msgObj2.userPublicKey = GetProfilePublicKey();	
	
	chrome.extension.sendMessage(msgObj2, ReceiveCallback);	
}


function GetProfileNik(){
	var res = "";
	if (document.location.href.indexOf("bitclout.com/u/") > 0){
		res = new URL(document.location.href).pathname.replace('/u/', '');		
	}
	return  res;
}	


function GetProfilePublicKey(){
	var res = "";
	var elementPublicKey = document.querySelector('i.fa-key');
	if (elementPublicKey){
		res = elementPublicKey.parentElement.textContent.trim();
	}	
	return  res;
}


function GetLoggedUserNik(){
	var res = "";	
	var elementCurrUser = document.querySelector('#changeAccountSelectorRoot');
		if (elementCurrUser){
			res = elementCurrUser.textContent.trim();
		}	
	return  res;		
}


async function GetLoggedUserPublicKey(sNik){
    return new Promise(function (resolve, reject) {
        var requestUrl = "https://api.bitclout.com/get-single-profile";
			
		var request = new XMLHttpRequest();		
		request.open("POST", requestUrl, true);	
		request.setRequestHeader("Content-type", "application/json");
		request.withCredentials = true;
		
		request.onload = function () {
			if (request.status = 200) {
				var tobj = JSON.parse(request.responseText);
				console.log(tobj);
				resolve(tobj.Profile.PublicKeyBase58Check);				
			} else {
				console.log("Error GetLoggedUserPublicKey" + request.status + " " + request.statusText);
				reject(false);
			}		
		}

		request.onerror = function () {
			console.log("api.bitclout. Error while GetLoggedUserPublicKey. Request failed");
			reject(false);
		};	

			var fields_ = {};
			fields_["PublicKeyBase58Check"] = "";
			fields_["Username"] = sNik;
	
		var postbody = JSON.stringify(fields_);
		
		console.log(postbody);
  	
		request.send(postbody);		
    });	
}


function FirstTab1Click(e){
	if (iPreviousTab == 0){
		document.querySelectorAll('tab-selector ~ div')[0].style.visibility = "visible";
		document.querySelectorAll('tab-selector ~ div')[0].style.height = "";
	}	
	
	divReviews.style.display = "none";
	iPreviousTab = 0;
	console.log(e.srcElement);
	e.srcElement.parentElement.parentElement.children[2].children[1].classList.remove("tab-underline-active");	
	e.srcElement.parentElement.parentElement.children[2].children[1].classList.add("tab-underline-inactive");
	e.srcElement.parentElement.parentElement.children[0].children[1].classList.remove("tab-underline-inactive");	
	e.srcElement.parentElement.parentElement.children[0].children[1].classList.add("tab-underline-active");
}


function SecondTab1Click(e){
	if (iPreviousTab == 1){
		document.querySelectorAll('tab-selector ~ div')[0].style.visibility = "visible";
		document.querySelectorAll('tab-selector ~ div')[0].style.height = "";
	}
	divReviews.style.display = "none";
	iPreviousTab = 1;	
	console.log(e.srcElement);
	e.srcElement.parentElement.parentElement.children[2].children[1].classList.remove("tab-underline-active");	
	e.srcElement.parentElement.parentElement.children[2].children[1].classList.add("tab-underline-inactive");
	e.srcElement.parentElement.parentElement.children[1].children[1].classList.remove("tab-underline-inactive");	
	e.srcElement.parentElement.parentElement.children[1].children[1].classList.add("tab-underline-active");
}


function OurTabClick(e){
	//console.log( e.target);
	console.log(e.srcElement);
	
	e.srcElement.parentElement.children[1].classList.remove("tab-underline-inactive");	
	e.srcElement.parentElement.children[1].classList.add("tab-underline-active");
	
	e.srcElement.parentElement.parentElement.children[0].children[1].classList.remove("tab-underline-active");	
	e.srcElement.parentElement.parentElement.children[0].children[1].classList.add("tab-underline-inactive");	
	
	e.srcElement.parentElement.parentElement.children[1].children[1].classList.remove("tab-underline-active");	
	e.srcElement.parentElement.parentElement.children[1].children[1].classList.add("tab-underline-inactive");
	
	document.querySelectorAll('tab-selector ~ div')[0].style.visibility = "hidden";
	document.querySelectorAll('tab-selector ~ div')[0].style.height = "0px";
	divReviews.style.display = "block";
	//divReviews.style.visibility = "visible";
	
}
	

var observer = new MutationObserver(observePage);
console.log("CloutReview OBSERVER CREATED");

observer.observe(document.body, 
{
	childList : true, 
	subtree : true
});	