//pull sample metadata
function showMetadata(sample) {
    let demographics = d3.select("#sample-metadata");

    d3.json("./data/samples.json").then(function (data) {
        let metadata = data.metadata
        //just get the data for the chosen sample
        let samdata = metadata.filter((sampleJawn) => sampleJawn.id == sample);

        demographics.html('')

        for (demographic of samdata) {

            Object.entries(demographic).forEach(([key, value]) => {
                demographics.append("p").text(`${key}: ${value}`)
            })
        }

    })
}

//use data from sample to create charts
function makeCharts(sample) {
    d3.json("./data/samples.json").then(function (data) {
        let samples = data.samples
        //just get the data for the chosen sample
        let sdata = samples.filter((sampleJawn) => sampleJawn.id == sample);

        if (sdata.length > 0) {
            let result = sdata[0];
            let sample_values = result.sample_values
            let otu_ids = result.otu_ids;
            let otu_labels = result.otu_labels;

            var yticks = otu_ids.slice(0, 10).map(otuID => `OTU ${otuID}`).reverse();

            let trace1 = {
                y: yticks,
                x: sample_values.slice(0, 10).reverse(),
                text: otu_labels.slice(0, 10).reverse(),
                type: "bar",
                orientation: 'h'
            }

            let trace2 = {
                x: otu_ids,
                y: sample_values,
                type: "bubble",
                mode: "markers",
                marker: {
                    size: sample_values,
                    color: otu_ids,
                    colorscale: "Earth"
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


            Plotly.newPlot("bar", [data1], layout1);
            Plotly.newPlot("bubble", [data2], layout2)
        }

    })
}

function makeGauge(sample) {

    d3.json("./data/samples.json").then(function (data) {
        let metadata = data.metadata
        //just get the data for the chosen sample
        let samdata = metadata.filter((sampleJawn) => sampleJawn.id == sample)
        let result = samdata[0];

        let wfreq = result.wfreq

        console.log(wfreq)

        let trace3 = {
            domain: { x: [0, 1], y: [0, 1] },
            value: wfreq,
            title: { text: "Weekly Washing Frequency" },
            type: "indicator",
            mode: "gauge+number",
            gauge: {
                axis: { range: [0, 9] },
                bar: { color: "black", width: 1 },
                steps: [
                    { range: [0, 1], color: "red" },
                    { range: [1, 4], color: "yellow" },
                    { range: [4, 9], color: "green" }
                ]

            }

        }

        let data3 = trace3;
        let layout3 = { width: 600, height: 450, margin: { t: 0, b: 0 } };

        Plotly.newPlot('gauge', [data3], layout3);

    })

}



//function for what happens when the option is changed
function optionChanged(sample) {
    makeCharts(sample);
    showMetadata(sample);
    makeGauge(sample);
}


function init() {

    let dropdown = d3.select("#selDataset")
    //read in the data
    d3.json("./data/samples.json").then(function (data) {

        let names = data.names;

        for (let name of names) {
            dropdown.append("option").text(name).property("value", name);
        }

        let firstOpt = names[0]

        optionChanged(firstOpt);
    })

}

init()