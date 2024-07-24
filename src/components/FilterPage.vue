<template>
  <div>
    <div v-if="loading">Loading...</div>
    <div v-else class="page-container">
      <div class="map-container">
        <FundingMap
          :projects="filteredProjects"
          :selectedCountryCodes="selectedCountryCodes"
          :reset-selection="resetMapSelection"
          @country-selected="onCountrySelected"
        />
      </div>
      <div class="main-layout">
        <div class="filter-container">
          <ProjectFilters
            ref="projectFilters"
            :projects="projects"
            :selectedCountries="selectedCountries"
            @filter="applyFilter"
            @update:selectedCountries="updateSelectedCountries"
            @update:selectedTopic="updateSelectedTopics"
            class="filters"
          />
        </div>
        <div class="projects-container">
          <div v-if="filteredProjects.length === 0" class="no-results-message">
            <p>No projects match your current filter selection.</p>
            <p>Please try adjusting your filters to see more results.</p>
            <v-btn @click="resetFilters" color="primary" class="mt-3">Reset Filters</v-btn>
          </div>
          <div v-else class="projects">
            <div v-for="project in prioritizedProjects" :key="project.id">
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
      prioritizedProjects: [],
      loading: true,
      selectedCountryCodes: [],
      selectedCountries: [],
      resetMapSelection: false,
      recentSelections: {
        countries: [],
        topics: [],
      },
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
          this.prioritizedProjects = [...this.projects];
          this.loading = false;
        })
        .catch(error => {
          console.error('Error fetching data:', error);
          this.loading = false;
        });
    },
    resetCountrySelection() {
      this.selectedCountryCodes = [];
      this.selectedCountries = [];
      this.resetMapSelection = true;
      this.applyFilter();
    },
    updateSelectedCountries(countries) {
      this.selectedCountries = countries;
      this.selectedCountryCodes = this.projects
        .filter(p => countries.includes(p.country))
        .map(p => p.country_code);
      this.recentSelections.countries = countries;
      this.applyFilter();
    },
    updateSelectedTopics(topics) {
      this.recentSelections.topics = topics;
      this.applyFilter();
    },
    onCountrySelected({ countryName }) {
      const countryIndex = this.selectedCountries.indexOf(countryName);
      
      if (countryIndex > -1) {
        // If the country is already selected, remove it
        this.selectedCountries = this.selectedCountries.filter(c => c !== countryName);
      } else {
        // If the country is not selected, add it
        this.selectedCountries = [...this.selectedCountries, countryName];
      }
      
      // Update the ProjectFilters component
      this.$refs.projectFilters.selectedCountry = [...this.selectedCountries];
      
      // Update selectedCountryCodes
      this.selectedCountryCodes = this.projects
        .filter(p => this.selectedCountries.includes(p.country))
        .map(p => p.country_code);
      
      // Update recent selections
      this.recentSelections.countries = [countryName, ...this.recentSelections.countries.filter(c => c !== countryName)];
      
      // Apply the filter to update the project list
      this.applyFilter();
    },
    applyFilter() {
      const filters = this.$refs.projectFilters;
      if (!filters) return;

      const { selectedCountry, selectedTopic } = filters;

      this.filteredProjects = this.projects.filter(p => {
        return (
          (selectedCountry.length === 0 || selectedCountry.includes(p.country)) &&
          (selectedTopic.length === 0 || selectedTopic.includes(p.topic))
        );
      });

      this.prioritizeProjects();
      this.resetMapSelection = false;
    },
    prioritizeProjects() {
      // Create a scoring system based on recent selections
      const getScore = (project) => {
        let score = 0;
        if (this.recentSelections.countries.includes(project.country)) {
          score += this.recentSelections.countries.length - this.recentSelections.countries.indexOf(project.country);
        }
        if (this.recentSelections.topics.includes(project.topic)) {
          score += this.recentSelections.topics.length - this.recentSelections.topics.indexOf(project.topic);
        }
        return score;
      };

      // Sort the filtered projects based on the scoring system
      this.prioritizedProjects = [...this.filteredProjects].sort((a, b) => getScore(b) - getScore(a));
    },
    resetFilters() {
      this.$refs.projectFilters.selectedCountry = [];
      this.$refs.projectFilters.selectedTopic = [];
      this.selectedCountries = [];
      this.selectedCountryCodes = [];
      this.recentSelections = {
        countries: [],
        topics: [],
      };
      this.applyFilter();
    },
  },
  mounted() {
    this.fetchData();
  },
  watch: {
    filteredProjects() {
      this.selectedCountryCodes = [...new Set(this.filteredProjects.map(p => p.country_code))];
      this.prioritizeProjects();
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

.no-results-message {
  text-align: center;
  padding: 20px;
  background-color: #f8f8f8;
  border-radius: 10px;
  margin-top: 20px;
}

.no-results-message p {
  margin-bottom: 10px;
}
</style>
