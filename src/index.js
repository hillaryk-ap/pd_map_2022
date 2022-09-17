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
    const style = map.getStyle();

    style.sources = {
        ...style.sources,
        ...custom.sources
    };
    style.layers.push(...custom.layers);
    map.setStyle(style);
}

// Mapbox requires an access token
mapboxgl.accessToken = settings.accessToken;

// Creates the map instance
map = new mapboxgl.Map(settings);

// Adds an event listener that calls init (callback function) when map "loads" 
map.on("load", init);
