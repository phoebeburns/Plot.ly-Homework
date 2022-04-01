//pull sample metadata
function showMetadata(sample){
    let demographics = d3.select("#sample-metadata");

    d3.json("samples.json").then(function(data){
        let metadata = data.metadata
        //just get the data for the chosen sample
        let samdata = metadata.filter((sampleJawn) => sampleJawn.id == sample);
        d3.select("#sample-metadata") 
        console.log(samdata)

        Object.entries(samdata).forEach(([key, value]) => {
            demographics.append("p").text(`${key}: ${value}`)
        })

    })
}

//use data from sample to create charts
function makeCharts(sample){
    d3.json("samples.json").then(function(data){
        let samples = data.samples
        //just get the data for the chosen sample
        let sdata = samples.filter((sampleJawn)=> sampleJawn.id == sample);

        if (sdata.length > 0) {
            let result = sdata[0];

            let otu_ids = result.otu_ids;
            let otu_labels = result.otu_labels;

            let trace1 = {
                x: [otu_ids],
                y: [sample_values],
                text: [otu_labels],
                type: bar,
                orientation: 'h'
            }

            let trace2 = {
                x: [otu_ids],
                y: [sample_values],
                mode: markers,
                marker:{
                    size: [sample_values]
                }
            }

            let data1 = trace1
            let layout1 = {
                title: "Top Ten OTUs"
            }

            let data2 = trace2
            let layout2 = {
                title: "OTU Quantity Bubbles"
            }

            Plotly.newPlot("bar", data1, layout1);
            Plotly.newPlot("bubble",data2,layout2)
        }

    })
}

//function for what happens when the option is changed
function optionChanged(sample) {
    makeCharts(sample);
    showMetadata(sample);
}

let dropdown = d3.select("selDataset")
//read in the data
d3.json("samples.json").then(function(data) {

    let names = data.names ;

    for(name of names){
        dropdown.apppend("option").text(name).property("value", name);
    }

    let firstOpt = names[0]

    optionChanged(firstOpt);
})