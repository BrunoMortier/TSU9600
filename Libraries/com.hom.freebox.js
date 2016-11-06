/*!
 @author Bruno MORTIER
 @title com.home.freebox
 @version 1.0
 */

 /////////////////////////////////////////////////////////////////////
//							//
//			Constantes			//
//							//
/////////////////////////////////////////////////////////////////////

//var FreeBoxCode = CF.widget("LblFreeboxCode","Config", "Home");
//var FreeBoxPrefix = "http://hd1.freebox.fr/pub/remote_control?code=";

//var FreeBoxCode;
//var FreeBoxPrefix;

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