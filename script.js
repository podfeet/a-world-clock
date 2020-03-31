// 
// Define globally-scoped variables
// 

// 4 Time formats
let TIME12WSEC = 'h:mm:ss a';
let TIME12WOSEC = 'h:mm a';
let TIME24WSEC = 'HH:mm:ss';
let TIME24WOSEC = 'HH:mm';
let FORMATTEDTIME = TIME12WSEC; // Default formatted time
let TRUESECONDS = ''; // boolean true if show seconds is true
let TRUE12HR = ''; // boolean true if numHrs is 12

// 
// Document Ready Handler
// 
$(function(){
  renderTime();
  setInterval(renderTime, 1000); // update clock every second
  // formatTime();
});

// Document functions

/**
* Define Time format
*
* What comes in: 
* @showSeconds {boolean}
* @numHrs {string} 12 or 24
* @return {string} Returns a string that defines the time format
* Errors thrown e.g. @throws {RangeError} and why
*/

function renderTime(){
  $('#forTime').html(moment().format(FORMATTEDTIME));
}


function ifTrue(){
  TRUESECONDS = ($("input[id][name$='showSeconds']").prop( "checked" ));
  TRUE12HR = ($("input[id][name$='numHrs']").prop( "checked" ))
  if (TRUESECONDS && TRUE12HR){
    FORMATTEDTIME = TIME12WSEC
    }
    else{
      if (TRUESECONDS && !TRUE12HR){
        FORMATTEDTIME = TIME24WSEC
        }
        else{
          if (!TRUESECONDS && TRUE12HR){
            FORMATTEDTIME = TIME12WOSEC
            }
            else{
                FORMATTEDTIME = TIME24WOSEC
              }
            }
    }
}

$('#showSeconds').click(function(){
  ifTrue();
  renderTime();
});
$('#numHrs').click(function(){
  ifTrue();
  renderTime();
});



// $('#showSeconds').click(function(){
//   if ($("input[id][name$='showSeconds']").prop( "checked" )) {
//     FORMATTEDTIME = TIME12WSEC;
//   }else{
//     FORMATTEDTIME = TIME12WOSEC;
//   } 
//   TIMEVIEW = {
//     time: FORMATTEDTIME // should be showSeconds option
//   }
//   renderTime();
// })

// let hrs = 'h';
// let min = ':mm'; // no matter what, we need mm for minutes
// let sec = ':sec';

// let timeString = [hrs + min + sec];


// function formatTime(){
//   console.log(`timeString before formatTime is ${timeString}`);
//   timeString = [];
//   timeString.push(hrs + min + sec)
//   console.log(timeString);
// }
//   // This works but only on clicking
// $('#numHrs').click(function(){
//   if ($("input[id][name$='numHrs']").prop( "checked" )) { // if numHrs is checked, they asked for 12 hour, else 24 hr clock
//     hrs = 'h' }else{ hrs='HH'};
//     console.log(`on click numHrs hrs is ${hrs}`);
//     formatTime();
//   });
// $('#showSeconds').click(function(){
//   if ($("input[id][name$='showSeconds']").prop( "checked" )) {
//     sec = ':ss' }else{ sec = ''};
//     console.log(`on click sec is ${sec}`);
//     formatTime();
//   });
  
  


  

// moment().format('MMMM Do YYYY, h:mm:ss a');

// function timeFunction(ss,nh){

// }

// ************** //
// Click Handlers //
// ************** //

/**
* Click Handler for Timezone selection (Select)
*
* What comes in e.g. @param {string} boogers which is the string
* What goes out e.g. @return {jQuery} Returns a jQuery ojbect that contains...
* Errors thrown e.g. @throws {RangeError} and why
*/

/**
* Click Handler for 12 vs 24 hr selection (radio)
*
* What comes in e.g. @param {string} boogers which is the string
* What goes out e.g. @return {jQuery} Returns a jQuery ojbect that contains...
* Errors thrown e.g. @throws {RangeError} and why
*/

/**
* Click Handler for show seconds option (radio)
*
* What comes in e.g. @param {string} boogers which is the string
* What goes out e.g. @return {jQuery} Returns a jQuery ojbect that contains...
* Errors thrown e.g. @throws {RangeError} and why
*/

/**
* Click Handler for pulsing divider option (radio)
* Can I animate the radio button to help illustrate?
*
* What comes in e.g. @param {string} boogers which is the string
* What goes out e.g. @return {jQuery} Returns a jQuery ojbect that contains...
* Errors thrown e.g. @throws {RangeError} and why
*/

/**
* Description
*
* What comes in e.g. @param {string} boogers which is the string
* What goes out e.g. @return {jQuery} Returns a jQuery ojbect that contains...
* Errors thrown e.g. @throws {RangeError} and why
*/

/**
* First test of moment.js
* 
* What comes in e.g. @param {string} boogers which is the string
* What goes out e.g. @return {jQuery} Returns a jQuery ojbect that contains...
* Errors thrown e.g. @throws {RangeError} and why
*/
