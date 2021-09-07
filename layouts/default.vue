<template>
  <div class="layout-login">
    <Nuxt />
    <div class="footer">
      <p>&copy; 2021 tiemcuatui.com</p>
    </div>
  </div>
</template>

<script lang="ts">
import { Vue, Component } from "nuxt-property-decorator";

@Component
export default class LoginLayout extends Vue {
  
}
</script>

<style lang="scss">
@import '@/assets/styles/mixins.scss';

#__nuxt {
  width: 100%;
  height: 100%;
  background-color: #fff;
}

#__layout {
  height:100%;
  width:100%;
}

.layout-login {
  height:100%;
  width:100%;
  background: black;
  -webkit-background-size: cover;
  -moz-background-size: cover;
  -o-background-size: cover;
  background-size: cover;
}

.footer {
  padding: rem(40);
  position: absolute;
  bottom: 0;
  right: 0;
  height: 30px;

  @media (max-width: $md-max-width) {
    padding: rem(40) rem(20) rem(40);
  }

  @media (max-width: $sm-max-width) {
    padding: rem(40) rem(20) rem(20);
  }

  ul {
    margin-bottom: 0;
    li {
      margin-right: rem(20);
      text-transform: uppercase;
      &:last-child {
        margin-right: 0;
      }
      a {
        color: $text;
        opacity: 0.7;
        line-height: 1.4;
        display: inline-block;
        margin-right: rem(10);
        &:hover {
          opacity: 1;
        }
      }
    }
  }
}

</style>
