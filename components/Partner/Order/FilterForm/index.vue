<template>
  <div class="row">
    <div class="mb-5 col-lg-12">
      <a-form :form="form" layout="horizontal" :colon="false" class="filter-form">
        <!-- <a-form-item>
          <a-input
            allowClear
            v-decorator="['q', { initialValue: '' }]"
            placeholder="Tìm trong tên sp, từ khóa, ..."
            @pressEnter="onSubmit"
          >
            <a-icon slot="prefix" type="search" style="color:rgba(0,0,0,.25)" />
          </a-input>
        </a-form-item> -->
        <a-form-item>
          <a-input
            allowClear
            v-decorator="['ids', { initialValue: '' }]"
            placeholder="Lọc theo Mã ĐH"
            @pressEnter="onSubmit"
          >
          </a-input>
        </a-form-item>
        <a-form-item label="Trạng thái ĐH">
          <a-select
            show-search
            v-decorator="[
              'status',
              { initialValue: [] }
            ]"
            placeholder="Chọn trạng thái"
          >
            <a-select-option
              v-for="status in orderStatus"
              :value="status.value"
              :key="status.value"
              >{{ status.name }}</a-select-option
            >
          </a-select>
        </a-form-item>
        <a-form-item label="Thanh toán?">
          <a-radio-group v-decorator="['is_paid']">
            <a-radio :value="false">
              Chưa thanh toán
            </a-radio>
            <a-radio :value="true">
              Đã thanh toán
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

import fetchOrderStatus from "@/gql/queries/fetchOrderStatus.gql";

@Component({})
export default class PartnerOrderFilterForm extends Vue {
  orderStatus: any = null
  
  form: any = {};
  loading: boolean = false;
  
  onReset() {
    this.$router.push('/partner/order');
  }

  onSubmit(e) {
    e.preventDefault();

    this.form.validateFields(async (err, values) => {
      if (!err) {        
        let where: any = {}
        let queryString: string = '';

        if (typeof values.ids !== 'undefined' && values.ids.length > 0) {
          where['code'] = {
            _in: values.ids.split(',').map(id => id.trim())
          }
        }

        if (values.status.length > 0) {
          where['_status'] = {
            value: {
              _in: values.status
            }
          }
        }

        if (typeof values.is_paid !== 'undefined') {
          where['is_paid'] = {
            _eq: values.is_paid
          }
        }

        // // search
        // if (typeof values.q !== 'undefined' && values.q.length > 0) {
        //   queryString += '?q=' + values.q;

        //   try {
        //     const r = await this.$apollo.query({
        //       query: searchMedia,
        //       variables: {
        //         q: values.q
        //       }
        //     });

        //     // console.log(r['data']['search_media']);
            
        //     if (r['data']['search_media'].length > 0) {
        //       const resultIds = r['data']['search_media'].map(item => item.id);
        //       // console.log(r['data']['search_media']);
        //       queryString += `&sr=${resultIds.join(',')}`;
              
        //       where['id'] = {
        //         _in: r['data']['search_media'].map(item => item.id)
        //       }
        //     } else {              
        //       this.form.setFieldsValue({
        //         ids: ''
        //       })
        //       where['id'] = {
        //         _in: []
        //       }
        //     }
        //   } catch (error) {
        //     // alert('search failed');
        //   }
        // }
        
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
    await this._reload()

    const { currentFilters, currentSearchText } = initQs(this);  
    
    this.form = this.$form.createForm(this, {
      mapPropsToFields: () => {
        return {
          status: this.$form.createFormField({
            value: typeof currentFilters['_status'] !== 'undefined' ? currentFilters['_status']['value']['_in'] : []
          }),
          ids: this.$form.createFormField({
            value: typeof currentFilters['code'] !== 'undefined' ? currentFilters['code']['_in'].join(',') : ''
          }),
          q: this.$form.createFormField({
            value: typeof currentSearchText !== 'undefined' && currentSearchText.length > 0 ? currentSearchText : ''
          })
        };
      }
    });

    await this.$helper.sleep(180);

    // need add after form builed
    if (typeof currentFilters['is_paid'] !== 'undefined') {
      this.form.setFieldsValue({
        is_paid: currentFilters['is_paid']['_eq']
      })  
    }
  }

  async _reload() {
    // fetch order status
    const r =  await this.$apollo.query({ query: fetchOrderStatus })
    this.orderStatus = r.data.order_status
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