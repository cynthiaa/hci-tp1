$(function() {		
        $( "#departure_date" ).datepicker({
            defaultDate: "+2d",
            changeMonth: true,
			dateFormat: "yy-mm-dd",
            numberOfMonths: 1,
			minDate: 3,
            onSelect: function( selectedDate ) {
                $( "#return_date" ).datepicker( "option", "minDate", selectedDate );
            }
        });
        $( "#return_date" ).datepicker({
            defaultDate: "+2d",
            changeMonth: true,
			dateFormat: "yy-mm-dd",
            numberOfMonths: 1,
            onSelect: function( selectedDate ) {
                $( "#departure_date" ).datepicker( "option", "maxDate", selectedDate );
            }
        });
        $.datepicker.setDefaults($.datepicker.regional['es']);
    });
