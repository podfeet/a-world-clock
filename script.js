/* eslint-disable no-unused-vars */
/* eslint-disable no-undef */
// 
// Define globally-scoped variables
// 

// Time formats
let h = 'h';
let m = 'mm';
let s = 'ss a';
let TIME12WSEC = 'dddd h:mm:ss a';
let TIME12WOSEC = 'dddd h:mm a';
let TIME24WSEC = 'dddd HH:mm:ss';
let TIME24WOSEC = 'dddd HH:mm';
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
    //
    // Create the ID into which the description for the clock instance will be placed
    //
    /**
    * 
    * @type {string}  
    */
    get timeDescriptionID(){
      return this._timeDescriptionID;
    }
    /**
    * @type {string}
    * @throws {TypeError}
    * // no range error because I have a default
    */
    set timeDescriptionID(tdid){
      if(is.not.string(tdid)){
        throw new TypeError('Time description ID must be a string');
      }
      this._timeDescriptionID = tdid;
    }
    //
    // Create the description of the clock instance
    //
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
    // Determine if clock will be timeshifted or static
    // If static it will update with interval
    /**
     * @type {Boolean}
     */
    get timeShifted(){
      return this._timeShifted;
    }
    /**
     * @type {boolean} defaults to true
     * @throws {TypeError} if not boolean
     */
    set timeShifted(ts){
      if(typeof ts === 'boolean'){
        this._timeShifted = ts;
      } else {
        if(typeof ts === 'undefined'){
          this._timeShifted = true;
        }else{
            throw new TypeError('timeShifted must be true or false')}
      }  
    }
    // Choose a time format
    /**
     * @type {string}
     */
    get timeFormat(){
      return this._timeFormat;
    }
    /**
     * @type {Global Variable}
     * @throws {TypeError} if not one of two variables
     */
    set timeFormat(tf){
      if(tf == TIME12WSEC || tf == TIME24WSEC){
        this._timeFormat = tf;
      } else {
        if(tf === 'undefined'){
          tf = FORMATTEDTIME;
        } else {
          throw new RangeError('timeFormat must be TIME12WSEC or TIME24WSEC')
        }
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
      if(!sbdid){
        return;
      } else {
        if(is.not.string(sbdid)){
          throw new TypeError('searchBoxDivID must be a string');
        } else {
        this._searchBoxDivID = sbdid;
        }
      } 
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
      if(!sbid){
        return;
      }
      if(is.not.string(sbid)){
       throw new TypeError('searchBoxID must be a string');
      }
      this._searchBoxID = sbid;
    } 
    /**
     * 
     * @typeof {string} location 
     */
    get location(){
      return this._location;
    }
    /**
     * 
     * @typeof {string} location
     * @throws {typeError}
     * @throws {rangeError} if not from the TzNamesArray values 
     */
    set location(loc){
      if(is.not.string(loc)){
        throw new TypeError('Location must be a string')
      } else {
        if(!TzNamesArray.includes(loc)){
          throw new RangeError('Location must be a city listed in moment.tz.names() from moment.js')
        } else {
        this._location = loc;
        }
      }
    }

    //
    // define the constructor
    //
    constructor(details){
      // Choose whether clock goes in shifting or static div
      this.clockPlaceholder = details.clockPlaceholder;

      // Text to be shown before time in clock
      this.timeDescriptionID = details.timeDescriptionID;
      this.timeDescription = details.timeDescription; // could throw error

      // Unique IDs to hold the time (must have values)
      this.timeID = details.timeID; // could throw error

      // Setting default location of clock if not defined
      this.location = details.location;

      // determine if the clock will move with the timeshifter
      this.timeShifted = details.timeShifted;

      // time format variable to allow change with scroller
      this.timeFormat = details.timeFormat;
      
      // Unique Div to hold the text box for search
      this.searchBoxDivID = details.searchBoxDivID;

      // Unique ID to hold the text box for search
      this.searchBoxID = details.searchBoxID;
    }
    //  Define the Instance functions
    aRenderTime(){
      $(`#${this.timeID}`).html(moment.tz(this.location).format(FORMATTEDTIME)); 
      // can't put description here. trust me. no really, not here.   
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
    // shiftTime(){
    //   // if this.timeShifted is true, then shift time with sliders
    //   let self = this;
    //   if (this.timeShifted){
    //     // shift hours
    //     $('#changeHrs').on('input change', function(){
    //       let queryStringReceived = window.location.search;
    //       let currentTime = '';
    //       if (!queryStringReceived){
    //         // currentTime is the time in that location when the user loads the page
    //         currentTime = moment.tz(self.location); 
    //       } else {
    //         currentTime = $('#timeID').html(`${myUrlParam.get('time1')}`)
    //       }
          
    //       let roundUpTime = currentTime.startOf('h');
    //       $(`#${self.timeID}`).html(roundUpTime.add(this.value, 'h').format(FORMATTEDTIME));
    //       // console.log(`#${self.timeID}`);
    //     })
    //     // shift min
    //     $('#changeMin').on('input change', function(){
    //       $(`#${self.timeID}`).html(roundUpTime.add(this.value, 'm').format(self.timeFormat));
    //     })
    //   }else{return}
    // }

    shiftTime(){
      // if this.timeShifted is true, then shift time with sliders
      let self = this;
      if (this.timeShifted){
        // shift hours
        $('#changeHrs').on('input change', function(){
          // reset times using code from aRenderTime?
          // $(`#${self.timeID}`).html(moment.tz(self.location).format(FORMATTEDTIME));
          // 
          let currentTime = moment.tz(self.location);
          let roundUpTime = currentTime.startOf('h');
          $(`#${self.timeID}`).html(roundUpTime.add(this.value, 'h').format(FORMATTEDTIME));
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
        if(this.searchBoxID){
          const $thisSearchBox = $('<input type="text">').addClass("mySearchboxes form-control small").attr('id', `${this.searchBoxID}`).attr('placeholder', `Search (default ${this.location})`);
          // define a variable for the div which will hold the <input> text box
          let aSearchBoxDivID = $(`#${this.searchBoxDivID}`);
          aSearchBoxDivID.append($thisSearchBox);
        }else{throw new Error('You must provide a searchBoxID for the search box')}
      }else{
        throw new Error('You must provide a searchBoxDivID to hold the search box')
      }
    }

  } // complete AClock Class definition
  
  // Create a function to make the clocks
  // Accept parameters a,b,c,d as the query string values to populate searchClock1 and 2 for location and timeDescription
  // a and c are the location names in the search boxes
  // b and d are the timeDescriptions, e.g. "Time in Europe/London becomes"
  function makeClocks(a,b,c,d){ 
    // create instances of AClock as desired
    localTSClock = new AClock({ // timeshifted local clock
      clockPlaceholder: shiftingClocksPlaceholder, 
      // this works!
      timeDescriptionID: 'localTSID',
      timeDescription: `Time in ${moment.tz.guess(true)} becomes:`,
      timeID: 'localTSTime', 
      timeFormat: TIME12WSEC,
      location: moment.tz.guess(true),
      timeShifted: true,
    })
    searchClock1 = new AClock({
      clockPlaceholder: shiftingClocksPlaceholder,
      timeDescriptionID: 'search1TSID',
      //timeDescription: 'Time in America/Los_Angeles becomes:',
      timeDescription: b,
      timeID: 'search1Time',
      timeFormat: TIME12WSEC,
      timeShifted: true,
      // location: "America/Los_Angeles",
      location: a,
      searchBoxDivID: 'sbsearchClock1Div',
      searchBoxID: 'sbsearchClock1'
    });
    searchClock2 = new AClock({
      clockPlaceholder: shiftingClocksPlaceholder,
      timeDescriptionID: 'search2TSID',
      //timeDescription: 'Time in Europe/Dublin becomes:',
      timeDescription: d,
      timeID: 'search2Time',
      timeFormat: TIME12WSEC,
      timeShifted: true,
      // location: "Europe/Dublin",
      location: c,
      searchBoxDivID: 'sbsearchClock2Div',
      searchBoxID: 'sbsearchClock2'
    });
    localClock = new AClock ({
      clockPlaceholder: staticClocksPlaceholder,
      timeDescriptionID: 'localID',
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
    // Searchboxes clock timeshifted
    searchClock1.putClockUp();
    searchClock1.clockInterval();
    searchClock1.shiftTime();
    searchClock1.addSearchBox();

    searchClock2.putClockUp();
    searchClock2.clockInterval();
    searchClock2.shiftTime();
    searchClock2.addSearchBox();
    
    // Local Clock static (non-shifting)
    localClock.putClockUp(staticClocksPlaceholder);
    localClock.clockInterval()
    // localClock.shiftTime();
  }

  // pull the query string that may have been received in the URL
  const queryStringReceived = window.location.search;

  // Determine if URL has a query string and pass values to search clocks or send defaults if not
  function checkQuery(){
    // if URL has no query string use these defaults
    if (queryStringReceived==""){
      // default city and location description for searchClock1
      sC1 = "America/Los_Angeles";
      sTD1 = 'Time in America/Los_Angeles becomes:';
      // default city and location description for searchClock1
      sC2 = "Europe/Dublin";
      sTD2 = 'Time in Europe/Dublin becomes:';
    } else {
      myUrlParam = new URLSearchParams(queryStringReceived);
      // If URL does have a query string, pull the time descriptions for search clocks
      // These exist even if the user hasn't entered a search city
      sTD1 = myUrlParam.get('searchTimeDesc1')
      sTD2 = myUrlParam.get('searchTimeDesc2')

      // Check to see if a search city has been entered for the ssearch clocks
      // If not set it to the defaults
      // If they have, pull it from the query string
      if (myUrlParam.get('searchCity1') == ""){
        sC1 = "America/Los_Angeles";
      } else {
        sC1 = myUrlParam.get('searchCity1'); 
      }

      if (myUrlParam.get('searchCity2') == ""){
        sC2 = "Europe/Dublin";
      } else {
        sC2 = myUrlParam.get('searchCity2'); 
      }
    }
  }
   
  checkQuery();

  // make the individual clocks:
  // pass parameters for cities and locations to searchClock 1 and 2  that were parsed from the URL query string
  makeClocks(sC1,sTD1,sC2,sTD2);  // check to see if those are the right names

  // Set time on searchClock1 to the entered location
  function onSelectItem1(item){
    searchClock1.location = `${item.value}`;
    console.log(`selected value is ${item.value}`);
    searchClock1.timeDescription = `Time in ${item.label} becomes:`;
    $(`#${searchClock1.timeDescriptionID}`).html(searchClock1.timeDescription);
    searchClock1.aRenderTime();
    // reset local and other search clock back to current time (since searchClock2 starts at current time)
    localTSClock.aRenderTime();
    searchClock2.aRenderTime();
    // reset range slider and label back to 0
    $("input[type=range]").val(0);
    showSliderLabel();
  }
  // Set time on searchClock2 to the entered location
  function onSelectItem2(item){
    searchClock2.location = `${item.value}`;
    searchClock2.timeDescription = `Time in ${item.label} becomes:`;
    $(`#${searchClock2.timeDescriptionID}`).html(searchClock2.timeDescription);
    searchClock2.aRenderTime();
    // reset local and other search clock back to current time (since searchClock2 starts at current time)
    localTSClock.aRenderTime();
    searchClock1.aRenderTime();
    // reset range slider and label back to 0
    $("input[type=range]").val(0);
    showSliderLabel();
  }

  // this works to change the time from 12/24 can't get inside class
  $('#numHrs').click(function(){
    ifTrue();
    $("input[type=range]").val(0);
    showSliderLabel();
    localTSClock.aRenderTime();
    searchClock1.aRenderTime();
    searchClock2.aRenderTime();
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

  $('#sbsearchClock1').autocomplete({
      source: tzNamesObject, // dictionary object with the values from which to search
      onSelectItem: onSelectItem1, // callback to run when item is selected
      highlightClass: 'text-danger', // color to highlight the searched-for text in the found fields
      treshold: 1 // minimum characters to search before it starts displaying
  });
  $('#sbsearchClock2').autocomplete({
      source: tzNamesObject, // dictionary object with the values from which to search
      onSelectItem: onSelectItem2, // callback to run when item is selected
      highlightClass: 'text-danger', // color to highlight the searched-for text in the found fields
      treshold: 1 // minimum characters to search before it starts displaying
  });


// ********************************************************* //
// Click Handler checking for 12/24 hr //
// ********************************************************* //
/**
* Define Time format
*
* What comes in:
* @numHrs {string} 12 or 24
* @return {string} Returns a string that defines the time format
*/

  function ifTrue(){
    TRUE12HR = ($("input[id][name$='numHrs']").prop( "checked" ))
    if (TRUE12HR){
      FORMATTEDTIME = TIME12WSEC;
    } else {
      FORMATTEDTIME = TIME24WSEC;
      }
    }

// creating sendable times
const queryStringSend = window.location.search;
  
function setTimesFromURL(){
  if (queryStringSend){
    queryStringSend;
    myUrlParam = new URLSearchParams(queryStringSend);
    // set times
    $('#localTSTime').html(`${myUrlParam.get('loctime')}`)
    $('#search1Time').html(`${myUrlParam.get('searchtime1')}`)
    $('#search2Time').html(`${myUrlParam.get('searchtime2')}`)
    // set location names (timeDescription)
    $('#localTSID').html(`${myUrlParam.get('localTimeDesc')}`)
    $('#search1TSID').html(`${myUrlParam.get('searchTimeDesc1')}`)
    $('#search2TSID').html(`${myUrlParam.get('searchTimeDesc2')}`)
    // if no search city is entered, this will be blank 
    $('#sbsearchClock1').val(`${myUrlParam.get('searchCity1')}`)
    $('#sbsearchClock2').val(`${myUrlParam.get('searchCity2')}`)
  }
}
setTimesFromURL();
  
  // Event handler for the copy button to create the URL
  $('#copyBtn').click(function(){
    // need to remove spaces in values & replace with +
    const space = /\s/g;

    // find local and search times and remove spaces
    let localT = $('#localTSTime').html();
    let searchT1 = $('#search1Time').html();
    let searchT2 = $('#search2Time').html();

    let lT = localT.replace(space, '+')
    let sT1 = searchT1.replace(space, '+')
    let sT2 = searchT2.replace(space, '+')

    // find time descriptions (locations) & remove spaces
    let localTimeDesc = $('#localTSID').html();
    let searchTimeDesc1 = $('#search1TSID').html();
    let searchTimeDesc2 = $('#search2TSID').html();
    let searchCity1 = $('#sbsearchClock1').val();
    let searchCity2 = $('#sbsearchClock2').val();

    let lTD = localTimeDesc.replace(space, '+');
    let sTD1 = searchTimeDesc1.replace(space, '+');
    let sTD2 = searchTimeDesc2.replace(space, '+');
    let sC1 = searchCity1.replace(space, '+')
    let sC2 = searchCity2.replace(space, '+')
    // split the url to remove any existing search queries
    let thisURL = $(location).attr('href').split("?")[0];
    // create the url
    sendableURL = `${thisURL}?loctime=${lT}&searchtime1=${sT1}&searchtime2=${sT2}&localTimeDesc=${lTD}&searchTimeDesc1=${sTD1}&searchTimeDesc2=${sTD2}&searchCity1=${sC1}&searchCity2=${sC2}`

    alert(`Copy this URL and send it to someone:\n\n${sendableURL}`);
  })
  // $('#copyBtn').click(function(){
  //   // find local and search times
  //   let lT = $('#localTSTime').html();
  //   let sT1 = $('#search1Time').html();
  //   let sT2 = $('#search2Time').html();

  //   // find time descriptions (locations)
  //   let lTD = $('#localTSID').html();
  //   let sTD1 = $('#search1TSID').html();
  //   let sTD2 = $('#search2TSID').html();
  //   let sC1 = $('#sbsearchClock1').val();
  //   let sC2 = $('#sbsearchClock2').val();

  //   // put search parameters into a dictionary
  //   let myURLSearchParams = {
  //     loctime: lT,
  //     searchtime1: sT1,
  //     searchtime2: sT2,
  //     localTimeDesc: lTD,
  //     searchTimeDesc1: sTD1,
  //     searchTimeDesc2: sTD2,
  //     searchCity1: sC1,
  //     searchCity2: sC2
  //   }
   

  //   // create the url
  //   // let sendableURL = new URL(thisURL);
  //   for(let [name, value] in myURLSearchParams){
  //      // split the url to remove any existing search queries
  //     let thisURL = $(location).attr('href').split("?")[0];
  //     let newQueryString = new URLSearchParams(thisURL);
  //     newQueryString.append(name, value)
  //     console.log(newQueryString);  // returns http://localhost:8888/a-world-clock/
      
  //     sendableURL =`${thisURL}?${newQueryString}`;
  //   }

  //   alert(`Copy this URL and send it to someone:\n\n${sendableURL}`);

  // });




}); // end document ready