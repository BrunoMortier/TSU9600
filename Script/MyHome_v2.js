/////////////////////////////////////////////////////////////////////
//							//
//			Constantes			//
//							//
/////////////////////////////////////////////////////////////////////

var FreeBoxCode = CF.widget("LblFreeboxCode","Config", "Home");
var FreeBoxPrefix = "http://hd1.freebox.fr/pub/remote_control?code=";
var DenonIP = CF.widget("LblDenonIP","Config", "Home");



/////////////////////////////////////////////////////////////////////
//							//
//                                   Freebox HTTP request                                     //
//							//
//    Changelog :						//
//	22-09-2013 : Original release				//
//							//		
/////////////////////////////////////////////////////////////////////

// ******************* Reset Freebox Code Label*********************
function LblFreeboxCodeReset()
{
	FreeBoxCode.label = "";
}

// ******************* NumKeypad for Freebox Code Label*********************
function LblFreeboxCodeEnterKey(value)
{
	FreeBoxCode.label = FreeBoxCode.label + value;
}

// ******************* Send short HTTP request *********************
function sendShortCommand(command,callback)
{
	var httpLib = com.philips.HttpLibrary;
	var url = FreeBoxPrefix + FreeBoxCode.label + "&key=" + command;
	System.print(url);
	httpLib.getHTTP(url, callback);
}

// ******************* Send long HTTP request *********************
function sendLongCommand(command,callback)
{
	var httpLib = com.philips.HttpLibrary;
	var url = FreeBoxPrefix+ FreeBoxCode.label + "&key=" + command + "&long=true";
	System.print(url);
	httpLib.getHTTP(url, callback);
}

/////////////////////////////////////////////////////////////////////
//							//
//                                    Denon HTTP request                                      //
//							//
//    Changelog :						//
//	11-11-2013 : Original release				//
//							//		
/////////////////////////////////////////////////////////////////////
// ******************* Init Denon Connexion*********************
ConnectionSetup()

/////////////////////////////////////////////////////////////////////
//							//
//                                    Denon Socket request                                     //
//							//
//    Changelog :						//
//	22-09-2013 : Original release				//
//							//		
/////////////////////////////////////////////////////////////////////
Z1Previous = ""
Z2Previous = ""
Z3Previous = ""

ConnectionSetup()

function ConnectionSetup(){
	var myString;

	DenonSocket = new TCPDenonSocket(false);
	DenonSocket.connect(DenonIP.label,23,3000);
	//DenonSocket.onConnect=onConnect; 
	//DenonSocket.onData=onData; 
	//DenonSocket.onIOError=onIOError;
	//DenonSocket.onClose=onClose;
	//DenonSocket.getStatus=getStatus;

	myString = DenonSocket.read()
	CF.widget("Status","Home Page", "Home").label=myString;
}

function onConnect()
{
		CF.activity().label = CF.page().label ;
};

