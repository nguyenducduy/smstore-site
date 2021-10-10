<template>
  <div class="p-8 pt-12 content">
    <div class="mb-8 row">
      <div class="col-lg-12">
        <breadcrumbs :data="bc" />
      </div>
      <div class="col-lg-12">
        <partner-banner-edit-form />
      </div>
    </div>
  </div>
</template>

<script lang="ts">
import { Vue, Component } from "vue-property-decorator";
import Breadcrumbs from "@/components/Layout/Breadcrumbs/index.vue";
import PartnerBannerEditForm from "@/components/Partner/Banner/EditForm/index.vue";

import fetchBanner from '@/gql/queries/fetchBanner.gql'

@Component({
  layout: "partner",
  middleware: ['partner-check-auth'],
  components: {
    Breadcrumbs,
    PartnerBannerEditForm
  }
})
export default class PartnerBannerEditPage extends Vue {
  bc: any = [];

  head() {    
    return {
      title: this.bc.map(ele => { return ele.title }).join(' » ')
    }
  }
  
  async mounted() {
    const r = await this.$apollo.query({
      query: fetchBanner,
      variables: {
        id: this.$route.params.id
      }
    });

    if (r['data']) {
      this.bc = [
        {
          title: "Banner",
          url: "/partner/banner",
          active: false,
          sub: [
            { icon: 'plus', name: 'Thêm', url: '/partner/banner/add' },
          ]
        },
        {
          title: "Sửa banner ID: " + r['data']['banners_by_pk']['id'],
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
