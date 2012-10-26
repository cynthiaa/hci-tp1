$(function() {
		$("#initial_search").click(function() {
			var origin = $("#origin").val();
			var destination = $("#destination").val();
			var departure_date = $("#departure_date").val();
			var return_date = $("#return_date").val();
			var adults_num = $("#adults_num").val();
			var kids_num = $("#kids_num").val();
			var infants_num = $("#infants_num").val();
			var query_string = "?origin="+origin+"&destination="+destination+"&departure_date="+departure_date+"&return_date="+return_date+"&adults_num="+adults_num+"&kids_num="+kids_num+"&infants_num="+infants_num;
			document.location.href="results.html"+query_string;
		});
		
        $( "#departure_date" ).datepicker({
            defaultDate: "+1w",
            changeMonth: true,
			dateFormat: "yy-mm-dd",
            numberOfMonths: 3,
            onSelect: function( selectedDate ) {
                $( "#return_date" ).datepicker( "option", "minDate", selectedDate );
            }
        });
        $( "#return_date" ).datepicker({
            defaultDate: "+1w",
            changeMonth: true,
			dateFormat: "yy-mm-dd",
            numberOfMonths: 3,
            onSelect: function( selectedDate ) {
                $( "#departure_date" ).datepicker( "option", "maxDate", selectedDate );
            }
        });
        $.datepicker.setDefaults($.datepicker.regional['es']);
    });
