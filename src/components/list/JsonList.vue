<template>
  <div style="width: 100%; overflow: hidden">
    <template v-for="(item, key) in data">
      <div v-if="!isJSON(item)" :key="key + depth + 'detail'" :style="indent" class="detailLine">{{ key }}: {{
        item
      }}
      </div>
      <template v-else>
        <div :key="key + 'key'" :style="indent" class="groupKey">{{ key }}
          <a-icon type="caret-down" />
        </div>
        <json-list :key="key + depth + 'list'" :data="item" :depth="depth + 1" />
      </template>
    </template>
  </div>
</template>

<script>
import { isJSON } from '@/utils/util';

export default {
  name: 'JsonList',
  props: {
    data: {
      type: [Object, Array],
      default: () => ({})
    },
    depth: {
      type: Number,
      default: 0,
    }
  },
  data() {
    return {};
  },
  computed: {
    indent() {
      return { paddingLeft: `${this.depth * 15}px` };
    }
  },
  methods: {
    isJSON,
  }
};
</script>

<style scoped lang="less">
.groupKey {
  font-weight: bold;
  padding: 5px 0 0 0;
}

.detailLine {
  width: 100%;
  word-break: break-all;
}
</style>
