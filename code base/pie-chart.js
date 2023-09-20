/*
https://editor.p5js.org/bobbytux/sketches/isdsojlcC

http://bl.ocks.org/infographicstw/8a76612985ea52c5be1f

https://codepen.io/behreajj/pen/BRePoo

*/

function PieChart(x, y, diameter) {

  this.x = x;
  this.y = y;
  this.diameter = diameter;
  this.labelSpace = 40;

  this.get_radians = function(data) {
    var total = sum(data);
    var radians = [];

    for (let i = 0; i < data.length; i++) {
      radians.push((data[i] / total) * TWO_PI);
    }

    return radians;
  };

  this.draw = function(data, labels, colours, title) {
   
    // Test that data is not empty and that each input array is the
    // same length.
    if (data.length == 0) {
      alert('Data has length zero!');
    } else if (![labels, colours].every((array) => {
      return array.length == data.length;
    })) {
      alert(`Data (length: ${data.length})
             Labels (length: ${labels.length})
             Colours (length: ${colours.length})
             Arrays must be the same length!`);
    }


    fill('slategray');
    noStroke();
    rect(width/24, height*0.85, 250, 80);

    //draw PieChart slices
    var angles = this.get_radians(data);
    var lastAngle = 0;
    var colour;

    var lx; 
    var ly;

    for (var i = 0; i < data.length; i++) {
      if (colours) {
        colour = colours[i];
      } else {
        colour = map(i, 0, data.length, 0, 255);
      }

    //it calculates the angle between the pie and the mouse
    var mouseA = PI/2 - atan((this.x-mouseX)/(this.y-mouseY));

    //it adds PI whenever the mouseY is less than y coordinate
    if(mouseY < this.y)
    {
     mouseA = mouseA + PI;
    }

    //it calculates the new position of the slices
    dx = cos((lastAngle + (lastAngle+angles[i]))/2) * 50;
    dy = sin((lastAngle + (lastAngle+angles[i]))/2) * 50;

    //check the position of the mouse in the slices
    if(dist(this.x,this.y,mouseX,mouseY) <= this.diameter/2 && 
       mouseA >= lastAngle && mouseA <= lastAngle + angles[i]) 
    {
      this.makeDataLabel(data[i],lx, ly);  
      
      fill(colour);
      noStroke();
      arc(this.x + dx, this.y + dy,
        this.diameter, this.diameter,
        lastAngle, lastAngle + angles[i]);
 
    }
      else{
        fill(colour);
        noStroke();
           arc(this.x, this.y,
             this.diameter, this.diameter,
             lastAngle, lastAngle + angles[i]); 
      }
  

    //draw labels and legend
    if (labels) {
      this.makeLegendItem(labels[i], i, colour);
    }

    lastAngle += angles[i];
  }

  if (title) {
    noStroke();
    textAlign('center', 'center');
    textSize(30);
    text(title, width/2, this.y - this.diameter * 0.65);
  }

  
};

  this.makeLegendItem = function(label, i, colour) {
    var x = this.x + 70 + this.diameter / 2;
    var y = this.y + (this.labelSpace * i) - this.diameter / 3;
    var boxWidth = this.labelSpace / 2;
    var boxHeight = this.labelSpace / 2;

    fill(colour);
    rect(x, y, boxWidth, boxHeight);

    fill('black');
    noStroke();
    textAlign('left', 'center');
    textSize(12);
    text(label, x + boxWidth + 10, y + boxWidth / 2);
  };

 this.makeDataLabel = function(data,lx,ly){
  //draw data labels
  var dataLabelsize = 38;
  push();
  fill(0);
  strokeWeight(3);
  textSize(dataLabelsize);
  textAlign(CENTER,CENTER);
  
  text(data, 
       width/8, 
       height*0.9);
  pop();   
 }
}
