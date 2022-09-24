import "./styles.css";
import "mapbox-gl/dist/mapbox-gl.css";
import * as mapboxgl from "mapbox-gl"; 
import settings from "./settings.json";
import custom from "./custom-style.json";

// creates map variable
let map;

// gets the map style and appends onto map style the custom sources and layers (custom-style.json) and sets the styles
// FYI: custom sources are the actual data and custom layers are how the data is visualized
// Reference: https://docs.mapbox.com/mapbox-gl-js/api/map/

async function init() {
    // This is where we load the site data
    //const sites = await import("../data/sites.json"); // remove because we don't need to store the excess data after geospatial processing (see process.mjs)
        // also means we remove sites from custom-style.json:
        // "sites" : {
        //    "type": "geojson",
        //    "data": {
        //        "type": "FeatureCollection",
        //        "features": []
        //    }
        //},
    const neighborhoods = await import("../data/output.json"); // switched out from neighborhoods.json after apply geospatial processing (see process.mjs)
    const style = map.getStyle();

    // These sources and layer styles are defined in the custom-style.json file
    // Sources are data pulled in the map: for this course we are using geojson data is from historicplacesla.org
        // MapBox geojson source documentation: https://docs.mapbox.com/mapbox-gl-js/style-spec/sources/#geojson
        // We add an empty features array for the site.geojson source that will get populated later with JS
    // Layers determine how sources are visualized
    style.sources = {
        ...style.sources,
        ...custom.sources
    };

    // Layers doc: https://docs.mapbox.com/mapbox-gl-js/style-spec/layers/
    // For point data we'll use circle layer type: https://docs.mapbox.com/mapbox-gl-js/style-spec/layers/#circle
    // All layers have layout properties and paint properties
        // layout properties should all be grouped together (same for paint)
    style.layers.push(...custom.layers);
    map.setStyle(style);

    // Add data to the source: https://docs.mapbox.com/mapbox-gl-js/api/map/#map#getsource see getSource()
        // geojson source doc: https://docs.mapbox.com/mapbox-gl-js/api/sources/#geojsonsource see setData()
    //map.getSource("sites").setData(sites); // remove because we don't need to store the excess data after geospatial processing (see process.mjs)
    map.getSource("neighborhoods").setData(neighborhoods);

}

// Mapbox requires an access token
mapboxgl.accessToken = settings.accessToken;
// Creates the map instance
map = new mapboxgl.Map(settings);
// Adds an event listener that calls init (callback function) when map "loads" 
map.on("load", init);





// Other notes
// mapbox expressions doc: https://docs.mapbox.com/mapbox-gl-js/style-spec/expressions/ - for custom-syle.json
    // create color ramp with step function
    // nest a get expression to get the count 
    // we'll use stop values (have an output) to apply the color