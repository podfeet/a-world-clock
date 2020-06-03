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
// let TRUESECONDS = true; // boolean true if show seconds is true
// let TRUE12HR = true; // boolean true if numHrs is 12

// Time Zone globally-scoped variables
let zones = [];

// Create an array from the official list of timezone names
let TzNamesArray = moment.tz.names();
// don't understand this but it takes the array which is just a list of the region/city and makes it into an object where the key is the region/city and so is the value. which for some reason works in autocomplete!
let tzNamesObject = TzNamesArray.reduce(function(o, val) { o[val] = val; return o; }, {});

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
    // define the constructor
    constructor(details){
      //  Initialize the data attributes
      this.clockPlaceholder = details.clockPlaceholder;
      this.timeDescription = details.timeDescription;
      this.timeID = details.timeID;
      this.location = details.location;
      this.interval = details.interval;
      this.timeShifted = details.timeShifted;
      this.timeFormat = details.timeFormat;
      this.requireDropDown = details.requireDropDown;       // do I ever use this? How do I tell if to make dropdown?
      this.dropDownDivID = details.dropDownDivID;
      this.dropDownID = details.dropDownID;
      this.searchBoxDivID = details.searchBoxDivID;
      this.searchBoxID = details.searchBoxID;
    };
    //  Define the Instance functions
    aRenderTime(){
      $(`#${this.timeID}`).html(moment.tz(this.location).format(this.timeFormat));
    };
    // Render the html for the clocks
    putClockUp(){
      // Convert the placeholder template script to a string
      let clockCardTemplate = $('#clockCards').html();
      // render the html for the clocks
      $(this.clockPlaceholder).append(Mustache.render(clockCardTemplate, this));
      this.aRenderTime();
      };
    clockInterval(){
      if(this.interval){
        setInterval(this.aRenderTime.bind(this), 1000);
      }else{return};
    };
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
    }else{return};
    };

    // Add dropdown if required
    addDropDown(){
      const $thisSelect = $('<select>').addClass("mr-2 ml-2 col-5 col-md-11 text-primary").attr('id', `${this.dropDownID}`).attr('name', 'locality');
      let aDropDownDivID = $(`#${this.dropDownDivID}`);
      // append a select (dropdown) to the placeholder div ID we created
      aDropDownDivID.append($thisSelect);
      // add a defualt selection in dropdown
      $thisSelect.append('<option selected="true" disabled>(GMT +12:00) Auckland, Wellington, Fiji, Kamchatka</option>');
      $thisSelect.prop('selectedIndex', 0);
      // give the json file a name
      const jsonUrl = './zones.json';
      // feels like an AJAX call to get the data
      $.getJSON(jsonUrl, function(zones){
        for (const z of zones){
          $thisSelect.append($('<option></option>').attr('value', z.city).text(`${z.name}`));
        }
      });
    };
    // Add text search box for cities instead of dropdown
    addSearchBox(){
      const $thisSearchBox = $('<input type="text">').addClass("mySearchboxes form-control").attr('id', `${this.searchBoxID}`);
      let aSearchBoxDivID = $(`#${this.searchBoxDivID}`);
      aSearchBoxDivID.append($thisSearchBox);

    }
    
    onSelectItem(item){
      alert('you selected something');
      this.location = item.label
    };
  }; // complete AClock class definition
  
  // Create a function to make the clocks
  function makeClocks(){
    // create instances of AClock as desired
    localTSClock = new AClock({ // timeshifted local clock
      clockPlaceholder: shiftingClocksPlaceholder,
      timeDescription: 'If your local time is:', 
      timeID: 'localTSTime', 
      location: moment.tz.guess(true),
      interval: false,
      timeShifted: true,
      timeFormat: TIME24WOSEC,
      requireDropDown: false,
      searchBox: false
    })
    chooseClock = new AClock({
      clockPlaceholder: shiftingClocksPlaceholder,
      timeDescription: 'Then the time chosen will be:', 
      timeID: 'chooseTime', 
      location: 'Pacific/Auckland',
      interval: false,
      timeShifted: true,
      timeFormat: TIME24WOSEC,
      requireDropDown: true,
      dropDownDivID: 'chooseZoneDiv',
      dropDownID: 'chooseZone',
      searchBoxDivID: 'sbChooseClockDiv',
      searchBoxID: 'sbChooseClock'
    });
    // localClock = new AClock ({
    //   clockPlaceholder: staticClocksPlaceholder,
    //   timeDescription: 'Your current local time is:',
    //   timeID: 'localTime',
    //   location: moment.tz.guess(true),
    //   interval: true,
    //   timeShifted: false,
    //   timeFormat: FORMATTEDTIME,
    //   requireDropDown: false
    // });
    // Put the clocks up, enable/disable interval, and enable timeshifting
    // local timeshifted 
    localTSClock.putClockUp();
    localTSClock.clockInterval();
    localTSClock.shiftTime()
    // Chooseable timeshifted
    chooseClock.putClockUp();
    chooseClock.clockInterval();
    chooseClock.shiftTime();
    chooseClock.addDropDown();
    chooseClock.addSearchBox();
    // Local Clock static
    // localClock.putClockUp(staticClocksPlaceholder);
    // localClock.clockInterval()
    // localClock.shiftTime();
  };
  // make the individual clocks:
  makeClocks();

  $('#chooseZone').change(function(){ // triggers the function EVERY time you change the select
    chooseClock.location = $('#chooseZone option:selected').val();
    chooseClock.aRenderTime();
  });

  // function to show value chosen on range sliders
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

  // Bootstrap Autocomplete in html input - not in a class
  // event handler when text box element is chosen
  function onSelectItem(item, element) {
    $('#output').html(
        'Element <b>' + $(element).attr('id') + '</b> was selected<br/>' +
        '<b>Value:</b> ' + item.value + ' - <b>Label:</b> ' + item.label
    );
  }
  // Adds Bootstrap autocomplete function to the ID #myAutocomplete
  // Doesn't seem to work if I make it a class though
  $('.mySearchboxes').autocomplete({
      source: tzNamesObject, // dictionary object with the values from which to search
      onSelectItem: onSelectItem, // callback to run when item is selected
      highlightClass: 'text-danger', // color to highlight the searched-for text in the found fields
      treshold: 1 // minimum characters to search before it starts displaying
  });

}); // end document ready
