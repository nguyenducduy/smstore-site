<template>
  <a-layout>
    <a-layout-sider theme="light" v-model="collapsed" collapsible>
      <menu-left />
    </a-layout-sider>
    <a-layout>
      <a-layout-header>
        <topbar />
      </a-layout-header>
      <a-layout-content>
        <Nuxt :key="$route.fullPath" />
      </a-layout-content>
      <a-layout-footer>
        <a-back-top />
        <partner-footer />
      </a-layout-footer>
    </a-layout>
    <!-- <change-password-modal /> -->
  </a-layout>
</template>

<script lang="ts">
import { Vue, Component } from 'nuxt-property-decorator'
import MenuLeft from '@/components/Layout/Partner/MenuLeft/index.vue'
import Topbar from '@/components/Layout/Partner/Topbar/index.vue'
import PartnerFooter from '@/components/Layout/Partner/Footer/index.vue'

@Component({
  components: {
    MenuLeft,
    Topbar,
    PartnerFooter,
    // ChangePasswordModal
  }
})
export default class PartnerLayout extends Vue {
  collapsed: boolean = true

  mounted() {
    if (process.client) {
      window.scrollTo({ top: 0 })
    }
  }
}
</script>

<style lang="scss">
@import "./style.partner.scss";
</style>
