// INIT FUNCTION //////////////////////////////////////////////////////////////////////
function init(callback) {
    // Select the dropdown menu
    var dropdownMenu = d3.select("#selDataset");
    // Use D3.json() to fetch and read the JSON file
    d3.json("../../data/samples.json").then((data) => {
        // Append each one of our subject IDs to the dropdown
        data.names.forEach(element => {
            dropdownMenu.append("option").attr("value", element).text(element);
        });
    });
    
    callback();
};


// On change, call getData()
d3.selectAll("#selDataset").on("change", getData);


// GETDATA FUNCTION //////////////////////////////////////////////////////////////////
function getData() {
    // Select the dropdown menu
    var dropdownMenu = d3.select("#selDataset");
    // Assign the value of the dropdown menu option to a variable
    var subject_selection = dropdownMenu.property("value");
    // Use D3.json() to fetch and read the JSON file
    d3.json("../../data/samples.json").then((data) => {
        
        // DEMOGRAPHIC INFO //////////////////////////////////////////////////////////
        // Select the Demographic Info div
        var demographicInfo = d3.select("#sample-metadata");
        // Clear any existing data
        demographicInfo.html("");
        
        // // Get the Metadata for our specific subject
        // var metadata = data.metadata.filter(item => item.id == subject_selection)[0]
        // // Display our key-value pairs 
        // Object.entries(metadata).forEach(([key, value]) => {
        //     // Append a new paragraph for each piece of data
        //     var row = demographicInfo.append("p");
        //     // Fill said paragraph with our data (and capitalize the key)
        //     row.text(`${key.charAt(0).toUpperCase()+key.slice(1)}: ${value}`);
        // });

        // Although the following code isn't as elegant as the above (which accomplishes what was necessary),
        // I preferred the following technique simply because it labeled the data more clearly (Washing Frequency vs Wfreq)

        // Get the index of the Subject ID making it easier to call the rest of the data
        var index = data.names.findIndex((id) => id == subject_selection)
        // Get our data to populate the Demographic Info
        var subject_id = data.metadata[index].id;
        var ethnicity = data.metadata[index].ethnicity;
        var gender = data.metadata[index].gender;
        var age = data.metadata[index].age;
        var location = data.metadata[index].location;
        var bbtype = data.metadata[index].bbtype;
        var wfreq = data.metadata[index].wfreq;
        // Check
        console.log(`${index}: Subject ID #${subject_id}`);
    
        // Display our data
        demographicInfo.html(  `ID: ${subject_id}<br>
                                Ethnicity: ${ethnicity}<br>
                                Gender: ${gender}<br>
                                Age: ${age}<br>
                                Location: ${location}<br>
                                Navel Type: ${bbtype}<br>
                                Washing Frequency: ${wfreq}`
        );
        
        // BAR CHART ////////////////////////////////////////////////////////////
        
        //  Get our data to populate the bar chart
        var sample_list = data.samples[index];
        var sample_values = sample_list.sample_values;
        var otu_ids = sample_list.otu_ids;
        var otu_labels = sample_list.otu_labels;

        // Sort the data array using the greekSearchResults value
        sample_values.sort((a, b) => {parseFloat(b) - parseFloat(a);});

        // Slice the first 10 objects for plotting
        var sample_values_sliced = sample_values.slice(0, 10);
        var otu_ids_sliced = otu_ids.slice(0, 10).map(id => `OTU ${id}`);
        var otu_labels_sliced = otu_labels.slice(0, 10);
        var ten = [...Array(10).keys()].reverse() // simply creates the array [9,8,7,6,5,4,3,2,1,0]

        // Bar Data
        var bar_data = [{
            x: sample_values_sliced,
            y: ten,
            text: otu_labels_sliced,
            type: "bar",
            orientation: "h"
        }];

        // Bar Layout 
        var bar_layout = {
            title: `Bacteria Found in<br>Subject ${subject_id}'s Belly Button`,
            yaxis: {tickmode: "array",
                    tickvals: ten,
                    ticktext: otu_ids_sliced
            }
        };

        // Render the plot to the div tag with id "bar"
        Plotly.newPlot("bar", bar_data, bar_layout, {responsive: true});
        
        
        // GAUGE CHART /////////////////////////////////////////////////////////
        
        var gauge_data = [{
                // domain: { x: [0, 1], y: [0, 1] }, // unsure what this does
                value: wfreq,
                gauge: { 
                    axis: { range: [null, 10] },
                    bar: { color: "#337ab7" },
                    steps: [
                        { range: [0, 0.5], color:   "#ff9999" },
                        { range: [0.5, 1.5], color: "#ffb399" },
                        { range: [1.5, 2.5], color: "#ffcc99" },
                        { range: [2.5, 3.5], color: "#ffe699" },
                        { range: [3.5, 4.5], color: "#ffff99" },
                        { range: [4.5, 5.5], color: "#e6ff99" },
                        { range: [5.5, 6.5], color: "#ccff99" },
                        { range: [6.5, 10], color:  "#a6ff4d" }
                    ],
                    threshold: {
                        line: { color: "rgb(80, 80, 80)", width: 3 },
                        thickness: 1,
                        value: 6.5
                    }
                },
                title: { text: "Belly Button Washington Frequency<br>(Scrubs per Week)" },
                type: "indicator",
                mode: "gauge+number"
        }];
        
        var gauge_layout = {
            margin: { t: 0, b: 0 } 
        };
        
        Plotly.newPlot("gauge", gauge_data, gauge_layout, {responsive: true});
        

        // BUBBLE CHART /////////////////////////////////////////////////////////
        
        // Bubble Data
        var bubble_data = [{
            x: otu_ids,
            y: sample_values,
            text: otu_labels,
            mode: 'markers',
            marker: {
            // Make the maximum value size 100
            size: sample_values.map(value => 100*value/Math.max(...sample_values)),
            // My colors by dafault go from grey(0) to red(∞), making the first value negative for some reason makes the colors go from purple(-∞) to grey to red(∞)
            color: otu_ids.map(id => id-Math.min(...otu_ids)-1)
            }
        }];

        // Bubble Layout
        var bubble_layout = {
            title: `Bubble Chart for Subject ${subject_id}`,
            xaxis: {
                title: "OTU ID"
            },
            yaxis: {
                title: "Sample Values"
            }
        };
        
        // Render the plot to the div tag with id "bubble"
        Plotly.newPlot("bubble", bubble_data, bubble_layout, {responsive: true});

    });
}

init(getData); // unsure why this doesn't work...
setTimeout(getData, 500); // so I have to put a delay on getData()