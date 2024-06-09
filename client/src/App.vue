<script setup>
import LoginPage from './views/LoginPage.vue';
import { RouterLink, RouterView } from 'vue-router'
import { mapGetters } from 'vuex'
</script>

<template>

  <RouterView></RouterView>

</template>
<script>
export default {
  data() {
    return {

    }
  },
  computed: {
    ...mapGetters(
      {
        getUserToken: "GET_USER_TOKEN",
        getCurrentUser: "GET_CURRENT_USER"
      }
    ),
  }
}
</script>

<style scoped></style>