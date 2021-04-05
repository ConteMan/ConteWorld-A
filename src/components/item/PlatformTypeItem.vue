<template>
  <div
    :key="item.id"
    class="item-container"
    @dblclick="statusChange(2)"
  >
    <a-dropdown
      v-if="status === 1"
      class="action"
      placement="bottomRight"
    >
      <a class="ant-dropdown-link" @click="e => e.preventDefault()">
        <a-icon type="ellipsis" />
      </a>
      <a-menu slot="overlay">
        <a-menu-item
          v-if="['conteworld_talk'].includes(item.platform_type)"
          @click="statusChange(2)"
        >
          <a href="javascript:;">编辑</a>
        </a-menu-item>
        <a-menu-item
          @click="deleteItem(item.id)"
        >
          <a href="javascript:;">删除</a>
        </a-menu-item>
      </a-menu>
    </a-dropdown>

    <template v-if="['conteworld_talk'].includes(item.platform_type)">
      <conte-world-talk v-bind="{ item }" :status.sync="status" :is-public.sync="item.is_public" />
    </template>
    <div v-if="['yuque_note'].includes(item.platform_type)" v-html="yuqueNoteFormat(item.content)" />
    <div v-if="['jike_activity'].includes(item.platform_type)">
      {{ item.content }}
    </div>

    <div v-if="status === 1" class="info">
      <span class="time">
        {{ dayjs(item.platform_created_at).format("YYYY-MM-DD HH:mm:ss") }}
      </span>
      <span class="platform-type">
        / {{ item.platform_type_des.value }}
      </span>
      <span class="is-public">
        / {{ item.is_public ? '公开' : '私密' }}
      </span>
    </div>
  </div>
</template>

<script>
import dayjs from 'dayjs';
import ConteWorldTalk from './ConteWorldTalk.vue';
import { Talk as Base } from '@/services';

export default {
  name: 'PlatformTypeItem',
  components: {
    ConteWorldTalk
  },
  props: {
    item: {
      type: [Object, Array],
      default: () => {}
    }
  },
  data() {
    return {
      dayjs,
      status: 1, // 1 readonly, 2 editable
    };
  },
  methods: {
    yuqueNoteFormat(data) {
      return data.replaceAll(/\<\!doctype\s\S*\>|\<meta[\s\S]*\/\>|data-lake\S{0,10}=\"\S{0,100}\"/g, '');
    },
    statusChange(status) {
      this.status = status;
    },
    async deleteItem(id) {
      const res = await Base.delete(id);
      if (res.data.code === 0) {
        this.$emit('remove-item', id);
        this.$message.success('搞定！');
      } else {
        this.$message.error('有点问题！');
      }
    }
  },
};
</script>

<style lang="less" scoped>
@import "../../theme/default/public.less";

.item-container {
  position: relative;
  width: 100%;
  border-bottom: @conte-border;
  padding: 12px;
  overflow-x: hidden;
  &:hover {
    background-color: @conte-border-grey;
  }
  .action {
    position: absolute;
    right: 20px;
    z-index: 2;
  }
  .info {
    text-align: left;
    color: @conte-font-grey;
    font-size: 12px;
    padding: 8px 0 0 0;
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
