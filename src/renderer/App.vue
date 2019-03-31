<template>
  <v-app>
    <div>
      <router-link to="/">Upload</router-link>&nbsp;|
      <router-link to="/cam">Camera</router-link>
    </div>
    <v-content>
      <router-view></router-view>
    </v-content>
  </v-app>
</template>

<script>
export default {
  name: "App"
};
</script>

<style>
/* CSS */
</style>
