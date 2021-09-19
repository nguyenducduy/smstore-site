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
    >Xóa</a-button>
  </a-popconfirm>
</template>

<script lang="ts">
import { Vue, Component, Prop } from "vue-property-decorator";
import deleteProduct from "@/gql/mutations/deleteProduct.gql";

@Component({})
export default class MediaDeleteButton extends Vue {
  @Prop() id: number;

  loading: boolean = false;

  async onDelete() {
    this.loading = true;
    
    try {
      await this.$apollo.mutate({
        mutation: deleteProduct,
        variables: {
          id: this.id
        }
      });

      this.loading = false;
      this.$bus.$emit('products.reload');
      this.$message.success('Xóa SP ID: ' + this.id + ' thành công');
    } catch (error) {
      this.loading = false;
    }
  }
}
</script>