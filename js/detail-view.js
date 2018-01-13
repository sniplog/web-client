function DetailView() {
	
	this.url = 'http://api.sniplog.it/json/';
	this.entryId = null;
	this.fadeInTimeout = 200;
	this.fadeOutTimeout = this.fadeInTimeout;
	this.makeDraggable = true;
	this.limitDisplayed = 5;
}

DetailView.prototype.init = function(entryId) {
	
	console.debug("DetailView init");
	this.entryId = entryId;
	this.getEntryById();
}

DetailView.prototype.getEntryById = function() {
	
	if(!this.entryId)
		return false;
	
	var search = this;
	var request = jQuery.ajax({
		  type: "POST",
		  url: this.url,
		  async: this.asyncRequests,
		  data: {'action': 'get_entry_by_id', 'entryId': this.entryId }
		});
	
	request.done(function(response) {
		search.wrapResponse(response.data[0]);
	});
	
}

DetailView.prototype.deleteEntryById = function(entryId) {
	
	
	console.debug('Delete entry with id: '+ entryId);
	
	if(!entryId)
		return false;
	
	var search = this;
	var request = jQuery.ajax({
		  type: "POST",
		  url: this.url,
		  async: this.asyncRequests,
		  data: {'action': 'delete_entry_by_id', 'entryId': entryId }
		});
	
	request.done(function(response) {

		var table = $('#example').DataTable();
	    table.draw(false);
	});
}

DetailView.prototype.makeDraggableContainer = function(resultContainer) {
	
	return resultContainer.draggable({ cancel: ".hljs > *",
		
		start: function( event, ui ) {
			jQuery(this).addClass('on-drag'); 
       },
	
		stop: function( event, ui ) {
			jQuery(this).removeClass('on-drag'); 
	   }
	
	});


}

DetailView.prototype.sendNotify = function(notify) {
	
	
	
}


DetailView.prototype.copyToClipboard = function (element) {
	
	 var $temp = $("<textarea>");
	  $("body").append($temp);
	  $temp.val($(element).text()).select();
	  document.execCommand("copy");
	  $temp.remove();
}

DetailView.prototype.wrapResponse = function(data) {
	
	
	var command = jQuery('<div />');
	var actionButtons = jQuery('<div />');
	actionButtons.addClass('action-buttons');
	
	var actionDrag = jQuery('<div />').addClass('drag-label action-button').html('<i class="glyphicon glyphicon-move"></i>');
	var actionCopy = jQuery('<div />').addClass('copy-label action-button').text('copy');
	var actionClose = jQuery('<div />').addClass('close-label action-button').html('<i class="glyphicon glyphicon-remove"></i>');

	actionButtons.append(actionDrag);
	actionButtons.append(actionCopy);
	actionButtons.append(actionClose);
	command.addClass('entries');
	
	var escapedData = data.command.replace(/</g, '&lt;');
	command.html(escapedData);
	command.wrapInner('<span />').wrapInner('<code />').wrapInner('<pre />');
	
	var description = jQuery('<div />').addClass('command-description');
	description.html(data.description + "<br /><b>by: " + data.username + "</b>");
	
	
	var resultContainer = jQuery('<div></div>');
	resultContainer.addClass('command-detail');
//	resultContainer.append(actionButtons);
	resultContainer.append(command).fadeIn(this.fadeInTimeout);
	
	
	var detailView = this;
	
	actionCopy.click(function() {
		actionCopy.text('copied!');
		detailView.copyToClipboard(command);
	});
	
	
	command.dblclick(function() {
		actionCopy.text('copied!');
		detailView.copyToClipboard(jQuery(this));
	});
	
	var detailViewEntry = jQuery('<div />').addClass('detail-view-entry');
	
	if(this.makeDraggable) {
		detailViewEntry.addClass('draggable');
		detailViewEntry = this.makeDraggableContainer(detailViewEntry);
	}
	var detailViewContainer = jQuery('#detail-view-container');
	
	detailViewEntry.append(actionButtons);
	detailViewEntry.append(resultContainer);
	

	if(data.description)
		detailViewEntry.append(description);
	
	
	actionClose.click(function() {
		//detailViewEntry.fadeOut(this.fadeOutTimeout);
		
		detailViewEntry.animate({
		    top: [ "toggle", "swing" ],
		    opacity: "toggle"
		  }, 200, "linear");
		
	});
	

	detailViewContainer.append(detailViewEntry);
	
	//	jQuery('pre code') change scope
	jQuery('pre code').each(function(i, block) {
   	    hljs.highlightBlock(block);

   	  });
	
}
