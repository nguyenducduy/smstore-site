<template>
  <a-popconfirm
    title="Bạn đã chắc?"
    okText="Đồng ý"
    cancelText="Hủy"
    placement="left"
    @confirm="onDelete"
  >
    <a-button
      :loading="loading"
      icon="delete"
      type="link"
      style="color: #ff0074c4"
    ></a-button>
  </a-popconfirm>
</template>

<script lang="ts">
import { Vue, Component, Prop } from "vue-property-decorator";
import { Getter } from 'vuex-class'
import deleteBanner from "@/gql/mutations/deleteBanner.gql";

@Component({})
export default class BannerDeleteButton extends Vue {
  @Getter('users/shopId') shopId
  @Prop() id: number;
  @Prop() imagePath: string;

  loading: boolean = false;

  async onDelete() {
    this.loading = true;
    
    try {
      await this.$apollo.mutate({
        mutation: deleteBanner,
        variables: {
          id: this.id
        }
      });
      
      await this.$axios.post(
        `${this.$config.NUXT_ENV_STORAGE_ENDPOINT}/banners/delete`,
        {
          id: this.shopId,
          path: this.imagePath
        }
      )

      this.loading = false;
      this.$bus.$emit('banners.reload');
      this.$message.success('Xóa banner ID: ' + this.id + ' thành công');
    } catch (error) {
      this.loading = false;
    }
  }
}
</script>