google.load("visualization", "1");
function Timeline(destinationDivId, idField, data, optional) {

	this.destinationDivId = destinationDivId;
	this.idField = idField;
	this.start = 'start';
	this.end = 'end';
	this.name = 'name';
	this.width = "width";
	this.height = "height";

	if (optional != null) {
		this.start = optional[this.start] ? optional[this.start] : this.start;
		this.end = optional[this.end] ? optional[this.end] : this.end;
		this.name = optional[this.name] ? optional[this.name] : this.name;
		this.width = optional[this.width] ? optional[this.width] : '100%';
		this.height = optional[this.height] ? optional[this.height] : '300px';
	}

	this.columns = [['datetime', this.start], ['datetime', this.end], ['string', 'content']];

	this.isFirstTime = true;
	this.draw(data, []);

}

Timeline.prototype.draw = function(data, selected) {

	this.rows = [];
	for (var i = 0; i < data.length; i++) {
		var row = [];
		row[0] = convertListToDate(data[i][this.start]);
		row[1] = convertListToDate(data[i][this.end]);
		var rowId = this.destinationDivId + '-' + data[i][this.idField];

		row[2] = '<div id="' + rowId + '">' + data[i][this.idField] + '-' + data[i][this.name] + '</div>';
		$("#" + rowId).data("id", data[i][this.idField]);

		if (data[i].image != undefined)
			row[2] += '<img src="' + data[i].image + '" style="width:32px; height:32px;">';
		this.rows.push(row);
	}

	var columns = this.columns;
	var rows = this.rows;
	var destinationDivId = this.destinationDivId;
	var timeline;
	var table;
	var width = this.width;
	var height = this.height;
	
	var isFirstTime = this.isFirstTime;
	if (this.isFirstTime)
		this.isFirstTime = false;
	// Called when the Visualization API is loaded.
	function drawVisualization() {
		// Create and populate a table table.

		table = new google.visualization.DataTable();

		for (var i = 0; i < columns.length; i++) {
			var column = columns[i];
			table.addColumn(columns[i][0], columns[i][1]);
		}

		table.addRows(rows);

		// specify options
		var options = {
			width : width,
			height : height,
			//height: "auto",
			editable : false, // enable dragging and editing items
			//axisOnTop: true,
			style : "box",
			locale : "it"
		};

		// Instantiate our timeline object.

		timeline = new links.Timeline(document.getElementById(destinationDivId));
		$('#' + destinationDivId).prepend('Inizio tempo:<input type="text" id="' + destinationDivId + '-startDate" value="" size="10">Fine tempo:<input type="text" id="' + destinationDivId + '-endDate" value="" size="10" ><input type="button" id="' + destinationDivId + '-setRange" value="Set" ><input type="button" id="' + destinationDivId + '-setCurrentTime" value="Data corrente">');
		//this.timeline = timeline;
		//this.table = table;

		// Add event listeners
		google.visualization.events.addListener(timeline, 'select', onselect);
		//google.visualization.events.addListener(timeline, 'change', onchange);
		//google.visualization.events.addListener(timeline, 'add', onadd);
		//google.visualization.events.addListener(timeline, 'edit', onedit);
		//google.visualization.events.addListener(timeline, 'delete', ondelete);
		google.visualization.events.addListener(timeline, 'rangechange', onrangechange);
		//google.visualization.events.addListener(timeline, 'rangechanged', onrangechanged);

		onrangechange();

		$('#' + destinationDivId + '-setRange').on('click', function(e) {
			if (!timeline)
				return;

			var newStartDate = new Date($('#' + destinationDivId + '-startDate').val());
			var newEndDate = new Date($('#' + destinationDivId + '-endDate').val());
			//console.log("newStartDate", newStartDate);
			//console.log("newEndDate", newEndDate);
			
			timeline.setVisibleChartRange(newStartDate, newEndDate);

		});


		// set the visible range to the current time
		$('#' + destinationDivId + '-setCurrentTime').on('click', function(e) {
			if (!timeline)
				return;

			timeline.setVisibleChartRangeNow();
			onrangechange();

		});

		// Draw our timeline with the created table and options
		timeline.draw(table, options);

		for (var i = 0; i < selected; i++) {
			var rowId = destinationDivId + '-' + selected[i];
			var parent = $("#" + rowId).parent().parent();
			parent.addClass('timeline-selected');
		}
		
		
		if(isFirstTime) {
			//timeline.setVisibleChartRangeAuto();
			$('#' + destinationDivId + '-setCurrentTime').trigger('click');
				
		}
		
	}

	// Make a callback function for the select item
	var onselect = function(event) {
		var rowIndex = getSelectedRow();

		if (rowIndex != undefined) {

			// Note: you can retrieve the contents of the selected row with
			var d = table.getValue(rowIndex, 2);
			var id = d.split('"')[1].split("-")[1];
			//console.log("id", id);
			var rowId = destinationDivId + '-' + id;
			//console.log("$id", $("#" + rowId).data("id"));
			var parent = $("#" + rowId).parent().parent();
			var isSelected = parent.hasClass("timeline-selected");
			var next = parent.next();
			//console.log(isSelected);
			if (!isSelected) {
				//$("#" + rowId).addClass('selected');
				next.addClass('timeline-selected');
				parent.addClass('timeline-selected');
				//document.getElementById("info").innerHTML += id + " selected<br>";

			} else {
				//$("#" + rowId).removeClass('selected');
				next.removeClass('timeline-selected');
				parent.removeClass('timeline-selected');
				//$("#" + rowId).parent(".timeline-event").removeClass('timeline-event-selected');
				//document.getElementById("info").innerHTML += id + " unselected<br>";

			}

			$("#" + destinationDivId).trigger("mapClicked", [id, !isSelected]);
			//console.log("isSelected", isSelected);

		} else {
			//document.getElementById("info").innerHTML += "no item selected<br>";
		}
	};

	// callback function for the change item
	var onchange = function() {
		var row = getSelectedRow();
		//document.getElementById("info").innerHTML += "item " + row + " changed<br>";
	};

	// callback function for the delete item
	var ondelete = function() {
		var row = getSelectedRow();
		//document.getElementById("info").innerHTML += "item " + row + " deleted<br>";
	};

	// callback function for the edit item
	var onedit = function() {
		var row = getSelectedRow();
		//document.getElementById("info").innerHTML += "item " + row + " edit<br>";
		var content = table.getValue(row, 2);
		var newContent = prompt("Enter content", content);
		if (newContent != undefined) {
			table.setValue(row, 2, newContent);
		}
		timeline.redraw();
	};

	// callback function for the add item
	var onadd = function() {
		var row = getSelectedRow();
		//document.getElementById("info").innerHTML += "item " + row + " created<br>";
		var content = table.getValue(row, 2);
		var newContent = prompt("Enter content", content);
		if (newContent != undefined) {
			table.setValue(row, 2, newContent);
			timeline.redraw();
		} else {
			// cancel adding the item
			timeline.cancelAdd();
		}
	};

	function onrangechange() {
		// adjust the values of startDate and endDate
		var range = timeline.getVisibleChartRange();
		document.getElementById(destinationDivId + '-startDate').value = dateFormat(range.start);
		document.getElementById(destinationDivId + '-endDate').value = dateFormat(range.end);
	}

	function onrangechanged() {
		//document.getElementById("info").innerHTML += "range changed<br>";
	}

	// Format given date as "yyyy-mm-dd hh:ii:ss"
	// @param datetime   A Date object.
	function dateFormat(date) {
		var datetime = date.getFullYear() + "-" + ((date.getMonth() < 9) ? "0" : "") + (date.getMonth() + 1) + "-" + ((date.getDate() < 10) ? "0" : "") + date.getDate();
		//  + " " + ((date.getHours() < 10) ? "0" : "") + date.getHours() + ":" + ((date.getMinutes() < 10) ? "0" : "") + date.getMinutes() + ":" + ((date.getSeconds() < 10) ? "0" : "") + date.getSeconds();
		return datetime;
	}

	function getSelectedRow() {
		var row = undefined;
		var sel = timeline.getSelection();
		if (sel.length) {
			if (sel[0].row != undefined) {
				row = sel[0].row;
			}
		}

		return row;
	}

	// Set callback to run when API is loaded
	google.setOnLoadCallback(drawVisualization);
	drawVisualization();
	//alert(destinationDivId);

}
function convertListToDate(list) {
	var date = new Date();

	if (list == null)
		return null;

	date.setFullYear(list[0], list[1], list[2]);

	list[3] != null ? date.setHours(list[3]) : null;
	list[4] != null ? date.setMinutes(list[4]) : null;
	list[5] != null ? date.setSeconds(list[5]) : null;

	return date;
}

