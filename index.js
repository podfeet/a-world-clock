// 
// Define globally-scoped variables
// 

// 4 Time formats
let TIME12WSEC = moment().format('h:mm:ss a');
let TIME12WOSEC = moment().format('h:mm a');
let TIME24WSEC = moment().format('HH:mm:ss');
let TIME24WOSEC = moment().format('HH:mm:ss');
let FORMATTEDTIME = TIME12WSEC; // Default formatted time

let TIMEVIEW = {}; // the view for the time Mustache
// 
// Document Ready Handler
// 
$(function(){
  console.log('starting DOM');
  renderTime();
  console.log('I am done with DOM');
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
  $('#forTime').empty();
  $('#forTime').html(Mustache.render($('#timeTpl').html(), TIMEVIEW));
}
// 


// <!-- NEEDS NESTED 12 VS 24 HR -->
$('#showSeconds').click(function(){
  if ($("input[id][name$='showSeconds']").prop( "checked" )) {
    // console.log('showSeconds is yes');
    console.log(`12 hour time with seconds is ${TIME12WSEC}`);
    FORMATTEDTIME = TIME12WSEC;
  }else{
    console.log(`12 hour time without seconds is ${TIME12WOSEC}`);
    FORMATTEDTIME = TIME12WOSEC;
  } 
  // had to repeate TIMEVIEW in here because it wasn't getting updated with new FORMATTEDTIME
  TIMEVIEW = {
    time: FORMATTEDTIME // should be showSeconds option
  }
  renderTime();
})



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