function getStatus()
{
	var tmpString;
	var myString;
	var aResults;
	var i;

	myString = DenonSocket.read()
	aResults = myString.split(String.fromCharCode(13));

	for (i=0; i<aResults.length; i++){
		tmpString = aResults[i]
		//CF.widget("AmpStatus").label = CF.widget("AmpStatus").label  + "\n" + "->" +"{ "+aResults[i].substr(0,2)+" } " +aResults[i].substr(2) + "\n" + isNaN(aResults[i].substr(2))

		if(tmpString == "ZMON"){
			widget("ZMON").setImage(widget("on","RESOURCES").getImage())
			widget("ZMOFF").setImage(widget("default","RESOURCES").getImage())
		}else if(tmpString == "ZMOFF"){
			widget("ZMOFF").setImage(widget("off","RESOURCES").getImage())
			widget("ZMON").setImage(widget("default","RESOURCES").getImage())
		}else if(tmpString == "Z2ON"){
			widget("Z2ON").setImage(widget("on","RESOURCES").getImage())
			widget("Z2OFF").setImage(widget("default","RESOURCES").getImage())
		}else if(tmpString == "Z2OFF"){
			widget("Z2OFF").setImage(widget("off","RESOURCES").getImage())
			widget("Z2ON").setImage(widget("default","RESOURCES").getImage())
		}else if(tmpString == "Z3ON"){
			widget("Z3ON").setImage(widget("on","RESOURCES").getImage())
			widget("Z3OFF").setImage(widget("default","RESOURCES").getImage())
		}else if(tmpString == "Z3OFF"){
			widget("Z3OFF").setImage(widget("off","RESOURCES").getImage())
			widget("Z3ON").setImage(widget("default","RESOURCES").getImage())
		}else if((tmpString.substr(0,2)=="MV" || tmpString.substr(0,2)=="Z2" || tmpString.substr(0,2)=="Z3") && isNaN(tmpString.substr(2)) == false){
			if(tmpString.substr(0,2)=="MV"){
				CF.widget("ZMVolume").label = FormatVolume(tmpString.substr(2)) 
			}else if(tmpString.substr(0,2)=="Z2"){
				CF.widget("Z2Volume").label = FormatVolume(tmpString.substr(2)) 
			}else if(tmpString.substr(0,2)=="Z3"){
				CF.widget("Z3Volume").label = FormatVolume(tmpString.substr(2))
			}
		}else if(tmpString.substr(0,2) == "SI"){
			//CF.widget("Status").label = Z1Previous
			if (Z1Previous != "" && CF.widget("Z1"+sDevice) != null){
				widget("Z1"+Z1Previous).setImage(widget("deviceOFF","RESOURCES").getImage())		
			}
			sDevice = tmpString.substr(2)
			if(sDevice == "AUXUSB"){
				sDevice = "AUXNET"
			}
			if(CF.widget("Z1"+sDevice) != null){
				widget("Z1"+sDevice).setImage(widget("deviceON","RESOURCES").getImage())
			}
			Z1Previous  = sDevice
		}else if(tmpString.substr(0,2) == "Z2" ){
			//CF.widget("Status").label = Z2Previous
			if (Z2Previous != "" && CF.widget("Z2"+sDevice) != null){
				widget("Z2"+Z2Previous).setImage(widget("deviceOFF","RESOURCES").getImage())		
			}
			sDevice = tmpString.substr(2)
			if(sDevice == "AUXUSB"){
				sDevice = "AUXNET"
			}
			if(CF.widget("Z2"+sDevice) != null){
				widget("Z2"+sDevice).setImage(widget("deviceON","RESOURCES").getImage())
			}
			Z2Previous  = sDevice 
		}else if(tmpString.substr(0,2) == "Z3" ){
			//CF.widget("Status").label = Z3Previous
			if (Z3Previous != "" && CF.widget("Z3"+sDevice) != null){
				widget("Z3"+Z3Previous).setImage(widget("deviceOFF","RESOURCES").getImage())		
			}
			sDevice = tmpString.substr(2)
			if(sDevice == "AUXUSB"){
				sDevice = "AUXNET"
			}
			if(CF.widget("Z3"+sDevice) != null){
				CF.widget("Z3"+sDevice).setImage(widget("deviceON","RESOURCES").getImage())
			}
			Z3Previous  = sDevice
		}else if(tmpString.substr(0,2) == "MS" ){
			CF.widget("MS").label = tmpString.substr(2)
		}
	}
}

function onData()
{
	myString = DenonSocket.read()
	if(CF.page().label == "Overview"){
		ViewInputs(myString)
	}else if(CF.page().label == "Tuner"){
		ViewTuner(myString)
	}else if(CF.page().label == "iRadio"){
		ViewiRadio(myString)
	}
}

function onClose()
{
	CF.activity().label = "Connection Closed";
	scheduleAfter(5000,ConnectionSetup);
};

function onIOError()
{
	CF.activity().label = "Connection Failed";
	scheduleAfter(5000,ConnectionSetup);
};

