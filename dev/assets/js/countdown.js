//deadline is for 99 days

//var deadline = '09/30/2015';

//var deadline = 'December 31 2015 00:00:50 UTC+0200';
$.fn.countDownTimer = function( options ) {
 
    // default settings for countdown timer
    var defaults = {
      'offerStartTime':Date.parse(new Date()), /*  specify the start date */
      'offerEndTime': '09/30/2015 23:16:00', /*  specify the end date */
      'serverTime':new Date(), /*  pass the server date otherwise it will take client date */
      'clockHeader':'Christmas count down',       
      'txtColor':'#FFF',
      'bgColor':'#00816A',
      'module':'no hero',
      'moduleClass':'', // this is for getting timer parent control
      'headerTxt':false,
      'headerClass':false,
      'paraTxt':false,
      'paraClass':false,
      'linkText':false,
      'linkUrl':false,
      'linkTitle':false,
      'timerFlashMessage':false,
      'timerHideAfterFinishes':false,
      'moduleHide':false,
      'apiUrl':false, /* you can pass api url http://www.timeapi.org/utc/now.json*/
      'borderRadius':'3',
      'border': '1px solid #FFF' // use none 
    };
 
    var settings = $.extend( {}, defaults, options );
    var d;
    function increamentTimer() {     
      return new Date(d.setSeconds(d.getSeconds() + 1));       
    }
 
    /* calculating remaining time for timer and checking the server increament values*/
    function getTimeRemaining(endtime,currentTime) {
      var t = Date.parse(endtime) - Date.parse(currentTime);
      var seconds = Math.floor( (t/1000) % 60 );
      var minutes = Math.floor( (t/1000/60) % 60 );
      var hours = Math.floor( (t/(1000*60*60)) % 24 );
      var days = Math.floor( t/(1000*60*60*24) );
      return {
        'total': t,
        'days': days,
        'hours': hours,
        'minutes': minutes,
        'seconds': seconds
      };
    }

    /* show days, hours, minutes and seconds show and hide with conditions */
    function showTicks(t,settings,elem) { 
      if(t.days>=1) {
        elem.find('.clockTicks').hide();
        elem.addClass('clockTickOne').find('.daysTick').show();
      }
      else {
        if(settings.module==='hero') {
          elem.find('.clockTicks').show();
          elem.addClass('clockTickThree').find('.daysTick').hide();     
        }
        else {
            if(t.hours>=1) {
              elem.find('.clockTicks').hide();
              elem.find('.hoursTick,.minutesTick').show();
            }          
            else {      
              elem.find('.clockTicks').hide();
              elem.find('.minutesTick,.secondsTick').show();
            }
            elem.addClass('clockTickTwo'); 
        }  
      } 
     
      
    }

    function stopTimer(timeinterval) {
      clearInterval(timeinterval);
    }
 
    return this.each(function() {
        
        var elem=$(this);
        /*hide the timer intially*/
        elem.hide();

        var daysSpan = elem.find('.days'); 
        var hoursSpan = elem.find('.hours'); 
        var minutesSpan = elem.find('.minutes'); 
        var secondsSpan = elem.find('.seconds'); 
        /*configurations*/        
        elem.find('.clockHeader').html(settings.clockHeader);
        elem.find('.split').css({
          'color':settings.txtColor,
          'backgroundColor':settings.bgColor,
          'borderRadius':settings.borderRadius,
          'border':settings.border
        });

        function updateClock() { 
          var t;
          d=increamentTimer();
          /*hide the clock if offer start time is early*/
          if( Date.parse(d) < Date.parse(settings.offerStartTime)) {             
            return true;
          }
          
          /* time becomes 00 reset the values to null */
          if( Date.parse(d) >= Date.parse(settings.offerEndTime)) {
            t={'total': 0, 'days': 0, 'hours': 0, 'minutes': 0, 'seconds': 0};
          }
          else {
            t=getTimeRemaining(settings.offerEndTime,d);
            
          }
          
          //daysSpan.html(t.days);
          //hoursSpan.html( ('0' + t.hours).slice(-2));
         // minutesSpan.html(('0' + t.minutes).slice(-2));
          //secondsSpan.html( ('0' + t.seconds).slice(-2));

          /* show Days, Hours, Minutes and Seconds with conditions*/
          showTicks(t,settings,elem);
          elem.show();
          /* condition for splitting values into 2 */
                    
          daysSpan.find('.split').eq(0).html(('0' + t.days).slice(-2).substring(0,1));
          daysSpan.find('.split').eq(1).html(('0' + t.days).slice(-2).substring(1,2));            
          
          hoursSpan.find('.split').eq(0).html(('0' + t.hours).slice(-2).substring(0,1));
          hoursSpan.find('.split').eq(1).html(('0' + t.hours).slice(-2).substring(1,2));
          
          minutesSpan.find('.split').eq(0).html(('0' + t.minutes).slice(-2).substring(0,1));
          minutesSpan.find('.split').eq(1).html(('0' + t.minutes).slice(-2).substring(1,2));  
          
          secondsSpan.find('.split').eq(0).html(('0' + t.seconds).slice(-2).substring(0,1));
          secondsSpan.find('.split').eq(1).html(('0' + t.seconds).slice(-2).substring(1,2));
          
          /*time becomes 00*/
          if(t.total<=0){
            stopTimer(timeinterval);
            $('.'+settings.moduleClass).addClass('timerComplete');
            
            if(settings.headerTxt) {
              elem.closest('.'+settings.moduleClass).find('.'+settings.headerClass).html(settings.headerTxt); 
              
            }
            /* second Para */
            if(settings.paraTxt) {
              elem.closest('.'+settings.moduleClass).find('.'+settings.paraClass).html(settings.paraTxt); 
              
            }
            /* Link change */
            if(settings.linkText) {
              elem.closest('.'+settings.moduleClass).find('a').attr({'title':settings.linkTitle,'href':settings.linkUrl}).text(settings.linkText); 
            }

            if(settings.timerFlashMessage) {
              elem.find('.timerFlashMessage').html(settings.timerFlashMessage);  
            }
            if(settings.timerHideAfterFinishes) {
              elem.hide();
            }
            if(settings.moduleHide) {
              elem.closest('.'+settings.moduleClass).addClass('hide');
            }

            


          }
          
          
        }
        /*example to set from Api */
        var timeinterval;
        function serverResponse() {
          updateClock();
          timeinterval = setInterval(updateClock,1000);
        }
        
        if(settings.apiUrl) {
                    
            $.ajax({
              type: 'GET',
              url: settings.apiUrl,
              
              dataType:'jsonp',
              success: function(data){
                 d=new Date(data.dateString);
                 serverResponse();
              },
              error: function(){
                 //console.log('request failed');
                 d=new Date();
                 serverResponse(); 
              }
            });    
        }
        else {          
          d=new Date(settings.serverTime);
          serverResponse();
        }
        
        

       
    });
 
};