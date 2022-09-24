// Where we do geospatial processing of geojson data with turf
// Turf docs: https://turfjs.org/

import turf from "@turf/turf"; // was added as a dependency in packages.json
import fs from "fs"; // included with nodeJS
import sites from "../data/sites.json" assert { type: "json" };
import neighborhoods from "../data/neighborhoods.json" assert { type: "json" };



// turf aggregation method - collect: https://turfjs.org/docs/#collect
    // collect requires a "property"
    // our data does not have any properties so we need to do some data manipulation first with js (not turf)
    // we'll loop through each feature of our feature collection and add the property attribute with a count of 1 (each feature represents a site)
    // then we'll be sum this counts to some polygon space (like a neighborhood)
sites.features.forEach(function(feature) {
    feature.properties = {
        count: 1
    };

});


let output = turf.collect(neighborhoods, sites, "count", "count")

console.log(output.features[0]) // We can see here that the counts are literally aggregated into an array (i.e. it doesn't sum the counts)
// However the length of the array is our sum -- so we can do a little extra data manipulation on the output argument of collect 

output.features = output.features.filter(function(feature, index) {
    feature.id = index; //the neighborhoods data was missing a unique identifier so here we assign
    feature.properties.count = feature.properties.count.length; // this updates the count to the sum via the length (see above)
    return feature.properties.count > 0; // this is required for the filter function 
});

console.log(output.features[0]) //looks good!

// Now we need to write our output to a file
    // First we need to convert the output from an object to a string
output = JSON.stringify(output, null, "\t")

    // Then we can write it out to a file
fs.writeFile("../data/output.json", output, function(error) {
    if (error) throw error;
    console.log("file written with success. 👍");
});