<template>
  <div class="p-8 content">
    <div class="mb-8 row">
      <div class="col-lg-6">
        <breadcrumbs :data="bc" />
      </div>
      <div class="text-right col-lg-6">
        <a-button type="primary" icon="plus" @click="$router.push('/partner/banner/add')">Thêm</a-button>
      </div>
      <div class="col-lg-12">
        <partner-order-items />
      </div>
    </div>
  </div>
</template>

<script lang="ts">
import { Vue, Component } from "vue-property-decorator";
import Breadcrumbs from "@/components/Layout/Breadcrumbs/index.vue";
import PartnerOrderItems from "@/components/Partner/Order/Items/index.vue";

@Component({
  layout: "partner",
  middleware: ['partner-check-auth'],
  components: {
    Breadcrumbs,
    PartnerOrderItems
  }
})
export default class PartnerOrderPage extends Vue {
  head() {    
    return {
      title: this.bc.map(ele => { return ele.title }).join(' » ')
    }
  }
  
  bc: any = [
    {
      title: "Đơn hàng",
      url: "/partner/order",
      active: false
    },
    {
      title: "Tất cả",
      url: "",
      active: true
    }
  ];
}
</script>
