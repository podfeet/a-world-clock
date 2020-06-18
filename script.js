/* eslint-disable no-unused-vars */
/* eslint-disable no-undef */
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
// 
let TRUESECONDS = true; // boolean true if show seconds is true
let TRUE12HR = true; // boolean true if numHrs is 12

// TimeShifter variables
let hrsShifted = '';
let minShifted = '';

// Create an array from the official list of timezone names
let TzNamesArray = moment.tz.names();
// don't understand this but it takes the array which is just a list of the region/city and makes it into an object where the key is the region/city and so is the value. which for some reason works in autocomplete!
let tzNamesObject = TzNamesArray.reduce(function(o, val) { o[val.replace('_',' ')] = val; return o; }, {});

// Create variable for the string value of the time-shifted versions of local and chosen distant clock
let TSlocal = '';
let TSdistant = '';

// 
// Document Ready Handler
// 
$(function(){

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
    //
    // the ID into which the clock will be placed
    //
    /**
    * @type {string}
    */
     get timeID(){
      return this._timeID;
    }
    /**
    * @type {string}
    * @throws {TypeError}
    * @throws {RangeError}
    */
    set timeID(tid){
      if(is.not.string(tid)){
        throw new TypeError('timeID must be a string');
      }
      if(is.empty(tid)){
        throw new RangeError('You must enter a timeID')
      }
      this._timeID = tid;
    }

    //
    // Create the description of the clock instance
    //
    
    // Clock will go into either the existing shifting or static placeholder div
    /**
     * @type {object} div where the clock will be placed, default is shiftingClocksPlaceholderye
     */
    get clockPlaceholder(){
      return this._clockPlaceholder;
    }
    /**
     * @type {object} div where the clock will be placed
     * @throws {RangeError} if not one of two values
     */
    set clockPlaceholder(cph){
      if((cph == shiftingClocksPlaceholder) || (cph == staticClocksPlaceholder)){
          this._clockPlaceholder = cph;
        }else{
        throw new RangeError(`clockPlaceholder must be either shiftingClocksPlaceholder or staticClocksPlaceholder`)
        }
      this._clockPlaceholder = cph;
    }
    /**
    * 
    * @type {string}  
    */
    get timeDescription(){
      return this._timeDescription;
    }
    /**
    * @type {string}
    * @throws {TypeError}
    * // no range error because I have a default
    */
    set timeDescription(td){
      if(is.not.string(td)){
        throw new TypeError('Time description must be a string');
      }
      this._timeDescription = td;
    }
    // Determine if clock will be timeshifted or static
    // If static it will update with interval
    /**
     * @type {Boolean}
     */
    get timeShifted(){
      return this._timeShifted;
    }
    /**
     * @type {Boolean} defaults to true
     * @throws {TypeError} if not Boolean
     */
    set timeShifted(ts){
      if(typeof ts === Boolean){
        this._timeShifted = ts;
      }else{
        throw new TypeError('timeShifted must be true or false')
      }
    }
    // ID for the Div to hold the search box
    /**
     * @typeof {string} Unique name of div for search box 
     */
    get searchBoxDivID(){
      return this._searchBoxDivID;
    }
    /**
    * @type {string}
    * @throws {TypeError}
    * @throws {RangeError}
    */
    set searchBoxDivID(sbdid){
        if(sbdid === null){
          return;
        }
        if(is.not.string(sbdid)){
        throw new TypeError('searchBoxDivID must be a string');
      }
      this._searchBoxDivID = sbdid;
    } 
    // ID for the search box itself
     /**
     * @typeof {string} Unique name of div for search box 
     */
    get searchBoxID(){
      return this._searchBoxID;
    }
    /**
    * @type {string}
    * @throws {TypeError}
    */
    set searchBoxID(sbid){
      if(sbid === null){
        return;
      }
      if(is.not.string(sbid)){
       throw new TypeError('searchBoxID must be a string');
      }
      this._searchBoxID = sbid;
    } 

    //
    // define the constructor
    //
    constructor(details){
      // completed getter/setter data attributes

      // placeholder div into which this clock should go
      if(typeof details.clockPlaceholder ==='undefined'){
        this.clockPlaceholder = shiftingClocksPlaceholder;
      } else {
        this.clockPlaceholder = details.clockPlaceholder;
      }

      // Text to be shown before time in clock
      if(typeof details.timeDescription === 'undefined'){ // if no description provided
        this.timeDescription = "Generic Clock";
        console.log(`The time description should be ${this._timeDescription}`);
        }else{
        this.timeDescription = details.timeDescription; // could throw error
      }

      // Unique IDs to hold the time (must have values)
      this.timeID = details.timeID; // could throw error

      // determine if the clock will move with the timeshifter
      // set default to true
      if(typeof details.timeShifted ==='undefined'){
        this._timeShifted = true;
        } else {
          this._timeShifted = details.timeShifted;
      }
      
      // Unique Div to hold the text box for search
      // if a search box exists it must have a div ID to hold it
      if(typeof details.searchBoxDivID ==='undefined'){
        // if there should not be a search box, there's no div id for it
        this.searchBoxDivID = null;
        }else{
        this.searchBoxDivID = details.searchBoxDivID;
      }

      // Unique ID to hold the text box for search
      if(typeof details.searchBoxID ==='undefined'){
        this.searchBoxID = null;
        }else{
        this.searchBoxID = details.searchBoxID;
      }


      //  Initialize the data attributes
      
      this.location = details.location;
      
      if (details.timeFormat !== undefined){
        this.timeFormat = details.timeFormat;
        } else{
          this.timeFormat = FORMATTEDTIME;
        }
    }
    //  Define the Instance functions
    aRenderTime(){
      $(`#${this.timeID}`).html(moment.tz(this.location).format(FORMATTEDTIME));
    }
    // Render the html for the clocks
    putClockUp(){
      // Convert the placeholder template script to a string
      let clockCardTemplate = $('#clockCards').html();
      // render the html for the clocks
      $(this.clockPlaceholder).append(Mustache.render(clockCardTemplate, this));
      this.aRenderTime();
      }
    clockInterval(){ // only static clocks show changing seconds
      if(!this.timeShifted){
        setInterval(this.aRenderTime.bind(this), 1000);
      }else{return}
    }
    // Event Handler to change time via range sliders
    // shiftTime Hours
    shiftTime(){
      // if this.timeShifted is true, then shift time with sliders
      let self = this;
      if (this.timeShifted){
        // shift hours
        $('#changeHrs').on('input change', function(){
          let currentTime = moment.tz(self.location);
          let roundUpTime = currentTime.startOf('h');
          $(`#${self.timeID}`).html(roundUpTime.add(this.value, 'h').format(self.timeFormat));
        })
        // shift min
        $('#changeMin').on('input change', function(){
          $(`#${self.timeID}`).html(roundUpTime.add(this.value, 'm').format(self.timeFormat));
        })
      }else{return}
    }

    // Add text search box for cities instead of dropdown
    addSearchBox(){
      if (this.searchBoxDivID){
        const $thisSearchBox = $('<input type="text">').addClass("mySearchboxes form-control small").attr('id', `${this.searchBoxID}`).attr('placeholder', 'Search City (default Europe/Dublin)');
        // define a variable for the div which will hold the <input> text box
        let aSearchBoxDivID = $(`#${this.searchBoxDivID}`);
        aSearchBoxDivID.append($thisSearchBox);
      }else{
        throw new Error('You must provide a searchBoxDivID to hold the search box')
      }
    }

  } // complete AClock Class definition
  
  // Create a function to make the clocks
  function makeClocks(){
    // create instances of AClock as desired
    localTSClock = new AClock({ // timeshifted local clock
      clockPlaceholder: shiftingClocksPlaceholder,
      timeDescription: 'If your local time becomes:', 
      timeID: 'localTSTime', 
      location: moment.tz.guess(true),
      timeShifted: true,
      searchBox: false
    })
    searchClock = new AClock({
      clockPlaceholder: shiftingClocksPlaceholder,
      timeDescription: 'Time in this location WILL be:', 
      timeID: 'searchTime', 
      location: 'Europe/Dublin',
      timeShifted: true,
      searchBoxDivID: 'sbSearchClockDiv',
      searchBoxID: 'sbSearchClock'
    });
    localClock = new AClock ({
      clockPlaceholder: staticClocksPlaceholder,
      timeDescription: 'Your current local time is:',
      timeID: 'localTime',
      timeFormat: TIME12WSEC,
      location: moment.tz.guess(true),
      timeShifted: false,
    });
    // Put the clocks up, enable/disable interval, and enable timeshifting
    // local timeshifted 
    localTSClock.putClockUp();
    localTSClock.clockInterval();
    localTSClock.shiftTime();
    // Searchbox clock timeshifted
    searchClock.putClockUp();
    searchClock.clockInterval();
    searchClock.shiftTime();
    searchClock.addSearchBox();
    
    // Local Clock static (non-shifting)
    localClock.putClockUp(staticClocksPlaceholder);
    localClock.clockInterval()
    // localClock.shiftTime();
  }

  // make the individual clocks:
  makeClocks();

  function onSelectItem(item){
    // Set time on searchClock to the entered location
    searchClock.location = `${item.value}`;
    searchClock.aRenderTime();
    // reset local clock back to current time (since searchClock starts at current time)
    localTSClock.aRenderTime();
    // reset range slider and label back to 0
    $("input[type=range]").val(0);
    showSliderLabel();
  }
  // this works to change the time from 12/24 can't get inside class
  $('#numHrs').click(function(){
    ifTrue();
    localTSClock.aRenderTime();
    searchClock.aRenderTime();
    localClock.aRenderTime();
  });

  // function to show value chosen on range sliders
  // https://codepen.io/prasanthmj/pen/OxoamJ
  function showSliderLabel(){
    $(function(){
      $('.slider').on('input change', function(){
        $(this).next($('.slider_label')).html(this.value);
        });
        $('.slider_label').each(function(){
          var value = $(this).prev().attr('value');
          $(this).html(value);
        });
      });
  }
  showSliderLabel();

  // Adds Bootstrap autocomplete function to the ID #myAutocomplete
  // Doesn't seem to work if I make it a class though
  $('.mySearchboxes').autocomplete({
      source: tzNamesObject, // dictionary object with the values from which to search
      onSelectItem: onSelectItem, // callback to run when item is selected
      highlightClass: 'text-danger', // color to highlight the searched-for text in the found fields
      treshold: 1 // minimum characters to search before it starts displaying
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
  TRUE12HR = ($("input[id][name$='numHrs']").prop( "checked" ))
  if (TRUE12HR){
    FORMATTEDTIME = TIME12WSEC;
  } else {
    FORMATTEDTIME = TIME24WSEC;
    }
  }



}); // end document ready


  //
  // Create sendable times
  // Has to be outside the document ready because we want times after slider has moved

  // these return the local and selected times
  //$('#localTSTime').html(); returns "8:00:00 am"
  // $('#searchTime').html(); returns "4:00:00 pm"
  // $('#searchTime').replaceWith('9:00:00 am'); changed searchTime to 9am - also borked formatting

  // TSlocal = $('#localTSTime').html();
 

  // can change a browser to a new location with
  // $(location).attr('href', 'https://podfeet.com')

  // how do I attach the change to the time to the url...


// function getTSTimes(){
//   TSlocal = $('#localTSTime').html();
//   TSdistant = $('#searchTime').html();
  // console.log(TSlocal);
  // console.log(`The time shifted local time is ${TSlocal} and time-shifted distance time is ${TSdistant}`);
// }
// getTSTimes();
