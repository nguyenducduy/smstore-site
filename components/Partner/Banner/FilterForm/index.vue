<template>
  <div class="row">
    <div class="mb-5 col-lg-12">
      <a-form :form="form" layout="horizontal" :colon="false" class="filter-form">
        <a-form-item>
          <a-input
            allowClear
            v-decorator="['ids', { initialValue: '' }]"
            placeholder="Lọc theo ID: 1,2,3..."
            @pressEnter="onSubmit"
          >
          </a-input>
        </a-form-item>
        <!-- <a-form-item label="Loại">
          <a-select
            show-search
            v-decorator="[
              'type',
              { initialValue: [] }
            ]"
            placeholder="Chọn loại"
          >
            <a-select-option
              v-for="type in media_type"
              :value="type.value"
              :key="type.value"
              >{{ type.description }}</a-select-option
            >
          </a-select>
        </a-form-item> -->
        <a-form-item label="Trạng thái">
          <a-radio-group v-decorator="['is_active']">
            <a-radio :value="false">
              Ẩn
            </a-radio>
            <a-radio :value="true">
              Hiện
            </a-radio>
          </a-radio-group>
        </a-form-item>
       
      </a-form>
    </div>
    <div class="col-lg-12">
      <a-form-item>
        <a-button
          class="mr-4"
          type="primary"
          :loading="loading"
          @click.prevent="onSubmit"
          >Lọc</a-button
        >
        <a-button @click.prevent="onReset"
          >Clear</a-button
        >
      </a-form-item>
    </div>    
  </div>
</template>

<script lang="ts">
import { Component, Vue } from 'nuxt-property-decorator';
import { initQs } from '@/helper/paginate';

@Component({
  
})
export default class PartnerBannerFilterForm extends Vue {
  categories: any = null
  form: any = {};
  loading: boolean = false;

  onReset() {
    this.$router.push('/partner/banner');
  }

  onSubmit(e) {
    e.preventDefault();

    this.form.validateFields(async (err, values) => {
      if (!err) {        
        let where: any = {}
        let queryString: string = '';

        if (typeof values.ids !== 'undefined' && values.ids.length > 0) {
          where['id'] = {
            _in: values.ids.split(',').map(id => id.trim())
          }
        }
       
        if (typeof values.is_active !== 'undefined') {
          where['is_active'] = {
            _eq: values.is_active
          }
        }
        
        const filterEncoded = btoa(JSON.stringify(where));

        queryString = queryString +
          (typeof values.q !== 'undefined' && values.q.length > 0 ? '&' : '?') +
          `filter_by=${filterEncoded}`
        
        this.$router.push(queryString);
      }
    });
  }

  created() {
    this.form = this.$form.createForm(this);
  }

  async mounted() {
    const { currentFilters, currentSearchText } = initQs(this);  
    
    this.form = this.$form.createForm(this, {
      mapPropsToFields: () => {
        return {
          ids: this.$form.createFormField({
            value: typeof currentFilters['id'] !== 'undefined' ? currentFilters['id']['_in'].join(',') : ''
          }),
        };
      }
    });

    await this.$helper.sleep(180);

    // need add after form builed
    if (typeof currentFilters['is_active'] !== 'undefined') {
      this.form.setFieldsValue({
        is_active: currentFilters['is_active']['_eq']
      })  
    }
  }
}
</script>

<style lang="scss" scoped>

.filter-form {
  .ant-form-item {
    margin-bottom: 5px;
  }
}
</style>