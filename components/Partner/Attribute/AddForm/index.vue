<template>
  <a-modal
    :visible="visible"
    :title="`Thêm thuộc tính cho loại ${typeName}`"
    okText="Thêm"
    cancelText="Hủy"
    @cancel="visible = false"
    @ok="onSubmit"
    width="350px"
  >
    <a-form layout="vertical" :form="form">
      <a-form-item
        v-for="k in form.getFieldValue('keys')"
        :key="k"
        :label="'Thuộc tính ' + (k+1)"
      >
        <a-input
          @keypress.enter="__add"
          v-decorator="[
            `attrs[${k}]['value']`,
            {
              rules: [{ required: true, message: 'Vui lòng nhập tên thuộc tính' }]
            }
          ]"
          class="mb-4 mr-4"
          style="width: 90%; margin-right: 10px;"
        />
        <a-icon
          class="dynamic-delete-button"
          type="minus"
          @click="() => __remove(k)"
        />
      </a-form-item>
      <a-form-item v-bind="formItemLayoutWithOutLabel">
        <a-button type="dashed" style="width: 48%" @click="__add">
          <a-icon type="plus" /> Thêm
        </a-button>
      </a-form-item>
    </a-form>
  </a-modal>
</template>

<script lang="ts">
import { Vue, Component, Prop } from "vue-property-decorator";
import { Getter } from 'vuex-class'

import insertProductAttribute from "@/gql/mutations/insertProductAttribute.gql";

@Component({})
export default class PartnerProductAttributeAddModal extends Vue {
  @Getter('users/shopId') shopId

  visible: boolean = false;
  form: any = {};
  loading: boolean = false;

  formItemLayoutWithOutLabel: any = {
    wrapperCol: {
      xs: { span: 24, offset: 0 },
      sm: { span: 24, offset: 0 },
    },
  };
  
  typeName: string = ''
  typeId: number = 0
  id: number = 0

  __remove(k) {
    const { form } = this;
    const keys = form.getFieldValue('keys');
    
    form.setFieldsValue({
      keys: keys.filter(key => key !== k),
    });
  };

  __add() {
    const { form } = this;
    const keys = form.getFieldValue('keys');
    const nextKeys = keys.concat(this.id++);
    form.setFieldsValue({
      keys: nextKeys,
    });
  };

  created() {
    this.form = this.$form.createForm(this);
    this.form.getFieldDecorator('keys', { initialValue: [], preserve: true });
  }

  onSubmit() {
    this.form.validateFields(async (err, values) => {
      if (!err) {
        this.loading = true;

        try {
          values.attrs.map(async attr => {
            if (attr.value !== '') {
              await this.$apollo.mutate({
                mutation: insertProductAttribute,
                variables: {
                  object: {
                    name: attr.value,
                    store_id: this.shopId,
                    type_id: this.typeId
                  }
                }
              });
            }
          })          

          this.form.resetFields();
          this.loading = false;
          this.visible = false;

          this.$message.success(`Thuộc tính đã được thêm`);
          this.$bus.$emit('types.reload');
        } catch (error) {
          this.loading = false;
        }
      }
    });
  }

  mounted() {
    this.$bus.$on("attributes.add.show", (type_id, type_name) => {
      this.typeName = type_name
      this.typeId = type_id
      this.visible = true;
    });
  }
}
</script>