//-------------------------------------
//  View Inputs
//-------------------------------------
function ViewInputs(sString){

	var tmpString;
	var aResults = sString.split(String.fromCharCode(13));
	var i;
	
	for (i=0; i<aResults.length; i++){
		tmpString = aResults[i]
		//CF.widget("AmpStatus").label = CF.widget("AmpStatus").label  + "\n" + "->" +"{ "+aResults[i].substr(0,2)+" } " +aResults[i].substr(2) + "\n" + isNaN(aResults[i].substr(2))

		if(tmpString == "ZMON"){
			widget("ZMON").setImage(widget("on","RESOURCES").getImage())
			widget("ZMOFF").setImage(widget("default","RESOURCES").getImage())
		}else if(tmpString == "ZMOFF"){
			widget("ZMOFF").setImage(widget("off","RESOURCES").getImage())
			widget("ZMON").setImage(widget("default","RESOURCES").getImage())
		}else if(tmpString == "Z2ON"){
			widget("Z2ON").setImage(widget("on","RESOURCES").getImage())
			widget("Z2OFF").setImage(widget("default","RESOURCES").getImage())
		}else if(tmpString == "Z2OFF"){
			widget("Z2OFF").setImage(widget("off","RESOURCES").getImage())
			widget("Z2ON").setImage(widget("default","RESOURCES").getImage())
		}else if(tmpString == "Z3ON"){
			widget("Z3ON").setImage(widget("on","RESOURCES").getImage())
			widget("Z3OFF").setImage(widget("default","RESOURCES").getImage())
		}else if(tmpString == "Z3OFF"){
			widget("Z3OFF").setImage(widget("off","RESOURCES").getImage())
			widget("Z3ON").setImage(widget("default","RESOURCES").getImage())
		}else if((tmpString.substr(0,2)=="MV" || tmpString.substr(0,2)=="Z2" || tmpString.substr(0,2)=="Z3") && isNaN(tmpString.substr(2)) == false){
			if(tmpString.substr(0,2)=="MV"){
				CF.widget("ZMVolume").label = FormatVolume(tmpString.substr(2)) 
			}else if(tmpString.substr(0,2)=="Z2"){
				CF.widget("Z2Volume").label = FormatVolume(tmpString.substr(2)) 
			}else if(tmpString.substr(0,2)=="Z3"){
				CF.widget("Z3Volume").label = FormatVolume(tmpString.substr(2))
			}
		}else if(tmpString.substr(0,2) == "SI"){
			//CF.widget("Status").label = Z1Previous
			if (Z1Previous != "" && CF.widget("Z1"+sDevice) != null){
				widget("Z1"+Z1Previous).setImage(widget("deviceOFF","RESOURCES").getImage())		
			}
			sDevice = tmpString.substr(2)
			if(sDevice == "AUXUSB"){
				sDevice = "AUXNET"
			}
			if(CF.widget("Z1"+sDevice) != null){
				widget("Z1"+sDevice).setImage(widget("deviceON","RESOURCES").getImage())
			}
			Z1Previous  = sDevice
		}else if(tmpString.substr(0,2) == "Z2" ){
			//CF.widget("Status").label = Z2Previous
			if (Z2Previous != "" && CF.widget("Z2"+sDevice) != null){
				widget("Z2"+Z2Previous).setImage(widget("deviceOFF","RESOURCES").getImage())		
			}
			sDevice = tmpString.substr(2)
			if(sDevice == "AUXUSB"){
				sDevice = "AUXNET"
			}
			if(CF.widget("Z2"+sDevice) != null){
				widget("Z2"+sDevice).setImage(widget("deviceON","RESOURCES").getImage())
			}
			Z2Previous  = sDevice 
		}else if(tmpString.substr(0,2) == "Z3" ){
			//CF.widget("Status").label = Z3Previous
			if (Z3Previous != "" && CF.widget("Z3"+sDevice) != null){
				widget("Z3"+Z3Previous).setImage(widget("deviceOFF","RESOURCES").getImage())		
			}
			sDevice = tmpString.substr(2)
			if(sDevice == "AUXUSB"){
				sDevice = "AUXNET"
			}
			if(CF.widget("Z3"+sDevice) != null){
				CF.widget("Z3"+sDevice).setImage(widget("deviceON","RESOURCES").getImage())
			}
			Z3Previous  = sDevice
		}else if(tmpString.substr(0,2) == "MS" ){
			CF.widget("MS").label = tmpString.substr(2)
		}
	}
}

function checkString(sString){
	//CF.widget("AmpStatus").label =""
	for (i=0; i<sString.length; i++){
		//CF.widget("AmpStatus").label=CF.widget("AmpStatus").label+sString.substr(i,1) +" - " + sString.charCodeAt(i)+"\n"
	}
}

function FormatVolume(iVolume){
	if(iVolume.length > 2 ){
		return "-"+(80-(iVolume/10))+"dB"
	}else{
		if(iVolume == 99){
			return "---.- dB"
		}else{
			return "-"+(80-iVolume)+".0dB"
		}
	}
}

//------------------------------
// TUNER
//------------------------------

function ViewTuner(sString){
	var tmpString;
	var aResults = sString.split(String.fromCharCode(13));
	var i;
	
	for (i=0; i<aResults.length; i++){
		tmpString = aResults[i]
		//CF.widget("AmpStatus").label = CF.widget("AmpStatus").label  + "\n" + "->" +"{ "+aResults[i].substr(0,2)+" } " 
				
		if(tmpString == "TMAM"){
			CF.widget("txtFM").visible = false
			CF.widget("txtAM").visible= true
		}else if(tmpString == "TMFM"){
			CF.widget("txtFM").visible= true
			CF.widget("txtAM").visible= false
		}else if(tmpString == "TPOFF"){
			CF.widget("txtPreset").visible= false
			CF.widget("txtPresetNo").visible= false
		}else if(tmpString.substr(0,2) == "TF"){
			CF.widget("txtStation").visible = true
			CF.widget("txtStation").label = (tmpString.substr(2,4)*1)+"."+tmpString.substr(6)
		}else if(tmpString.substr(0,2) == "TP"){
			CF.widget("txtPreset").visible= true
			CF.widget("txtPresetNo").visible= true
			CF.widget("txtPresetNo").label = tmpString.substr(2)
		}
	}
}

