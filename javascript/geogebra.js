// script to load embeded geogebra
var params = {"appName": "graphing", "width": 1000, "height": 600, "showToolBar": true, "showAlgebraInput": true, "showMenuBar": true };
var applet = new GGBApplet(params, true);
window.addEventListener("load", function() {
	applet.inject('ggb-element');
});

// script to load windowed geogebra
var questionmark = "data:image/svg+xml;base64,PHN2ZyB4bWxucz0iaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmciIHdpZHRoPSIyNCIgaGVpZ2h0PSIyNCIgdmlld0JveD0iMCAwIDI0IDI0Ij48cGF0aCBmaWxsPSJub25lIiBkPSJNMCAwaDI0djI0SDB6Ii8+PHBhdGggZD0iTTExIDE4aDJ2LTJoLTJ2MnptMS0xNkM2LjQ4IDIgMiA2LjQ4IDIgMTJzNC40OCAxMCAxMCAxMCAxMC00LjQ4IDEwLTEwUzE3LjUyIDIgMTIgMnptMCAxOGMtNC40MSAwLTgtMy41OS04LThzMy41OS04IDgtOCA4IDMuNTkgOCA4LTMuNTkgOC04IDh6bTAtMTRjLTIuMjEgMC00IDEuNzktNCA0aDJjMC0xLjEuOS0yIDItMnMyIC45IDIgMmMwIDItMyAxLjc1LTMgNWgyYzAtMi4yNSAzLTIuNSAzLTUgMC0yLjIxLTEuNzktNC00LTR6Ii8+PC9zdmc+";
var tutorials = {
	'1':['Classic: Graphing Perspective','https://www.geogebra.org/m/XUv5mXTm#chapter/400286'],
	'2':['Classic: Geometry Perspective','https://www.geogebra.org/m/XUv5mXTm#chapter/400287'],
	'3':['Classic: Spreadsheet Perspective','https://www.geogebra.org/m/XUv5mXTm#chapter/400292'],
	'4':['Classic: CAS Perspective','https://www.geogebra.org/m/XUv5mXTm#chapter/400291'],
	'5':['Classic: 3D Geometry Perspective','https://www.geogebra.org/m/XUv5mXTm#chapter/400289'],
	'6':['Classic: Statistics Perspective','https://www.geogebra.org/m/XUv5mXTm#chapter/400293'],
	'graphing':['Graphing Calculator', 'https://www.geogebra.org/m/vd6UC685'],
	'geometry':['Geometry', 'https://www.geogebra.org/m/DmVNbn2V'],
	'cas':['CAS', 'https://www.geogebra.org/m/mxtyvd22'],
	'scientific':['Scientific Calculator', 'https://www.geogebra.org/m/brr48aw7'],
	'3d':['3D Calculator', 'https://www.geogebra.org/m/aWhYSpvy']
};
var lastApp = null;
function updateHelp(p){
	$("#dialog").dialog("option",{"title":"GeoGebra " + tutorials[p][0] + "<a target=\"_blank\" href=\""+tutorials[p][1]+"\"><img src=\""+questionmark+"\"/></a>"});
}

/* Classic ÜPerspectives */
function perspective(p){
	updateHelp(p);
	
	// reset parameters and reinit app - only needed for switching between classic and new apps
	//---------------------------------------
	parameters["perspective"]="1";
	parameters["appName"]="classic";
	applet = new GGBApplet(parameters, '5.0', 'applet_container');
	applet.inject('applet_container');
	//---------------------------------
	
	if(lastApp === p && $("#dialog").dialog("isOpen")){
		$("#dialog").dialog("close");
		lastApp = null;
		//if applet is initialized open it	
		}else {
		$("#dialog").dialog("open");
		function doSetPerspective(){
			ggbApplet.newConstruction();
			ggbApplet.setPerspective(p);
			ggbApplet.showToolBar(p != "1" && p != "6");
			checkWindowSize();
			lastApp = p;
		}
		if(window.ggbApplet && ggbApplet.setPerspective){
			doSetPerspective();
			}else{
			window.ggbOnInit = doSetPerspective;
		}
	}
	
}

