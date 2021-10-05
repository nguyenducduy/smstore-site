<template>
  <div class="p-8 content">
    <div class="mb-4 row">
      <div class="col-lg-12">
        <breadcrumbs :data="bc" />
      </div>
      <div class="col-lg-12">
        <partner-product-type-add-button class="mt-4 mb-4" />
        <partner-product-attribute-items />
      </div>
    </div>
    <partner-product-attribute-add-form />
  </div>
</template>

<script lang="ts">
import { Vue, Component } from "vue-property-decorator";
import Breadcrumbs from "@/components/Layout/Breadcrumbs/index.vue";
import PartnerProductTypeAddButton from "@/components/Partner/Type/AddButton/index.vue";
import PartnerProductAttributeAddForm from "@/components/Partner/Attribute/AddForm/index.vue";
import PartnerProductAttributeItems from "@/components/Partner/Attribute/Items/index.vue";

@Component({
  layout: "partner",
  middleware: ['partner-check-auth'],
  components: {
    Breadcrumbs,
    PartnerProductTypeAddButton,
    PartnerProductAttributeAddForm,
    PartnerProductAttributeItems
  }
})
export default class PartnerProductAttributePage extends Vue {
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
      sub: [
        { icon: 'plus', name: 'Thêm', url: '/partner/product/add' }
      ]
    },
    {
      title: "Thuộc tính & loại SP",
      url: "",
      active: true,
    },
  ];
}
</script>