function KeyNumber(iVal){
	if((CF.widget("enterStation").label.indexOf(".")>0 && iVal ==".") || ((CF.widget("enterStation").label.length-CF.widget("enterStation").label.indexOf(".")>2) && CF.widget("enterStation").label.indexOf(".")>0) ){
		iVal = ""
	}
	if(CF.widget("enterPreset").label.length == 1){
		CF.widget("enterPreset").label = CF.widget("enterPreset").label + iVal
		DenonSocket.write("TP"+CF.widget("enterPreset").label+"\r");
		CF.widget("enterPreset").visible=false
		CF.widget("txtPresetNo").visible=true
	}else{
		CF.widget("txtStation").visible = false
		CF.widget("enterStation").visible = true
		CF.widget("enterStation").label = CF.widget("enterStation").label + iVal
	}
}

function KeyLetter(sLetter){
	widget("txtPresetNo").visible=false
	CF.widget("enterPreset").visible=true
	CF.widget("enterPreset").label = sLetter
}

function KeyDel(){
	CF.widget("enterStation").label = CF.widget("enterStation").label.substr(0,CF.widget("enterStation").label.length-1)
}

function KeyEnter(){
	stationID=""
	sZeros="000000"
	if(CF.widget("enterStation").label.indexOf(".")<0){
		if(CF.widget("enterStation").label.length<4){
			stationID=sZeros.substr(0,4-CF.widget("enterStation").label.length)+CF.widget("enterStation").label+sZeros.substr(0,2)
		}else{
			stationID=CF.widget("enterStation").label+sZeros.substr(0,2)
		}
	}else{
		var aStation = widget("enterStation").label.split(".");	
		stationID=sZeros.substr(0,4-aStation[0].length)+aStation[0]+aStation[1]+sZeros.substr(0,2-aStation[1].length)
	}
	DenonSocket.write("TF"+stationID+"\r");
	CF.widget("enterStation").visible=false
	CF.widget("txtStation").visible = true
	CF.widget("enterStation").label=""
	//CF.widget("AmpStatus").label = CF.widget("AmpStatus").label  + "\n" + stationID
}

//------------------------------
// iRadio
//------------------------------
function NSAHighlight(sString){
	if((sString.charCodeAt(4)==9  || sString.charCodeAt(4)==10) ){
		CF.widget("Pointer").top = 53 + (sString.charAt(3)*21)
		CF.widget("Pointer").visible = true
	}
	if(CF.widget("NSA0").label.indexOf("Now Playing") >=0){
		CF.widget("Pointer").visible = false
	}
	return "";
}

function StripChar(sString){
	tmpString="";
	for(i=0;i<sString.length;i++){
		if(sString.charCodeAt(i)>=32 || sString.charCodeAt(i)==0){
			tmpString +=  sString.charAt(i)
		}
	}
	return tmpString;
}

function ViewiRadio(sString){
	sString= sString.replace(String.fromCharCode(13),"[CR]")
	var tmpString;
	var aResults = sString.split("[CR]");
	var i;
	
	for (i=0; i<aResults.length; i++){
		tmpString = aResults[i]
		//CF.widget("AmpStatus").label = CF.widget("AmpStatus").label  + "\n" + "->" + aResults[i] + "\n"
		if(tmpString.indexOf("NSA")>0){
			tmpString = tmpString.substr(tmpString.indexOf("NSA")) 
		}

		if(tmpString.substr(0,3)=='NSA'){
			if(tmpString.substr(0,4)=='NSA0'){
				CF.widget(tmpString.substr(0,4)).label = StripChar(tmpString.substr(4));
			}else{
				if(tmpString.charAt(5) =="*"){
					CF.widget(tmpString.substr(0,4)).label = NSAHighlight(tmpString)+"\uF0EC "+StripChar(tmpString.substr(6));
				}else{
					CF.widget(tmpString.substr(0,4)).label = NSAHighlight(tmpString)+StripChar(tmpString.substr(5));
				}
			}
		}
	}
}