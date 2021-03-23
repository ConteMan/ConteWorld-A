<template>
  <div>
    <div
      class="talk-editor editor"
    >
      <div>
        <editor-content
          class="editor__content"
          :editor="editor"
        />
      </div>
      <editor-menu-bar v-if="editable" v-slot="{ commands, isActive }" :editor="editor">
        <div class="menubar">
          <a-button
            type="link"
            class="menubar__button"
            :class="{ 'is-active': isActive.bold() }"
            @click="commands.bold"
          >
            <a-icon type="bold" />
          </a-button>
          <a-button
            type="link"
            class="menubar__button"
            :class="{ 'is-active': isActive.italic() }"
            @click="commands.italic"
          >
            <a-icon type="italic" />
          </a-button>
          <a-switch
            v-model="isPublic"
            class="public-switch"
            size="small"
            checked-children="公开"
            un-checked-children="私密"
          />
          <a-button
            size="small"
            class="talk-cancel"
            :loading="updateLoading"
            @click.exact="editableChange(1)"
          >
            取消
          </a-button>
          <a-button
            type="primary"
            size="small"
            class="talk-submit"
            :loading="updateLoading"
            @click.exact="talkSubmit"
          >
            发布
          </a-button>
        </div>
      </editor-menu-bar>
    </div>
  </div>
</template>

<script>
import { Editor, EditorContent, EditorMenuBar } from 'tiptap';
import {
  Blockquote,
  BulletList,
  CodeBlock,
  Heading,
  ListItem,
  OrderedList,
  TodoItem,
  TodoList,
  Bold,
  Code,
  Italic,
  Link,
  Strike,
  Underline,
  History,
  Placeholder,
} from 'tiptap-extensions';
import HardBreakPlus from '@/utils/tiptap/HardBreakPlus.js';
import { Talk as Base } from '@/services';

export default {
  name: 'CounteWorldTalk',
  components: {
    EditorContent,
    EditorMenuBar,
  },
  props: {
    item: {
      type: [Object, Array],
      default: () => {}
    },
    status: {
      type: Number,
      default: 1,
    }
  },
  data() {
    return {
      editable: false,
      editor: new Editor({
        editable: false,
        extensions: [
          new Blockquote(),
          new BulletList(),
          new CodeBlock(),
          new HardBreakPlus(),
          new Heading({ levels: [1, 2, 3] }),
          new ListItem(),
          new OrderedList(),
          new TodoItem(),
          new TodoList(),
          new Link(),
          new Bold(),
          new Code(),
          new Italic(),
          new Strike(),
          new Underline(),
          new History(),
          new Placeholder({
            emptyEditorClass: 'is-editor-empty',
            emptyNodeClass: 'is-empty',
            emptyNodeText: '现在的想法是 …',
            showOnlyWhenEditable: true,
            showOnlyCurrent: true,
          }),
        ],
        content: `${this.item.content}`,
        autoFocus: true,
      }),

      isPublic: Boolean(this.item.is_public),
      id: this.item.id,
      updateLoading: false,
    };
  },
  watch: {
    status(target) {
      const status = target > 1;
      this.editable = status;
      this.editor.setOptions({ editable: status });
    }
  },
  beforeDestroy() {
    this.editor.destroy();
  },
  methods: {
    editableChange(status) {
      this.$emit('update:status', status);
    },
    async talkSubmit() {
      if (this.updateLoading) {
        return false;
      }
      const content = this.editor.getHTML();
      const content_origin = this.editor.getJSON();
      if (!content || content === '<p></p>') {
        this.$message.error('写点什么吧, 要么就清除这段记忆');
        return false;
      }
      this.updateLoading = true;
      const res = await Base.update({ id: this.id, content, content_origin, is_public: this.isPublic });
      this.updateLoading = false;
      if (res.data.code === 0) {
        this.$message.success('搞定！');
      } else {
        this.$message.error('有点问题！');
      }
    },
  },
};
</script>

<style lang="less" scoped>
  .talk-editor {
    position: relative;
    min-height: 100px;
    padding: 10px 20px;
    .editor__content {
      min-height: 50px;
    }
    .menubar {
      display: flex;
      flex-direction: row;
      align-items: center;
      margin: 0 -5px;
      .menubar__button {
        padding: 0 5px;
      }
      .public-switch {
        position: absolute;
        right: 150px;
      }
      .talk-submit {
        position: absolute;
        right: 20px;
      }
      .talk-cancel {
        position: absolute;
        right: 80px;
      }
    }
  }
</style>
