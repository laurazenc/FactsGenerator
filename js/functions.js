$(document).ready(function(){

	var rootChildren;
	var rootTag; 					//Lv0
	var rootChildrenTag; 	//Lv1
	var subchildrenTag; 	//Lv2

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
          // Enable adding-panel
		    };
        setAddBtn();
        exportBtn();
		  }
		  	
		}
	});
	

	function setAddBtn(){
		$('.adding-btn').css('visibility', 'visible');
		var contetPanelLeft = $('.addInputFile').offset();
		var contentPanelRight = contetPanelLeft.left + $('.addInputFile').width();

		$('.adding-btn').css('left', (contentPanelRight + 30)+'px');
		$('.adding-btn').css('top', ($( window ).height()/2) - ($('.adding-btn').height())/2);
		
	}

	function exportBtn(){
		$('.export-panel').css({
			'visibility': 'visible',
			'display': 'block'
		});
	}


	function workingWithXML(e){
		var xml = e.target.result;
    var parse = $.parseXML(e.target.result);
    var $xml = $(parse);
    
    var root = $xml.children()[0];
    
    // Name of rootTag
    rootTag = $xml.children()[0].nodeName;
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
    rootChildren = $xml.children().children();

    //Adding background-colors
    var cntFirstChildren = rootChildren.length;

		rootChildren.each(function() {
			
			rootChildrenTag = $(this)[0].nodeName;

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
				subchildrenTag = $(this)[0].nodeName;
				var subchildrenText = $(this).text();
				var fact = document.createElement( "article" );

				$(fact).addClass('subchildren').attr('name', subchildrenTag);
				$(fact).append('<div class="subchildrenText">'+($.trim(subchildrenText))+'</div>');
				$(fact).append('<div class="subchildrenPanel"> <i class="edit fa fa-pencil"></i> <i class="delete fa fa-trash"></i> </div>'); 
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

	$(window).on("resize scroll",function(e){
	    setAddBtn();
	    addingPanelPos();
	});

	
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
	
	$(document).on('click', '.edit', function(){
		var buttonEdit = $(this).attr('class', 'save fa fa-floppy-o');
		var editableNode = $(this).parent().parent();
		var editableText = $(editableNode).find('.subchildrenText');
		$(editableText).attr('contenteditable', 'true').addClass('dashed');
		$(editableNode).addClass('editable');
	});

	$(document).on('click', '.save', function(){
		var buttonEdit = $(this).attr('class', 'edit fa fa-pencil');
		var editableNode = $(this).parent().parent();
		var editableText = $(editableNode).find('.subchildrenText');
		$(editableText).attr('contenteditable', 'falase').removeClass('dashed');
		$(editableNode).removeClass('editable');
	});

	$(document).on('click', '.delete', function(){
		//Update tag lenght
		var actualTag = $(this).parent().parent().parent().parent().parent().attr('id');
		var tagCounter = parseInt($("#"+actualTag).find('.subchildrenCounter').html());
		$("#"+actualTag).find('.subchildrenCounter').html(tagCounter-1);
		

		var removeNode = $(this).parent().parent();
		$(removeNode).remove();

	});

	$(document).on('click', '.adding-btn', function(){
		$('.adding-panel').css({
			'visibility': 'visible',
			'display': 'block'
		});
		addingPanelPos();
		$(this).children().attr('class', 'close fa fa-times');
		$(this).addClass('close-btn');

		//Set form content
		$('.addchooser').find('.btnlevel1').attr('value', rootTag);
		$('.addchooser').find('.btnlevel2').attr('value', subchildrenTag);
		
	});

	$(document).on('click', '.close-btn', function(){
		$(this).children().attr('class', 'add fa fa-plus');
		$(this).removeClass('close-btn');
		$('.adding-panel').css({
			'visibility': 'hidden',
			'display': 'none'
		});
	});

	function addingPanelPos(){
		var lV = (($(window).width()/2) - $('.adding-wrapper').width()/2);
		var tV = (($(window).height()/2) - $('.adding-wrapper').height()/2);
		$('.adding-wrapper').css({
			'left': lV+'px',
			'top': tV+'px'
		});;
	}

	// Form add buttons
	$(document).on('click', '.btnlevel1', function(){
		var v = $(this).val();
		$('.addForms').find('.addingForm-lv2').css('visibility', 'hidden');
		$('.addForms').find('.addingForm-lv1').css('visibility', 'visible');
		$('#level1Form p').html(v);
	});

	$(document).on('click', '.btnlevel2', function(){
		var v = $(this).val();
		$('.addForms').find('.addingForm-lv1').css('visibility', 'hidden');
		$('.addForms').find('.addingForm-lv2').css('visibility', 'visible');
		$('#level2Form p').html(v);
		$('#lv1').html('');
		rootChildren.each(function(i) {

			var name = $(this)[0].nodeName;

			var option = $("<option></option>");
      option.val(i);
      option.text(name);

      $('#lv1').append(option);
		});

	});

	$(document).on('click', '.btnAddlv2', function(){
		var text = $(this).parent().parent().find('#level2Obj').val();
		if(text){
			var level1 = $(this).parent().parent().find('#lv1 option:selected').text();
			if(level1){
				$("#"+level1).find('.subchildrenWrapper').append('<article class="subchildren" name="'+subchildrenTag+'"><div class="subchildrenText">'+text+'</div><div class="subchildrenPanel"> <i class="edit fa fa-pencil"></i> <i class="delete fa fa-trash"></i> </div></article>')
				
				$("#"+level1).find('.subchildrenCounter').html($("#"+level1).find('.subchildrenWrapper .subchildren').length);
			}
		}

	});

	//Export

	$(document).on('click', '#exportBtn' ,function(){
		var $xml = $($.parseXML('<?xml version="1.0" encoding="utf-8" ?><'+rootTag+'/>'));

		rootChildren.each(function() {

			var name = $(this)[0].nodeName;
			
			var rTag = $xml.find(rootTag);
			var ap = $('<'+name+'/>', $xml[0]);
			$(rTag).append(ap);
			var fTag = $xml.find(name);
			$('#'+name).find('.subchildren').each(function() {
				var tag = $(this).attr('name');
				var ap = $('<'+tag+'/>', $xml[0]);
				var text = $(this).find('.subchildrenText').html();
				ap.text(text);

				$(fTag).append(ap);
			});
			
		});
    var serial = new XMLSerializer();
    var XMLOut = serial.serializeToString($xml[0]);
    
    

		var fileURL = 'data:application/notepad;charset=utf-8,' + encodeURIComponent(XMLOut);
		var fileName = "output.xml";


		if (!window.ActiveXObject) {
		  var save = document.createElement('a');
		  save.href = fileURL;

		  save.target = '_blank';
		  save.download = fileName || 'unknown';

		  var event = document.createEvent('Event');
		  event.initEvent('click', true, true);
		  save.dispatchEvent(event);
		  (window.URL || window.webkitURL).revokeObjectURL(save.href);
		}

		// for IE
		else if (!!window.ActiveXObject && document.execCommand) {
		  var _window = window.open(fileURL, '_blank');
		  _window.document.close();
		  _window.document.execCommand('SaveAs', true, fileName || fileURL)
		  _window.close();
		}
		   


	});

	


});


	