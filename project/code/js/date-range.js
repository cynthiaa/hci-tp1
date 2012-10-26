$(function() {

		
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
