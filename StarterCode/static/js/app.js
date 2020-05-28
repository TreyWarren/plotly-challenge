
function init() {
    var dropdownMenu = d3.select("#selDataset");
    // Use D3.json() to fetch and read the JSON file
    d3.json("../../data/samples.json").then((importedData) => {
        var data = importedData;
        console.log(data);
    
        console.log(data.names)
        data.names.forEach(element => {
            dropdownMenu.append("option").attr("value", element).text(element);
    
        });
    });
};





// On change to the DOM, call getData()
d3.selectAll("#selDataset").on("change", getData);

// Function called by DOM changes
function getData() {
    var dropdownMenu = d3.select("#selDataset");
    // Assign the value of the dropdown menu option to a variable
    var subject_selection = dropdownMenu.property("value");
  

    // Use D3.json() to fetch and read the JSON file
    d3.json("../../data/samples.json").then((importedData) => {
        // console.log(importedData);
        var data = importedData;
        // console.log(data.metadata);
        var index = data.names.findIndex((id) => id == subject_selection)
        var subject_id = data.metadata[index].id;
        var ethnicity = data.metadata[index].ethnicity;
        var gender = data.metadata[index].gender;
        var age = data.metadata[index].age;
        var location = data.metadata[index].location;
        var bbtype = data.metadata[index].bbtype;
        var wfreq = data.metadata[index].wfreq;

        console.log(subject_id);
        console.log(index);

        var demographicInfo = d3.select("#sample-metadata");
        demographicInfo.html(  `ID: ${subject_id}<br>
                                Ethnicity: ${ethnicity}<br>
                                Gender: ${gender}<br>
                                Age: ${age}<br>
                                Location: ${location}<br>
                                Navel Type: ${bbtype}<br>
                                Washing Frequency: ${wfreq}`
                            );
        /////////////////////////////////////////////////////////////////
        
        var sample_list = data.samples[index];
        var sample_values = sample_list.sample_values;
        var otu_ids = sample_list.otu_ids;
        var otu_labels = sample_list.otu_labels;

        // Sort the data array using the greekSearchResults value
        sample_values.sort(function(a, b) {
            return parseFloat(b) - parseFloat(a);
        });

        // Slice the first 10 objects for plotting
        var ten = [9,8,7,6,5,4,3,2,1,0]
        var sample_values_sliced = sample_values.slice(0, 10);
        var otu_ids_sliced = otu_ids.slice(0, 10).map(id => `OTU ${id}`);
        var otu_labels_sliced = otu_labels.slice(0, 10);

        // Trace for the Data
        var bar_trace = {
            x: sample_values_sliced,
            y: ten,
            text: otu_labels_sliced,
            type: "bar",
            orientation: "h"
        };

        // data
        var bar_data = [bar_trace];

        // Apply the group bar mode to the layout
        var bar_layout = {
            title: `Bacteria Found in<br>Subject ${subject_id}'s Belly Button`,
            yaxis: {tickmode: "array",
                    tickvals: ten,
                    ticktext: otu_ids_sliced
            }
        };

        // Render the plot to the div tag with id "plot"
        Plotly.newPlot("bar", bar_data, bar_layout, {responsive: true});
        
        ////////////////////////////////////////////////////////////////////////////////

        var bubble_trace = {
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
        };
        console.log(Math.max(...sample_values));
        console.log(Math.min(...sample_values));

        var bubble_data = [bubble_trace];
        
        var bubble_layout = {
            title: `Bubble Chart for Subject ${subject_id}`,
            xaxis: {
                title: "OTU ID"
            },
            yaxis: {
                title: "Sample Values"
            }
        };
        
        Plotly.newPlot("bubble", bubble_data, bubble_layout, {responsive: true});

    });
}
init();
getData();