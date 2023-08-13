sap.ui.define([
	"sap/ui/core/mvc/Controller",
	"sap/m/MessageToast",
	"sap/m/MessageBox"
],
	/**
	 * @param {typeof sap.ui.core.mvc.Controller} Controller
	 */
	function (Controller, MessageToast, MessageBox) {
		"use strict";

		var prefixId;
		var oScanResultText;
		var oScanResultText2;
		// var array1 = [];
		// this.array1 = [];

		return Controller.extend("Barcodescanner.cartoonscanner.controller.Scanner", {
			onInit: function () {
				debugger;
				var that = this;
				// that.onReadAll();

				oScanResultText = this.getView().byId('sampleBarcodeScannerResult');
				oScanResultText2 = this.getView().byId('_idScanHere');
				that.garray1 = [];
			},

			onScanSuccess: function (oEvent) {
				debugger;
				var that = this;
				if (oEvent.getParameter("cancelled")) {
					MessageToast.show("Scan cancelled", { duration: 1000 });
				} else {
					if (oEvent.getParameter("text")) {

						var val = oEvent.getParameter("text");


						var oModel = new sap.ui.model.odata.ODataModel("/sap/opu/odata/sap/ZCODE_SCANNER_VERIFICATION_SRV/");

						oModel.read("/CodeScannerSet?$filter=(ZhuNumber eq '" + val + "')", {
							success: function (odata) {

								debugger;

								var success = "Cartoon has been scanned successfully!"
								var oModel11 = new sap.ui.model.json.JSONModel();
								oModel11.setData(odata);
								that.getView().setModel(oModel11, "Data11");

								oScanResultText.setValue(val);

								var audio = new Audio("../Audio/beep-04.wav");
								audio.play();

								that.getView().byId('ScannerButton2').setVisible(true);

								const unique = [...new Map(odata.results.map((m) => [m.Matnr, m])).values()];

								var totalscanned = 0;

								for (let j = 0; j < unique.length; j++) {
									totalscanned = totalscanned + parseInt(unique[j].Menge);
								}

								that.getView().byId("_idts").setValue(totalscanned);

								var oModel1 = new sap.ui.model.json.JSONModel();
								oModel1.setData(unique);
								that.getView().setModel(oModel1, "Data1");
								// MessageBox.success("Scanned successfully");
								// MessageToast.show("Cartoon has been Scanned Successfully");
								MessageBox.success(success, {
									icon: MessageBox.Icon.success,
									title: "SUCCESS",
									actions: [MessageBox.Action.OK],
									emphasizedAction: [MessageBox.Action.OK],
									onClose: function () {
									}
								});

							},

							error: function () {

								var error = "This cartoon can't be scanned.";
								MessageBox.error(error, {
									icon: MessageBox.Icon.warning,
									title: "ERROR",
									actions: [MessageBox.Action.OK],
									emphasizedAction: [MessageBox.Action.OK],
									onClose: function () {
									}
								});

								// MessageToast.show("This cartoon can't be scanned..");
								//   oScanResultText.setValue(' ');
								var audio = new Audio("../Audio/beep.wav");
								audio.play();

							}
						});

					} else {
						oScanResultText.setValue('');
					}
				}
			},

			onScanError: function (oEvent) {
				debugger;
				MessageToast.show("Scan failed: " + oEvent, { duration: 1000 });
			},

			onScanSuccess1: function (oEvent) {
				debugger;

				var that = this;

				var scannn2 = that.getView().getModel("Data11").getData().results;

				var scan1 = that.getView().getModel("Data1").getData();

				if (oEvent.getParameter("cancelled")) {
					MessageToast.show("Scan cancelled");
				} else {
					if (oEvent.getParameter("text")) {
						oScanResultText2.setValue(oEvent.getParameter("text"));
						var value1 = oEvent.getParameter("text");
						var grid = value1.split("-")[2];

						var _DataZdNum = scannn2.find(function (element) {
							return element.ZdNum === value1;
						})
						if (_DataZdNum) {
							if (that.garray1.length <= 0) {
								that.garray1.push(_DataZdNum);
							}
							else {
								var rdata = that.garray1.find(function (element) {
									return element.ZdNum === value1;
								})
								if (rdata) {
									var _Data = 'X';
								} else {
									that.garray1.push(_DataZdNum);
								}
							}
						}
						else {
							that.getView().byId('_idScanHere').setValue("Not a Valid Code");
							// MessageToast.show("This Item Not Related Our Item");
						}

						var _DataZhuNumber = scannn2.find(function (element) {
							return element.ZhuNumber === value1;
						})
						if (_DataZhuNumber) {
							var audio = new Audio("../Audio/beep.wav");
							audio.play();
							var that = this;
							var warning1 = "Wrong SKU Number";
							MessageBox.warning(warning1, {
								id: "msgbox",
								icon: MessageBox.Icon.warning,
								title: "ERROR",
								actions: [MessageBox.Action.OK],
								emphasizedAction: [MessageBox.Action.OK],
								onClose: function (actions) {
									// if (actions === "OK") {
									//     // sap.ui.getCore().byId("msgbox").close();
									// }
								}
							});
						}

						if (_Data) {
							var audio = new Audio("../Audio/beep.wav");
							audio.play();
							var warning = "You have Already Scanned this Item!";
							MessageBox.warning(warning, {
								icon: MessageBox.Icon.warning,
								title: "ERROR",
								actions: [MessageBox.Action.OK],
								emphasizedAction: [MessageBox.Action.OK],
								onClose: function () {
								}
							});
						} else {

							var rdata1 = that.garray1.find(function (element) {
								return element.ZdNum === value1;
							});
							if (rdata1) {
								var rdata2 = scan1.find(function (element) {
									return element.Zgrid === grid;
								});
								if (rdata2) {
									rdata2.Zscanned = parseInt(rdata2.Zscanned) + 1;
									that.getView().getModel("Data1").setData(scan1);

									var audio = new Audio("../Audio/beep-04.wav");
									audio.play();

									var success = "Scanned Successfully!";
									MessageBox.success(success, {
										icon: MessageBox.Icon.success,
										title: "SUCCESS",
										actions: [MessageBox.Action.OK],
										emphasizedAction: [MessageBox.Action.OK],
										onClose: function () {
										}
									});
									let TS = [];
									for (var i = 0; i < scan1.length; i++) {
										TS.push(scan1[i].Zscanned);
									}
									let sum = 0;

									for (let i = 0; i < TS.length; i++) {
										sum += parseInt(TS[i]);
									}
									that.byId("_idsq").setValue(sum);
								}
							}
						}
					} else {
						oScanResultText2.setText('');
					}
				}
			},

			// onReadAll: function () {
			//         var that = this;
			//         debugger;
			//         var oModel = new sap.ui.model.odata.ODataModel("/sap/opu/odata/sap/ZCODE_SCANNER_VERIFICATION_SRV/");
			//         // var oModel = this.getOwnerComponent().getModel("RegistraionData");

			//         oModel.read("/CodeScannerSet", {
			//             success: function (odata) {

			//                 debugger;
			//                 var oModel1 = new sap.ui.model.json.JSONModel();
			//                 oModel1.setData(odata);
			//                 that.getView().setModel(oModel1, "Data1");
			//                 // MessageBox.success("Success");

			//             },
			//             error: function (error) {
			//                 sap.ui.core.BusyIndicator.hide();
			//                 var messsage = error;
			//                 var msg = $(error.response.body).find('message').first().text();
			//                 var action = "OK";
			//                 new sap.m.MessageBox.error(msg, {
			//                     onClose: function () {
			//                         if (action === "OK") {

			//                         }
			//                     }
			//                 })
			//             }
			//             // error : function() {
			//             //     MessageBox.error("error");
			//             // }
			//         });
			//     },

		});
	});

