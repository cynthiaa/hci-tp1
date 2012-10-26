// estado de la barra de busqueda avanzada
var filters_state = false;


$(document).ready(function() {
	$("#filters").hide(0);
	qs= new QueryString()
	$("#all_results").empty();
	$("#origin").val(qs.value('origin_name'));
	$("#destination").val(qs.value('destination_name'));	
	$("#departure_date").val(qs.value('departure_date'));
	$("#return_date").val(qs.value('return_date'));
	$("#adults_num").val(qs.value('adults_num'));
	$("#kids_num").val(qs.value('kids_num'));
	$("#infants_num").val(qs.value('infants_num'));
	$.ajax({
            url: "http://eiffel.itba.edu.ar/hci/service2/Geo.groovy?method=GetCities&page_size=40",
			dataType: "jsonp",
			jsonpCallback: "loadCities",
    });
});

function loadCities(data){
	qs= new QueryString()
	var orig = qs.value('origin');
	var orig_name = qs.value('origin_name');
	var dest = qs.value('destination');
	var dest_name = qs.value('destination_name')
	var dep = qs.value('departure_date');
	var ret = qs.value('return_date');
	var adult_num = qs.value('adults_num');
	var child_num = qs.value('kids_num');
	var infant_num = qs.value('infants_num');
	var sort_key = "total";
	var min_price = "";
	var max_price = "";
	var cabin = ""
	
	var myCities = new Array();
	var myCitiesId = new Array();
	if(!data.hasOwnProperty("error")){
		for (var i=0;i<data['total'];i++){
			myCities[i] = data['cities'][i]['name'];
			myCitiesId[i] = data['cities'][i]['cityId'];
		}
	}else{
		console.log(JSON.stringify(data));
	}
	
	//aca viene la llamada de ajax
	retrieveFlights(orig, dest, dep, ret, adult_num, child_num, infant_num, 1, sort_key, "asc", min_price, max_price, cabin);
	
	$( "#origin" ).autocomplete({
            source: myCities
	});
	
	$( "#destination" ).autocomplete({
            source: myCities
	});
	
	$("#search_flights").click(function () {	
		orig_name = $("#origin").val();
		orig = myCitiesId[myCities.indexOf(orig_name)];
		dest_name = $("#destination").val();
		dest = myCitiesId[myCities.indexOf(dest_name)];
		dep = $("#departure_date").val();
		ret = $("#return_date").val();
		adult_num = $("#adults_num").val();
		child_num = $("#kids_num").val();
		infant_num = $("#infants_num").val();
		// si esta abierta la ventana de filtros
		if(filters_state){
			min_price = $("#price_from").val();
			max_price = $("#price_to").val();;
			cabin = $("#cabin_type").val();
		}
		if(valid_search(orig_name, dest_name, dep, ret, min_price, max_price)){
			$("#all_results").empty();
			retrieveFlights(orig, dest, dep, ret, adult_num, child_num, infant_num, 1, sort_key, "asc", min_price, max_price, cabin);
		}				
	});
	
	$("#sort_key").change(function(){
		if($("#sort_key").val() == "Precio"){
			sort_key = "total";
		}else if($("#sort_key").val() == "Aerolinea"){
			sort_key = "airline";
		}else if($("#sort_key").val() == "Duracion"){
			sort_key = "duration";
		}else if($("#sort_key").val() == "Escalas"){
			sort_key = "stopovers";
		}		
		retrieveFlights(orig, dest, dep, ret, adult_num, child_num, infant_num, 1, sort_key, "asc", min_price, max_price, cabin);
	});
	
	$("#advanced_filters").click(function () {	
		if(filters_state){
			$("#filters").hide(500);
			// reseteo cuando cierra
			min_price = "";
			max_price = "";
			cabin = ""
			$("#price_from").val("");
			$("#price_to").val("");
			$("#cabin_type").val("Turista");
			filters_state = false;
		}else{
			$("#filters").show(500);
			filters_state = true;
		}			
	});
}

