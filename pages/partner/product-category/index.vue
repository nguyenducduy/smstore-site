<template>
  <div class="p-6 content">
    <div class="mb-4 row">
      <div class="col-lg-6">
        <breadcrumbs :data="bc" />
      </div>
      <div class="col-lg-6">
        <partner-product-category-add-form />
      </div>
    </div>
    <partner-product-category-items />
  </div>
</template>

<script lang="ts">
import { Vue, Component, Watch } from "vue-property-decorator";
import Breadcrumbs from "@/components/Layout/Breadcrumbs/index.vue";
import PartnerProductCategoryAddForm from "@/components/Partner/Category/AddForm/index.vue";
import PartnerProductCategoryItems from "@/components/Partner/Category/Items/index.vue";

@Component({
  layout: "partner",
  middleware: ['partner-check-auth'],
  components: {
    Breadcrumbs,
    PartnerProductCategoryAddForm,
    PartnerProductCategoryItems
  }
})
export default class PartnerProductCategoryPage extends Vue {
  head() {    
    return {
      title: this.bc.map(ele => { return ele.title }).join(' » ')
    }
  }
  
  bc: any = [
    {
      title: "Danh mục SP",
      url: "/partner/product-category",
      active: false,
      icon: 'fa fa-tags'
    },
    {
      title: "Tất cả",
      url: "",
      active: true
    }
  ];
}
</script>
