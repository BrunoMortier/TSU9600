/*!
  @title Dimmer
  @version 1.0
  @author Rick
 */
var dir,
	gmin,	gmax,
	scale,
	res, lres,
	pos, irpage,
	lab;

function dslider(wk, wg, wl, wpd, hv){
var xp, yp, xk, yk;

	lab = wl; dir = hv; irpage = wpd;
	if(dir == 0){ 
		gmin = wg.left; 
		gmax = wg.left + wg.width - wk.width;}
	else{
		gmax = wg.top + wg.height - wk.height;
		gmin = wg.top;} 
  	scale = (gmax - gmin) / 15; 
	
	if (System.getGlobal(wk.tag) == null) System.setGlobal(wk.tag , 8); 
		res = System.getGlobal(wk.tag); 
		if(dir == 0) wk.left = gmin + (scale * res);
		else wk.top =  gmin + (scale *  (15 - res));
		lab.label = res; 
////
wk.onPress = function(x, y) {
	xp = x; yp = y;	
	xk = this.left; yk = this.top;	}
/////
wk.onMove = function(x, y) { 
	if(dir == 0 ){  // horizontal
		if((x - 3) >  xp) xk +=3; else  if((x+3) < xp) xk -=3;
		if(xk > gmax) {xk = gmax; return ;} 
		if(xk < gmin) {xk = gmin; return ;}
		this.left = xk ; 
		res = (xk - gmin) / scale; }	
	else{	
		if((y - 3) >  yp) yk +=3; else  if((y +3) < yp) yk -=3;
		if(yk > gmax) {yk = gmax; return ;}
		if(yk < gmin) {yk = gmin; return ;}
		this.top = yk ; 
		res =  15 - ((yk - gmin) / scale) ; }
	
	res = Math.round(res);
	if(res == lres) return ;
	lab.label = res;
	lres = res;	}
//////
 wk.onRelease = function () {
  	System.setGlobal(this.tag,res); 
	pos = "D"+ res;
	irpage.widget(pos).scheduleActions(); }
};
