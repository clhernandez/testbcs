	(function(){
		//init dates in indices form
		var yesterday = moment().subtract(1, 'days');
		var tomorrow = moment().add(1, 'days');

		document.getElementById("fechaDesde").value = yesterday.format("YYYY-MM-DD");
		document.getElementById("fechaHasta").value = tomorrow.format("YYYY-MM-DD");

		document.getElementById("btnFiltrar").addEventListener("click", dataFilter);//call function dataFilter onClick
		document.getElementById("periodo").addEventListener("change", onChangeDate);


		//fallback html5 datepicker with jquery-ui
		$('input[type=date]').datepicker({
		  	dateFormat: 'yy-mm-dd',
		    changeMonth: true,
		    changeYear: true
		});
	})();

	function dataFilter(){
		var indice = document.getElementById("indice").value;
		var periodo = document.getElementById("periodo").value;
		var fechaDesde = document.getElementById("fechaDesde").value;
		var fechaHasta = document.getElementById("fechaHasta").value;

		if(validateDates(fechaDesde, fechaHasta)){
			$("#table tbody").empty();

			var endpoint = "/api" + (indice!="ALL"? "/"+indice :"")+ "/" + periodo +"/"+fechaDesde+"/"+fechaHasta;
			console.log(endpoint);
			target.className="";
			$.ajax({
			  url: endpoint,
			  context: document.body
			}).done(function(data) {
				parseData(data);
			});
		}
	}

	function parseData(data){
		var indices;
		if(data.resultados.code==0){
			if(data.resultados.indicesItem.length>0){
				indices = data.resultados.indicesItem.sort(sortByDate);

				for(var i in indices){
					$("#table tbody").append("<tr class='res'> <td>"+indices[i].fecha+"</td><td>"+indices[i].indice+"</td><td>"+indices[i].ind_act+"</td><td>"+indices[i].ind_var+"</td> </tr>");
				}
			}else{
				$("#table tbody").append("<tr class='res'> <td colspan='4'><div class='alert alert-info'>No existen datos, intente refinar la busqueda.</div> </td></tr>");
			}

		}else{
			$("#table tbody").append("<tr class='res'> <td colspan='4'><div class='alert alert-warning'>Ocurrio un error en la búsqueda, intentelo nuevamente en un momento.</div> </td></tr>");
		}
		target.className="hide";
		graficar(indices);
	}

	

	function onChangeDate(){
		if(this.value=="DI"){
			document.getElementById("fechaDesde").value = (moment(document.getElementById("fechaDesde").value).startOf("month")).format("YYYY-MM-DD");
			document.getElementById("fechaHasta").value = (moment(document.getElementById("fechaDesde").value).endOf("month")).format("YYYY-MM-DD");
		}else {
			if(this.value=="ME"){
			document.getElementById("fechaDesde").value = (moment(document.getElementById("fechaDesde").value).startOf("year")).format("YYYY-MM-DD");
			document.getElementById("fechaHasta").value = (moment(document.getElementById("fechaDesde").value).endOf("year")).format("YYYY-MM-DD");
			}else {
				if(this.value=="AN"){
					document.getElementById("fechaDesde").value = (moment(document.getElementById("fechaDesde").value).startOf("year")).format("YYYY-MM-DD");
					document.getElementById("fechaHasta").value = (moment(document.getElementById("fechaDesde").value).endOf("year")).format("YYYY-MM-DD");
		
					document.getElementById("fechaDesde").value = (moment(document.getElementById("fechaDesde").value).subtract(1, "years")).format("YYYY-MM-DD");
				}
			}
		}
	}

	function graficar(indices){

	if(document.getElementById("indice").value!="ALL"){
		$("#lineChart").empty();

		var dataPlot = [];
		for(var i in indices){
			dataPlot.push({fecha: indices[i].fecha.trim(), ind_act: indices[i].ind_act, ind_may: indices[i].ind_may, ind_men: indices[i].ind_men});
		}
		

		new Morris.Line({
		  // ID of the element in which to draw the chart.
		  element: "lineChart",
		  // Chart data records -- each entry in this array corresponds to a point on
		  // the chart.
		  data: dataPlot,
		  // The name of the data record attribute that contains x-values.
		  xkey: 'fecha',
		  // A list of names of data record attributes that contain y-values.
		  ykeys: ['ind_act', 'ind_may', 'ind_men'],
		  // Labels for the ykeys -- will be displayed when you hover over the
		  // chart.
		  labels: ['Indice Actual', 'Mayor Valor indice','Menor valor Indice' ],
		  
		  lineColors:["red", "green", "blue"]
		});
	}
}