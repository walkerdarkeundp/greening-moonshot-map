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
import { ref, watch, onMounted, defineComponent } from 'vue';
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

    const onCountryClick = (e) => {
      const layer = e.target;
      const countryCode = layer.feature.properties.ISO_A2;
      if (countriesWithProjects.has(countryCode)) {
        const countryName = layer.feature.properties.ADMIN;
        emit('country-selected', { countryCode, countryName });
      }
    };

    onMounted(async () => {
      if (!mapRef.value) {
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
              click: onCountryClick
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
