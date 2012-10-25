$(document).ready(function() {
	var method = getQuerystring('method');
	var flight = getQuerystring('flight_number');
	var airline = getQuerystring('airline_id');
	commentQuery(method, flight, airline);
});

function getQuerystring(key, default_)
{
  if (default_==null) default_="";
  key = key.replace(/[\[]/,"\\\[").replace(/[\]]/,"\\\]");
  var regex = new RegExp("[\\?&]"+key+"=([^&#]*)");
  var qs = regex.exec(window.location.href);
  if(qs == null)
    return default_;
  else
    return qs[1];
}

function commentQuery(method, flight_number, airline_id){
	// one way flight
		if(method == "by_flight"){
			$.ajax({
				url: "http://eiffel.itba.edu.ar/hci/service2/Review.groovy?method=GetAirlineReviews&flight_num="+ flight_number,
				dataType: "jsonp",
				jsonpCallback: "addComments",				
				beforeSend: function(){
					loading();
				},
				error: function(error) {
					alert("Server retrieval has failed");
					return;
				}
			});
		}else{
			$.ajax({
				url: "http://eiffel.itba.edu.ar/hci/service2/Review.groovy?method=GetAirlineReviews&airline_id="+ airline_id,
				dataType: "jsonp",
				jsonpCallback: "addComments",
				beforeSend: function(){
					loading();
				},
				error: function(error) {
					alert("Server retrieval has failed");
					return;
				}
			});
		}
}

function loading(){
	$("#all_comments").empty();
	$("#all_comments").append("<div id='loading'><p><img src='images/ajax-loader.gif'/></p></div>").hide(0);
	$("#all_comments").fadeIn(500);
	return;
}

function addComments(data){
	var loadDiv = $("#all_comments").children("#loading");
	loadDiv.delay(800).hide(800);	
	if(data.hasOwnProperty("error")){
		$("#all_comments").append("<br><div id='search_error'><h3>Error "+data.error.code+": "+data.error.message+"</h3></div>");
		var errorDiv = $("#all_comments").children("#search_error");
		errorDiv.hide(0).delay(1000);
		errorDiv.fadeIn(500);
		return;
	}
	if(data['total']==0){
		$("#all_comments").append("<div id='no_comments' class='inner_box'><h3>No hay comentarios disponibles</h3></div><br>");
		var errorDiv = $("#all_comments").children("#no_comments");
		errorDiv.hide(0).delay(1000);
		errorDiv.fadeIn(500);
	}else{
		for(var i=0;i<data['total'];i++){
			var comment_flight_id = data['reviews'][i]['flightNumber'];
			var comment_airline_id = data['reviews'][i]['airlineId'];
			var comment_satisfaction = data['reviews'][i]['overallRating'];
			var comment_kindness = data['reviews'][i]['friendlinessRating'];
			var comment_food = data['reviews'][i]['foodRating'];
			var comment_punctuality = data['reviews'][i]['punctualityRating'];
			var comment_frequent_traveller = data['reviews'][i]['mileageProgramRating'];
			var comment_confort = data['reviews'][i]['comfortRating'];
			var comment_price_quality = data['reviews'][i]['qualityPriceRating'];
			var comment_recommend = data['reviews'][i]['yesRecommend'];
			var comment_comments = data['reviews'][i]['comments'];
			if(comment_comments == null)
				comment_comments = "-";
			$("<div class='inner_box'><p><table><tr><th>Nombre de aerolínea</th><td>"+comment_airline_id+"</td><th >Satisfaccion general</th></tr><tr><th>Número de vuelo</th><td>"+comment_flight_id+"</td><td>"+comment_satisfaction+"<td></tr><tr><th>Amabilidad:</th><td>"+comment_kindness+"</td><th>Comentarios</th></tr><tr><th>Comida:</th><td>"+comment_food+"</td><td id='comment_col' rowspan='6'>"+comment_comments+"</td></tr><tr><th>Puntualidad:</th><td>"+comment_punctuality+"</td></tr><tr><th>Programa viajeros frecuentes:</th><td>"+comment_frequent_traveller+"</td></tr><tr><th>Confort:</th><td>"+comment_confort+"</td></tr><tr><th>Relación precio/calidad:</th><td>"+comment_price_quality+"</td></tr><tr><th>Recomendaría a otro:</th><td>"+comment_recommend+"</td></tr></table></p></a></div><br>").appendTo("#all_comments");
		}
		for(var i=0;i<flights.total;i++){
			$(".inner_box").fadeIn(500).delay(200);
		}		
	}
	return;
}
