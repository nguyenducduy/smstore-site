<template>
  <a-popconfirm
    okText="Đồng ý"
    cancelText="Hủy"
    placement="left"
    @confirm="onDelete"
    width="100px"
  >
    <template slot="title">
      Bạn đã chắc?
    </template>
    <a-button
      :loading="loading"
      icon="delete"
      type="danger"
    >Xóa loại</a-button>
  </a-popconfirm>
</template>

<script lang="ts">
import { Vue, Component, Prop } from "vue-property-decorator";
import deleteProductType from "@/gql/mutations/deleteProductType.gql";

@Component({})
export default class ProductTypeDeleteButton extends Vue {
  @Prop() id: number;

  loading: boolean = false;

  async onDelete() {
    this.loading = true;
    
    try {
      await this.$apollo.mutate({
        mutation: deleteProductType,
        variables: {
          id: this.id
        }
      });

      this.loading = false;
      this.$bus.$emit('types.reload');
      this.$message.success('Xóa ID: ' + this.id + ' thành công');
    } catch (error) {
      this.loading = false;
    }
  }
}
</script>