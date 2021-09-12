<template>
  <div :class="$style.footer + ' bg-blue-50'">
    <div :class="$style.inner">
      <div class="row">
        <div class="col-sm-12">
          <div :class="$style.copyright">
            <span class="p-4">
              © 2021 tiemcuatui.com
              <!-- <a
                href="https://olli-ai.com/"
                target="_blank"
                rel="noopener noreferrer"
                >{{ title }}</a
              > -->
            </span>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script lang="ts">
import { Vue, Component } from "nuxt-property-decorator";

@Component({
  name: "partner-footer"
})
export default class PartnerFooter extends Vue {
  
}
</script>

<style lang="scss" module>
@import "./style.module.scss";
</style>
