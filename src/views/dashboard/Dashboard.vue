<template>
  <page-layout>
    <div v-if="Object.keys(statistic).length" class="content no-padding-top">
      <div class="statistic">
        <a-statistic :title="$t('articleName')" :value="statistic.article" />
        <a-statistic :title="$t('talkName')" :value="statistic.talk" />
        <a-statistic :title="$t('movieName')" :value="statistic.movie" />
        <a-statistic :title="$t('softwareName')" :value="statistic.software" />
        <a-statistic :title="$t('oneName')" :value="statistic.one" />
      </div>
    </div>
  </page-layout>
</template>

<script>
import PageLayout from '@/layouts/PageLayout';
import Statistic from '@/services/modules/statistic.js';

export default {
  name: 'Dashboard',
  components: {
    PageLayout,
  },
  i18n: require('./i18n'),
  data() {
    return {
      statistic: {},
    };
  },
  created() {
    this.getStatistic();
  },
  methods: {
    async getStatistic() {
      const res = await Statistic.total();
      if (res.data.code === 0) {
        this.statistic = res.data.data;
      }
    }
  }
};
</script>

<style scoped lang="less">
@import "index";
</style>
