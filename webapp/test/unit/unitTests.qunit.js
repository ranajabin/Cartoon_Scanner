/* global QUnit */
QUnit.config.autostart = false;

sap.ui.getCore().attachInit(function () {
	"use strict";

	sap.ui.require([
		"Barcodescanner/cartoonscanner/test/unit/AllTests"
	], function () {
		QUnit.start();
	});
});
