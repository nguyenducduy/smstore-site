<template>
  <div>
    <div :class="$style.logo" v-if="loggedShop">
      <div class="w-16 mx-auto my-2">
        <img
          class="object-cover object-fit"
          :src="`${$helper.getImage(loggedShop.logo_path)}`"
          @click="$router.push('/partner')"
        />
      </div>
    </div>
    <div :class="[$style.navigation, $style.light]">
      <a-menu
        mode="inline"
        @click="onClick"
        @openChange="onOpenChange"
        :selectedKeys="selectedKeys"
        :openKeys.sync="openKeys"
      >
        <template v-for="item in items">
          <a-menu-item
            :key="`${item.id}-${item.path}`"
            v-if="typeof item.children === 'undefined' || item.children.length == 0"
          >
            <router-link v-if="item.path !== ''" :to="item.path">
              <i v-if="item.icon" :class="[$style.icon, item.icon]"></i>
              <span :class="$style.title">{{ item.name }}</span>
            </router-link>
            <span v-else>
              <i v-if="item.icon" :class="[$style.icon, item.icon]"></i>
              <span :class="$style.title">{{ item.name }}</span>
            </span>
          </a-menu-item>
          <a-sub-menu
            v-if="typeof item.children !== 'undefined' && item.children.length > 0"
            :key="`${item.id}-${item.path}`"
          >
            <span slot="title">
              <span :class="$style.title">{{ item.name }}</span>
              <i v-if="item.icon" :class="[$style.icon, item.icon]"></i>
            </span>
            <template v-for="child in item.children">
              <a-menu-item
                :key="`${child.id}-${child.path}`"
              >
                <router-link v-if="child.path !== ''" :to="child.path">
                  <span :class="$style.title">{{ child.name }}</span>
                  <i v-if="child.icon" :class="[$style.icon, child.icon]"></i>
                </router-link>
                <span v-else>
                  <span :class="$style.title">{{ child.name }}</span>
                  <i v-if="child.icon" :class="[$style.icon, child.icon]"></i>
                </span>
              </a-menu-item>
            </template>
          </a-sub-menu>
        </template>
      </a-menu>
    </div>
  </div>
</template>

<script lang="ts">
import { Vue, Component, Prop, Watch } from "nuxt-property-decorator";
import { Mutation, Getter } from "vuex-class";
import find from "lodash/find";

@Component({
  name: "menu-left"
})
export default class MenuLeft extends Vue {
  @Mutation("SET") storeSet;
  @Watch("$route")
  routeChange() {
    this.setSelectedKeys();
  }

  @Getter("openKeys") getOpenKeys;
  @Getter("selectedKeys") getSelectedKeys;
  @Getter('users/loggedShop') loggedShop

  get items() {
    return [
      {
        id: '1',
        name: 'Tổng quan',
        path: '/partner',
        icon: 'fa fa-line-chart'
      },
      {
        id: '2',
        name: 'Sản phẩm',
        path: '/partner/product',
        icon: 'fa fa-briefcase',
        children: [
          {
            id: '2.1',
            name: 'Tất cả SP',
            path: '/partner/product'
          },
          {
            id: '2.2',
            name: 'Danh mục',
            path: '/partner/product-category'
          },
          {
            id: '2.4',
            name: 'Thuộc tính',
            path: '/partner/product-attribute'
          },
        ]
      },
      {
        id: '3',
        name: 'Trang',
        path: '/partner/blog',
        icon: 'fa fa-pagelines',
        children: [
          {
            id: '3.1',
            name: 'Tất cả',
            path: '/partner/blog'
          },
          {
            id: '3.2',
            name: 'Danh mục',
            path: '/partner/blog-categroy'
          }
        ]
      },
      {
        id: '4',
        name: 'Banner',
        path: '/partner/banner',
        icon: 'fa fa-picture-o'
      },
      {
        id: '5',
        name: 'Đơn hàng',
        path: '/partner/order',
        icon: 'fa fa-shopping-cart'
      },
      {
        id: '6',
        name: 'Đánh giá SP',
        path: '/partner/review',
        icon: 'fa fa-comments'
      },
      {
        id: '7',
        name: 'Cài đặt',
        path: '/partner/setting',
        icon: 'fa fa-cog'
      },
    ];
  }

  selectedKeys: any = [];
  openKeys: any = [];

  onClick(e) {
    this.storeSet({ app: "menu.selectedKeys", value: [e.key] });
    this.selectedKeys = [e.key];
  }

  onOpenChange(openKeys) {
    this.storeSet({ app: "menu.openedKeys", value: openKeys });
    this.openKeys = openKeys;
  }

  setSelectedKeys() {
    const pathname = this.$route.path;
    const menuData = this.items.concat();

    const flattenItems = (items, key) =>
      items.reduce((flattenedItems, item) => {
        flattenedItems.push(item);

        if (Array.isArray(item[key])) {
          return flattenedItems.concat(flattenItems(item[key], key));
        }

        return flattenedItems;
      }, []);

    const selectedItem = find(flattenItems(menuData, "children"), [
      "path",
      pathname
    ]);    

    this.selectedKeys = selectedItem
      ? [selectedItem.id + "-" + selectedItem.path]
      : [];
  }

  created() {
    this.openKeys = this.getOpenKeys;
    this.selectedKeys = this.getSelectedKeys;
    this.setSelectedKeys();
  }
}
</script>

<style lang="scss" module>
@import "./style.module.scss";
</style>
