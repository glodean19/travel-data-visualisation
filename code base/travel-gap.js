/*
For stacked area

*/
function TravelGap() {

  // Name for the visualisation to appear in the menu bar.
  this.name = 'Travel Gap: 1999-2019';

  // Each visualisation must have a unique ID with no special
  // characters.
  this.id = 'travel-gap-timeseries';

  // Title to display above the plot.
  this.title = 'UK residents travelling abroad and overseas visiting UK';

    // Names for each axis.
  this.xAxisLabel = 'Years';
  this.yAxisLabel = 'Thousands';

  this.colors = [];

  var marginSize = 45;

  // Layout object to store all common plot layout parameters and
  // methods.
  this.layout = {
    marginSize: marginSize,

    // Locations of margin positions. Left and bottom have double margin
    // size due to axis and tick labels.
    leftMargin: marginSize*2.5,
    rightMargin: width - marginSize,
    topMargin: marginSize*1.5,
    bottomMargin: height - marginSize * 2,
    pad: 7,

    plotWidth: function() {
      return this.rightMargin - this.leftMargin;
    },

    plotHeight: function() {
      return this.bottomMargin - this.topMargin;
    },

    // Boolean to enable/disable background grid.
    grid: false,

    // Number of axis tick labels to draw so that they are not drawn on
    // top of one another.
    numXTickLabels: 21,
    numYTickLabels: 8,

  };

  // Property to represent whether data has been loaded.
  this.loaded = false;

  // Preload the data. This function is called automatically by the
  // gallery when a visualisation is added.
  this.preload = function() {
    var self = this;
    this.data = loadTable(
      './data/Travel/dataTravel Gap1999-2019.csv', 'csv', 'header',
      // Callback function to set the value
      // this.loaded to true.
      function(table) {
        self.loaded = true;
        gallery.loadInitialVisual();
      });

  };

  this.setup = function() {
    // Font defaults.
    textSize(12);

    // Set min and max years.
    this.startYear = Number(this.data.columns[1]);
    this.endYear = Number(this.data.columns[this.data.columns.length-1]);

    for(var i = 0; i < this.data.getRowCount(); i++)
    {
      this.colors.push(color(random(0,255), random(0,255), random(0,255)));

    }

    // Find min and max thousands for mapping to canvas height.

    var rows = this.data.getRows();

    this.minThousands = this.data.getNum(0,1);
    this.maxThousands = this.data.getNum(0,1);

    for(var i = 0; i < rows.length; i++)
    {
      for(var j = 1; j < this.data.getColumnCount(); j++)
      {
        var r = this.data.getNum(i, j);
      
      if (this.maxThousands < r)
      {
        this.maxThousands = r;
      } 
      if (this.minThousands > r )
      {
      this.minThousands = r;
      }
     
    }
      
  }

};

  this.destroy = function() {
  };

  this.draw = function() {
    clear();
    if (!this.loaded) {
      console.log('Data not yet loaded');
      return;
    }
 
    // Draw the title above the plot.
    this.drawTitle();

    // Draw all y-axis labels.
    drawYAxisTickLabels(this.minThousands,
                        this.maxThousands,
                        this.layout,
                        this.mapThousandsToHeight.bind(this),
                        0);

    // Draw x and y axis.
    drawAxis(this.layout);

    // Draw x and y axis labels.
    drawAxisLabels(this.xAxisLabel,
                   this.yAxisLabel,
                   this.layout);

    // Plot all years between startYear and endYear using the width
    // of the canvas minus margins.

    var numYears = this.endYear - this.startYear;

    // Loop over all rows and draw a line from the previous value to
    // the current.
    for (var i = 0; i < this.data.getRowCount(); i++) {

      var row = this.data.getRow(i);

      var previous = null;

      var l = row.getString(0);

      var uR = this.data.getRow(0);
      var oR = this.data.getRow(1);

      for(var j = 1; j <= numYears+1; j++)
      {
          // Create an object to store data for the current year.
          var current = {
            // Convert strings to numbers.
            'years': this.startYear + (j - 1),
            'thousands': row.getNum(j),
            'ukD': uR.getNum(j),
             'osD': oR.getNum(j),
          };
          

          if (previous != null) {
            // Draw line segment connecting previous year to current year.
            push();
            stroke(this.colors[i]);
            strokeWeight(2);
            fill(this.colors[i]);
            
            line(this.mapYearToWidth(previous.years),
                 this.mapThousandsToHeight(previous.thousands),
                 this.mapYearToWidth(current.years),
                 this.mapThousandsToHeight(current.thousands));
            
            quad(this.mapYearToWidth(previous.years),
            this.mapThousandsToHeight(previous.thousands),
            this.mapYearToWidth(current.years),
            this.mapThousandsToHeight(current.thousands),
            this.mapYearToWidth(current.years),
            this.layout.bottomMargin,
            this.mapYearToWidth(previous.years),
            this.layout.bottomMargin);
            pop();

          
          
          if((previous != null) && (mouseX > this.mapYearToWidth(previous.years) && 
                                    mouseX < this.mapYearToWidth(current.years) && 
                                    mouseY > this.mapThousandsToHeight(current.osD) && mouseY < this.layout.bottomMargin&&
                                    mouseY > this.mapThousandsToHeight(previous.osD)))
          {
            fill(this.colors[i]);
            textSize(30);
            text('Overseas residents', width/2, this.layout.bottomMargin+marginSize);
          }
   
          else if((previous != null) && (mouseX > this.mapYearToWidth(previous.years) && 
          mouseX < this.mapYearToWidth(current.years) && 
          mouseY < this.mapThousandsToHeight(current.osD) && mouseY > this.mapThousandsToHeight(current.ukD)&&
          mouseY > this.mapThousandsToHeight(previous.ukD)&&
          mouseY < this.mapThousandsToHeight(previous.osD)))
          {
          fill(this.colors[0]);
          textSize(30);
          text('UK residents', width/2, this.layout.bottomMargin+marginSize);
          }
          
        }
          drawXAxisTickLabel(current.years, this.layout,this.mapYearToWidth.bind(this));
        // Assign current year to previous year so that it is available
        // during the next iteration of this loop to give us the start
        // position of the next line segment.
        previous = current;
        }

      }

};

this.drawTitle = function() {

fill(192);
noStroke();
textAlign('center', 'center');
textSize(30);

text(this.title,
(this.layout.plotWidth() / 2) + this.layout.leftMargin,
this.layout.topMargin - (this.layout.marginSize / 2));

};

this.mapYearToWidth = function(value) {
return map(value,
  this.startYear,
  this.endYear,
  this.layout.leftMargin,   // Draw left-to-right from margin.
  this.layout.rightMargin);
};

this.mapThousandsToHeight = function(value) {
return map(value,
  this.minThousands,
  this.maxThousands,
  this.layout.bottomMargin, // Smaller at the bottom.
  this.layout.topMargin);   // Bigger at the top.
};
}
