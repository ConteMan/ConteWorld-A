<template>
  <div :key="item.id" class="item-container">
    <div v-if="['conteworld_talk'].includes(item.platform_type)" v-html="item.content" />
    <div v-if="['yuque_note'].includes(item.platform_type)">
      {{ item.content }}
    </div>
    <div v-if="['jike_activity'].includes(item.platform_type)">
      {{ yuqueNoteFormat(item.content) }}
    </div>
    <div class="info">
      <span class="time">
        {{ dayjs(item.platform_created_at).format("YYYY-MM-DD HH:mm:ss") }}
      </span>
      <span class="platform-type">
        {{ item.platform_type_des.value }}
      </span>
    </div>
  </div>
</template>

<script>
import dayjs from 'dayjs'

export default {
  name: 'PlatformTypeItem',
  props: {
    item: {
      type: [Object, Array],
      default: () => {}
    }
  },
  data() {
    return {
      dayjs,
    }
  },
  methods: {
    yuqueNoteFormat(data) {
      return data.replaceAll('<!doctype lake>', '')
    }
  },
}
</script>

<style lang="less" scoped>
@import "../../theme/default/public.less";

.item-container {
  width: 100%;
  border-bottom: @conte-border;
  padding: 12px;
  overflow-x: hidden;
  &:hover {
    background-color: @conte-border-grey;
  }
  .info {
    text-align: left;
    color: @conte-font-grey;
    font-size: 12px;
    padding: 8px 0 0 0;
    .time {
      margin-right: 8px;
    }
  }
  .item-pic {
    width: 100%;
  }
  @{deep} blockquote {
    border-left: 3px solid rgba(0,0,0,.1);
    color: rgba(0,0,0,.8);
    padding-left: 4px;
  }
}
</style>
