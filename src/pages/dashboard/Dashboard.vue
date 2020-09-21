<template>
  <page-layout>
    <div slot="headerContent">
      ConteMan can't stop.
    </div>
    <a-row :gutter="[16,16]">
      <a-col :xs="24" :sm="24" :md="24" :lg="16" :xl="16">
        <a-card title="系统构建" :loading="depLoading">
          <a-button class="color-grey" slot="extra" type="link" :icon="depShow ? 'minus' : 'plus'" @click="() => {this.depShow = !this.depShow}"></a-button>
          <json-list v-if="depShow" :data="dependencies" :depth="0"/>
        </a-card>
      </a-col>
      <a-col :xs="24" :sm="24" :md="24" :lg="8" :xl="8">
        <a-card title="主机信息" :loading="osLoading">
          <a-button class="color-grey" slot="extra" type="link" :icon="osShow ? 'minus' : 'plus'" @click="() => {this.osShow = !this.osShow}"></a-button>
          <json-list v-if="osShow" :data="os" :depth="0"/>
        </a-card>
      </a-col>
    </a-row>

  </page-layout>
</template>

<script>
import PageLayout from '@/layouts/PageLayout'
import JsonList from "@/components/list/JsonList"
import { System } from '@/services'

export default {
  name: "Dashboard",
  components: {
    PageLayout,
    JsonList
  },
  data() {
    return {
      os: {},
      dependencies: {},
      osLoading: true,
      depLoading: true,
      osShow: false,
      depShow: false,
    }
  },
  methods: {
    async getOS() {
      this.osLoading = true;
      const res = await System.os();
      this.osLoading = false;
      this.os = res.data;
    },
    async getDep() {
      this.depLoading = true;
      const res = await System.dependencies();
      this.depLoading = false;
      this.dependencies = res.data;
    },
  },
  mounted() {
    this.getOS();
    this.getDep();
  }
}
</script>

<style scoped lang="less">
  .color-grey {
    color: grey;
  }
</style>