function valid_search(orig, dest, dep, ret, min_price, max_price){
		var error_string = "";
		if(orig == "")
			error_string = error_string+ translateElem("origin_error")+".\n";
		if(dest == "")
			error_string = error_string+translateElem("destination_error")+".\n";
		if(dep == "" || !checkdate(dep))
			error_string = error_string+translateElem("departure_date_error")+".\n";
		if(ret != "" && !checkdate(ret))
			error_string = error_string+translateElem("return_date_error")+".\n";
		if(min_price != "" && isNaN(parseFloat(min_price))){
				error_string = error_string+"El precio minimo debe ser un numero.\n";			
		}
		if(max_price != "" && isNaN(parseFloat(max_price))){
				error_string = error_string+"El precio maximo debe ser un numero.\n";	
		}
		if(min_price != "" && max_price != "" && !isNaN(parseFloat(max_price)) && !isNaN(parseFloat(min_price)) && parseFloat(max_price)<parseFloat(min_price) ){
				error_string = error_string+"El precio minimo debe ser menor al máximo.\n";	
		}
		if(error_string != ""){
			alert(error_string);
			error_string = "";
			return false;
		}else{
			return true;
		}
}

function checkdate(input){
	var validformat=/^\d{4}\-\d{2}\-\d{2}$/; //Basic check for format validity
	if (!validformat.test(input))
		alert(translateElem("invalid_date_format"));
	else{ //Detailed check for valid date ranges
		var monthfield=input.split("-")[1];
		var dayfield=input.split("-")[2];
		var yearfield=input.split("-")[0];
		var dayobj = new Date(yearfield, monthfield-1, dayfield);
		var currentDay = new Date();
		if(dayobj-currentDay<172800000){
			alert(translateElem("to_soon_date")); 
			return false;
		}
		if ((dayobj.getMonth()+1!=monthfield)||(dayobj.getDate()!=dayfield)||(dayobj.getFullYear()!=yearfield))
			return false;
		else
			return true;
	}
}

