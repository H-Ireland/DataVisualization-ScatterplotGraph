fetch("data/cyclist-data.json")
    .then(response => response.json())
    .then(item => {
        item.map(obj => {
            const parseYear = d3.timeParse("%Y")
            obj.Year = parseYear(obj.Year)            
            console.log(obj.Year)

            const parseTime = d3.timeParse("%M:%S")
            obj.Time = parseTime(obj.Time)
        })

        makeScatterplot(item)
    })

let h = 750;
let w = 1500;

const padding = {
    top: 75,
    right: 75,
    bottom: 75,
    left: 80,
}

// create SVG canvas
const svg = d3
    .select('body')
    .append('svg')
    .attr('height', h)
    .attr('width', w);

//create labels
svg
    .append('text')
    .attr('x', w / 2)
    .attr('y', h - 685)  // this (along with text-anchor below) places heading in proper position on x-axis
    .attr('text-anchor', 'middle')
    .attr('class', 'top-label')
    .text('Doping in Professional Bicycle Racing');

svg
    .append('text')
    .attr('x', w / 2)  // this (along with text-anchor below) places subheading in proper position on x-axis
    .attr('y', h - 650)
    .attr('text-anchor', 'middle')
    .attr('class', 'axis-label')
    .text("35 Fastest times up Alpe d'Huez");

svg
    .append('text')
    .attr('x', -175)    
    // this (along with rotate and text-anchor below) places text in proper position on y-axis
    .attr('y', 32)
    .attr('transform', 'rotate(-90)')
    .attr('text-anchor', 'middle')
    .attr('class', 'axis-label')
    .text('Time in Minutes');

//create dimensions for graph
let displayHeight = h - (padding.top + padding.bottom)
let displayWidth = w - (padding.right + padding.left)

const makeScatterplot = (arr) => {

    let dataset = arr;    

    const xData = (d) => d.Year - 1;   
    const yData = (d) => d.Time;  

    const xScale = d3
        .scaleTime()
        .domain(d3.extent(dataset, xData))    
        .range([0, displayWidth])
        .nice();
       

    const yScale = d3
        .scaleTime()
        .domain(d3.extent(dataset, yData))      
        .range([0, displayHeight]);

    // create both axes      
    const xAxis = d3
    .axisBottom(xScale).tickFormat(d => d3.timeFormat("%Y")(d) === "1992" ? "" : d3.timeFormat("%Y")(d));
    const yAxis = d3
    .axisLeft(yScale).tickFormat(d => d3.timeFormat("%M:%S")(d))   

    const graph = d3
        .select("svg")
        .attr("class", "myGraph")
        .append("g")        
        .attr("transform", `translate(${padding.left}, ${padding.bottom})`)

    graph
        .append("g")
        .attr("transform", `translate(0, ${displayHeight})`)      
        .attr("id", "myAxes")
        .call(xAxis);

    graph
        .append('g')           
        .attr("transform", `translate(xScale(xData(d), ${displayWidth})`)
        .attr("id", "myAxes")
        .call(yAxis);

    // create circles to display data
    graph.selectAll("circle")
        .data(dataset)
        .enter()
        .append("circle")
        .attr("r", 5)
        .attr("cx", (d) => xScale(xData(d)))
        .attr("cy", (d) => yScale(yData(d)))
        .attr("fill", (d) => {          
            return d.Doping === "" ? "green" : "rgb(16, 16, 56)"           
        })
        .append("title")
        .attr("class", "zoom")
        .attr("id", "tooltip")       
        .text((d) => d.Year.getFullYear());       

    graph
        .append('text')
        .attr('x', displayWidth - 300)  // this (along with text-anchor below) places subheading in proper position on x-axis
        .attr('y', h - 500)       
        .attr('class', 'legend')
        .text("No doping allegations");

    graph
        .append("rect")
        .attr('x', displayWidth - 100)
        .attr('y', h - 510)
        .attr('height', 15)
        .attr('width', 15)
        .attr('fill', 'green')

    graph
        .append('text')
        .attr('x', displayWidth - 300)  // this (along with text-anchor below) places subheading in proper position on x-axis
        .attr('y', h - 450)
        .attr('class', 'legend')
        .text("Riders with doping allegations");

        graph
        .append("rect")
        .attr('x', displayWidth - 50)
        .attr('y', h - 463)
        .attr('height', 15)
        .attr('width', 15)
        .attr('fill', 'rgb(16, 16, 56)')
}