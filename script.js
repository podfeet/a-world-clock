// 
// Define globally-scoped variables
// 

// Time formats

// let TIME12WSEC = `'h${$seperator}mm${$seperator}ss a'` ;
let h = 'h';
let m = 'mm';
let s = 'ss a';
let TIME12WSEC = 'h:mm:ss a';
let TIME12WOSEC = 'h:mm a';
let TIME24WSEC = 'HH:mm:ss';
let TIME24WOSEC = 'HH:mm';
let FORMATTEDTIME = TIME12WSEC; // Default formatted time
let TRUESECONDS = ''; // boolean true if show seconds is true
let TRUE12HR = ''; // boolean true if numHrs is 12

// Time Zone globally-scoped variables
let zones = [];
let dropDown = '';
let selectedZone = '';

// TimeShifter variables
let hrsShifted = '';
let minShifted = '';

// 
// Document Ready Handler
// 
$(function(){
  selectedZone = 'Pacific/Auckland';
  renderTime();
  setInterval(renderTime, 1000); // update clock every second
  makeDropDown();
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
  $('#forTime').html(moment().format(FORMATTEDTIME)); // local time
  $('#forTime2').html(moment().tz(selectedZone).format(FORMATTEDTIME)); // time in selected zone
}

// *********************************************************** //
// populate the timezone dropdown //
// *********************************************************** //
/**
* Create dropdown for timezone selection
*
* What comes in: 
* @zones.json {json object}
* @#timeZone {ID of select for the dropdown}
* @return {string} Returns a string with formatted time and sends it to placeholder html ID
* Errors thrown e.g. @throws {RangeError} and why
*/

// source: https://www.codebyamir.com/blog/populate-a-select-dropdown-list-with-json
// shortcut for full AJAX call: https://api.jquery.com/jQuery.getJSON/
function makeDropDown(){
  dropDown = $('#timeZone'); // dropDown is the ID of the select element in the html
  dropDown.empty(); // empty whatever is in the dropdown to start with
  // create a disabled but selected default to tell people to use the dropdown
  dropDown.append('<option selected="true" disabled>(GMT +12:00) Auckland, Wellington, Fiji, Kamchatka</option>')
  dropDown.prop('selectedIndex', 0);
  // give the json file a name
  const jsonUrl = './zones.json';
  // feels like an AJAX call to get the data
  $.getJSON(jsonUrl, function(zones){
    for (const z of zones){
      dropDown.append($('<option></option>').attr('value', z.city).text(`${z.name}`));
    }
  });
}

// Event handler for when the dropdown is changed to choose a new zone
$('#timeZone').change(function(){ // triggers the function EVERY time you change the select
  ifTrue();
  selectedZone = $('#timeZone option:selected').val();
});

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

// Two click handlers to render the time after changing showSeconds and numHrs
$('#showSeconds').click(function(){
  ifTrue();
  renderTime();
});
$('#numHrs').click(function(){
  ifTrue();
  renderTime();
});

// Event Handler to change time via range sliders
// $('#forTime').html(moment().subtract(1, 'h').format(FORMATTEDTIME)); // local time
function shiftTime(){
  let addHours = $('changeHrs').value;
  alert(addHours);
}

// elaborate function to show range slider input value as sliding
// from https://codepen.io/yannicvanveen/pen/HtvbI
// maybe too cute - just want to show the number somewhere that sticks 
// $('input[type="range"]').on('input', function() {
//   var control = $(this),
//     controlMin = control.attr('min'),
//     controlMax = control.attr('max'),
//     controlVal = control.val(),
//     controlThumbWidth = control.data('thumbwidth');

//   var range = controlMax - controlMin;
  
//   var position = ((controlVal - controlMin) / range) * 100;
//   var positionOffset = Math.round(controlThumbWidth * position / 100) - (controlThumbWidth / 2);
//   var output = control.next('output');
  
//   output
//     .css('left', 'calc(' + position + '% - ' + positionOffset + 'px)')
//     .text(controlVal);
// });

// https://codepen.io/prasanthmj/pen/OxoamJ
$(function(){
  $('.slider').on('input change', function(){
    $(this).next($('.slider_label')).html(this.value);
    });
    $('.slider_label').each(function(){
      var value = $(this).prev().attr('value');
      $(this).html(value);
    });
  });

