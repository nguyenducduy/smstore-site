<template>
  <div class="row">
    <div class="col-lg-6">
      <div class="z-50 ml-4 col-lg-6">
        <search-bar />
      </div>
    </div>
    <div class="col-lg-6">
      <div :class="$style.topbar">
        <profile-menu class="mr-8" />
        <span v-if="loggedShop">
          <a target="_blank" :href="`https://${loggedShop.domain}.tiemcuatui.com`">
            {{ loggedShop.domain }}.tiemcuatui.com
          </a>
           &nbsp; | &nbsp;
        </span>
      </div>
    </div>
  </div>
</template>

<script lang="ts">
import { Vue, Component } from "nuxt-property-decorator";
import { Getter } from 'vuex-class'
import ProfileMenu from "@/components/Layout/Partner/Topbar/ProfileMenu/index.vue";
import SearchBar from '@/components/Layout/Partner/Topbar/SearchBar/index.vue'

@Component({
  name: "topbar",
  components: {
    ProfileMenu,
    SearchBar
  }
})
export default class Topbar extends Vue {
  @Getter('users/loggedShop') loggedShop
}
</script>

<style lang="scss" module>
@import "./style.module.scss";
</style>
