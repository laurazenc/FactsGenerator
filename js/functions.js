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
          workingWithXML(e);
		    };
		  }
		  	
		}
	});
	


	function workingWithXML(e){
		var xml = e.target.result;
    var parse = $.parseXML(e.target.result);
    var $xml = $(parse);
    
    var root = $xml.children()[0];
    
    // Name of rootTag
    var rootTag = $xml.children()[0].nodeName;
    var rootTagWrapper = document.createElement( "article" );
    var rootTagTitle = $("<p></p>");
    $(rootTagTitle).addClass('rootTitle');
    var $pRootTagTitle = $(rootTagTitle).text(rootTag);
    
    $(rootTagWrapper).attr('id', rootTag);
		$(rootTagWrapper).append($pRootTagTitle);

		var generalContent = document.createElement( "div" );
		$(generalContent).addClass('generalContent');
		$('.content-panel').append($(rootTagWrapper));
		$('.content-panel').append($(generalContent));


    // Name of all firstChildren
    var rootChildren = $xml.children().children();

    //Adding background-colors
    var cntFirstChildren = rootChildren.length;

		rootChildren.each(function() {
			
			var rootChildrenTag = $(this)[0].nodeName;

    	var children = document.createElement( "section" );
    	var innerChildren = document.createElement( "div" );
    	
	    $(children).attr('id', rootChildrenTag);
    	$(children).addClass('pane');
    	$(innerChildren).addClass('inner');
    	$(innerChildren).append('<h1><span class="title">'+rootChildrenTag+'</span><span class="subchildrenCounter"></span></h1>')
    	
    	var subchildrenContent = document.createElement('div');
    	$(subchildrenContent).addClass('subchildrenWrapper');
    	
	    
			
    	// Subchildren list
			var subchildrenList = $(xml).find(rootChildrenTag);
			var counter = subchildrenList.children().length;						
			// Read each subchildren content
			subchildrenList.children().each(function() {
				
				var subchildrenTag = $(this).text();
				var fact = document.createElement( "article" );

				$(fact).addClass('subchildren');
				$(fact).append($.trim(subchildrenTag));
				$(subchildrenContent).append($(fact));
			});


			$(innerChildren).append($(subchildrenContent));
			$(children).append($(innerChildren));
			$('.generalContent').append($(children));
			$( "#"+rootChildrenTag).find('.subchildrenCounter').append(counter);

			$( "#"+rootChildrenTag).addClass('bg-color'+cntFirstChildren);
			cntFirstChildren--;
    });


		//After everything is being loaded, lets give it some css style and functionallity
		xmlFormat();
	}
	
	function xmlFormat(){
		$('.pane').each(function(e) {

			var tag = $(this);

			//Calculate height of content
			var contentH = $(tag).find('.inner').height();
			//console.log(contentH);
		});
	}

	
	$(document).on('click', '.pane .inner h1' ,function(){
		var actual = $(this).parent().parent();
		var tagHeight = $(actual).find('.inner').height();
		if($(actual).hasClass('active')){
			$(actual).removeClass('active');
		}else{
			$(actual).addClass('active');

			$(actual).find('.active').attr('style', 'max-height:'+tagHeight+'px !important');
		}
	});
	

});


	