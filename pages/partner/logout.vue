<template>
  <div>
    Logout ...
  </div>
</template>

<script lang="ts">
import { Vue, Component } from "nuxt-property-decorator";

@Component({
  head() {
    return {
      title: 'Đăng xuất'
    };
  }
})
export default class LogoutPage extends Vue {
  async mounted() {
    try {
      Vue.ls.remove('token');
      this.$cookiz.remove('token');
      this.$apolloHelpers.onLogout();

      return (window.location.href = `
          ${window.location.protocol}//${window.location.hostname +
        (window.location.port ? ":" + window.location.port : "")}/partner/login`);

    } catch (error) {
    }
  }
}
</script>