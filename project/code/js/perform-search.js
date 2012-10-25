$(document).ready(function() {
	var orig = getQuerystring('origin');
	var dest = getQuerystring('destination');
	var dep = getQuerystring('departure_date');
	var ret = getQuerystring('return_date');
	var adult_num = getQuerystring('adults_num');
	var child_num = getQuerystring('kids_num');
	var infant_num = getQuerystring('infants_num');
	//aca viene la llamada de ajax
	getCommentsDiv("by_flight", "6593", "8R", ("body"));
	//retrieveFlights(orig, dest, dep, ret, adult_num, child_num, infant_num, 1, "total", "asc");
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

function retrieveFlights(orig, dest, dep, ret, adult_num, child_num, infant_num, page, sort_key, sort_order){
	// one way flight
	if (ret == ""){
		$.ajax({
            url: "http://eiffel.itba.edu.ar/hci/service2/Booking.groovy?method=GetOneWayFlights&from="+ orig +"&to="+ dest +"&dep_date="+ dep +"&adults="+ adult_num +"&children="+ child_num +"&infants="+ infant_num+"&sort_key="+ sort_key+"&sort_order="+sort_order,
			dataType: "jsonp",
			jsonpCallback: "displayFlights",
			beforeSend: function(){
				loading();
			},
            error: function(error) {
                alert("Server retrieval has failed");
				return;
            }
        });
	}else{
		//ida y vuelta
		$.ajax({
            url: "http://eiffel.itba.edu.ar/hci/service2/Booking.groovy?method=GetRoundTripFlights&from="+ orig +"&to="+ dest +"&dep_date="+ dep +"&ret_date="+ ret +"&adults="+ adult_num +"&children="+ child_num +"&infants="+ infant_num+"&sort_key="+ sort_key+"&sort_order="+sort_order,
			dataType: "jsonp",
			jsonpCallback: "displayFlights",
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
	$("#all_results").empty();
	$("#all_results").append("<div id='loading'><p><img src='images/ajax-loader.gif'/></p></div>").hide(0);
	$("#all_results").fadeIn(500);
	return;
}

function displayFlights(flights){
	var loadDiv = $("#all_results").children("#loading");
	loadDiv.delay(800).hide(800);
	if(flights.hasOwnProperty("error")){
		$("#all_results").append("<br><div id='search_error'><h3>Error "+flights.error.code+": "+flights.error.message+"</h3></div>");
		var errorDiv = $("#all_results").children("#search_error");
		errorDiv.hide(0).delay(1000);
		errorDiv.fadeIn(500);
		return;
	}else{
		for(var i=0;i<flights.total;i++){
			// flight price information
			var adult_price = (flights['flights'][i]['price']['adults'] == null) ? "-": flights['flights'][i]['price']['adults']['baseFare']+" "+flights['currencyId'];
			var adult_quant = (flights['flights'][i]['price']['adults'] == null) ? "-": flights['flights'][i]['price']['adults']['quantity'];
			var child_price = (flights['flights'][i]['price']['children'] == null) ? "-": flights['flights'][i]['price']['children']['baseFare']+" "+flights['currencyId'];
			var child_quant = (flights['flights'][i]['price']['children'] == null) ? "-": flights['flights'][i]['price']['children']['quantity'];
			var infant_price = (flights['flights'][i]['price']['infants'] == null) ? "-": flights['flights'][i]['price']['infants']['baseFare']+" "+flights['currencyId'];
			var infant_quant = (flights['flights'][i]['price']['infants'] == null) ? "-": flights['flights'][i]['price']['infants']['quantity'];
			var charges = flights['flights'][i]['price']['total']['charges']+" "+flights['currencyId'];
			var tax = flights['flights'][i]['price']['total']['taxes']+" "+flights['currencyId'];
			var fare = flights['flights'][i]['price']['total']['fare']+" "+flights['currencyId'];
			var total = flights['flights'][i]['price']['total']['total']+" "+flights['currencyId'];
			// flight arrival information
			//alert(JSON.stringify(flights));	
			var	outbound_arrival_date = flights['flights'][i]['outboundRoutes'][0]['segments'][0]['arrival']['date'];
			var	outbound_arrival_timezone = flights['flights'][i]['outboundRoutes'][0]['segments'][0]['arrival']['timezone'];
			var outbound_arrival_airport_id = flights['flights'][i]['outboundRoutes'][0]['segments'][0]['arrival']['airportId'];
			var outbound_arrival_airport = flights['flights'][i]['outboundRoutes'][0]['segments'][0]['arrival']['airportDescription'];
			var outbound_arrival_city_id = flights['flights'][i]['outboundRoutes'][0]['segments'][0]['arrival']['cityId'];
			var outbound_arrival_city = flights['flights'][i]['outboundRoutes'][0]['segments'][0]['arrival']['cityName'];
			var outbound_arrival_country_id = flights['flights'][i]['outboundRoutes'][0]['segments'][0]['arrival']['countryId'];
			var outbound_arrival_country = flights['flights'][i]['outboundRoutes'][0]['segments'][0]['arrival']['countryName'];
			// flight departure information
			var	outbound_departure_date = flights['flights'][i]['outboundRoutes'][0]['segments'][0]['departure']['date'];
			var	outbound_departure_timezone = flights['flights'][i]['outboundRoutes'][0]['segments'][0]['departure']['timezone'];
			var outbound_departure_airport_id = flights['flights'][i]['outboundRoutes'][0]['segments'][0]['departure']['airportId'];
			var outbound_departure_airport = flights['flights'][i]['outboundRoutes'][0]['segments'][0]['departure']['airportDescription'];
			var outbound_departure_city_id = flights['flights'][i]['outboundRoutes'][0]['segments'][0]['departure']['cityId'];
			var outbound_departure_city = flights['flights'][i]['outboundRoutes'][0]['segments'][0]['departure']['cityName'];
			var outbound_departure_country_id = flights['flights'][i]['outboundRoutes'][0]['segments'][0]['departure']['countryId'];
			var outbound_departure_country = flights['flights'][i]['outboundRoutes'][0]['segments'][0]['departure']['countryName'];
			// flight data
			var outbound_flight_id = flights['flights'][i]['outboundRoutes'][0]['segments'][0]['flightId'];
			var outbound_flight_number = flights['flights'][i]['outboundRoutes'][0]['segments'][0]['flightNumber'];
			var outbound_cabin_type = flights['flights'][i]['outboundRoutes'][0]['segments'][0]['cabinType'];
			var outbound_airline_id = flights['flights'][i]['outboundRoutes'][0]['segments'][0]['airlineId'];
			var outbound_airline_name = flights['flights'][i]['outboundRoutes'][0]['segments'][0]['airlineName'];
			var outbound_airline_rating = flights['flights'][i]['outboundRoutes'][0]['segments'][0]['arilineRating'];
			if (outbound_airline_rating == null)
				outbound_airline_rating = "Sin calificar"
			// additional data
			var outbound_duration = flights['flights'][i]['outboundRoutes'][0]['duration'];
			// chequear si tmb tiene vuelta o es solo ida
			if(flights['flights'][i].hasOwnProperty('inboundRoutes')){
				var	inbound_arrival_date = flights['flights'][i]['inboundRoutes']['segments'][0]['arrival']['date'];
				var	inbound_arrival_timezone = flights['flights'][i]['inboundRoutes']['segments'][0]['arrival']['timezone'];
				var inbound_arrival_airport_id = flights['flights'][i]['inboundRoutes']['segments'][0]['arrival']['airportId'];
				var inbound_arrival_airport = flights['flights'][i]['inboundRoutes']['segments'][0]['arrival']['airportDescription'];
				var inbound_arrival_city_id = flights['flights'][i]['inboundRoutes']['segments'][0]['arrival']['cityId'];
				var inbound_arrival_city = flights['flights'][i]['inboundRoutes']['segments'][0]['arrival']['cityName'];
				var inbound_arrival_country_id = flights['flights'][i]['inboundRoutes']['segments'][0]['arrival']['countryId'];
				var inbound_arrival_country = flights['flights'][i]['inboundRoutes']['segments'][0]['arrival']['countryName'];
				// flight departure information
				var	inbound_departure_date = flights['flights'][i]['inboundRoutes']['segments'][0]['departure']['date'];
				var	inbound_departure_timezone = flights['flights'][i]['inboundRoutes']['segments'][0]['departure']['timezone'];
				var inbound_departure_airport_id = flights['flights'][i]['inboundRoutes']['segments'][0]['departure']['airportId'];
				var inbound_departure_airport = flights['flights'][i]['inboundRoutes']['segments'][0]['departure']['airportDescription'];
				var inbound_departure_city_id = flights['flights'][i]['inboundRoutes']['segments'][0]['departure']['cityId'];
				var inbound_departure_city = flights['flights'][i]['inboundRoutes']['segments'][0]['departure']['cityName'];
				var inbound_departure_country_id = flights['flights'][i]['inboundRoutes']['segments'][0]['departure']['countryId'];
				var inbound_departure_country = flights['flights'][i]['inboundRoutes']['segments'][0]['departure']['countryName'];
				// flight data
				var inbound_flight_id = flights['flights'][i]['inboundRoutes']['segments'][0]['flightId'];
				var inbound_flight_number = flights['flights'][i]['inboundRoutes']['segments'][0]['flightNumber'];
				var inbound_cabin_type = flights['flights'][i]['inboundRoutes']['segments'][0]['cabinType'];
				var inbound_airline_id = flights['flights'][i]['inboundRoutes']['segments'][0]['airlineId'];
				var inbound_airline_name = flights['flights'][i]['inboundRoutes']['segments'][0]['airlineName'];
				var inbound_airline_rating = flights['flights'][i]['inboundRoutes']['segments'][0]['arilineRating'];
				if (inbound_airline_rating == null)
					inbound_airline_rating = "Sin calificar"
				// additional data
				var inbound_duration = flights['flights'][i]['inboundRoutes']['duration'];
			}
			// pregutnar que onda las escalas
			var stopovers = 1;
			//if(flights['flights'][i].hasOwnProperty('inboundRoutes'))
			//	stopovers = flights['filters'][1]['value'][0]['count'];
			//else
			//	stopovers = flights['filters'][1]['values'][0]['count'];
			// query string
			var flight_price_query = "?adult_price="+adult_price+"&adult_quant="+adult_quant+"&child_price="+child_price+"&child_quant="+child_quant+"&infant_price="+infant_price+"&infant_quant="+infant_quant+"&cargas="+charges+"&tax="+tax+"&fare="+fare+"&total="+total;
			
			var outbound_arrival_city_query = "&outbound_arrival_date="+outbound_arrival_date+"&outbound_arrival_timezone="+outbound_arrival_timezone+"&outbound_arrival_airport="+outbound_arrival_airport+"&outbound_arrival_city="+outbound_arrival_city+"&outbound_arrival_country="+outbound_arrival_country;
			var inbound_arrival_city_query = "&inbound_arrival_date="+inbound_arrival_date+"&inbound_arrival_timezone="+inbound_arrival_timezone+"&inbound_arrival_airport="+inbound_arrival_airport+"&inbound_arrival_city="+inbound_arrival_city+"&inbound_arrival_country="+inbound_arrival_country;
			
			var outbound_departure_city_query = "&outbound_departure_date="+outbound_departure_date+"&outbound_departure_timezone="+outbound_departure_timezone+"&outbound_departure_airport="+outbound_departure_airport+"&outbound_departure_city="+outbound_departure_city+"&outbound_departure_country="+outbound_departure_country;
			var inbound_departure_city_query = "&inbound_departure_date="+inbound_departure_date+"&inbound_departure_timezone="+inbound_departure_timezone+"&inbound_departure_airport="+inbound_departure_airport+"&inbound_departure_city="+inbound_departure_city+"&inbound_departure_country="+inbound_departure_country;
			
			var outbound_flight_info_query = "&outbound_flight_number="+outbound_flight_number+"&outbound_cabin_type="+outbound_cabin_type+"&outbound_airline_name="+outbound_airline_name+"&outbound_airline_rating="+outbound_airline_rating+"&outbound_duration="+outbound_duration;
			var inbound_flight_info_query = "&inbound_flight_number="+inbound_flight_number+"&inbound_cabin_type="+inbound_cabin_type+"&inbound_airline_name="+inbound_airline_name+"&inbound_airline_rating="+inbound_airline_rating+"&inbound_duration="+inbound_duration;
			
			var stopovers_query = "?stopovers="+stopovers;
			
			var buy_query = flight_price_query+""+outbound_arrival_city_query+""+inbound_arrival_city_query+""+outbound_departure_city_query+""+inbound_departure_city_query+""+outbound_flight_info_query+""+inbound_flight_info_query+""+stopovers_query;		
			//creacion del div
			var new_div = $("<br><div id='result' class='inner_box result'></div>").appendTo("#all_results");
			var price_div = $("<div id='price'><p><b>Precio:<br>"+total+"</b><br><a class='view_price_detail'>(Ver detalles)</a><br></p><p><a class='button' href='buy.html"+buy_query+"'>Comprar</a></p></div>").appendTo(new_div);
			var inbound_div = (flights['flights'][i].hasOwnProperty('inboundRoutes'))? "<p><h3>Origen: "+inbound_departure_airport_id+" Destino: "+inbound_arrival_airport_id+"</h3><table><tr><th>Salida</th><th>Llegada</th><th>Duración</th><th>Escalas</th><th>Aerolinea</th><th>Vuelo</th></tr><tr><td>"+inbound_departure_date+"</td><td>"+inbound_arrival_date+"</td><td>"+inbound_duration+"</td><td>"+stopovers+"</td><td>"+inbound_airline_name+"<br><a id='airline' class='comments'>(Comentarios)</a></td><td>"+inbound_airline_rating+"<br><a id='flight' class='comments'>(Comentarios)</a></td></tr></table></p>":"";
			var outbound_div =$("<div id='flight_info'><p><h3>Origen: "+ outbound_departure_city_id +" Destino: "+ outbound_arrival_city_id +"</h3><table><tr><th>Salida</th><th>Llegada</th><th>Duracion</th><th>Escalas</th><th>Aerolinea</th><th>Vuelo</th></tr><tr><td>"+outbound_departure_date+"</td><td>"+outbound_arrival_date+"</td><td>"+outbound_duration+"</td><td>"+stopovers+"</td><td>"+outbound_airline_name+"<br><a id='airline' class='comments'>(Comentarios)</a></td><td>"+outbound_airline_rating+"<br><a id='flight' class='comments'>(Comentarios)</a></td></tr></table></p>"+inbound_div+"</div>").appendTo(new_div);
			if (inbound_div == ""){
				price_div.css({"height":"140px", "padding":"5px 0px 0px 0px"});
				outbound_div.css({"padding":"10px 0px 0px 0px"});
			}
			var flight_price = $("<div id='flight_price'><p><h3>Desaglose de precio</h3></p><p><table><tr><th>Por adultos</th><th>Por ninos</th><th>Por infantes</th><th>Por impuestos</th><th>Por cargas</th></tr><tr><td>"+adult_price+"</td><td>"+child_price+"</td><td>"+infant_price+"</td><td>"+tax+"</td><td>"+charges+"</td></tr></table></p><p><h3>Total: "+total+"</h3></p><a class='volver'>< volver ></a></div>").appendTo(new_div);

			//var comments_div = $(").appendTo(new_div);
			// hide divs
			flight_price.hide(0);
			$(".result").hide(0);			
		}
		for(var i=0;i<flights.total;i++){
			$(".result").fadeIn(500).delay(800);
			flight_price.hide(0);
		}
		attachClickEvent();			
	}
	return;
}

function attachClickEvent(){
	//agrego un handler dinamicamente
			$( ".view_price_detail" ).live("click", function() {
				var result_div = $( this ).parents("#result");
					if(result_div.children( "#flight_info" ).is(':visible'))
						result_div.children( "#price" ).animate({"height":"155px", "padding":"25px 0px 0px 0px"});
						result_div.children( "#flight_info" ).fadeOut(500);		
				result_div.children( "#flight_price" ).delay(600).fadeIn(1000);
			});
			
			$( ".volver" ).live("click", function() {
			var result_div = $( this ).parents("#result");
			if(result_div.children( "#flight_price" ).is(':visible'))
				result_div.children( "#price" ).animate({"height":"140", "padding":"10px 0px 0px 0px"}, 1000);
				result_div.children( "#flight_price" ).fadeOut(500);		
			result_div.children( "#flight_info" ).delay(600).fadeIn(1000);
			});
}	
