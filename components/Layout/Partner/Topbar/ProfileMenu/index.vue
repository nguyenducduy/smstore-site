<template>
  <a-dropdown :trigger="['click']" placement="bottomLeft" v-if="userInfo">
    <div :class="$style.dropdown">
      Hi, <strong>{{ userInfo.name }}</strong>
      &nbsp;
      <!-- <a-badge :count="99"> -->
      <a-avatar v-if="userInfo.avatar !== null" :src="__getAvatar(userInfo.avatar)" />
      <a-avatar v-else :style="`backgroundColor: ${ userInfo.group.color} ; color: #fff`">{{ userInfo.name[0] }}</a-avatar>
      <!-- </a-badge> -->
    </div>
    <a-menu slot="overlay">
      <a-menu-item>
        <p class="mt-1">
          <a-tag :color="userInfo.group.color">{{
            userInfo.group.description
          }}</a-tag>
        </p>
      </a-menu-item>
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

import fetchUser from "@/apollo/queries/fetchUser.gql";

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

      this.$nuxt.$loading.finish();
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

  __getAvatar(originCoverUrl) {
    if (originCoverUrl !== '') {
      return this.$helper.getAvatar(originCoverUrl);
    } else {
      return null;
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
