<template>
  <div>
    <a-button type="primary" size="small" @click="showModal">
      Xem đơn
    </a-button>
    <a-modal
      :title="`Mã ĐH: ${orderCode}`"
      :visible="visible"
      @cancel="handleCancel"
      width="60%"
      centered
      v-if="order"
    >
      <a-spin :spinning="loading">
        <a-table
          size="small"
          class="box-white"
          :dataSource="order_products"
          :columns="columns"
          :pagination="false"
          :rowKey="record => record.id"

        >
          <template slot="_images" slot-scope="record">
            <img
              v-if="record.product.images && record.product.images.length > 0"
              :src="$helper.getImage(record.product.images[0]['path'])"
            />
          </template>
          <template slot="_name" slot-scope="record">
            <span class="text-gray-700">{{ record.product.name }}</span>
            <a-space>
              <small>#{{ record.product.sku }}</small>
            </a-space>
            <br/>
            <div :class="`${ record.unit_price !== record.product.price ? 'line-through' : ''}`">
              Giá: {{ record.product.price | number('0,0')}} &#8363;
            </div>
            <div class="flex pt-2 " v-if="record.options.length > 0">
              <template v-for="(opt, i) in record.options">
                <div :key="i">
                  <span>{{ opt.name }}: </span>
                  <span>{{ opt.value.val }}</span>
                  &nbsp;
                  <a-tag v-if="opt.value.mode !== '' && opt.value.price !== ''">
                    <span v-if="opt.value.mode === 'inc'" class="text-green-600">+</span>
                    <span v-if="opt.value.mode === 'dec'" class="text-red-600">-</span>
                    <span>{{ opt.value.price | number('0,0')}} &#8363;</span>
                  </a-tag>
                  <span v-if="i < record.options.length - 1">&nbsp;|&nbsp;&nbsp;</span>
                </div>
              </template>
            </div>
          </template>
          <template slot="_unitPrice" slot-scope="record">
            <span class="font-mono text-xl">{{ record.unit_price | number('0,0') }}</span>
            &#8363;
          </template>
          <template slot="_subTotal" slot-scope="record">
            <span class="font-mono text-xl">{{ record.sub_total | number('0,0') }}</span>
            &#8363;
          </template>
          <template slot="_inStock" slot-scope="record">
            <a-tag color="green" v-if="record.product.in_stock">
              Còn hàng
            </a-tag>
            <a-tag v-else>
              Hết hàng
            </a-tag>
          </template>
        </a-table>
        <div class="p-4 row">
          <div class="col-lg-6">
            <h1 class="text-2xl">Thông tin khách hàng</h1>
            <p>Tên KH: {{ order.shipping_full_name }}</p>
            <p>Số ĐT: {{ order.shipping_phone_number }}</p>
            <p>Địa chỉ nhận hàng: {{ order.shipping_address }}</p>
            <p>Email: {{ order.shipping_email }}</p>
            <p>Ghi chú của KH: {{ order.note }}</p>
          </div>
          <div class="text-right col-lg-6">
            <h1 class="text-2xl">
              Tổng giá: 
              <span class="font-bold">{{ order.total_price | number('0,0') }} &#8363;</span>
            </h1>
          </div>
        </div>
      </a-spin>
      <template slot="footer">
        <a-button type="danger" :loading="loading" @click="onOrderCancel">
          Hủy đơn
        </a-button>
        <a-button  type="primary" :loading="loading" @click="onOrderConfirm">
          Nhận đơn
        </a-button>
      </template>
    </a-modal>
  </div>
</template>

<script lang="ts">
import { Component, Vue, Prop } from 'nuxt-property-decorator'

import fetchOrderDetail from '@/gql/queries/fetchOrderDetail.gql'
import updateFieldOrder from '@/gql/mutations/updateFieldOrder.gql'

@Component({})
export default class OderDetailModal extends Vue {
  @Prop()
  orderCode
  
  @Prop()
  orderId

  visible = false
  loading = false

  order_products: any = null
  order: any = null

  get columns() {
    const columns: any = [
      {
        scopedSlots: { customRender: "_images" },
        width: 100,
      },
      {
        title: "Tên SP",
        scopedSlots: { customRender: "_name" }
      },
      {
        title: "Còn hàng?",
        scopedSlots: { customRender: "_inStock" },
        key: "in_stock",
      },
      {
        title: "Số lượng",
        dataIndex: "quantity",
        align: "center",
      },
      {
        title: "Đơn giá",
        scopedSlots: { customRender: "_unitPrice" },
        align: "center",
      },
      {
        title: "Tạm tính",
        scopedSlots: { customRender: "_subTotal" },
        align: "center",
      },
    ];

    return columns;
  }

  async showModal() {
    this.visible = true;

    this.loading = true
    const r = await this.$apollo.query({
      query: fetchOrderDetail,
      variables: {
        id: this.orderId
      }
    })

    this.order = r.data.orders_by_pk
    this.order_products = r.data.orders_by_pk.order_products
    this.loading = false
  }

  async onOrderConfirm(e) {
    this.loading = true
    const r = await this.$apollo.mutate({
      mutation: updateFieldOrder,
      variables: {
        id: this.orderId,
        fields: { 'status': 'confirmed' }
      }
    });

    if (r.data && r.data.update_orders.affected_rows > 0) {
      this.$message.success('Đã chuyển trạng thái thành Đã chốt đơn');
    } else {
      this.$message.error('Không thể chuyển trạng thái đơn hàng');
    }

    this.$bus.$emit('orders.reload')
    this.loading = false
    this.visible = false
  }

  async onOrderCancel(e) {
    this.loading = true
    const r = await this.$apollo.mutate({
      mutation: updateFieldOrder,
      variables: {
        id: this.orderId,
        fields: { 'status': 'canceled' }
      }
    });

    if (r.data && r.data.update_orders.affected_rows > 0) {
      this.$message.success('Đã chuyển trạng thái thành Đã hủy');
    } else {
      this.$message.error('Không thể chuyển trạng thái đơn hàng');
    }

    this.$bus.$emit('orders.reload')
    this.loading = false
    this.visible = false
  }

  handleCancel(e) {
    this.visible = false;
  }
}
</script>