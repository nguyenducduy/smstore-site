<template>
  <div class="content">
    <div class="row">
      <div class="col-lg-6"></div>
    </div>
  </div>
</template>

<script lang="ts">
import { Vue, Component, Watch } from "nuxt-property-decorator";
import Breadcrumbs from "@/components/Layout/Breadcrumbs/index.vue";

@Component({
  name: 'partner-dashboard-page',
  layout: 'partner',
  components: {
    Breadcrumbs
  }
})
export default class PartnerDashboardPage extends Vue {
  head() {    
    return {
      title: this.bc.map(ele => { return ele.title }).join(' » ')
    }
  }
  
  bc: any = [
    {
      title: "Tổng quan",
      url: "",
      active: true
    }
  ];

}
</script>

<style lang="scss" scoped>

</style>
