$(document).ready(function() {

	$('#dropdown-minimize').click(function() {

		$('#infoWindow').animate({
			height: 'toggle',
			width: 'toggle',
		}, 350);

		scale *= -1;

		var matrix = $(this).css("transform");

		var scale = -1;
		if (matrix.split(",")[3] < 0) {
			scale = 1;
		}

		$(this).css("transform", `scaleY(${scale})`);

	});

});