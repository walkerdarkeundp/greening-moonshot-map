<template>
  <v-app>
    <v-main>
      <router-view></router-view> <!-- Use router-view to render components based on route -->
    </v-main>
  </v-app>
</template>

<script>
export default {
  name: 'App',
  data: () => ({
    //
  }),
}
</script>
