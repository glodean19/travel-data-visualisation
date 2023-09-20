/*

https://www.youtube.com/watch?v=Ae73YY_GAU8


*/
function TravelCountries() {

  //create a new mappa instance from Leaflet website
  var mappa = new Mappa('Leaflet');

  //tile map object
  var options = {
    lat: 40,
    lng: -40,
    zoom: 3,
    style: "http://{s}.tile.osm.org/{z}/{x}/{y}.png",

  };

  //array with lat, lon and visits
  this.cData = [];

  // Name for the visualisation to appear in the menu bar.
  this.name = 'Travel Countries';

  // Each visualisation must have a unique ID with no special
  // characters.
  this.id = 'travel-countries';

  // Property to represent whether data has been loaded.
  this.loaded = false;

  this.pad = 20;

  //this.colors = color(random(0,255), random(0,255), random(0,255));
  var col = ['blue', 'OrangeRed', 'DarkTurquoise', 'DarkOrchid', 'Gold',
  'HotPink', 'MediumBlue', 'SandyBrown', 'Silver', 'ForestGreen'];


  // Title to display above the plot.
  this.title = 'Top 10 countries visited by UK residents, 2019';

  // Preload the data. This function is called automatically by the
  // gallery when a visualisation is added.
  this.preload = function() {
    var self = this;
    this.data = loadTable(
      './data/Travel/dataTravelCountries.csv', 'csv', 'header',
      // Callback function to set the value
      // this.loaded to true.
      function(table) {
        self.loaded = true;
        gallery.loadInitialVisual();
      });
    //preload countries latitute and longitude
    this.countries = loadJSON('./data/Travel/countries.json');

  };


  this.setup = function() {
    // Set the canvas for this visualisation to be the 'map' div, rather than the 'visual' div
    this.canvas = c.parent('map');

    //create a tile map in the canvas
    this.travelMap = mappa.tileMap(options);
    this.travelMap.overlay(this.canvas);

    //set min and max number of visits90
    var maxVis = 0;
    var minVis = Infinity;


    //look at the data rows one at time
    for(var row of this.data.rows)
    {
      //get the country's names in the dataset
      var country = row.get('Countries').toLowerCase();
      //return contries lat and long in the dataset
      var latlon = this.countries[country];

      //return only not blank lat and long
      if(latlon){
          var lat = latlon[0];
          var lon = latlon[1];

          //return visits count by countries
          var visCount = Number(row.get('Visits'));

          //set properties to the data with country's lat and lon and total visit
          this.cData.push({lat, lon, visCount, col});

          //find the smaller and the largest number of visits
          if(visCount > maxVis)
          {
            maxVis = visCount;
          }
          if(visCount < minVis)
          {
            minVis = visCount;
          }

      }
    }

    //calculate the country's diameter based on number of visits
    var minD = sqrt(minVis);
    var maxD = sqrt(maxVis);

    for(var country of this.cData)
    {
       country.diameter = map(sqrt(country.visCount), minD, maxD, 1, 4);
    }


  };

  this.destroy = function() {
    // Reset the canvas to the 'visual' div, for the other visualisations
    this.canvas = c.parent('visual');
    // Reset the canvas transformation, in case the user has moved the map
    // Don't know why it should affect all the other visualisations, but it does.
    // The Mappa API is limited, to say the least
    if (c.elt) {
      c.elt.style.transform = 'translate(0, 0)';
    }
    // Remove any nodes from the 'map' div
    var parent = document.getElementById('map');
    while (parent.firstChild) {
        parent.removeChild(parent.firstChild);
    }
  };

  this.draw = function() {
    //it clears the background
    clear();
    if (!this.loaded) {
      console.log('Data not yet loaded');
      return;
    }


    push();
    fill('DeepSkyBlue');
    rect(width/24, height*0.85, 90, 60);
    pop();

    //check this for loop
    for(var country of this.cData)
    {
      for(var c of col)
      {
    //find the pixel location based on lan and long
    var pix = this.travelMap.latLngToPixel(country.lat, country.lon);

    //resize the circles based on the zoom level
    var zoom = this.travelMap.zoom();

    //scale the circle based on the zoom
    var scl = pow(2, zoom);

    var scaledRadius = (country.diameter * scl)/2;

    //draw ellipses
    fill(c);
    noStroke();
    ellipse(pix.x, pix.y, country.diameter * scl);
    //console.log(country.col);
  }
    if(dist(mouseX, mouseY, pix.x, pix.y) < scaledRadius)
    {
      push();
      fill(0);
      textSize(24);
      strokeWeight(1);
      text(country.visCount, width/14, height*0.89);
      pop();

  }
 };

      // Draw the title above the plot.
      this.drawTitle();
}
    //draw title of the visualisaton
    this.drawTitle = function() {
      fill(0);
      noStroke();
      textAlign('center', 'center');
      textSize(24);

      text(this.title,
            width/2,
            this.pad);
      };
}