/* new UI Apps */
function start(appname){
	updateHelp(appname);
	
	// reset parameters and reinit app - only needed for switching between classic and new apps
	//---------------------------------------
	parameters["perspective"]=null;
	parameters["appName"]=appname;
	applet = new GGBApplet(parameters, true);
	applet.inject('applet_container');
	//---------------------------------
	
	if($("#dialog").dialog("isOpen")){
		$("#dialog").dialog("close");
		//if applet is initialized open it	
		}else {
		$("#dialog").dialog("open");
		
		if(window.ggbApplet && ggbApplet.newConstruction){
			ggbApplet.newConstruction();
			checkWindowSize();
			}else{
			window.ggbOnInit = checkWindowSize;
		}
	}
	
}
var parameters = {
	"appName":null,
	"id":"ggbApplet",
	"width":800,
	"height":600,
	"showToolBar":true,
	"borderColor":null,
	"showMenuBar":false,
	"allowStyleBar":true,
	"showAlgebraInput":true,
	"enableLabelDrags":false,
	"enableShiftDragZoom":true,
	"capturingThreshold":null,
	"showToolBarHelp":false,
	"errorDialogsActive":true,
	"showTutorialLink":true,
	"showLogging":true,
	"useBrowserForJS":true,
	"disableAutoScale":true,
"perspective":"1"};
var applet = new GGBApplet(parameters, true);
//  when used with Math Apps Bundle, uncomment this:
//  applet.setHTML5Codebase('GeoGebra/HTML5/5.0/web3d/');
window.onload = function() { applet.inject('applet_container'); updateHelp('1');}

// script setup windows
var dialogPaddingV = 60;
var dialogPaddingH = 10;		
var dialogMarginH = 10;
var dialogMarginV = 10;
var dialogMinHeight = 300;
var dialogMinWidth = 280;
function checkWindowSize(){
	if(!$("#dialog").dialog("isOpen")){
		return;
	}
	if(window.innerWidth < $("#dialog").dialog("option","width") + $("#dialog").parent().offset()["left"] + dialogMarginH){
		$("#dialog").parent().offset({"left":window.innerWidth - $("#dialog").dialog("option","width") - dialogMarginH});
	}
	if(window.innerWidth < $("#dialog").dialog("option","width") + dialogMarginH){
		var targetWidth = Math.max(dialogMinWidth, window.innerWidth);
		$("#dialog").parent().offset({"left":0})
		$("#dialog").dialog("option",{"width":targetWidth - dialogMarginH})
		window.ggbApplet && ggbApplet.setWidth(targetWidth -dialogPaddingH - dialogMarginH);
	}
	
	if(window.innerHeight < $("#dialog").dialog("option","height") + $("#dialog").parent().offset()["top"] + dialogMarginV){
		$("#dialog").parent().offset({"top":window.innerHeight - $("#dialog").dialog("option","height") - dialogMarginV});
	}
	if(window.innerHeight < $("#dialog").dialog("option","height")){
		var targetHeight = Math.max(dialogMinHeight, window.innerHeight);
		$("#dialog").parent().offset({"top":0})
		$("#dialog").dialog("option",{"height": targetHeight})
		window.ggbApplet && ggbApplet.setHeight(targetHeight -dialogPaddingV);
	}
}
$( function() {
	function dialogResize(e,ui){
		
		ggbApplet.setSize(ui.size.width-dialogPaddingH, ui.size.height-dialogPaddingV);
	}
	$("#dialog" ).dialog({
		width:810,
		height:600 + dialogPaddingV,
		minHeight: dialogMinHeight,
		minWidth: dialogMinWidth,
		resize:dialogResize,
	autoOpen: false});
	$("#dialog").data('dialog').uiDialog.draggable('option', {
		containment: [-100000,-10000,10000,10000],
		cancel: '.ui-dialog-titlebar-close, .GeoGebraFrame',
	handle: '.ui-dialog-titlebar, .ui-dialog-content'} );
	
	window.addEventListener("resize",checkWindowSize);
}
);