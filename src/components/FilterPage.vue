<template>
  <div>
    <div v-if="loading">Loading...</div>
    <div v-else class="page-container">
      <div class="map-container">
        <FundingMap
          :projects="filteredProjects"
          :selectedCountryCodes="selectedCountryCodes"
          :reset-selection="resetMapSelection"
        />
      </div>
      <div class="main-layout">
        <div class="filter-container">
          <ProjectFilters
            ref="projectFilters"
            :projects="projects"
            @filter="applyFilter"
            @continent-or-country-changed="resetCountrySelection"
            class="filters"
          />
        </div>
        <div class="projects-container">
          <div class="projects">
            <div v-for="project in filteredProjects" :key="project.id">
              <ProjectCard :project="project" />
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import ProjectFilters from './FilterPage/ProjectFilters';
import ProjectCard from './FilterPage/ProjectCard.vue';
import FundingMap from './FilterPage/FundingMap.vue';
import 'leaflet/dist/leaflet.css';

export default {
  components: {
    ProjectFilters,
    ProjectCard,
    FundingMap,
  },
  data() {
    return {
      projects: [],
      filteredProjects: [],
      loading: true,
      selectedCountryCodes: [],
      resetMapSelection: false,
    };
  },
  methods: {
    fetchData() {
      fetch(`${process.env.BASE_URL}SDG_2023.json`)
        .then(response => {
          if (!response.ok) {
            throw new Error('Network response was not ok');
          }
          return response.json();
        })
        .then(data => {
          this.projects = data.projects;
          this.filteredProjects = [...this.projects];
          this.loading = false;
        })
        .catch(error => {
          console.error('Error fetching data:', error);
          this.loading = false;
        });
    },
    resetCountrySelection() {
      this.selectedCountryCodes = [];
      this.resetMapSelection = true;
      this.applyFilter();
    },
    applyFilter() {
      const filters = this.$refs.projectFilters;
      if (!filters) return;

      const { selectedContinent, selectedCountry, selectedTopic, selectedYear } = filters;
      
      this.filteredProjects = this.projects.filter(p => {
        return (
          (selectedContinent.length === 0 || selectedContinent.includes(p.continent)) &&
          (selectedCountry.length === 0 || selectedCountry.includes(p.country)) &&
          (selectedTopic.length === 0 || selectedTopic.includes(p.topic)) &&
          (selectedYear.length === 0 || selectedYear.includes(p.completion_date))
        );
      });
      this.updateSelectedCountryCodes();
      this.resetMapSelection = false;
    },
    updateSelectedCountryCodes() {
      this.selectedCountryCodes = [...new Set(this.filteredProjects.map(p => p.country_code))];
    }
  },
  mounted() {
    this.fetchData();
  },
  watch: {
    filteredProjects() {
      this.updateSelectedCountryCodes();
    }
  }
};
</script>



<style scoped>
.page-container {
  padding: 40px;
}

.map-container {
  width: 100%;
  border-radius: 20px;
}

.main-layout {
  display: flex;
  background-color: white;
  border-radius: 20px;
}

.filter-container {
  flex-basis: 25%;
  padding: 20px 20px 20px 0px;
  border-radius: 20px;
  position: sticky;
  top: 0;
  height: calc(100vh - 60px);
  overflow-y: auto;
}

.projects-container {
  flex-basis: 75%;
  padding: 20px 0px 20px 0px;
  border-radius: 20px;
}
</style>
