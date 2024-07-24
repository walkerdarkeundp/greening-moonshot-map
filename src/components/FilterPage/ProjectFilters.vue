<template>
  <v-expansion-panels accordion multiple>
    <!-- Countries Filter -->
    <v-expansion-panel hide-actions>
      <v-select
        v-model="selectedCountry"
        :items="sortedCountryList"
        label="Countries"
        multiple
        @focus="isAnyDropdownOpen = true"
        @blur="isAnyDropdownOpen = false"
        @change="onCountryChange"
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
        @change="onTopicChange"
      ></v-select>
    </v-expansion-panel>
  </v-expansion-panels>
</template>

<script>
export default {
  props: ['projects', 'selectedCountries'],
  data() {
    return {
      selectedTopic: [],
      countryList: [],
      topicList: [],
      isAnyDropdownOpen: false,
    };
  },
  computed: {
    selectedCountry: {
      get() {
        return this.selectedCountries;
      },
      set(value) {
        this.$emit('update:selectedCountries', value);
      }
    },
    sortedCountryList() {
      return [...this.countryList].sort((a, b) => a.localeCompare(b));
    }
  },
  methods: {
    keepDropdownOpen() {
      this.isAnyDropdownOpen = true;
    },
    closeAllDropdowns() {
      this.isAnyDropdownOpen = false;
    },
    updateFilterLists() {
      this.countryList = [...new Set(this.projects.map(project => project.country))];
      this.topicList = [...new Set(this.projects.map(project => project.topic))];
    },
    filterProjects() {
      this.$emit('filter');
    },
    onCountryChange(value) {
      this.keepDropdownOpen();
      this.$emit('update:selectedCountries', value);
    },
    onTopicChange(value) {
      this.keepDropdownOpen();
      this.$emit('update:selectedTopic', value);
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
    selectedCountry() {
      this.filterProjects();
    },
    selectedTopic() {
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
