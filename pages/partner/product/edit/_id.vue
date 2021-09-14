<template>
  <div class="p-8 pt-12 content">
    <div class="mb-8 row">
      <div class="col-lg-12">
        <breadcrumbs :data="bc" />
      </div>
      <div class="col-lg-12">
        <partner-product-edit-form />
      </div>
    </div>
  </div>
</template>

<script lang="ts">
import { Vue, Component } from "vue-property-decorator";
import Breadcrumbs from "@/components/Layout/Breadcrumbs/index.vue";
import PartnerProductEditForm from "@/components/Partner/Product/EditForm/index.vue";

import fetchProduct from '@/gql/queries/fetchProduct.gql'

@Component({
  layout: "partner",
  middleware: ['partner-check-auth'],
  components: {
    Breadcrumbs,
    PartnerProductEditForm
  }
})
export default class PartnerProductEditPage extends Vue {
  bc: any = [];

  head() {    
    return {
      title: this.bc.map(ele => { return ele.title }).join(' » ')
    }
  }
  
  async mounted() {
    const r = await this.$apollo.query({
      query: fetchProduct,
      variables: {
        id: this.$route.params.id
      }
    });

    if (r['data']) {
      this.bc = [
        {
          title: "Sản phẩm",
          url: "/partner/product",
          active: false
        },
        {
          title: "Sửa: " + r['data']['products_by_pk']['name'],
          url: "",
          active: true
        }
      ];

      if (process.client) {
        window.scrollTo({ top: 0 })
      }
    }
  }
}
</script>
