<template>
  <v-expansion-panels accordion multiple>
    <!-- Continents Filter -->
    <v-expansion-panel hide-actions>
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
    <v-expansion-panel hide-actions>
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
    <v-expansion-panel hide-actions>
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
    <v-expansion-panel hide-actions>
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
      this.isAnyDropdownOpen = true;
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
  },
  mounted() {
    this.updateFilterLists();
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
