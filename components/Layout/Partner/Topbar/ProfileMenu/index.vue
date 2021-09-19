<template>
  <a-dropdown :trigger="['click']" placement="bottomLeft" v-if="userInfo">
    <div :class="$style.dropdown">
      Hi, <strong>{{ userInfo.full_name }}</strong>
      &nbsp;
      <!-- <a-badge :count="99"> -->
      <a-avatar style="color: #f56a00; backgroundColor: #fde3cf">{{ userInfo.full_name[0] }}</a-avatar>
      <!-- </a-badge> -->
    </div>
    <a-menu slot="overlay">
      <a-menu-item>
        <a
          href="javascript: void(0);"
          @click="$bus.$emit('users.changepassword.show')"
        >
          <i :class="$style.menuIcon" class="fa fa-key"></i>
          Đổi mật khẩu
        </a>
      </a-menu-item>
      <a-menu-item>
        <a href="javascript: void(0);" @click="onLogout">
          <i :class="$style.menuIcon" class="fa fa-sign-out"></i>
          Thoát
        </a>
      </a-menu-item>
    </a-menu>
  </a-dropdown>
</template>

<script lang="ts">
import { Vue, Component } from "nuxt-property-decorator";
import { Getter } from "vuex-class";

import fetchUser from "@/gql/queries/fetchUser.gql";

@Component({
  name: "profile-menu"
})
export default class ProfileMenu extends Vue {
  @Getter("users/loggedUser") loggedUser;

  userInfo: any = null;

  async onLogout() {
    this.$nuxt.$loading.start();

    try {
      Vue.ls.remove('token');
      this.$cookiz.remove('token');
      this.$apolloHelpers.onLogout();

      return (window.location.href = `
          ${window.location.protocol}//${window.location.hostname +
        (window.location.port ? ":" + window.location.port : "")}/admin`);
    } catch (error) {
      this.$nuxt.$loading.finish();
    }
  }

  async mounted() {
    try {
      const r = await this.$apollo.query({
        query: fetchUser,
        variables: { 'id': parseInt(this.loggedUser['sub']) }
      });  
      
      this.userInfo = r['data']['users_by_pk'];
    } catch (error) {
      
    }
  }
}
</script>

<style scoped>
.transition {
  transition: all 0.3s ease-in;
}
</style>

<style lang="scss" module>
@import "./style.module.scss";
</style>
