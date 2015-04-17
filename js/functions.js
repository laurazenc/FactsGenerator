$(document).ready(function(){
	$("#inputFile").change(function(event) {

		var file = $('#inputFile')[0].files[0];
		var fr = new FileReader();
		if(file){
			var ext = file.name.split('.').pop();
		  if(ext == 'xml'){
		  	var reader = new FileReader();
        reader.readAsText(file);
        reader.onload = function(e) {
            // browser completed reading file - display it
            var xml = e.target.result;
            var parse = $.parseXML(e.target.result);
            
            //$(".content-panel").append(xml);
        };
		  }
		  	
		}
	});


	
	
});