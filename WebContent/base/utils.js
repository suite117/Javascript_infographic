// url base dell'applicazione usato dove è necessario
var baseUrl = "/JSONServlet/";

function SQLInjection(str) {
    return str + " or 1=1";
}

var reader;
/**
 * Check for the various File API support.
 */
function checkFileAPI() {
    if (window.File && window.FileReader && window.FileList && window.Blob) {
	reader = new FileReader();
	return true;
    } else {
	alert('The File APIs are not fully supported by your browser. Fallback required.');
	return false;
    }
}

/*
 * display content using a basic HTML replacement
 */
function displayContents(txt, destinationDivId) {
    // console.log("destinationDivId", destinationDivId);

    // send text to container
    $("#" + destinationDivId).trigger('success', [ txt ]);
}

/**
 * read text input
 */
function readText(filePath, destinationDivId, $a) {

    checkFileAPI();

    var output = "";
    // placeholder for text output
    if (filePath.files && filePath.files[0]) {
	reader.onload = function(e) {
	    output = e.target.result;
	    displayContents(output, destinationDivId, $a);
	};
	// end onload()
	reader.readAsText(filePath.files[0]);
    }// end if html5 filelist support
    else if (ActiveXObject && filePath) {// fallback to IE 6-8 support via
	// ActiveX
	try {
	    reader = new ActiveXObject("Scripting.FileSystemObject");
	    var file = reader.OpenTextFile(filePath, 1);
	    // ActiveX File Object
	    output = file.ReadAll();
	    // text contents of file
	    file.Close();
	    // close file "input stream"
	    displayContents(output, destinationDivId, $a);
	} catch (e) {
	    if (e.number == -2146827859) {
		alert('Unable to access local files due to browser security settings. ' + 'To overcome this, go to Tools->Internet Options->Security->Custom Level. '
			+ 'Find the setting for "Initialize and script ActiveX controls not marked as safe" and change it to "Enable" or "Prompt"');
	    }
	}
    } else {// this is where you could fallback to Java Applet, Flash or similar
	return false;
    }
    return true;
}

var uiMenuId = 0;
function UIMenu($destinationDiv, data, options, level) {

    level = level ? level : 0;
    this.isHidden = false;
    if (options != null) {
	this.isHidden = options.show ? !options.show : this.isHidden;
	// console.log("this.isHidden", this.isHidden);
    }

    $destinationDiv.append('<ul id="ui-menu-' + uiMenuId + '"></ul>');
    var $ul = $('ul#ui-menu-' + uiMenuId, $destinationDiv);
    if (this.isHidden)
	$ul.hide();

    var backgroundImage= null;
    uiMenuId++;

    for ( var i = 0; i < data.length; i++) {
	var iconSpan = "";
	if (data[i].icon) {
	    iconSpan = '<span class="ui-icon ui-icon-' + data[i].icon + '"></span>';
	    backgroundImage = $("span", $ul).css('background-image');
	}
	$ul.append('<li><a href="#">' + iconSpan + data[i].label + '</a></li>');
	var $li = $("li:last-child", $ul);

	$a = $("a", $li);
	$a.data("index", i);

	if (data[i].click) {
	    $a.data("click", data[i].click);

	    $a.on('click', function(e) {
		clickFunction = $(this).data("click");
		// e.preventDefault();
		clickFunction(this);
		$ul.toggle();
	    });
	}
	if (data[i].success) {
	    $a.on('success', data[i].success);
	}

	if (data[i].disabled || !data[i].click) {
	    $li.addClass("ui-state-disabled");
	}

	switch (data[i].type) {
	case 'open':
	    $li.append('<form><input style="display:none" type="file" /></form>');
	    var $input = $("input", $li);
	    $input.on('change', function(e) {
		var destinationDivId = $(this).data("destinationDivId");
		var $a = $(this).data("a");

		readText(this, destinationDivId, $a);
	    });

	    $a.on('open', function(e, destinationDivId) {

		var $input = $("input", $(this).parent());
		$input.data("destinationDivId", destinationDivId);
		$input.data("a", $a.attr("id"));
		$input.trigger('click');
	    });
	    break;
	case 'save':

	    $a.on('save', function(e, fileName, data) {

		if (data == null)
		    return;

		var json = JSON.stringify(data);
		var blob = new Blob([ json ], {
		    type : "application/json"
		});

		var url = window.URL.createObjectURL(blob);
		// window.location = url;

		$(this).attr("download", fileName);
		// $a.attr("target", "_blank");
		$(this).attr("href", url);
		// console.log("json", json);

		// window.open(url, '_blank', '');

	    });
	    break;
	}

	if (data[i].children != null) {
	    // console.log("backgroundImage", backgroundImage);
	    inlineStyle = 'style="position: relative; right: 6px; top: -19px;"';
	    $li.append('<div ' + inlineStyle + ' class="ui-extra-icon ui-icon-triangle-1-e">&nbsp;</div>');
	    $("div", $li).css('background-image', backgroundImage);
	    UIMenu($li, data[i].children, options, level + 1);
	}
    }

    // fix for submenu
    if (level == 0) {
	$ul.menu();
	// $ul.menu("refresh");
    }

    return $ul;
}

