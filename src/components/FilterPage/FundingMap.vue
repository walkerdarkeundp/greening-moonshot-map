<template>
  <div class="map-and-disclaimer-container">
    <div class="map-container">
      <l-map :zoom="2" :center="[51.505, -0.09]" style="height: 400px" ref="mapRef">
        <l-tile-layer :url="arcgisTileUrl"></l-tile-layer>
      </l-map>
    </div>
    <div class="map-disclaimer">
      The designations employed and the presentation of material on this map do not imply the expression of any opinion whatsoever on the part of the Secretariat of the United Nations or UNDP concerning the legal status of any country, territory, city or area or its authorities, or concerning the delimitation of its frontiers or boundaries.
      References to Kosovo* shall be understood to be in the context of UN Security Council resolution 1244 (1999).
    </div>
  </div>
</template>

<script>
import { ref, watch, onMounted, onUnmounted, defineComponent } from 'vue';
import { LMap, LTileLayer } from 'vue3-leaflet';
import L from 'leaflet';

export default defineComponent({
  components: {
    LMap,
    LTileLayer,
  },
  props: {
    resetSelection: Boolean,
    projects: Array,
    selectedCountryCodes: Array,
  },
  emits: ['country-selected'],
  setup(props, { emit }) {
    const mapRef = ref(null);
    const arcgisTileUrl = 'https://geoservices.un.org/arcgis/rest/services/ClearMap_WebTopo/MapServer/tile/{z}/{y}/{x}?blankTile=false';
    let geoLayer = null;
    let countryFunding = {};
    let countriesWithProjects = new Set();

    const getColor = (funding) => {
      const maxFunding = Math.max(...Object.values(countryFunding));
      const ratio = funding / maxFunding;
      const lightness = 60 - (5 * ratio);
      return `hsl(0, 0%, ${lightness}%)`;
    };


    let popup = L.popup();

    function pointInPolygon(latlng, layer) {
      // Handles both MultiPolygon and Polygon
      const lat = latlng.lat;
      const lng = latlng.lng;
      const latlngs = layer.getLatLngs();
      // latlngs can be [ [ [latlng, ...], ... ] ] for MultiPolygon or [ [latlng, ...] ] for Polygon
      function inside(poly) {
        let inside = false;
        for (let i = 0, j = poly.length - 1; i < poly.length; j = i++) {
          const xi = poly[i].lat, yi = poly[i].lng;
          const xj = poly[j].lat, yj = poly[j].lng;
          const intersect = ((yi > lng) !== (yj > lng)) && (lat < (xj - xi) * (lng - yi) / (yj - yi + 0.0000001) + xi);
          if (intersect) inside = !inside;
        }
        return inside;
      }
      if (Array.isArray(latlngs[0][0])) {
        // MultiPolygon
        return latlngs.some(polyGroup => polyGroup.some(poly => inside(poly)));
      } else {
        // Polygon
        return latlngs.some(poly => inside(poly));
      }
    }

    function onMapClick(e) {
      if (!mapRef.value || !mapRef.value.$data || !mapRef.value.$data.map) {
        console.error("Map container is not yet available");
        return;
      }
     // const leafletMap = mapRef.value.$data.map;
      const latlng = e.latlng;
      let clickedCountry = null;

      geoLayer.eachLayer((layer) => {
        // Use point-in-polygon instead of bounds
        if (pointInPolygon(latlng, layer)) {
          const countryCode = layer.feature.properties.ISO_A2;
          const countryName = layer.feature.properties.ADMIN;
          const countryContinent = layer.feature.properties.CONTINENT;
          console.log('Clicked country:', countryCode, countryName, countryContinent);
          clickedCountry = { countryCode, countryName, countryContinent };
        }
      });
      const clickedProject = clickedCountry ? props.projects.find(project => project.country === clickedCountry.countryName) : null;

  popup
    .setLatLng(latlng)
    .setContent(
      clickedCountry
        ? `Region: ${clickedProject ? clickedProject.region : clickedCountry.countryContinent} <br>
        Country: ${clickedCountry.countryName}`
        : `You clicked the map at ${latlng.toString()}`
    )
    .openOn(mapRef.value.$data.map);
}


    const onCountryClick = (e) => {
      const layer = e.target;
      const countryCode = layer.feature.properties.ISO_A2;
      if (countriesWithProjects.has(countryCode)) {
        const countryName = layer.feature.properties.ADMIN;
        emit('country-selected', { countryCode, countryName });
      }
    };

    const updateCountryStyle = (layer, countryCode) => {
      if (props.selectedCountryCodes.includes(countryCode)) {
        layer.setStyle({
          fillColor: 'green',
          weight: 1,
          opacity: 1,
          fillOpacity: 0.6,
        });
      } else {
        layer.setStyle({
          fillColor: getColor(countryFunding[countryCode] || 0),
          weight: 0,
          opacity: 0,
          fillOpacity: countriesWithProjects.has(countryCode) ? 0.6 : 0,
        });
      }
    };

    const clearSelection = () => {
      if (geoLayer) {
        geoLayer.eachLayer((layer) => {
          const countryCode = layer.feature.properties.ISO_A2;
          updateCountryStyle(layer, countryCode);
        });
      }
    };

    onMounted(async () => {
      if (!mapRef.value || !mapRef.value.$data || !mapRef.value.$data.map) {
        console.error("Map container is not yet available");
        return;
      }
      const leafletMap = mapRef.value.$data.map;

      // Process project data
      countryFunding = {};
      props.projects.forEach(project => {
        const countryCode = project.country_code;
        countryFunding[countryCode] = (countryFunding[countryCode] || 0) + 1;
        countriesWithProjects.add(countryCode);
      });

      const geoResponse = await fetch('countries.json');
      const geoData = await geoResponse.json();
      
      geoLayer = L.geoJSON(geoData, {
        style: feature => {
          const countryCode = feature.properties.ISO_A2;
          const funding = countryFunding[countryCode] || 0;
          return {
            fillColor: getColor(funding),
            weight: 0,
            opacity: 0,
            fillOpacity: countriesWithProjects.has(countryCode) ? 0.6 : 0,
          };
        },
        onEachFeature: (feature, layer) => {
          const countryCode = feature.properties.ISO_A2;
          if (countriesWithProjects.has(countryCode)) {
            layer.on({
              click: (e) => {
                onCountryClick(e);
                onMapClick(e, layer)
              }
            });
          }
        }
      }).addTo(leafletMap);

      clearSelection();
    });

    watch(() => props.selectedCountryCodes, () => {
      clearSelection();
    });

    watch(() => props.resetSelection, (newValue) => {
      if (newValue) {
        clearSelection();
      }
    });

    onUnmounted(() => {
      if (mapRef.value && mapRef.value.$data && mapRef.value.$data.map) {
        mapRef.value.$data.map.removeLayer(geoLayer);
      }
    });

    return { mapRef, arcgisTileUrl };
  },
});
</script>

<style scoped>
  .map-container {
    height: 600px;
    position: relative;
  }

  .map-disclaimer {
    padding-top: 10px;
    padding-bottom: 20px;
    text-align: left;
    font-size: 0.8em;
  }
</style>
