$(document).ready(function() {
 
		
		$( ".result" ).children( "#flight_price" ).hide(0);
		
        $( "#view_price_detail" ).click(function() {
			var result_div = $( this ).parents("#result");
            result_div.children( "#flight_info" ).fadeOut(1000);			
			result_div.children( "#flight_price" ).delay(1000).fadeIn(500);
            return false;
        });
		
		$( "#volver" ).click(function() {
			var result_div = $( this ).parents("#result");
            result_div.children( "#flight_price" ).fadeOut(1000);			
			result_div.children( "#flight_info" ).delay(1000).fadeIn(500);
            return false;
        });
});