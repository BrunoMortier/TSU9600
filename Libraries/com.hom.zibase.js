/*!
 @author Bruno MORTIER
 @title com.home.zibase
 @version 1.0
 */

 /////////////////////////////////////////////////////////////////////
//							//
//			Constantes			//
//							//
/////////////////////////////////////////////////////////////////////

//var ZibaseIP = CF.widget("LblZibaseIP","Config", "Home");
//var ZibasePrefix = "http://";
//var ZibaseSuffix = "/cgi-bin/domo.cgi?cmd=";

var ZibaseIP;
var ZibasePrefix;
var ZibaseSuffix;

/////////////////////////////////////////////////////////////////////
//							//
//                                   Zibase HTTP request                                     //
//							//
//    Changelog :						//
//	02-08-2015 : Original release				//
//							//		
/////////////////////////////////////////////////////////////////////

// ******************* Send Zibase HTTP action *********************
function sendZibaseCommand(command,callback)
{
	var httpLib = com.philips.HttpLibrary;
	var url = ZibasePrefix + ZibaseIP.label + ZibaseSuffix + command;
	System.print(url);
	httpLib.getHTTP(url, callback);
}