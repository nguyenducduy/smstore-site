<template>
  <div class="p-4 mt-4 bg-white rounded">
    <a-spin :spinning="loading">
      <a-form :form="form" layout="vertical" :colon="false">
        <div class="row">
          <div class="col-lg-6">
            <!-- General info -->
            <a-form-item v-bind="tailFormItemLayout">
              <h1 class="info-label">
                <span>Thông tin cơ bản</span>
              </h1>
            </a-form-item>
            <a-form-item
            >
              <file-pond
                ref="pond"
                name="file"
                accepted-file-types="image/jpeg, image/png"
                credits="false"
                allowFileEncode="true"
                allowFileMetadata="true"
                allowMultiple="true"
                maxFiles="4"
                :files="myFiles"
                :instantUpload="false"
              />
            </a-form-item>

            <!-- <a-form-item
              v-bind="formItemLayout"
              label="Chủ đề"
              extra="Có thể chọn nhiều chủ đề"
            >
              <a-tree-select
                v-decorator="[
                  'categories',
                  {
                    rules: [
                      {
                        required: true,
                        message: 'Vui lòng chọn chủ đề'
                      }
                    ]
                  },
                  { initialValue: [] }
                ]"
                placeholder="Chọn chủ đề"
                style="width: 100%"
                :dropdownStyle="{ maxHeight: '400px', overflow: 'auto' }"
                treeDefaultExpandAll
                :replaceFields="replaceFields"
                :dropdown-style="{ maxHeight: '400px', overflow: 'auto' }"
                :tree-data="category"
                tree-default-expand-all
                allow-clear
                multiple
              ></a-tree-select>
            </a-form-item> -->
            <div class="row">
              <div class="col-lg-8">
                <a-form-item label="Tên SP">
                  <a-input
                    allowClear
                    v-decorator="[
                      'name',
                      {
                        rules: [
                          { required: true, message: 'Vui lòng nhập tên sản phẩm' }
                        ]
                      }
                    ]"
                    @change="__generateSlug"
                  ></a-input>
                </a-form-item>
              </div>
              <div class="col-lg-4">
                <a-form-item label="SKU">
                  <a-input
                    allowClear
                    v-decorator="[
                      'sku'
                    ]"
                  ></a-input>
                </a-form-item>
              </div>
            </div>
          </div>
          <div class="col-lg-6">
            <!-- Options info -->
            <a-form-item v-bind="tailFormItemLayout">
              <h1 class="info-label">
                <span>Tùy chọn</span>
              </h1>
            </a-form-item>
            <div class="row">
              <div class="mb-4 col-lg-12">
                <a-input @keyup.enter="addOption" type="text" v-model="newOptionName" style="width: 30%" placeholder="Tên tùy chọn"></a-input>
                <a-button type="primary" @click="addOption">Thêm</a-button>
              </div>
              <div class="mt-2 col-lg-12" v-if="options.length > 0">
                <div v-for="option, i in options" :key="i" class="mb-4 row">
                  <div class="col-lg-4">
                    <a-input v-model="option.name"></a-input>
                  </div>
                  <div class="col-lg-8">
                    <a-button icon="plus" type="dashed" @click="addOptionValue(i)">Thêm giá trị</a-button>
                    <a-button icon="minus" type="dashed">Xóa</a-button>
                  </div>
                  <div class="mt-4 mb-2 col-lg-12" v-for="value, k in option.values" :key="k">
                    <div class="col-lg-6">
                      <a-input v-model="value.val"></a-input>
                    </div>
                    <div class="col-lg-3">
                      <a-select v-model="value.mode" placeholder="Tăng/Giảm">
                        <a-select-option value="inc">
                          + Tăng
                        </a-select-option>
                        <a-select-option value="dec">
                          - Giảm
                        </a-select-option>
                      </a-select>
                    </div>
                    <div class="col-lg-3">
                      <a-input v-model="value.price" suffix="đ"></a-input>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            <!-- Attributes info -->
            <a-form-item v-bind="tailFormItemLayout">
              <h1 class="info-label">
                <span>Thuộc tính</span>
              </h1>
            </a-form-item>
          </div>

          <div class="shadow-lg col-lg-12 save-form-control">
            <a-form-item>
              <a-button
                class="mr-4"
                icon="save"
                type="primary"
                :loading="loading"
                @click.prevent="onSubmit"
                >Lưu</a-button
              >
              <a-button type="danger" class="rs_btn" @click.prevent="form.resetFields()"
                >Reset</a-button
              >
            </a-form-item>
          </div>
        </div>
      </a-form>
    </a-spin>
  </div>
</template>

<script lang="ts">
import { Vue, Component } from 'vue-property-decorator';
const slugify = require('slugify');

import createProduct from '@/gql/mutations/createProduct.gql'

@Component({

})
export default class PartnerProductAddForm extends Vue {
  form: any = {};
  loading: boolean = false;
  hasErrors: any = this.$helper.hasErrors;
  formItemLayout: any = {
    labelCol: { span: 6 },
    wrapperCol: { span: 18 }
  };
  tailFormItemLayout: any = {
    wrapperCol: { span: 24 }
  };

  myFiles: any = null;
  $refs: {
    pond: HTMLFormElement,
  };

  newOptionName = ''
  options: any = []
  
  addOption(key) {
    if (this.newOptionName.length === 0) {
      return this.$message.warning('Vui lòng nhập tên tùy chọn')
    }
    
    this.options.push({
      'name': this.newOptionName,
      'values': []
    })

    this.newOptionName = ''
  }

  addOptionValue(key) {
    console.log(key);
    
    this.options[key]['values'].push({
      'val': '1231232',
      'mode': '',
      'price': ''
    })

    console.log(this.options);
    
  }
  
  
  async onSubmit(e) {
    e.preventDefault();
    await this.$refs.pond.processFiles();
    
    // this.form.validateFields(async (err, values) => {
    //   if (!err) {
    //     this.loading = true;
        
    //     try {
    //       let productItem = {
    //         name: values.name,
    //       };

          
    //       await this.$apollo.mutate({
    //         mutation: createProduct,
    //         variables: productItem
    //       });

    //       this.loading = false;
    //       this.form.resetFields();
    //       this.$message.success(`Sản phẩm "${values.name}" đã được thêm`);
    //     } catch (error) {
    //       this.loading = false;
    //     }
    //   }
    // });
  }

  created() {
    this.form = this.$form.createForm(this);
    
  }

  mounted() {
    
  }

  __generateSlug(e) {
    this.form.setFieldsValue({
      slug: slugify(e.target.value, { lower: true, locale: 'vi' })
    })
  }
}
</script>

<style lang="scss">
.filepond--item {
    width: calc(50% - 0.5em);
}
.ant-card-grid {
  box-shadow: none !important;
}
</style>