function retrieveFlights(orig, dest, dep, ret, adult_num, child_num, infant_num, page, sort_key, sort_order,min_price, max_price, cabin){
	// one way flight
	if (ret == ""){
		$.ajax({
            url: "http://eiffel.itba.edu.ar/hci/service2/Booking.groovy?method=GetOneWayFlights&from="+ orig +"&to="+ dest +"&dep_date="+ dep +"&adults="+ adult_num +"&children="+ child_num +"&infants="+ infant_num+"&sort_key="+ sort_key+"&sort_order="+sort_order+"&min_price="+min_price+"&max_price="+max_price+"&cabin_type="+cabin,
			dataType: "jsonp",
			jsonpCallback: "oneWay",
			beforeSend: function(){
				loading();
			},
            error: function(error) {
                alert(translateElem("server_retrievel"));
				return;
            }
        });
	}else{
		//ida y vuelta
		$.ajax({
            url: "http://eiffel.itba.edu.ar/hci/service2/Booking.groovy?method=GetRoundTripFlights&from="+ orig +"&to="+ dest +"&dep_date="+ dep +"&ret_date="+ ret +"&adults="+ adult_num +"&children="+ child_num +"&infants="+ infant_num+"&sort_key="+ sort_key+"&sort_order="+sort_order+"&min_price="+min_price+"&max_price="+max_price+"&cabin_type="+cabin,
			dataType: "jsonp",
			jsonpCallback: "twoWay",
			beforeSend: function(){
				loading();
			},
            error: function(error) {
                alert(translateElem("server_retrievel"));
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

function oneWay(data){
	displayFlights(data, "oneWay");
}

function twoWay(data){
	displayFlights(data, "twoWay");
}

function displayFlights(flights, path){
	
	var loadDiv = $("#all_results").children("#loading");
	loadDiv.delay(800).hide(800);
	if(flights.hasOwnProperty("error")){
		$("#all_results").append("<br><div id='search_error'><h3>Error "+flights.error.code+translateElem("e"+flights.error.code)+": "+"</h3></div>");
		var errorDiv = $("#all_results").children("#search_error");
		errorDiv.hide(0).delay(1000);
		errorDiv.fadeIn(500);
		return;
	}else{
		var total_flights = 0;
		for(var i=0;i<flights.total;i++){
			// todos tienen ida no importa si es de ida y vuelta
			console.log(JSON.stringify(flights));
			if(flights['flights'][i].hasOwnProperty('outboundRoutes')){
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
	
			}else{
				continue;
			}
			if(path == "twoWay"){
				// si es de ida y vuelta y no tiene vuelta se ignora
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
				}else{
					continue;
				}
			}
			// pregutnar que onda las escalas
			var stopovers = 1;

			//creacion del string query para la compra
			var path_query = "?path="+path;
			
			var flight_price_query = "&adult_price="+adult_price+"&adult_quant="+adult_quant+"&child_price="+child_price+"&child_quant="+child_quant+"&infant_price="+infant_price+"&infant_quant="+infant_quant+"&charges="+charges+"&taxes="+tax+"&total="+total;
			
			var outbound_arrival_city_query = "&outbound_arrival_date="+outbound_arrival_date+"&outbound_arrival_timezone="+outbound_arrival_timezone+"&outbound_arrival_airport="+outbound_arrival_airport+"&outbound_arrival_city="+outbound_arrival_city+"&outbound_arrival_country="+outbound_arrival_country;
			var outbound_flight_info_query = "&outbound_flight_number="+outbound_flight_number+"&outbound_cabin_type="+outbound_cabin_type+"&outbound_airline_name="+outbound_airline_name+"&outbound_airline_rating="+outbound_airline_rating+"&outbound_duration="+outbound_duration;
			var outbound_departure_city_query = "&outbound_departure_date="+outbound_departure_date+"&outbound_departure_timezone="+outbound_departure_timezone+"&outbound_departure_airport="+outbound_departure_airport+"&outbound_departure_city="+outbound_departure_city+"&outbound_departure_country="+outbound_departure_country;
			
			var inbound_departure_city_query = "";
			var inbound_arrival_city_query = "";
			var inbound_flight_info_query = "";
			if(path == "twoWay"){
				inbound_departure_city_query = "&inbound_departure_date="+inbound_departure_date+"&inbound_departure_timezone="+inbound_departure_timezone+"&inbound_departure_airport="+inbound_departure_airport+"&inbound_departure_city="+inbound_departure_city+"&inbound_departure_country="+inbound_departure_country;
				inbound_arrival_city_query = "&inbound_arrival_date="+inbound_arrival_date+"&inbound_arrival_timezone="+inbound_arrival_timezone+"&inbound_arrival_airport="+inbound_arrival_airport+"&inbound_arrival_city="+inbound_arrival_city+"&inbound_arrival_country="+inbound_arrival_country;
				inbound_flight_info_query = "&inbound_flight_number="+inbound_flight_number+"&inbound_cabin_type="+inbound_cabin_type+"&inbound_airline_name="+inbound_airline_name+"&inbound_airline_rating="+inbound_airline_rating+"&inbound_duration="+inbound_duration;	
			}				

			var stopovers_query = "&stopovers="+stopovers;			
			
			var buy_query = path_query+""+flight_price_query+""+outbound_arrival_city_query+""+inbound_arrival_city_query+""+outbound_departure_city_query+""+inbound_departure_city_query+""+outbound_flight_info_query+""+inbound_flight_info_query+""+stopovers_query;		

			//creacion del div
			var new_div = $("<br><div id='result' class='inner_box result'></div>").appendTo("#all_results");
			var price_div = $("<div id='price'><p><b><span id='price_tag1' class='translate'>Precio:</span><br>"+total+"</b><br><a class='view_price_detail'>(<span id='price_detail' class='translate'>Ver detalles</span>)</a><br></p><p><a class='button' href='summary.html"+buy_query+"'><span id='buy_label' class='translate'>Comprar</span></a></p></div>").appendTo(new_div);
			var inbound_div = (path == "twoWay")? "<p><h3><span id='origin_label1' class='translate'>Origin</span>: "+inbound_departure_city_id+" <span id='destination_label1' class='translate'>Destino:</span>"+inbound_arrival_city_id+"</h3><table><tr><th><span id='departure_label1' class='translate'>Salida</span></th><th><span id='arrival_label1' class='translate'>Llegada</span></th><th><span id='duration_label1' class='translate'>Duración</span></th><th><span id='scales_label1' class='translate'>Escalas</span></th><th><span id='airline_label1' class='translate'>Aerolinea</span></th><th><span id='flight_label1' class='translate'>Vuelo</span></th></tr><tr><td>"+inbound_departure_date+"</td><td>"+inbound_arrival_date+"</td><td>"+inbound_duration+"</td><td>"+stopovers+"</td><td>"+inbound_airline_name+"<br><a id='airline' class='comments' href='read_comments.html?method=by_airline&flight_number="+inbound_flight_number+"&airline_id="+inbound_airline_id+"' target='_blank'>(<span id='comments_label1' class='translate'>Comentarios</span>)</a></td><td>"+inbound_airline_rating+"<br><a id='flight' class='comments' href='read_comments.html?method=by_flight&flight_number="+inbound_flight_number+"&airline_id="+inbound_airline_id+"' target='_blank'>(<span id='comments_label2' class='translate'>Comentarios</span>)</a></td></tr></table></p>":"";
			var outbound_div =$("<div id='flight_info'><p><h3><span id='origin_label2' class='translate'>Origin</span> "+ outbound_departure_city_id +" <span id='destination_label2' class='translate'>Destino</span> "+ outbound_arrival_city_id +"</h3><table><tr><th><span id='departure_label2' class='translate'>Salida</span></th><th><span id='arrival_label2' class='translate'>Llegada</span></th><th><span id='duration_label2' class='translate'>Duración</span></th><th><span id='scales_label2' class='translate'>Escalas</span></th><th><span id='airline_label2' class='translate'>Aerolinea</span></th><th><span id='flight_label2' class='translate'>Vuelo</span></th></tr><tr><td>"+outbound_departure_date+"</td><td>"+outbound_arrival_date+"</td><td>"+outbound_duration+"</td><td>"+stopovers+"</td><td>"+outbound_airline_name+"<br><a id='airline' class='comments' href='read_comments.html?method=by_airline&flight_number="+outbound_flight_number+"&airline_id="+outbound_airline_id+"' target='_blank'>(<span id='comments_label3' class='translate'>Comentarios</span>)</a></td><td>"+outbound_airline_rating+"<br><a id='flight' class='comments' href='read_comments.html?method=by_flight&flight_number="+outbound_flight_number+"&airline_id="+outbound_airline_id+"' target='_blank'>(<span id='comments_label4' class='translate'>Comentarios</span>)</a></td></tr></table></p>"+inbound_div+"</div>").appendTo(new_div);
			//var inbound_div = (path == "twoWay")? "<p><h3><span id='origin_label1' class='translate'>Origin</span>: "+inbound_departure_city_id+" <span id='destination_label' class='translate'>Destino: </span>"+inbound_arrival_city_id+"</h3><table><tr><th><span id='depart_label1' class='translate'>Salida</span></th><th><span id='arrival_label' class='translate'>Llegada</span></th><th><span id='duration1' class='translate'>Duración</span></th><th><span id='scales' class='translate'>Escalas</span></th><th>"/><span id='airline1' class='translate'>Aerolinea</span></th><th>Vuelo</th></tr><tr><td>"+inbound_departure_date+"</td><td>"+inbound_arrival_date+"</td><td>"+inbound_duration+"</td><td>"+stopovers+"</td><td>"+inbound_airline_name+"<br><a id='airline' class='comments' href='read_comments.html?method=by_airline&flight_number="+inbound_flight_number+"&airline_id="+inbound_airline_id+"' target='_blank'>(Comentarios)</a></td><td>"+inbound_airline_rating+"<br><a id='flight' class='comments' href='read_comments.html?method=by_flight&flight_number="+inbound_flight_number+"&airline_id="+inbound_airline_id+"' target='_blank'>(Comentarios)</a></td></tr></table></p>":"";
			//var outbound_div =$("<div id='flight_info'><p><h3><span id='origin_label' class='translate'>Origin</span> "+ outbound_departure_city_id +" <span id='destination_label' class='translate'>Destino</span> "+ outbound_arrival_city_id +"</h3><table><tr><th><span id='depart_label' class='translate'>Salida</span></th><th><span id='><span id='arrival' class='translate'>Llegada</span></th><th><span id='duration' class='translate'>Duracion</th><th><span id='scales' class='translate'>Escalas</span></th><th><span id='airline'>Aerolinea</span></th><th>Vuelo</th></tr><tr><td>"+outbound_departure_date+"</td><td>"+outbound_arrival_date+"</td><td>"+outbound_duration+"</td><td>"+stopovers+"</td><td>"+outbound_airline_name+"<br><a id='airline' class='comments' href='read_comments.html?method=by_airline&flight_number="+outbound_flight_number+"&airline_id="+outbound_airline_id+"' target='_blank'>(Comentarios)</a></td><td>"+outbound_airline_rating+"<br><a id='flight' class='comments' href='read_comments.html?method=by_flight&flight_number="+outbound_flight_number+"&airline_id="+outbound_airline_id+"' target='_blank'>(Comentarios)</a></td></tr></table></p>"+inbound_div+"</div>").appendTo(new_div);
			if (path == "oneWay"){
				price_div.css({"height":"140px", "padding":"5px 0px 0px 0px"});
				outbound_div.css({"padding":"10px 0px 0px 0px"});
			}
			var flight_price = $("<div id='flight_price'><p><h3><span id='price_des' class='translate'>Desglose de precio</span></h3></p><p><table><tr><th><span id='adults_price' class='translate'>Por adultos</span></th><th><span id='kids_price' class='translate'>Por niños</span></th><th><span id='infants_price' class='translate'>Por infantes</span></th><th><span id='tax_price' class='translate'>Por impuestos</span></th><th><span id='charges_price' class='translate'>Por cargas</span></th></tr><tr><td>"+adult_price+"</td><td>"+child_price+"</td><td>"+infant_price+"</td><td>"+tax+"</td><td>"+charges+"</td></tr></table></p><p><h3>Total: "+total+"</h3></p><a class='volver'>< <span id='back_details' class='translate'>volver </span>></a></div>").appendTo(new_div);
			total_flights++;
			// hide divs
			flight_price.hide(0);
			$(".result").hide(0);			
		}
		if(total_flights == 0){
			$("<br><div class='inner_box result'><h3><span id='no_available_flights' class='translate'>No hay vuelos disponibles</span></h3></div>").appendTo("#all_results");
			$(".result").hide(0);
		}
		$(".result").delay(400).fadeIn(600);
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

// This is public domain code written in 2011 by Jan Wolter and distributed
// for free at http://unixpapa.com/js/querystring.html
//
// Query String Parser
//
//    qs= new QueryString()
//    qs= new QueryString(string)
//
//        Create a query string object based on the given query string. If
//        no string is given, we use the one from the current page by default.
//
//    qs.value(key)
//
//        Return a value for the named key.  If the key was not defined,
//        it will return undefined. If the key was multiply defined it will
//        return the last value set. If it was defined without a value, it
//        will return an empty string.
//
//   qs.values(key)
//
//        Return an array of values for the named key. If the key was not
//        defined, an empty array will be returned. If the key was multiply
//        defined, the values will be given in the order they appeared on
//        in the query string.
//
//   qs.keys()
//
//        Return an array of unique keys in the query string.  The order will
//        not necessarily be the same as in the original query, and repeated
//        keys will only be listed once.
//
//    QueryString.decode(string)
//
//        This static method is an error tolerant version of the builtin
//        function decodeURIComponent(), modified to also change pluses into
//        spaces, so that it is suitable for query string decoding. You
//        shouldn't usually need to call this yourself as the value(),
//        values(), and keys() methods already decode everything they return.
//
// Note: W3C recommends that ; be accepted as an alternative to & for
// separating query string fields. To support that, simply insert a semicolon
// immediately after each ampersand in the regular expression in the first
// function below.

function QueryString(qs)
{
    this.dict= {};

    // If no query string  was passed in use the one from the current page
    if (!qs) qs= location.search;

    // Delete leading question mark, if there is one
    if (qs.charAt(0) == '?') qs= qs.substring(1);

    // Parse it
    var re= /([^=&]+)(=([^&]*))?/g;
    while (match= re.exec(qs))
    {
	var key= decodeURIComponent(match[1].replace(/\+/g,' '));
	var value= match[3] ? QueryString.decode(match[3]) : '';
	if (this.dict[key])
	    this.dict[key].push(value);
	else
	    this.dict[key]= [value];
    }
}

QueryString.decode= function(s)
{
    s= s.replace(/\+/g,' ');
    s= s.replace(/%([EF][0-9A-F])%([89AB][0-9A-F])%([89AB][0-9A-F])/g,
	function(code,hex1,hex2,hex3)
	{
	    var n1= parseInt(hex1,16)-0xE0;
	    var n2= parseInt(hex2,16)-0x80;
	    if (n1 == 0 && n2 < 32) return code;
	    var n3= parseInt(hex3,16)-0x80;
	    var n= (n1<<12) + (n2<<6) + n3;
	    if (n > 0xFFFF) return code;
	    return String.fromCharCode(n);
	});
    s= s.replace(/%([CD][0-9A-F])%([89AB][0-9A-F])/g,
	function(code,hex1,hex2)
	{
	    var n1= parseInt(hex1,16)-0xC0;
	    if (n1 < 2) return code;
	    var n2= parseInt(hex2,16)-0x80;
	    return String.fromCharCode((n1<<6)+n2);
	});
    s= s.replace(/%([0-7][0-9A-F])/g,
	function(code,hex)
	{
	    return String.fromCharCode(parseInt(hex,16));
	});
    return s;
};

QueryString.prototype.value= function (key)
{
    var a= this.dict[key];
    return a ? a[a.length-1] : undefined;
};

QueryString.prototype.values= function (key)
{
    var a= this.dict[key];
    return a ? a : [];
};

QueryString.prototype.keys= function ()
{
    var a= [];
    for (var key in this.dict)
	a.push(key);
    return a;
};
