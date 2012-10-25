$(document).ready(function() {
	$( "#send" ).click(function() {
		var recommend = ($("#recommend").val()=="Si")? "true":"false";
		sendCommentQuery($("#airline").val(),$("#flight_number").val(),$("#amability").val(),$("#food").val(),$("#punctuality").val(),$("#frequent_passenger").val(),$("#comfort").val(),$("#price_quality").val(),recommend,$("#comments").val());
    });
});

function sendCommentQuery(airline, flight, amability, food, punctuality, frequent_passenger, comfort, price_quality, recommend, comments){

	var objJson = {"airlineId": "IB","flightNumber": 6831, "friendlinessRating": 8,"foodRating": 9,"punctualityRating": 9,"mileageProgramRating": 6, "comfortRating": 9, "qualityPriceRating": 7, "yesRecommend": true, "comments": ""}
	objJson.airlineId = airline;
	objJson.flight = flight;
	objJson.friendlinessRating = amability;
	objJson.foodRating = food;
	objJson.punctualityRating = punctuality;
	objJson.mileageProgramRating = frequent_passenger;
	objJson.comfortRating = comfort;
	objJson.qualityPriceRating = price_quality;
	objJson.yesRecommend = recommend;
	objJson.comments = comments;
	console.log(JSON.stringify(objJson));
	$.ajax({
		url: "http://eiffel.itba.edu.ar/hci/service2/Review.groovy?method=ReviewAirline2",
		data: { data: JSON.stringify(objJson) },
		dataType: "jsonp",
		contentType: "application/json",
		beforeSend: function(){
			loading();
		},
		success: function(data){
			console.log(data);
		},
		error: function(error){
			console.log(error);
		}
	});
}

function loading(){
	$("#container_box").empty();
	$("#container_box").append("<div id='loading'><p><img src='images/ajax-loader.gif'/></p></div>").hide(0);
	$("#container_box").fadeIn(500).delay(500);
	return;
}

function commentSent(data){
	var loadDiv = $("#container_box").children("#loading");
	loadDiv.delay(800).hide(800);	
	if(data.hasOwnProperty("error")){
		$("#container_box").append("<br><div id='search_error'><h3>Error "+data.error.code+": "+data.error.message+"</h3></div>");
		var errorDiv = $("#container_box").children("#search_error");
		errorDiv.hide(0).delay(1000);
		errorDiv.fadeIn(500);
		return;
	}
	if(!data['review']){
		$("#container_box").append("<div id='no_comments' class='inner_box'><h3>No se pudo enviar su comentario<br>Disculpe las molestias ocasionadas</h3></div><br>");
		var errorDiv = $("#container_box").children("#no_comments");
		errorDiv.hide(0).delay(1000);
		errorDiv.fadeIn(500);
	}else{
		$("#container_box").append("<div id='no_comments' class='inner_box'><h3>Su comentario ha sio enviado exitosamente<br>Gracias por mejorar nuestro servicio</h3></div><br>");
		var success_div = $("#container_box").children("#no_comments");
		success_div.hide(0).delay(1000);
		success_div.fadeIn(500);	
	}
	return;
}
