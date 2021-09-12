<template>
  <div class="row">
    <a-form layout="inline" :form="form">
      <div class="col-lg-6">
        <a-form-item>
          <a-input
            type="text"
            placeholder="Tên loại SP"
            @keyup.enter="onSubmit"
            v-decorator="[
              'name',
              {
                rules: [{ required: true, message: 'Vui lòng nhập tên loại SP' }]
              }
            ]"
          >
          </a-input>
        </a-form-item>
        <a-form-item>
          <a-button type="primary" icon="plus" @click="onSubmit">Thêm</a-button>
        </a-form-item>
      </div>
    </a-form>
  </div>
</template>

<script lang="ts">
import { Vue, Component, Prop } from "vue-property-decorator";
import { Getter } from 'vuex-class'

import insertProductType from "@/gql/mutations/insertProductType.gql";

@Component({})
export default class PartnerProductTypeAddButton extends Vue {
  @Getter('users/shopId') shopId

  visible: boolean = false;
  form: any = {};
  loading: boolean = false;

  created() {
    this.form = this.$form.createForm(this);
  }

  onSubmit() {
    this.form.validateFields(async (err, values) => {
      if (!err) {
        this.loading = true;

        try {
          const r = await this.$apollo.mutate({
            mutation: insertProductType,
            variables: {
              object: {
                name: values.name,
                store_id: this.shopId
              }
            }
          });

          this.form.resetFields();
          this.loading = false;
          this.visible = false;

          if (r['data']) {
            this.$message.success(`Loại ${values.name} đã được thêm`);
            this.$bus.$emit('types.reload');
          }
        } catch (error) {
          this.loading = false;
        }
      }
    });
  }
}
</script>