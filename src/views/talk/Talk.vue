<template>
  <page-view-slot
    class="no-page-header"
    :show-header="false"
  >
    <template #router-view>
      <div class="talk-container" :style="{ 'height': containerHeight + 'px' }">
        <div
          id="talk-editor"
          class="talk-editor editor"
        >
          <div
            id="editor-container"
            @click="focus"
            @keyup.ctrl.enter.capture.exact="talkSubmit"
          >
            <editor-content
              class="editor__content"
              :editor="editor"
            />
          </div>
          <editor-menu-bar v-slot="{ commands, isActive }" :editor="editor">
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
              <a-button
                type="link"
                class="menubar__button"
                @click="showImagePrompt(commands.image)"
              >
                <a-icon type="picture" />
              </a-button>
              <a-switch
                v-model="isPublic"
                class="public-switch"
                size="small"
                checked-children="公开"
                un-checked-children="私密"
              />
              <a-button
                type="primary"
                size="small"
                class="talk-submit"
                @click="talkSubmit"
              >
                发布
              </a-button>
            </div>
          </editor-menu-bar>
        </div>

        <div
          v-infinite-scroll="loadMore"
          infinite-scroll-delay="1000"
          infinite-scroll-disabled="busy"
          infinite-scroll-distance="50"
          infinite-scroll-immediate-check="true"
          class="list-content"
          :style="{ 'height': listHeight + 'px' }"
        >
          <div class="contribution">
            <contribution
              :data="contribution"
              :year="2021"
            />
          </div>
          <template v-for="(item, i) in items">
            <platform-type-item :key="i" :item="item" @remove-item="removeItem" />
          </template>
        </div>
      </div>
    </template>
  </page-view-slot>
</template>

<script>
import _ from 'lodash';
import dayjs from 'dayjs';
import infiniteScroll from 'vue-infinite-scroll';
import elementResizeDetectorMaker from 'element-resize-detector';
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
  Image,
} from 'tiptap-extensions';
import HardBreakPlus from '@/utils/tiptap/HardBreakPlus.js';
import PageViewSlot from '@/layouts/PageViewSlot';
import PlatformTypeItem from '@/components/item/PlatformTypeItem.vue';
import { Talk as Base } from '@/services';
import Contribution from '@/components/contribution/Contribution.vue';

export default {
  name: 'Talk',
  i18n: require('./i18n'),
  directives: {
    infiniteScroll,
  },
  components: {
    PageViewSlot,
    EditorContent,
    EditorMenuBar,
    PlatformTypeItem,
    Contribution,
  },
  data() {
    return {
      items: [],
      offset: 0,
      type: '',
      limit: 20,
      busy: false,
      total: 0,

      dayjs,
      pageHeight: window.innerHeight,
      talkEditorHeight: 100,

      editor: new Editor({
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
          new Image(),
        ],
        content: ``,
        autoFocus: true,
      }),

      keyCode1: '',
      keyCode2: '',

      isPublic: false,

      contribution: {},
    };
  },
  computed: {
    containerHeight() {
      return this.pageHeight - 64;
    },
    listHeight() {
      return this.pageHeight - this.talkEditorHeight - 64;
    },
  },
  created() {
    this.index();
    const that = this;
    window.onresize = () => {
      return (() => {
        that.pageHeight = window.innerHeight;
      })();
    };
    this.editor.focus();
    this.getContribution();
  },
  mounted() {
    const _this = this;
    const ERD = elementResizeDetectorMaker();
    ERD.listenTo(document.getElementById('talk-editor'), element => {
      const height = element.offsetHeight;
      _this.talkEditorHeight = height;
    });
    const editorContainerEl = document.getElementById('editor-container');
    editorContainerEl.addEventListener('keydown', this.keyDownDeal);
    editorContainerEl.addEventListener('keyup', this.keyUpDeal);
  },
  beforeDestroy() {
    this.editor.destroy();
  },
  methods: {
    init() {
      this.items = [];
      this.offset = 0;
      this.busy = false;
    },
    async index() {
      const { offset, limit, type } = this;
      const res = await Base.index({ offset, limit, type });
      if (res.data.code === 0) {
        const { items, totalCount } = res.data.data;
        this.total = totalCount;
        if (items.length > 0) {
          this.items = _.concat(this.items, items);
          this.busy = false;
        } else {
          this.busy = true;
        }
      }
    },
    loadMore() {
      this.offset += this.limit;
      this.index();
    },
    async talkSubmit() {
      if (this.createLoading) {
        return false;
      }
      const content = this.editor.getHTML();
      const content_origin = this.editor.getJSON();
      if (!content || content === '<p></p>') {
        this.$message.error('写点什么吧');
        return false;
      }
      this.createLoading = true;
      const res = await Base.create({ content, content_origin, is_public: this.isPublic });
      this.createLoading = false;
      if (res.data.code === 0) {
        this.editor.setContent('');
        this.init();
        this.index();
        this.getContribution();
        this.$message.success('搞定！');
      } else {
        this.$message.error('有点问题！');
      }
    },
    focus() {
      this.editor.focus();
    },
    keyDownDeal(e) {
      if (e.key === 'Meta') {
        this.keyCode1 = 'Meta';
      }
      if (e.key === 'Enter') {
        this.keyCode2 = 'Enter';
      }
      if (this.keyCode1 === 'Meta' && this.keyCode2 === 'Enter') {
        this.talkSubmit();
      }
    },
    keyUpDeal(e) {
      if (['Meta', 'Enter'].includes(e.key)) {
        this.keyCode1 = '';
        this.keyCode2 = '';
      }
    },
    removeItem(id) {
      console.log({ id });
      _.remove(this.items, item => {
        return item.id === id;
      });
      this.items = [...this.items];
    },
    showImagePrompt(command) {
      const src = prompt('Enter the url of your image here');
      if (src !== null) {
        command({ src });
      }
    },
    async getContribution() {
      const res = await Base.contribution();
      if (res.data.code === 0) {
        this.contribution = res.data.data;
      }
    }
  }
};
</script>

<style lang="less" scoped>
@import "./index";
</style>
