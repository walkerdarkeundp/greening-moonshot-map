<template>
  <v-expansion-panels accordion multiple>
    <!-- Continents Filter -->
    <v-expansion-panel>
      <v-select
        v-model="selectedContinent"
        :items="continentList"
        label="Continents"
        multiple
        @focus="isAnyDropdownOpen = true"
        @blur="isAnyDropdownOpen = false"
        @change="keepDropdownOpen"
      ></v-select>
    </v-expansion-panel>
    <!-- Countries Filter -->
    <v-expansion-panel>
      <v-select
        v-model="selectedCountry"
        :items="filteredCountryList"
        label="Countries"
        multiple
        @focus="isAnyDropdownOpen = true"
        @blur="isAnyDropdownOpen = false"
        @change="keepDropdownOpen"
      ></v-select>
    </v-expansion-panel>
    <!-- Topic Filter -->
    <v-expansion-panel>
      <v-select
        v-model="selectedTopic"
        :items="topicList"
        label="Topics"
        multiple
        @focus="isAnyDropdownOpen = true"
        @blur="isAnyDropdownOpen = false"
        @change="keepDropdownOpen"
      ></v-select>
    </v-expansion-panel>
    <!-- Year Filter -->
    <v-expansion-panel>
      <v-select
        v-model="selectedYear"
        :items="yearList"
        label="Years"
        multiple
        @focus="isAnyDropdownOpen = true"
        @blur="isAnyDropdownOpen = false"
        @change="keepDropdownOpen"
      ></v-select>
    </v-expansion-panel>
    <!-- Budget Filter -->
    <v-expansion-panel>
      <v-range-slider
        :disabled="isAnyDropdownOpen"
        v-model="selectedBudgetRange"
        :max="maxBudget"
        :min="0"
        step="5000"
        label="Budget"
        thumb-label="always"
      ></v-range-slider>
    </v-expansion-panel>
  </v-expansion-panels>
</template>

<script>
export default {
  props: ['projects'],
  data() {
    return {
      selectedContinent: [],
      selectedCountry: [],
      selectedTopic: [],
      selectedYear: [],
      selectedBudgetRange: [0, 1000000],
      maxBudget: 1000000,
      continentList: [],
      countryList: [],
      topicList: [],
      yearList: [],
      isAnyDropdownOpen: false,
    };
  },
  computed: {
    filteredCountryList() {
      return this.selectedContinent.length === 0
        ? this.countryList
        : [...new Set(this.projects.filter(project => this.selectedContinent.includes(project.continent)).map(project => project.country))];
    },
  },
  methods: {
    keepDropdownOpen() {
      // This method is intentionally left to maintain dropdown state; adjust as needed.
      this.isAnyDropdownOpen = true;
      // Implement logic here if you need the dropdown to stay open after selection.
    },
    closeAllDropdowns() {
      this.isAnyDropdownOpen = false;
    },
    updateFilterLists() {
      this.continentList = [...new Set(this.projects.map(project => project.continent))];
      this.countryList = [...new Set(this.projects.map(project => project.country))];
      this.topicList = [...new Set(this.projects.map(project => project.topic))];
      this.yearList = [...new Set(this.projects.map(project => project.completion_date))];
    },
    updateMaxBudget() {
      this.maxBudget = Math.max(...this.projects.map(project => parseFloat(project.budget.replace(/[^0-9.]/g, ''))), 0);
      this.selectedBudgetRange = [0, this.maxBudget];
    },
    filterProjects() {
      this.$emit('filter');
    },
  },
  watch: {
    projects: {
      immediate: true,
      handler(newVal) {
        if (newVal && newVal.length) {
          this.updateFilterLists();
          this.updateMaxBudget();
        }
      }
    },
    selectedContinent() {
      this.filterProjects();
    },
    selectedCountry() {
      this.filterProjects();
    },
    selectedTopic() {
      this.filterProjects();
    },
    selectedYear() {
      this.filterProjects();
    },
    selectedBudgetRange() {
      this.filterProjects();
    },
  },
  mounted() {
    this.updateFilterLists();
    this.updateMaxBudget();
  },
};
</script>

<style scoped>
.filter {
  padding: 10px;
  border-radius: 10px;
  margin-bottom: 10px;
}
</style>