function UICompactMenu($div, menuItems, options) {

    var divId = $div.attr("id");

    var imagePath = null;
    // console.log("options", options);

    $div.append('<div id="' + divId + '-menu-container"></div>');
    divMenuContainer = $("#" + divId + '-menu-container');
    divMenuContainer.css("width", "40px");
    divMenuContainer.css("height", "40px");

    divMenuContainer.append('<img style="width: 32px; height: 32px;" id="' + divId + '-img" ' + imagePath + '/>');
    divMenuContainer.append('<span id="' + divId + '-menu"></span>');

    var $menu = $("#" + divId + '-menu');
    $menu.css('position', 'relative');
    $menu.css('left', '12px');
    $menu.css('top', '5px');
    $menu.css('z-index', 10000);

    var menu = UIMenu($menu, menuItems);

    var imagePath = baseUrl + 'base/images/settings.png';
    var show = false;
    if (options != null) {
	if (options["css_class"])
	    divMenuContainer.addClass(options["css_class"]);

	if (options["image"])
	    $("img", divMenuContainer).attr("src", options["image"]);

	if (options["show"])
	    show = options["show"];
    }

    $("img", divMenuContainer).attr("src", imagePath);

    if (!show)
	menu.hide();

    $("#" + divId + '-img').on("click", function() {
	menu.toggle();
    });

    return menu;
}

function isFunction(functionToCheck) {
    var getType = {};
    return functionToCheck && getType.toString.call(functionToCheck) === '[object Function]';
}

function getJSON(url) {
    var data = null;
    $.ajax({
	async : false, // thats the trick
	url : url,
	dataType : 'json',
	success : function(response) {
	    data = response;
	}
    });
    return data;
}

function getJSON2(url) {
    var t;
    $.getJSON(url, {
    // param : someparam
    }, function(data) {
	t = data;
    });
    return t;
}

function createObjfromObj(input, mapping) {

    var out = new Object();

    // per ogni elemento del mapping crea un oggetto con chiave specificata a
    // sinistra del mapping e valore
    // l'elaborazione della parte destra del mapping
    for (key in mapping) {
	var f = mapping[key][0];
	if (isFunction(f)) {

	    var arguments = mapping[key].slice(1);

	    if (arguments.length == 1) {
		if (arguments[0] instanceof Array) {
		    var args = new Array();
		    for ( var i = 0; i < arguments[0].length; i++) {
			args[i] = input[arguments[0][i]];
			// document.writeln(args[i] + "<br />");
		    }

		    out[key] = f.call(null, args);
		} else
		    // viene passato il singolo parametro
		    out[key] = f.call(null, new Array(input[arguments]));
	    } else {
		// recupera i valori delle proprietà dell'oggetto
		// e li passa alla funzione
		var args = new Array();
		for ( var i = 0; i < arguments.length; i++) {
		    args[i] = input[arguments[i]];
		    // document.write("p: " + args[i]);
		}
		out[key] = f.call(null, args);

	    }
	} else
	    out[key] = input[mapping[key]];
    }

    return out;
}
