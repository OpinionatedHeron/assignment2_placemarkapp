<script lang="ts">
  import "leaflet/dist/leaflet.css";
  import { onMount } from "svelte";
  import type { Control, Map as LeafletMap } from "leaflet";
  import { v4 as uuidv4 } from "uuid";

  let {
    height = 80,
    locations = [],
    categoryLayers = null,
    folderLayers = null,
    mapType = "basic"
  } = $props();

  let id = `map-${uuidv4()}`;
  let location = { lat: 53.2734, lng: -7.7783203 };
  let zoom = 8;
  let minZoom = 7;
  let activeLayer = "Terrain";

  let imap: LeafletMap;
  let control: Control.Layers;
  let overlays: Control.LayersObject = {};
  let baseLayers: any;
  let L: any;

  onMount(async () => {
    const leaflet = await import("leaflet");
    L = leaflet.default;

    baseLayers = {
      Terrain: leaflet.tileLayer("https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png", {
        maxZoom: 17,
        attribution:
          'Map data: &copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors, <a href="http://viewfinderpanoramas.org">SRTM</a> | Map style: &copy; <a href="https://opentopomap.org">OpenTopoMap</a> (<a href="https://creativecommons.org/licenses/by-sa/3.0/">CC-BY-SA</a>)'
      }),
      Satellite: leaflet.tileLayer(
        "https://server.arcgisonline.com/ArcGIS/rest/services/World_Imagery/MapServer/tile/{z}/{y}/{x}",
        {
          attribution:
            "Tiles &copy; Esri &mdash; Source: Esri, i-cubed, USDA, USGS, AEX, GeoEye, Getmapping, Aerogrid, IGN, IGP, UPR-EGP, and the GIS User Community"
        }
      )
    };

    let defaultLayer = baseLayers[activeLayer];
    imap = leaflet.map(id, {
      center: [location.lat, location.lng],
      zoom: zoom,
      minZoom: minZoom,
      layers: [defaultLayer]
    });

    if (mapType === "category" && categoryLayers) {
      createCategoryOverlays(leaflet);
    } else if (mapType === "folder" && folderLayers) {
      createFolderOverlays(leaflet);
    }

    control = leaflet.control.layers(baseLayers, overlays).addTo(imap);
  });

  function createCategoryOverlays(leaflet: any) {
    for (const [categoryName, locations] of Object.entries(categoryLayers)) {
      const layerGroup = leaflet.layerGroup();

      locations.forEach((loc: any) => {
        if (loc.lat && loc.lng) {
          const marker = leaflet.marker([loc.lat, loc.lng]).addTo(layerGroup);
          const popup = leaflet.popup({ autoClose: false, closeOnClick: false});
          popup.setContent(loc.popup || loc.title);
          marker.bindPopup(popup);
        }
      });

      overlays[categoryName] = layerGroup;
    }
  }

  function createFolderOverlays(leaflet: any) {
    for (const [folderName, locations] of Object.entries(folderLayers)) {
      const layerGroup = leaflet.layerGroup();

      locations.forEach((loc: any) => {
        if (loc.lat && loc.lng) {
          const marker = leaflet.marker([loc.lat, loc.lng]).addTo(layerGroup);
          const popup = leaflet.popup({ autoClose: false, closeOnClick: false});
          popup.setContent(loc.popup || loc.title);
          marker.bindPopup(popup);
        }
      });

      overlays[folderName] = layerGroup;
    }
  }

  export async function addMarker(lat: number, lng: number, popupText: string) {
    const leaflet = await import("leaflet");
    L = leaflet.default;
    L.marker([lat, lng]).addTo(imap);
    const marker = L.marker([lat, lng]).addTo(imap);
    const popup = L.popup({ autoClose: false, closeOnClick: false });
    popup.setContent(popupText);
    marker.bindPopup(popup);
  }

  export async function moveTo(lat: number, lng: number) {
    const leaflet = await import("leaflet");
    L = leaflet.default;
    imap.flyTo({ lat: lat, lng: lng });
  }
</script>

<div {id} class="box" style="height: {height}vh"></div>
