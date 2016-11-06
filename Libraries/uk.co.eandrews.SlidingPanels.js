/*!
  @title uk.co.eandrews.SlidingPanels
  @version 1.0
  @author Simon Andrews
 */

var uk;

if (!uk) { 
  uk = {};
} else if (typeof uk !== "object") {
  throw new Error("uk already exists and is not an object");
}
if (!uk.co) {
  uk.co = {};
} else if (typeof uk.co !== "object") {
  throw new Error("uk.co already exists and is not an object");
}
if (!uk.co.eandrews) {
  uk.co.eandrews = {};
} else if (typeof uk.co.eandrews !== "object") {
  throw new Error("uk.co.eandrews already exists and is not an object");
}

if (uk.co.eandrews.SlidingPanels) {
  throw new Error("uk.co.eandrews.SlidingPanels already exists");
}

uk.co.eandrews.SlidingPanels = {};

((function () {
    function Slider(activityName){
        var allWidgets = new Array(),
            frames = 1,
            shown = 1,
            timeout = 0,
            lastDirection="left",
            open=false,
            lastButtonPressed=0,
            slider = this,
            moving=false;
  
        function createWidget(aWidget, addReset){
            newWidget = GUI.addButton();
            newWidget.parentWidget = aWidget;
            newWidget.slider = slider;
            newWidget.visible = true;
            newWidget.bgColor = aWidget.bgColor;
            newWidget.bold = aWidget.bold;
            newWidget.color = aWidget.color 
            newWidget.font = aWidget.font;
            newWidget.fontSize = aWidget.fontSize;
            newWidget.halign = aWidget.halign;
            newWidget.height = aWidget.height;
            newWidget.italic = aWidget.italic;
            newWidget.label = aWidget.label;
            newWidget.left = aWidget.left;
            if (addReset){
                newWidget.onPress = function(){this.slider.resetTimeout();this.parentWidget.scheduleActions();};
            } else {
                newWidget.onPress = function(){this.parentWidget.scheduleActions();};
            }
            newWidget.stretchImage = aWidget.stretchImage;
            newWidget.tag = aWidget.tag;
            newWidget.top = aWidget.top;
            newWidget.transparent = aWidget.transparent;
            newWidget.valign = aWidget.valign;
            newWidget.width = aWidget.width;            
        
            try {
                newWidget.setImage(aWidget.getImage(0),0);
            } catch (e) {
                //not bothered if fails, should mean source widget doesn't have image
            }
        
            try {
                newWidget.setImage(aWidget.getImage(1),1);
            } catch (e) {
                //not bothered if fails, should mean source widget doesn't have image
            }
            
            return newWidget;
        }    
        
        function move(x,y){
            //for (w in allWidgets){
            for (w=0;w<allWidgets.length;w++){
                allWidgets[w].left += Math.round(x);
                allWidgets[w].top += Math.round(y);  
            }
        }
        
        function setupMove(moveDirection){
            if (moveDirection==="left"||moveDirection==="right"){
                moveBy = GUI.width/frames; 
            } else {
                moveBy = GUI.height/frames; 
            }
        
            if (moveDirection==="left"||moveDirection==="up"){
                moveBy = -moveBy;
            }
        
            if (moveDirection==="left"||moveDirection==="right"){
                move(moveBy,0);
            } else {
                move(0,moveBy);
            }
        
            if (shown<frames){
                if (shown==1){
                    open=!open;
                    lastDirection = moveDirection;
                }
                shown++;
                Activity.scheduleAfter(1,eval(moveDirection));
            } else {
                if (open&&timeout){
                    Activity.scheduleAfter(timeout,close);
                }
                shown=1;
            }
        }
        
        function close(){
            if (open){
                now = Date.now();
                timeSinceLastClick=now-lastButtonPressed;
                if (timeSinceLastClick<timeout){
                    Activity.scheduleAfter(timeout-timeSinceLastClick,close);
                } else {
                    switch (lastDirection) {
                        case 'left': right(); break;
                        case 'right': left(); break;
                        case 'up': down(); break;
                        case 'down': up(); break;
                    }
                }
            }
        }
        
        function left(){
            setupMove("left");
        }
        
        function right(){
            setupMove("right");
        }
        
        function down(){
            setupMove("down");
        }
        
        function up(){
            setupMove("up");
        }
    
        function getParamValue(paramPage, paramName, isNumber){
            if (!paramPage){
                throw new Error("Parameter page is invalid.");
            }     
            
            widget = paramPage.widget(paramName);
            
            if (!widget){
                throw new Error("Parameter widget '"+paramName+"' doesn't exist.");
            }
            
            paramValue = widget.label;
            
            if (isNumber){
                if (isNaN(paramValue)){
                    throw new Error("Paramvalue for widget '"+paramName+"' is not a number.");
                } else {
                    return parseInt(paramValue);
                }                   
            } else {
                return paramValue;
            }
        }
        
        function getWidget(resourcePage, widgetName){
            widget = resourcePage.widget(widgetName);
            
            if (!widget){
                throw new Error("You must have a widget\nwith a PS name of '"+widgetName+"'!");
            }
            
            return widget;   
        }
        
        function processWidgets(numWidgets, isButtons){
            if (isButtons){
                prefix = "B";
            } else {
                prefix = "P";
            }
            
            for (i=1;i<=numWidgets;i++){
                widgetName = prefix+"00";
                if (i>=10 && i<100){
                    widgetName = prefix+"0";    
                } else if (i>=100){
                    widgetName = prefix;
                }
                widget = resourcePage.widget(widgetName+i);
         
                allWidgets.push(createWidget(widget,isButtons));                
            }
        }
        
        function resetTimeout(){    
            lastButtonPressed = Date.now();
        }       

        activity = CF.activity(activityName);
    
        if (!activity){
            GUI.alert("Activity ('"+activityName+"') \ndoes not exist in project!");
            return;
        }
    
        paramPage = activity.page("PARAMETERS");
  
        resourcePage = activity.page("RESOURCES");
    
        if (!resourcePage){
            GUI.alert("Resource page ('RESOURCES') does not exist in activity: "+activityName+"!");
            return;
        }
    
        frames = getParamValue(paramPage, "FRAMES", true);
        
        timeout = getParamValue(paramPage, "TIMEOUT", true);
  
        numPanels = getParamValue(paramPage, "NUM_PANELS", true);
        
        processWidgets(numPanels,false);
   
        numButtons = getParamValue(paramPage, "NUM_BUTTONS", true);
    
        processWidgets(numButtons,true);
    
        direction = getParamValue(paramPage, "SLIDE_DIRECTION", false);
            
        if (direction=="LR"){
            widget = getWidget(resourcePage,"LEFT");
            
            leftWidget = createWidget(widget);
            leftWidget.slider = this;
            leftWidget.onPress = function(){this.slider.left();};
            allWidgets.push(leftWidget);    
    
            widget = getWidget(resourcePage,"RIGHT");
        
            rightWidget = createWidget(widget);
            rightWidget.slider = this;
            rightWidget.onPress = function(){this.slider.right();};
            allWidgets.push(rightWidget);    

            move(GUI.width,0);
        } else {
            widget = getWidget(resourcePage,"UP");
        
            upWidget = createWidget(widget);
            upWidget.slider = this;
            upWidget.onPress = function(){this.slider.up();};
            allWidgets.push(upWidget);    
   
            widget = getWidget(resourcePage,"DOWN");
        
            downWidget = createWidget(widget);
            downWidget.slider = this;
            downWidget.onPress = function(){this.slider.down();};
            allWidgets.push(downWidget);   
        
            move(0,GUI.height); 
        }
     
        this.resetTimeout = resetTimeout;
        this.left = left;
        this.right = right;
        this.up = up;
        this.down = down;
    }
    
    ns = uk.co.eandrews.SlidingPanels;

    // Public classes
    ns.Slider = Slider;
    
}()));
