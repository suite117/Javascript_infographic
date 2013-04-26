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

function Timeline(destinationDivId, idMap, data, optional) {

	var columns = [['datetime', 'start'], ['datetime', 'end'], ['string', 'content']];
	var rows = [];
	for (var i = 0; i < data.length; i++) {
		var row = [];
		row[0] = convertListToDate(data[i].start);
		console.log(row[0]);
		row[1] = convertListToDate(data[i].end);
		
		row[2] = '<div>' + data[i].name + '</div>';
		if (data[i].image != undefined)
			row[2] += '<img src="' + data[i].image + '" style="width:32px; height:32px;">';
		rows.push(row);
	}

	google.load("visualization", "1");

	// Set callback to run when API is loaded
	google.setOnLoadCallback(drawVisualization);

	this.timeline
	var timeline;
	var table;

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
			width : "100%",
			height : "300px",
			//height: "auto",
			editable : false, // enable dragging and editing items
			//axisOnTop: true,
			style : "box"
		};

		// Instantiate our timeline object.
		timeline = new links.Timeline(document.getElementById(destinationDivId));
		this.timeline = timeline;

		// Add event listeners
		google.visualization.events.addListener(timeline, 'select', onselect);
		google.visualization.events.addListener(timeline, 'change', onchange);
		//google.visualization.events.addListener(timeline, 'add', onadd);
		//google.visualization.events.addListener(timeline, 'edit', onedit);
		//google.visualization.events.addListener(timeline, 'delete', ondelete);
		google.visualization.events.addListener(timeline, 'rangechange', onrangechange);
		google.visualization.events.addListener(timeline, 'rangechanged', onrangechanged);

		// Draw our timeline with the created table and options
		timeline.draw(table, options);
		onrangechange();
	}

	// Make a callback function for the select item
	var onselect = function(event) {
		var row = getSelectedRow();

		if (row != undefined) {
			document.getElementById("info").innerHTML += "item " + row + " selected<br>";
			// Note: you can retrieve the contents of the selected row with
			var d = table.getValue(row, 2);
			console.log(d);
		} else {
			document.getElementById("info").innerHTML += "no item selected<br>";
		}
	};

	// callback function for the change item
	var onchange = function() {
		var row = getSelectedRow();
		document.getElementById("info").innerHTML += "item " + row + " changed<br>";
	};

	// callback function for the delete item
	var ondelete = function() {
		var row = getSelectedRow();
		document.getElementById("info").innerHTML += "item " + row + " deleted<br>";
	};

	// callback function for the edit item
	var onedit = function() {
		var row = getSelectedRow();
		document.getElementById("info").innerHTML += "item " + row + " edit<br>";
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
		document.getElementById("info").innerHTML += "item " + row + " created<br>";
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
		document.getElementById('startDate').value = dateFormat(range.start);
		document.getElementById('endDate').value = dateFormat(range.end);
	}

	function onrangechanged() {
		document.getElementById("info").innerHTML += "range changed<br>";
	}

	// Format given date as "yyyy-mm-dd hh:ii:ss"
	// @param datetime   A Date object.
	function dateFormat(date) {
		var datetime = date.getFullYear() + "-" + ((date.getMonth() < 9) ? "0" : "") + (date.getMonth() + 1) + "-" + ((date.getDate() < 10) ? "0" : "") + date.getDate() + " " + ((date.getHours() < 10) ? "0" : "") + date.getHours() + ":" + ((date.getMinutes() < 10) ? "0" : "") + date.getMinutes() + ":" + ((date.getSeconds() < 10) ? "0" : "") + date.getSeconds();
		return datetime;
	}

}

// adjust start and end time.
Timeline.prototype.setTime = function() {
	if (!this.timeline)
		return;

	var newStartDate = new Date(document.getElementById('startDate').value);
	var newEndDate = new Date(document.getElementById('endDate').value);
	this.timeline.setVisibleChartRange(newStartDate, newEndDate);
}
// set the visible range to the current time
Timeline.prototype.setCurrentTime = function() {
	if (!this.timeline)
		return;

	this.timeline.setVisibleChartRangeNow();
	onrangechange();
}
