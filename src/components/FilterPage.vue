<template>
  <div>
    <div v-if="loading">Loading...</div>
    <div v-else class="page-container">
      <div class="map-container">
        <FundingMap
          :projects="filteredProjects"
          @select-country="selectCountry"
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
      selectedCountryCodes: [], // Changed to an array to handle multiple selections
      resetMapSelection: false,
    };
  },
  methods: {
    fetchData() {
      fetch('/SDG_2023.json')
        .then(response => response.json())
        .then(data => {
          this.projects = data.projects;
          this.filteredProjects = [...data.projects];
          this.loading = false;
        });
    },
    selectCountry(countryCodes) {
      this.selectedCountryCodes = countryCodes;
      this.applyFilter();
    },
    resetCountrySelection() {
      this.selectedCountryCodes = [];
      this.resetMapSelection = true;
      this.applyFilter();
    },
    applyFilter() {
    const [minBudget, maxBudget] = this.$refs.projectFilters.selectedBudgetRange;
    this.filteredProjects = this.projects.filter(p => {
      const budget = parseFloat(p.budget.replace(/[^0-9.]/g, ''));
      return (
        (this.$refs.projectFilters.selectedContinent.length === 0 || this.$refs.projectFilters.selectedContinent.includes(p.continent)) &&
        (this.$refs.projectFilters.selectedCountry.length === 0 || this.$refs.projectFilters.selectedCountry.includes(p.country)) &&
        (this.$refs.projectFilters.selectedTopic.length === 0 || this.$refs.projectFilters.selectedTopic.includes(p.topic)) &&
        (this.$refs.projectFilters.selectedYear.length === 0 || this.$refs.projectFilters.selectedYear.includes(p.completion_date)) &&
        (budget >= minBudget && budget <= maxBudget) &&
        (this.selectedCountryCodes.length === 0 || this.selectedCountryCodes.includes(p.country_code))
      );
    });
    this.resetMapSelection = false;
  },

  },
  mounted() {
    this.fetchData();
  },
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