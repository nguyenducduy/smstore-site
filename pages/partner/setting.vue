<template>
  <div class="p-8 pt-12 content">
    <div class="mb-8 row">
      <div class="col-lg-12">
        <breadcrumbs :data="bc" />
      </div>
      <div class="col-lg-12">
        <partner-setting-edit-form />
      </div>
    </div>
  </div>
</template>

<script lang="ts">
import { Vue, Component } from "vue-property-decorator";
import Breadcrumbs from "@/components/Layout/Breadcrumbs/index.vue";
import PartnerSettingEditForm from "@/components/Partner/Setting/EditForm/index.vue";

@Component({
  layout: "partner",
  middleware: ['partner-check-auth'],
  components: {
    Breadcrumbs,
    PartnerSettingEditForm
  }
})
export default class PartnerSettingPage extends Vue {
  head() {    
    return {
      title: this.bc.map(ele => { return ele.title }).join(' » ')
    }
  }
  
  bc: any = [
    {
      title: "Cài đặt",
      url: "/partner/setting",
      active: true,
    }
  ];
}
</script>
