sap.ui.define([
    "sap/ui/core/mvc/Controller",
    "sap/ui/core/format/NumberFormat",
    "sap/m/library"
],
    /**
     * @param {typeof sap.ui.core.mvc.Controller} Controller
     */
    function (Controller,NumberFormat,mobileLibrary) {
        "use strict";

         // shortcut for sap.m.ButtonType
        var ButtonType = mobileLibrary.ButtonType;

        // shortcut for sap.m.DialogType
        var DialogType = mobileLibrary.DialogType;

        return Controller.extend("com.sap.mot.tax.recon.motivaproject.controller.View1", {
            onInit: function () {
                var oModel = new sap.ui.model.json.JSONModel();
                var data = [{
                    "status": "Open",
                    "operator": "Anoop",
                    "caseId": "Case-123",
                    "filingState": "TX",
                    "filingCode": "FIL-123",
                    "filingName": "Tax for TX",
                    "taxPeriod": "Dec-23",
                    "dateCreated": "11/13/2023",
                    "dueDate": "02/02/2024"
                },{
                    "status": "Closed",
                    "operator": "Anoop",
                    "caseId": "Case-2344",
                    "filingState": "TX",
                    "filingCode": "FIL-234",
                    "filingName": "Tax for GA",
                    "taxPeriod": "Dec-23",
                    "dateCreated": "11/10/2023",
                    "dueDate": "01/02/2024"
                }];
                oModel.setData({ data: data });
                this.getView().setModel(oModel, "oModel");
                this.getView().byId("table2").addStyleClass("table2");
                this.getView().byId("table3").addStyleClass("table2");
                this.getView().byId("table4").addStyleClass("table2");
                this.getView().byId("idReturnsTable").addStyleClass("table3");
                var oMultiInput = this.getView().byId("multiInput");
                oMultiInput.addToken(new sap.m.Token({
                    text: "GASOLINE"
                }));
            },
            handlePress: function () {
                this.getView().byId("_panel1").setVisible(false);
                this.getView().byId("_panel2").setVisible(true);
                this.getView().byId("_cancel").setVisible(true);
                this.getView().byId("_save").setVisible(true);
                this.getView().byId("_submit").setVisible(true);
            },
            handleValueHelp: function (oEvent) {
                var sInputValue = oEvent.getSource().getValue(),
                    oView = this.getView();
                    var oDialogModel = new sap.ui.model.json.JSONModel();
                    var data = [{
                        "code": "GASOLINE",
                        "description": "065"
                    },{
                        "code": "NONPETROLEUM",
                        "description": "090"
                    },{
                        "code": "ETHANOLBLENDS",
                        "description": "124"
                    }];
                    oDialogModel.setData({ data: data });
                    this.getView().setModel(oDialogModel, "oDialogModel");
                // create value help dialog
                if (!this._pValueHelpDialog) {
                    this._pValueHelpDialog = sap.ui.xmlfragment(
                        "com.sap.mot.tax.recon.motivaproject.fragments.Dialog", this);
                    this.getView().addDependent(
                        this._pValueHelpDialog);
                    this._pValueHelpDialog.open();
                }
            },

            _handleValueHelpClose: function (evt) {
                var aSelectedItems = evt.getParameter("selectedItems"),
                    oMultiInput = this.getView().byId("multiInput");
    
                if (aSelectedItems && aSelectedItems.length > 0) {
                    aSelectedItems.forEach(function (oItem) {
                        oMultiInput.addToken(new sap.m.Token({
                            text: oItem.getTitle()
                        }));
                    });
                }
                this._pValueHelpDialog.destroy();
                this._pValueHelpDialog = undefined;
            },

            onCancel:function(){
                this.getView().byId("_panel2").setVisible(false);
                this.getView().byId("_panel1").setVisible(true);
                this.getView().byId("_cancel").setVisible(false);
                this.getView().byId("_save").setVisible(false);
                this.getView().byId("_submit").setVisible(false);

            },

            handleRateChange: function(oEvent){
                var oFormat = NumberFormat.getCurrencyInstance({
                    "currencyCode": false,
                    "customCurrencies": {
                        "MyDollar": {
                            "isoCode": "USD",
                            "decimals": 2
                        }
                    }
                });
                var rate = oEvent.getParameter("value");
                var sales = this.getView().byId("text3").getText();
                sales = sales.replaceAll(',','');
                sales = parseFloat(sales) * parseFloat(rate);
                sales = sales.toFixed(2);
                this.getView().byId("_IDGenInput1").setValue(sales);
                var purchase = this.getView().byId("_IDGenText23").getText();
                purchase = purchase.replaceAll(',','');
                purchase = purchase * rate;
                purchase = purchase.toFixed(2);
                this.getView().byId("_IDGenInput2").setValue(purchase);
                var currMonAccrual = parseFloat(sales) + parseFloat(purchase);
                var currMonAccrual1 = oFormat.format(currMonAccrual, "MyDollar");
                this.getView().byId("text7").setText(currMonAccrual1);
                var due = parseFloat(currMonAccrual) - 100;
                due = oFormat.format(due, "MyDollar");
                this.getView().byId("text18").setText(due);
                this.getView().byId("text21").setText(due);
                this.getView().byId("_IDGenInput28").setText(due);
            },

            handleTaxPay:function(oEvent){
                var oFormat = NumberFormat.getCurrencyInstance({
                    "currencyCode": false,
                    "customCurrencies": {
                        "MyDollar": {
                            "isoCode": "USD",
                            "decimals": 2
                        }
                    }
                });
                var value = oEvent.getParameter("value");
                value = value.replaceAll(',','');
                value = value.replaceAll(' ','');
                if (parseFloat(value) == 0 || value == ""){
                    this.getView().byId("_IDGenInput25").setValue("0.00");
                    var dolVal = this.getView().byId("text21").getText();
                    this.getView().byId("_IDGenInput28").setText(dolVal);
                    var Gall = this.getView().byId("text20").getText();
                    this.getView().byId("_IDGenText238").setText(Gall);
                    return;                    
                }
                var unreconAm = this.getView().byId("text21").getText();
                var unreconAm1 = this.getView().byId("text21").getText();
                unreconAm = unreconAm.replaceAll(',','');
                unreconAm = unreconAm.replaceAll('$','');
                unreconAm = parseFloat(unreconAm);
                var finVal = unreconAm + parseFloat(value);
                var finVal1 = finVal;
                finVal = oFormat.format(finVal, "MyDollar");
                this.getView().byId("_IDGenInput28").setText(finVal);
                var rate = this.getView().byId("_IDGenInput3").getValue();
                var unreconGall = parseFloat(finVal1) / parseFloat(rate);
                unreconGall = unreconGall.toFixed(2);
                this.getView().byId("_IDGenText238").setText(unreconGall);
            },

            addAdjustment: function(){
                if (!this._pAdjDialog) {
                    this._pAdjDialog = sap.ui.xmlfragment(
                        "com.sap.mot.tax.recon.motivaproject.fragments.Adjustment", this);
                    this.getView().addDependent(
                        this._pAdjDialog);
                    this._pAdjDialog.open();
                }
            },

            onCheckBox1:function(oEvent){
                var select = oEvent.getParameter("selected");
                    if(select == true){
                        sap.ui.getCore().byId("_IDGenLabel4").setVisible(true);
                        sap.ui.getCore().byId("_IDGenInput1").setVisible(true);
                    }else{
                        sap.ui.getCore().byId("_IDGenLabel4").setVisible(false);
                        sap.ui.getCore().byId("_IDGenInput1").setVisible(false);
                    }
            },

            onCheckBox2:function(oEvent){
                var select = oEvent.getParameter("selected");
                    if(select == true){
                        sap.ui.getCore().byId("_IDGenLabel5").setVisible(true);
                        sap.ui.getCore().byId("_IDGenInput2").setVisible(true);
                    }else{
                        sap.ui.getCore().byId("_IDGenLabel5").setVisible(false);
                        sap.ui.getCore().byId("_IDGenInput2").setVisible(false);
                    }
            },

            onCheckBox3:function(oEvent){
                var select = oEvent.getParameter("selected");
                    if(select == true){
                        sap.ui.getCore().byId("_IDGenLabel6").setVisible(true);
                        sap.ui.getCore().byId("_IDGenInput3").setVisible(true);
                    }else{
                        sap.ui.getCore().byId("_IDGenLabel6").setVisible(false);
                        sap.ui.getCore().byId("_IDGenInput3").setVisible(false);
                    }
            },
            submitCloseAdjustment:function(){
                this._pAdjDialog.destroy();
                this._pAdjDialog = undefined;
            },
            onSave:function(){
                sap.m.MessageToast.show("Data saved successfully");
            },
            onSubmit:function(){
                var _this = this;
                if (!this.SubmitDialog) {
                    this.SubmitDialog = new sap.m.Dialog({
                        type: DialogType.Message,
                        title: "Confirm Submit",
                        content: new sap.m.Text({ text: "Go to Recon?" }),
                        beginButton: new sap.m.Button({
                            type: ButtonType.Accept,
                            text: "Confirm",
                            press: function () {
                                this.SubmitDialog.close();
                                _this.onSubmitConfirm();
                                sap.m.MessageToast.show("Data submitted for review successfully");
                                _this.onCancel();
                            }.bind(this)
                        }),
                        endButton: new sap.m.Button({
                            text: "Cancel",
                            press: function () {
                                this.SubmitDialog.close();
                            }.bind(this)
                        })
                    });
                }
    
                this.SubmitDialog.open();
            },

            onSubmitConfirm: function(){
                var BPAPayload = {
 
                    "definitionId": "eu10.kaar.taxreconapproval.taxRecon",
 
                    "context": {
                        "approveremail": "abc@abc.com",
                        "approvername": "abc"
                    }
                };
 
                $.ajax({
                    url:  "/workflow/rest/v1/workflow-instances/",
                    type: "POST",
                    async: false,
                    //headers : { "X-Csrf-Token": "Fetch" },
                    contentType: "application/json",
                    data: JSON.stringify(BPAPayload),
                    success: function (odata) {
                        console.log(odata);
                    },
                    error:  function (err) {
                        console.log(err);
                     },
 
                });
            },
            myFormatter: function (Status) {
				if (Status === "Open") {
					return "Error";
				} else if (Status === "Closed") {
					return "Success";
				} else {
					return "None";
				}
			},
        });
    });
