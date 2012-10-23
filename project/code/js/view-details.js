$(document).ready(function() { 
		
		$( ".result" ).children( "#flight_price" ).hide(0);
		$( ".result" ).children( "#flight_comments" ).hide(0);
		
        $( ".view_price_detail" ).click(function() {
			var result_div = $( this ).parents("#result");
			if(result_div.children( "#flight_info" ).is(':visible'))
				result_div.children( "#flight_info" ).fadeOut(500);
			if(result_div.children( "#flight_comments" ).is(':visible'))
				result_div.children( "#flight_comments" ).fadeOut(500);				
			result_div.children( "#flight_price" ).delay(600).fadeIn(1000);
            return false;
        });
		
		$( ".comments" ).click(function() {
			var result_div = $( this ).parents("#result");
            result_div.children( "#flight_info" ).fadeOut(500);
			if($(this).is("#airline")){
				// procesar comentarios de aerolinea
			}
			else{
				// procesar comentarios de vuelo
			}
			result_div.children( "#flight_comments" ).delay(600).fadeIn(1000);
            return false;
        });
		
		$( ".volver" ).click(function() {
			var result_div = $( this ).parents("#result");
			if(result_div.children( "#flight_price" ).is(':visible'))
				result_div.children( "#flight_price" ).fadeOut(500);
			if(result_div.children( "#flight_comments" ).is(':visible'))
				result_div.children( "#flight_comments" ).fadeOut(500);				
			result_div.children( "#flight_info" ).delay(600).fadeIn(1000);
            return false;
        });
		

});