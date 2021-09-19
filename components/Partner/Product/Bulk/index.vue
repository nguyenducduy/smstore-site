<template>
  <div>
    <a-dropdown :disabled="!selectedItems.length > 0" :trigger="['click']">
      <a-menu slot="overlay" @click="onOpenConfirmModal">
        <a-menu-item v-for="item in actions" :key="item.action">
          {{ item.label }}
        </a-menu-item>
      </a-menu>
      <a-button>
        Thực thi
        <a-icon type="down" />
      </a-button>
    </a-dropdown>
    <a-modal
      centered
      v-model="confirmVisible"
      ok-text="OK"
      cancel-text="Cancel"
      @ok="onSubmitBulk"
      v-if="action !== ''"
      :confirm-loading="loading"
    >
      <template slot="title">
        <a-icon type="warning" class="m-r-5" />Bạn có chắc muốn 
        <strong>
          {{ actions.filter(item => item["action"] === action)[0]["label"] }}
        </strong> những chương trình có ID sau?
      </template>
      <ul style="list-style: circle;">
        <li v-for="id in selectedItems" :key="id">{{ id }}</li>
      </ul>
    </a-modal>
  </div>
</template>

<script lang="ts">
import { Vue, Component, Prop } from "vue-property-decorator";
import updateFieldProduct from "@/gql/mutations/updateFieldProduct.gql";
import deleteProduct from "@/gql/mutations/deleteProduct.gql";

@Component({})
export default class MediaSubmitBulk extends Vue {
  @Prop() actions: any;
  @Prop() selectedItems: any;
  @Prop() displaySelectedField;

  action: string = "";
  confirmVisible: boolean = false;
  loading: boolean = false;

  onOpenConfirmModal(e) {
    this.action = e.key;
    if (this.selectedItems.length === 0) {
      this.$message.info("Please select item!");
      return;
    }

    // if (e.key === 'edit') {
    //   return this.$router.push('/admin/media/bulkupdate?id=' + this.selectedItems.join(','))
    // }
    
    this.confirmVisible = true;
  }

  async onSubmitBulk() {
    this.loading = true;

    this.selectedItems.map(async id => {
      if (this.action != 'delete') {
        let fields = {};

        if (this.action == 'inactive') {
          fields = { "is_active": false }
        }
        
        if (this.action == 'active') {
          fields = { "is_active": true }
        }

        const r = await this.$apollo.mutate({
          mutation: updateFieldProduct,
          variables: {
            id: id,
            fields: fields
          }
        });

        if (r['data'] && r['data']['update_products']['affected_rows'] > 0) {
          this.$message.success('Cập nhật trạng thái ' + this.action + ' cho ID: ' + id + ' thành công');
          this.$bus.$emit('products.reload');
        }
      } else {
        const r = await this.$apollo.mutate({
          mutation: deleteProduct,
          variables: {
            id: id
          }
        });

        if (r['data'] && r['data']['delete_products']['affected_rows'] > 0) {
          this.$message.success('Xóa ID: ' + id + ' thành công');
          this.$bus.$emit('products.reload');
        }
      }
    });

    this.loading = false;
    this.confirmVisible = false;
  }
}
</script>
