# Rubiks-2022-D3.js-LineChart-eksempel
This repository is intended to show how to build a simple line chart using D3.js, 
and was created in connection with a lecture at the Rubiks 2022 festival. 

## Code description
- index.html is a simple html file utilized to host the line chart. 
  - Inside the head there is a link to the css stylesheet. 
  - Inside the body there is: 
    - a div created to contain the line chart, and inside this div there is a select element inteded to work as a dropdown menu,
    - there is a link to DummyData.js, LineChart.js, and to the d3.js library, 
    - and there is a JavaScript object created of the LineChart.js class. 
- DummyData.js contains dummy data as JavaScript objects which will be visualized in the line chart.
- stylesheet.css contains css classes utilized to style the line chart. 
- LineChart.js is a JavaScript class utilized to build the line chart. 

## Description of LineChart.js
LineChart.js is a JavaScript class utilized to build the line chart. 
It contains various methods that step by step builds the line chart. 
- The drawChart() method starts by deleting previous created svg elements, and continues by 
creating a new svg element, and follows up by triggering other methods in order to 
build the line chart:
  - The appendTitle() method appends a title to the line chart. 
  - The appendLabelText() method appends a label text to the y-axis. 
  - the defineAccessor() method creates JavaScript accessors utilized as getters of dummy data in other methods.
  - The createScales() method creates scales for the y- and x-axis by defining range and domain.
  - The createGrid() method creates a grid that improved data visualization in the line chart. 
  - The createAxes() creates the y- and x-axis.
  - The joinData() method joins the dummy data to the line chart. 
  - The mouseevent() method creates a tooltip function to visualize the various data points when hovering the mouse over the line chart.

When the drawChart() method is finished building the line chart, the appendDropdownMenu() and updateData() methods 
are utilized to update the dataset that's visualized in the line chart: 
- The appendDropDownMenu() method adds option values to the dropdown menu. 
- The updateData() method listen for changes in the dropdown menu. When the value in the dropdown menu changes, 
a temporary variable is created. The temporary variable represent one of the JavaScript objects in the DummyData.js file, 
and will be utilized as input data in the drawChart() method that will be re-triggered. 

## Credits
Parts of the code is inspired by the following blog articles: 
- https://vizartpandey.com/creating-simple-line-charts-using-d3-js-part-01/
- https://vizartpandey.com/line-chart-how-to-show-data-on-mouseover-using-d3-js/
