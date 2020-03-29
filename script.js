// 
// Define globally-scoped variables
// 

// 4 Time formats
let TIME12WSEC = 'h:mm:ss a';
let TIME12WOSEC = 'h:mm a';
let TIME24WSEC = moment().format('HH:mm:ss');
let TIME24WOSEC = moment().format('HH:mm:ss');
let FORMATTEDTIME = TIME12WSEC; // Default formatted time

let TIMEVIEW = {}; // the view for the time Mustache

// 
// Document Ready Handler
// 
$(function(){
  renderTime();
  setInterval(renderTime, 1000); // update clock every second
});

// Document functions
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

/**
* Define Time format
*
* What comes in: 
* @showSeconds {boolean}
* @numHrs {string} 12 or 24
* @return {string} Returns a string that defines the time format
* Errors thrown e.g. @throws {RangeError} and why
*/
TIMEVIEW = {
  time: FORMATTEDTIME // default is 12 hour with seconds
}
function renderTime(){
  $('#forTime').html(moment().format(FORMATTEDTIME));
}

// <!-- NEEDS NESTED 12 VS 24 HR -->
$('#showSeconds').click(function(){
  if ($("input[id][name$='showSeconds']").prop( "checked" )) {
    FORMATTEDTIME = TIME12WSEC;
  }else{
    FORMATTEDTIME = TIME12WOSEC;
  } 
  TIMEVIEW = {
    time: FORMATTEDTIME // should be showSeconds option
  }
  renderTime();
})



// function formatTime(){
//   $('#showSeconds').click(function(){
//     if ($("input[id][name$='showSeconds']").prop( "checked" )) {
//       let SS = 'ss';
//     }else{
//       let SS = '';
//     } 
//   });
//   $('#numHrs').click(function(){
//     if ($("input[id][name$='numHrs']").prop( "checked" )) {
//       let numHrs = 'HH';
//       let A = ''
//     }else{
//       let numHrs = 'HhhH';
//       let A = 'a'
//     } 
//   });
//   FORMATTEDTIME = moment().format('MMMM Do YYYY, numHrs:mm:SS A');
//   console.log(FORMATTEDTIME);
// }

// formatTime();
  

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