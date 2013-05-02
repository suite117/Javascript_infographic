// url base dell'applicazione usato dove è necessario
var baseUrl = "/Javascript_infographic/Tesi/WebContent/";

var uiMenuId = 0;
function UIMenu($destinationDiv, data, options, level) {

	level = level ? level : 0;
	this.isHidden = false;
	if (options != null) {
		this.isHidden = options.show ? !options.show : this.isHidden;
		console.log("this.isHidden", this.isHidden);
	}

	$destinationDiv.append('<ul id="ui-menu-' + uiMenuId + '"></ul>');
	var $ul = $('ul#ui-menu-' + uiMenuId, $destinationDiv);
	if (this.isHidden)
		$ul.hide();

	var backgroundImage;
	uiMenuId++;

	for (var i = 0; i < data.length; i++) {
		var iconSpan = "";
		if (data[i].icon) {
			iconSpan = '<span class="ui-icon ui-icon-' + data[i].icon + '"></span>';
			backgroundImage = $("span", $ul).css('background-image');
		}

		$ul.append('<li><a href="#">' + iconSpan + data[i].label + '</a></li>');
		if (data[i].children != null) {

			var $li = $("li:last-child", $ul);

			//console.log("backgroundImage", backgroundImage);
			inlineStyle = 'style="position: relative; right: 6px; top: -19px;"'
			$li.append('<div ' + inlineStyle + ' class="ui-extra-icon ui-icon-triangle-1-e">&nbsp;</div>');
			$("div", $li).css('background-image', backgroundImage);
			UIMenu($li, data[i].children, options, level + 1);
		}
	}

	// fix for submenu
	if (level == 0) {
		$ul.menu();
		//$ul.menu("refresh");
	}

	return $ul;
}

UIMenu.prototype.get = function(first_argument) {
  
};


function UISettingsMenu($div, menuItems, options) {

	var divId = $div.attr("id");

	var styleClass;
	var imagePath;
	console.log("options", options);

	$div.append('<div id="' + divId + '-menu-container" ' + styleClass + '></div>');
	divMenuContainer = $("#" + divId + '-menu-container');

	divMenuContainer.append('<img style="width: 32px; height: 32px; float:right;" id="' + divId + '-img" ' + imagePath + '/>');
	divMenuContainer.append('<span id="' + divId + '-menu"></span>');

	var imagePath = 'base/images/settings.png';
	if (options != null) {
		if (options["css_class"])
			divMenuContainer.addClass(options["css_class"]);
			
		if (options["image"])
			imagePath = options["image"];

	}

	$("img", divMenuContainer).attr("src", baseUrl + imagePath);

	var $menu = $("#" + divId + '-menu');
	$menu.css('position', 'relative');
	$menu.css('left', '137px');
	$menu.css('top', '31px');

	var menu = UIMenu($menu, menuItems);
	menu.hide();
	menu.isHidden = true;

	$("#" + divId + '-img').on("click", function() {
		if (menu.isHidden) {
			menu.show();
			menu.isHidden = false;
		} else {
			menu.hide();
			menu.isHidden = true;
		}
	});

	return menu;
}

function isFunction(functionToCheck) {
	var getType = {};
	return functionToCheck && getType.toString.call(functionToCheck) === '[object Function]';
}

function getJSON(url) {
	var data;
	$.ajax({
		async : false, //thats the trick
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
		//param : someparam
	}, function(data) {
		t = data;
	})
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
					for (var i = 0; i < arguments[0].length; i++) {
						args[i] = input[arguments[0][i]];
						//document.writeln(args[i] + "<br />");
					}

					out[key] = f.call(null, args);
				} else
					// viene passato il singolo parametro
					out[key] = f.call(null, new Array(input[arguments]));
			} else {
				// recupera i valori delle proprietà dell'oggetto
				// e li passa alla funzione
				var args = new Array();
				for (var i = 0; i < arguments.length; i++) {
					args[i] = input[arguments[i]];
					//document.write("p: " + args[i]);
				}
				out[key] = f.call(null, args);

			}
		} else
			out[key] = input[mapping[key]];
	}

	return out;
}
