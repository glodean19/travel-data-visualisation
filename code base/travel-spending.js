/*

https://bl.ocks.org/tiktaktok/0966c7d1f1f5dce8936772479a89fa87

*/
function TravelSpending() {

  // Name for the visualisation to appear in the menu bar.
  this.name = 'Travel Spending';

  // Each visualisation must have a unique ID with no special
  // characters.
  this.id = 'travel-spending';

  this.labelSpace = 30;

  // Layout object to store all common plot layout parameters and
  // methods.
  this.layout = {
    // Locations of margin positions. Left and bottom have double margin
    // size due to axis and tick labels.
    leftMargin: 100,
    rightMargin: width,
    topMargin: 100,
    bottomMargin: height,
    pad: 40,

    plotHeight: function() {
      return this.bottomMargin - this.topMargin;
    },

    // Number of axis tick labels to draw so that they are not drawn on
    // top of one another.
    numXTickLabels: 10,
    numYTickLabels: 8,
  };

  // Default visualisation colours.
  this.ukColour = color(255, 0 ,0);
  this.overseaColour = color(0, 255, 0);

  // Property to represent whether data has been loaded.
  this.loaded = false;

   // Title to display above the plot
   this.title = 'UK residents spending abroad and overseas in UK';

  // Preload the data. This function is called automatically by the
  // gallery when a visualisation is added.
  this.preload = function() {
    var self = this;
    this.data = loadTable(
      './data/Travel/dataTravelSpending.csv', 'csv', 'header',
      // Callback function to set the value
      // this.loaded to true.
      function(table) {
        self.loaded = true;
        gallery.loadInitialVisual();
      });

  };

  this.setup = function() {

  };

  this.destroy = function() {
  };

  this.draw = function() {
    if (!this.loaded) {
      console.log('Data not yet loaded');
      return;
    }

    //canvas color
    c1 = color(9, 42, 68);
    c2 = color(192, 192, 192);
  
    for(var i = 0; i < width; i++){
      n = map(i,0,width,0,1);
      var newc = lerpColor(c1,c2,n);
      stroke(newc);
      line(0,i,width, i);
      }
    // Draw the title above the plot.
    this.drawTitle();

    var lineWidth = (width - this.layout.leftMargin) /
    this.data.getRowCount();


    for (var i = 0; i < this.data.getRowCount(); i++) {

      // Calculate the x position for each year.
      var lineX = (lineWidth * i) + this.layout.leftMargin;

      
     // Create an object that stores data from the current row.
     var spending = {
      // Convert strings to numbers.
      'year': this.data.getNum(i, 'Years'),
      'uk': this.data.getNum(i, 'UK residents'),
      'overseas': this.data.getNum(i, 'Overseas residents'),
    };
   
      // Draw the years at the bottom margin.
      fill(0);
      noStroke();
      textAlign('right', 'top');
      textSize(16);
      text(spending.year,
           lineX - 10,
           this.layout.bottomMargin - this.layout.pad
           );


      // Draw UK residents rectangle.
      var ukX = lineX - lineWidth;
      var ukY = this.layout.bottomMargin - 50;
      var ukWidth = lineWidth - this.layout.pad;
      var ukHeight = -this.mapPercentToHeight(spending.uk);

     
      if((mouseX > ukX && mouseX < ukX + ukWidth)&&  
         (mouseY < ukY && mouseY > ukY + ukHeight))
         
      {
          this.dataLabelsUk(spending.uk, ukX, ukY + ukHeight);
          
          noFill();
          stroke(this.ukColour);
        
        }
      else{
          fill(this.ukColour);
      }
    
      rect(ukX,
           ukY,
           ukWidth,
           ukHeight);
         
      var osX = ukX + ukWidth;
      var osY = this.layout.bottomMargin - 50;
      var osWidth = lineWidth - this.layout.pad;
      var osHeight = - this.mapPercentToHeight(spending.overseas);

      // Draw overseas residents rectangle.
      if((mouseX > osX) && (mouseX < osX + osWidth) && 
         (mouseY < osY) && (mouseY > osY + osHeight)) 
      {
        push();
          this.dataLabelsOs(spending.overseas, osX, osY + osHeight);
          pop();
          
          noFill();
          stroke(this.overseaColour);

      } 
      else{
          fill(this.overseaColour);
      }
      
      rect(osX,
           osY,
           osWidth,
           osHeight);

  }

  this.legend();

  //check the value
  this.dataLabelsUk = function(spenUk, posX, posY)
    {  
      push();
      fill(0);
      stroke(1);
      strokeWeight(1);
      textSize(18);
      textAlign(CENTER, TOP);
      translate(posX+5, posY-30);
      rotate(-HALF_PI);
      text(spenUk, 0, 0);
      pop();
      
   
    }

  this.dataLabelsOs = function(spenOs,posX, posY)
  { 
    push();
    fill(0);
    stroke(1);
    strokeWeight(1);
    textSize(18);
    textAlign(CENTER, TOP);
    translate(posX+5, posY-30);
    rotate(-HALF_PI);
    text(spenOs, 0, 0);
    pop();
  }
};

  this.mapPercentToHeight = function(value) {
    return map(value,
               10000,
               65000,
               0,
               this.layout.plotHeight());
  };

  //draw title of the visualisaton
  this.drawTitle = function() {

    fill(100);
    noStroke();
    textAlign('center', 'center');
    textSize(30);

    text(this.title,
          width/2,
          this.layout.pad);

    };

    this.legend = function() {
    
      var boxWidth = this.labelSpace / 2;
      var boxHeight = this.labelSpace / 2;

      var uk = 'UK Residents';
      var os = 'Overseas Residents';
  
      fill(this.ukColour);
      rect(50, 70, boxWidth, boxHeight);
  
      fill(128);
      noStroke();
      textAlign('left', 'center');
      textSize(18);
      text(uk, 50 + boxWidth + 10, 70 + boxWidth / 2);

      fill(this.overseaColour);
      rect(50, 90, boxWidth, boxHeight);
  
      fill(128);
      noStroke();
      textAlign('left', 'center');
      textSize(18);
      text(os, 50 + boxWidth + 10, 90 + boxWidth / 2);

    };
}
