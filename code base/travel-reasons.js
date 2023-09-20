/*
For dynamic slices
https://codepen.io/behreajj/pen/BRePoo
*/
function TravelReason() {

  // Name for the visualisation to appear in the menu bar.
  this.name = 'Travel Reasons';

  // Each visualisation must have a unique ID with no special
  // characters.
  this.id = 'travel-reasons';

  // Property to represent whether data has been loaded.
  this.loaded = false;

  this.canvas = c.parent('visual');
  
  // Preload the data. This function is called automatically by the
  // gallery when a visualisation is added.
  this.preload = function() {
    console.log('preload called');
    var self = this;
    this.data = loadTable(
      './data/Travel/data_piechart.csv', 'csv', 'header',
      // Callback function to set the value
      // this.loaded to true.
      function(table) {
        self.loaded = true;
        gallery.loadInitialVisual();
      });
      
  };

  this.setup = function() {
    if (!this.loaded) {
      console.log('Data not yet loaded');
      return;
    }
    
    push();
    // Create a select DOM element.
    this.select = createSelect();
    this.select.position(1400, 700); 
    pop();
    
 
    // Fill the options with all years.
    var years = this.data.columns;
    // First entry is empty.
    for (var i = 1; i < years.length; i++) {
      var col = color(169, 169, 169, 100);
      this.select.style('font-size', '26px');
      this.select.style('background-color', col);
      this.select.option(years[i]);
    }
    
    
  };

  this.destroy = function() {
    this.select.remove();
  };

  // Create a new pie chart object.
  this.pie = new PieChart(width/2, height/2 +30, width * 0.4);
 
 
  this.draw = function() {
    
    //clear();
    if (!this.loaded) {
      console.log('Data not yet loaded');
      return;
    }

    //canvas color
    c1 = color(50, 90, 130);
    c2 = color(210, 180, 140);
  
    for(var i = 0; i < width; i++){
      n = map(i,0,width,0,1);
      var newc = lerpColor(c1,c2,n);
      stroke(newc);
      line(0,i,width, i);
      }
 
    // Get the value of the year we're interested in from the
    // select item.
    var year = this.select.value();

    // Get the column of raw data for year.
    var col = this.data.getColumn(year);

    // Convert all data strings to numbers.
    col = stringsToNumbers(col);

    // Copy the row labels from the table (the first item of each row).
    var labels = this.data.getColumn(0);

    // Colour to use for each category.
    var colours = ['SteelBlue', 'Tomato', 'Teal', 'Tan'];

    // Make a title.
    fill(255);
    var title = 'UK residents’ visits abroad, by purpose, 1999 to 2019';

    // Draw the pie chart!
    this.pie.draw(col, labels, colours, title);

  

  };
}
