/*
Survey found here
https://www.ons.gov.uk/peoplepopulationandcommunity/leisureandtourism/articles/traveltrends/2019

*/
// Global variable to store the gallery object. The gallery object is
// a container for all the visualisations.
var gallery;

var c;
function setup() {
  // Create a canvas to fill the content div from index.html.
  c = createCanvas(1424, 776);
  c.parent('visual');

  // Create a new gallery object.
  gallery = new Gallery();

  // Add the visualisation objects here.
  gallery.addVisual(new TravelReason());
  gallery.addVisual(new TravelGap());
  gallery.addVisual(new TravelSpending());
  gallery.addVisual(new TravelCountries());

}

function draw() {

  if (gallery.selectedVisual != null) {
    gallery.selectedVisual.draw();
  }
}
