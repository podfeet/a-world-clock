// 
// Define globally-scoped variables
// 

// Time formats
let h = 'h';
let m = 'mm';
let s = 'ss a';
let TIME12WSEC = 'h:mm:ss a';
let TIME12WOSEC = 'h:mm a';
let TIME24WSEC = 'HH:mm:ss';
let TIME24WOSEC = 'HH:mm';
let FORMATTEDTIME = TIME12WSEC; // Default formatted time
let TRUESECONDS = true; // boolean true if show seconds is true
let TRUE12HR = true; // boolean true if numHrs is 12

// Time Zone globally-scoped variables
let zones = [];
let dropDown = '';
let selectedZone = '';

// TimeShifter variables
let hrsShifted = '';
let minShifted = '';

// initialize the renderTime function as a global variable
let rendertTime;

// 
// Document Ready Handler
// 
$(function(){
  selectedZone = 'Pacific/Auckland';
  renderTime();
  setInterval(renderTime, 1000); // update clock every second
  makeDropDown();

  /**
  * A class to create clocks
  *
  * Dictionary to build the clock: 
  * @timeDescription - The text to explain what clock is showing
  * @#timeID - name for the id of the div that will hold the clock
  * @location - if specifying a particular location, a string of the format "region/city" per zones.js
  * @interval - boolean if true, setInterval() fires and keeps clock updated. Static clocks required for Time Shifting
  * @startTimeH - for static clocks, the hour on which to start display
  * @FORMATTEDTIME - string - global variable holding the format for displaying the time as chosen by show/hide seconds and 12/24 clock check boxes
  * 
  * Instance functions:
  * @aRenderTime - renders the html for the clocks with inputs of timeID,location and time format
  * @clockInterval - sets the interval for the clock
  * Errors thrown e.g. @throws {RangeError} and why
  * Errors thrown e.g. @throws {TypeError} and why
  */
  class AClock{
    // define the constructor
    constructor(details){
      //  Initialize the data attributes
      this.timeDescription = details.timeDescription;
      this.timeID = details.timeID;
      this.location = details.location;
      this.interval = details.interval;
    };
    //  Define the Instance functions
    aRenderTime(){
      $(`#${this.timeID}`).html(moment.tz(this.location).format(FORMATTEDTIME));
    };
    clockInterval(){
      if(this.interval){
        setInterval(this.aRenderTime.bind(this), this.interval);
      }else{return};
    };
  };

  // Create a function to make the clocks
  function makeClocks(){
    // create instances of AClock as desired
    localClock = new AClock ({
      timeDescription: 'Classy: Your Local Time is…',
      timeID: 'localTime',
      location: moment.tz.guess(true),
      interval: true
    });
    nzClock = new AClock({
      timeDescription: 'Classy: The Time in New Zealand is...', 
      timeID: 'nzTime', 
      location: 'Pacific/Auckland',
      interval: false,
      // startTimeH: 8
    });
    localTSClock = new AClock({ // timeshifted local clock
      timeDescription: 'If the time where you are is...', 
      timeID: 'localTSTime', 
      location: moment.tz.guess(true),
      interval: false,
      // startTimeH: 8
    })
    // Convert the placeholder template script to a string
    let clockCardTemplate = $('#clockCards').html();

    // render the html for the clocks
    $('#clocksPlaceholder').append(Mustache.render(clockCardTemplate, localClock));
    $('#clocksPlaceholder').append(Mustache.render(clockCardTemplate, nzClock));
    $('#clocksPlaceholder').append(Mustache.render(clockCardTemplate, localTSClock));

    // start the clocks and set their intervals
    // Local
    localClock.aRenderTime();
    localClock.clockInterval();
    // New Zealand
    nzClock.aRenderTime();
    nzClock.clockInterval();
    // local Static Clock
    localTSClock.aRenderTime();
    localTSClock.clockInterval();

  };
  // make the clocks:
  makeClocks();
 
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

  // Original method to render 2 clocks
  function renderTime(){
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
  // put it in this when you get it captured
  // $('#forTime').html(moment().subtract(1, 'h').format(FORMATTEDTIME)); // local time
  let addHours = '0';
  function shiftTime(){
    $('#changeHrs').on('input change', function(){
      console.log(`you changed the hours by ${this.value}`); // this worked 
      $('#nzTime').html(moment().add(this.value, 'h').format(FORMATTEDTIME)); // this works but it reverted on the next second
      // $('#nzTime').html(moment.tz('Pacific/Auckland').add(1, 'h').format(FORMATTEDTIME));
    })
  }
  shiftTime();

  // function to show value chose on range sliders
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
}); // end document ready
