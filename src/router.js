import { createRouter, createWebHistory } from 'vue-router'
import FilterPage from '@/components/FilterPage.vue';

const routes = [
  { path: '/', component: FilterPage }, // Set the filter page as the root path
]

const router = createRouter({
  history: createWebHistory(),
  routes
})

export default router;
