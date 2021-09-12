<template>
  <div class="row">
    <div class="col-lg-6">
      <!-- <a style="margin-right: 10px; margin-left: 20px;" href="" target="_blank">Go to site <i class="fa fa-arrow-right"></i></a> -->
    </div>
    <div class="col-lg-6">
      <div :class="$style.topbar">
        <!-- <profile-menu /> -->
      </div>
    </div>
  </div>
</template>

<script lang="ts">
import { Vue, Component } from "nuxt-property-decorator";
// import ProfileMenu from "@/components/Layout/Partner/Topbar/ProfileMenu/index.vue";

@Component({
  name: "topbar",
  components: {
    // ProfileMenu,
  }
})
export default class Topbar extends Vue {}
</script>

<style lang="scss" module>
@import "./style.module.scss";
</style>
