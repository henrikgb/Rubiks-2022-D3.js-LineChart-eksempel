class LineChart {
    constructor(obj) {
        this.chartTitle = obj.chartTitle;
        this.svgWidth = obj.svgWidth;
        this.svgHeight = obj.svgHeight;
        this.data = obj.data;
        this.dataset = obj.dataset;
        this.chartMargin = obj.chartMargin;

        // The drawChart() method builds the line chart
        this.drawChart();

        // The appendDropdownMenu() and updateData() methods updates the dataset that's visualized in the line chart
        this.appendDropdownMenu();
        this.updateData();
    }

    drawChart(){
        // Remove previous created svg elements:
        d3.select('#chart').select('svg').remove();
        
        // Select div with id "#chart", and append a svg element inside of it:
        this.svg = d3.select('#chart')
            .append('svg')
            .attr('class', 'chart')
            //.attr("viewBox", "0 0 " + this.svgWidth + " " + this.svgHeight)
            .attr('width', this.svgWidth)
            .attr('height', this.svgHeight);

        // Create a group element inside the svg, which will contain all elements related to the line chart:
        this.graphWidth = this.svgWidth - this.chartMargin.left - this.chartMargin.right;
        this.graphHeight = this.svgHeight - this.chartMargin.top - this.chartMargin.bottom;
        this.graphCanvas = this.svg.append('g')
            .attr('width', this.graphWidth)
            .attr('height', this.graphHeight)
            .attr('transform', `translate(${this.chartMargin.left}, ${this.chartMargin.top})`);
        
        /*
        // Visualize the position of the graphCanvas g-element:
        this.graphCanvas = this.svg.append('rect')
            .attr('width', this.graphWidth)
            .attr('height', this.graphHeight)
            .attr('transform', `translate(${this.chartMargin.left}, ${this.chartMargin.top})`)
            .attr('fill', 'yellow');
        */

        // Utilize the other methods to step by step build the line chart:
        this.appendTitle();
        this.appendLabelText();
        this.defineAccessor();
        this.createScales();
        this.createGrid();
        this.createAxes();
        this.joinData();
        this.mouseevent();
    }

    appendTitle(){
        this.svg.append('text')
            .attr('x', 45)
            .attr('y', 55)
            .attr('text-anchor', 'start')
            .text(this.chartTitle)
            .style('fill', 'white')
            .style('font-size', "30px")
            .style('font-weight', '800')
            .style('font-family', 'helvetica')
    }

    appendLabelText(){
        this.svg.append('text')
            .attr('x', -280)
            .attr('y', 40)
            .attr('transform', 'rotate(-90)')
            .attr('text-anchor', 'middle')
            .text(this.data[0].unit) 
            .style('fill', 'white')
            .style('font-size', '20px')
    }

    defineAccessor(){
        this.yAccessor = (d) => d.value;
        this.dateParser = d3.timeParse("%d/%m/%Y");
        this.xAccessor = (d) => this.dateParser(d.date);
    }

    createScales(){
        this.yScale = d3.scaleLinear()
            .domain([Math.min(0, d3.min(this.data, this.yAccessor)), d3.max(this.data, this.yAccessor)])
            .range([this.graphHeight, 0]);

        this.xScale = d3.scaleTime()
            .domain(d3.extent(this.data, this.xAccessor))
            .range([0, this.graphWidth])
    }

    createGrid(){
        this.makeYLines = () => d3.axisLeft().scale(this.yScale)
        this.makeXLines = () => d3.axisBottom().scale(this.xScale)

        this.graphCanvas.append('g')
            .attr('class', 'grid')
            .call(this.makeYLines()
                .tickSize(-this.graphWidth, 0, 0)
                .tickFormat(''))
            .style('color', "#004975")
            .style('stroke-opacity', this.gridOpacity)
            .attr('stroke-width', 0.8)

        this.graphCanvas.append('g')
            .attr('class', 'grid')
            .call(this.makeXLines()
                .tickSize(this.graphHeight, 0, 0)
                .tickFormat(''))
            .style('color', '#004975')
            .style('stroke-opacity', this.gridOpacity)
            .attr('stroke-width', 0.8)
    }

    createAxes(){
        this.xAxisGroup = this.graphCanvas.append('g')
        this.yAxisGroup = this.graphCanvas.append('g')
        
        this.xAxis = d3.axisBottom(this.xScale)
        this.yAxis = d3.axisLeft(this.yScale) 

        this.xAxisGroup.call(this.xAxis)
        this.yAxisGroup.call(this.yAxis) 
        
        this.xAxisGroup
            .attr('stroke-width', 0.6)
            .attr('font-size', 14)
            .attr('transform', `translate(0, ${this.graphHeight})`) 

        this.yAxisGroup
            .attr('font-size', 14)
            .attr('stroke-opacity', 0); 
        this.xAxisGroup.selectAll('text')
            .attr('transform', 'rotate(-65)')
            .style('text-anchor', 'end')
            .attr('dx', '-.8em')
            .attr('dy', '.15em')   
    }

    joinData(){
        this.lineGenerator = d3.line()
            .x((d) => this.xScale(this.xAccessor(d)))
            .y((d) => this.yScale(this.yAccessor(d)))
            .curve(d3.curveMonotoneX);  

        this.line = this.graphCanvas
            .append("path")
            .attr("d", this.lineGenerator(this.data))
            .attr("fill", "none")
            .attr("stroke", "#A2C3F4") 
            .attr('shape-rendering', 'geometricPrecision')
            .attr("stroke-width", 1.5);
    }

    appendDropdownMenu(){
        d3.select('#dropdownmenu')
            .append("option")
            .attr("value", "temperature")
            .text("Temperature");
        d3.select('#dropdownmenu')
            .append("option")
            .attr("value", "rainfall")
            .text("Rainfall");
    }

    updateData(){
        const $this = this;
        d3.select('#dropdownmenu')
            .on('change', function() {
                let newData = eval(d3.select(this).property('value'));
                $this.data = newData;
                $this.drawChart();
            })
    }

    mouseevent() {
        // Append listening-rectangle to listen on movements of the mouse position
        this.listeningRect = this.graphCanvas
            .append("rect")
            .attr("class", "listening-rect")
            .attr('width', this.graphWidth)
            .attr('height', this.graphHeight)
            .on('mousemove', onMouseMove)
            .on("mouseleave", onMouseLeave)

        // Append a vertical line to visualize data point positions
        this.xAxisLine = this.graphCanvas
            .append("g")
            .append("rect")
            .style('stroke', '#006FB2')
            .style('stroke-width', 3)
            .style('stroke-dasharray', 2)
            .attr('x', -5000)
            .attr("width", ".5px")
            .attr("height", this.graphHeight);

        // Append a circle to visualize data point positions
        this.tooltipCircle = this.graphCanvas
            .append("circle")
            .attr("r", 7)
            .attr("stroke", '#006FB2')
            .attr("fill", "white")
            .attr("stroke-width", 2)
            .style("opacity", 0);

        // Append a tooltip box with information about the data points
        this.toolTipDiv = d3.select('body').append("rect")
            .attr("class", "line-chart-tooltip")
            .style("opacity", 0)


        const $this = this;
        function onMouseMove() {
            // Monitor mouse-position:
            let mousePosition = d3.mouse(this);
            let hoveredDate = $this.xScale.invert(mousePosition[0]);
            //console.log('Mouse position: ' + mousePosition)
            //console.log('hover date: ' + hoveredDate)

            // Calculate closest data point:
            let getDistanceFromHoveredDate = (d) => Math.abs($this.xAccessor(d) - hoveredDate);
            let closestIndex = d3.scan($this.data,(a, b) =>
                getDistanceFromHoveredDate(a) - getDistanceFromHoveredDate(b));
            let closestDataPoint = $this.data[closestIndex];
            let closestXValue = $this.xAccessor(closestDataPoint);
            let closestYValue = $this.yAccessor(closestDataPoint);
            // console.log("Closest X Value: " + closestXValue)
            // console.log("Closest Y Value: " + closestYValue)


            // Create tooltip-circle and axis-line, to follow the mouse pointer, and to visualize the data point positions
            $this.xAxisLine
                .attr("x", $this.xScale(closestXValue))
                .style('opacity', 1)
            $this.tooltipCircle
                .attr("cx", $this.xScale(closestXValue))
                .attr("cy", $this.yScale(closestYValue))
                .style("opacity", 1);

            // Create the tooltip-div with data point information: 
            $this.tooltipDiv = d3.select(".line-chart-tooltip");
            $this.tooltipDiv.style("opacity", 1)
            let formatDate = d3.timeFormat("%B %A %-d, %Y");
            $this.tooltipDiv.html(formatDate(closestXValue) + "</br>"
                + $this.data[0].description + ': ' + closestYValue + " " + $this.data[0].unit)
                .style("cursor", "pointer")
                .style("top", (event.pageY) - 75 + "px")
                .style("left",(event.pageX) - 70 + "px")
                .style('background-color', '#001929' )
        }

        function onMouseLeave() {
            //console.log('Mouse leaves')

            // Hide tool tip when hovering outside the line chart area:
            $this.tooltipDiv = d3.select(".line-chart-tooltip");
            $this.tooltipDiv.style("opacity", 0);
            $this.tooltipCircle.style("opacity", 0);
            $this.xAxisLine.style('opacity', 0)
        }
        
    }

}
