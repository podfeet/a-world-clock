// 
// Define globally-scoped variables
// 

// Time formats
let TIME12WSEC = 'h:mm:ss a';
let TIME12WOSEC = 'h:mm a';
let TIME24WSEC = 'HH:mm:ss';
let TIME24WOSEC = 'HH:mm';
let FORMATTEDTIME = TIME12WSEC; // Default formatted time
let TRUESECONDS = ''; // boolean true if show seconds is true
let TRUE12HR = ''; // boolean true if numHrs is 12

// More globally-scoped variables
let zones = [];

// 
// Document Ready Handler
// 
$(function(){
  renderTime();
  setInterval(renderTime, 1000); // update clock every second
});

// Document functions

// *********************************************************** //
// render the time in the chosen format and put it in the html //
// *********************************************************** //
/**
* Render Time Function
*
* What comes in: 
* @FORMATTEDTIME {string}
* @return {string} Returns a string with formatted time and sends it placeholder html
* Errors thrown e.g. @throws {RangeError} and why
*/
function renderTime(){
  $('#forTime').html(moment().format(FORMATTEDTIME));
  $('#forTime2').html(moment().tz('America/Toronto').format(FORMATTEDTIME));
}
// *********************************************************** //
// populate the timezone dropdown //
// *********************************************************** //
/**
* Create dropdown for timezone selection
*
* What comes in: 
* @ddTemplate {template string}
* @aDropDown {json view}
* @return {string} Returns a string with formatted time and sends it to placeholder html
* Errors thrown e.g. @throws {RangeError} and why
*/
// bring in the json of the time zone file with AJAX
const zonesPromise = $.ajax({
  url: './zones.json',
  method: 'GET',
  dataType: 'json',
  cache: false,
});

// zonesPromise.then(
//   function(zones){
//     // console.log(zones);
//     // zones = JSON.parse(zones);
//     for (const z of zones){
//       console.log(z.city);
//     }
//   },
//   function(){ // the rejected callback
//     console.log(`🙁 The promise rejected`);
//     console.error(result);
//   }
// );
// make a promise for the zones (and anything else that comes up later)
const allTplAndDataPromise = Promise.all([zonesPromise]);
allTplAndDataPromise.then(
  function (xArray){ // xArray is the output from Promise.all
    zones = xArray[0];
    console.log(zones); // prints our array of objects from zones.json
    for (const z of zones){ console.log(`${z.cc}: ${z.city}`);}
  });
// $('#countrySelect').append(Mustache.render(ddTemplate, aDropDown));
// $('#timeZone').append(Mustache.render(ddTemplate, aDropDown))

// ********************************************************* //
// Click Handler checking for 12/24 hr and show/hide seconds //
// ********************************************************* //
/**
* Define Time format
*
* What comes in: 
* @showSeconds {boolean}
* @numHrs {string} 12 or 24
* @return {string} Returns a string that defines the time format
* Errors thrown e.g. @throws {RangeError} and why
*/

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

/**
* Create dropdown for timezone
*
* What comes in: 
* @TIMEZONE {string}
* @return {string} Returns a string to pass to the mustache to renderTime function to forTime2
* Errors thrown e.g. @throws {RangeError} and why
*/



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
* Click Handler for 12 vs 24 hr and show/hide seconds selection (checkbox custom-switch)
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
