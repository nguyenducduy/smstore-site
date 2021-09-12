<template>
  <div class="p-8 pt-12 content">
    <div class="mb-8 row">
      <div class="col-lg-12">
        <breadcrumbs :data="bc" />
      </div>
      <div class="col-lg-12">
        <partner-product-add-form />
      </div>
    </div>
  </div>
</template>

<script lang="ts">
import { Vue, Component } from "vue-property-decorator";
import Breadcrumbs from "@/components/Layout/Breadcrumbs/index.vue";
import PartnerProductAddForm from "@/components/Partner/Product/AddForm/index.vue";

@Component({
  layout: "partner",
  middleware: ['partner-check-auth'],
  components: {
    Breadcrumbs,
    PartnerProductAddForm
  }
})
export default class PartnerProductAddPage extends Vue {
  head() {    
    return {
      title: this.bc.map(ele => { return ele.title }).join(' » ')
    }
  }
  
  bc: any = [
    {
      title: "Sản phẩm",
      url: "/partner/product",
      active: false,
      icon: 'fa fa-dot-circle-o'
    },
    {
      title: "Thêm",
      url: "",
      active: true
    }
  ];
}
</script>
