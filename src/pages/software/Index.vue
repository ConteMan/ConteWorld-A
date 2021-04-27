<template>
  <div>
    <a-card
      class="action-bar"
      :bordered="false"
    >
      <a-button
        type="primary"
        size="small"
        @click="drawOpen(false)"
      >
        {{ $t('add') }}
      </a-button>

      <div class="tag">
        <a-checkable-tag
          class="pointer"
          :checked="!checkedTag.length"
          @change="indexTagChange(undefined, $event)"
        >
          全部
        </a-checkable-tag>
        <a-checkable-tag
          v-for="item in tags"
          :key="item.id"
          class="pointer"
          :checked="checkedTag.includes(item.id)"
          @change="indexTagChange(item, $event)"
        >
          {{ item.name }}
        </a-checkable-tag>
      </div>

      <div class="status">
        <a-checkable-tag
          class="pointer"
          :checked="typeof checkedStatus === 'undefined'"
          @change="indexStatusChange(undefined, $event)"
        >
          全部
        </a-checkable-tag>
        <a-checkable-tag
          v-for="status in statuses"
          :key="status.key"
          class="pointer"
          :checked="checkedStatus === status.key"
          @change="indexStatusChange(status.key, $event)"
        >
          {{ status.value }}
        </a-checkable-tag>
      </div>
    </a-card>

    <a-card :bordered="false">
      <a-list
        item-layout="vertical"
        :loading="loading"
        :data-source="items"
        :bordered="false"
      >
        <a-list-item
          slot="renderItem"
          key="item.slug"
          slot-scope="item"
          class="list-item"
        >
          <template slot="extra">
            <a-space>
              <a-icon type="edit" :title="$t('edit')" @click="drawOpen(true, item.id)" />
            </a-space>
          </template>
          <div class="title">
            {{ item.name }}
          </div>
          <div v-if="item.version && Object.keys(item.version)" class="version">
            <a-space :size="20">
              <template v-for="(versionItem, versionIndex) in item.version">
                <span v-if="versionIndex === 'default'" :key="versionIndex">{{ versionItem.version }}</span>
                <span v-else :key="versionIndex">{{ versionIndex }} / {{ versionItem.version }}</span>
              </template>
            </a-space>
          </div>
        </a-list-item>
      </a-list>
    </a-card>

    <a-card :bordered="false">
      <a-pagination
        size="small"
        :current="page"
        :page-size="limit"
        :total="total"
        :page-size-options="pageSizeOptions"
        :show-size-changer="true"
        :show-less-items="true"
        @change="onPageChange"
        @showSizeChange="onSizeChange"
      >
        <template slot="buildOptionText" slot-scope="props">
          <span>{{ props.value }}</span>
        </template>
      </a-pagination>
    </a-card>

    <a-drawer
      :title="editMode ? $t('edit') : $t('add')"
      :width="720"
      :visible="drawVisible"
      :body-style="{ paddingBottom: '80px' }"
      @close="drawClose"
    >
      <a-form-model
        ref="drawerForm"
        :model="form"
        :rules="rules"
        layout="vertical"
      >
        <a-form-model-item label="名称" prop="name">
          <a-input v-model="form.name" />
        </a-form-model-item>
        <a-form-model-item label="网站" prop="site_url">
          <a-input v-model="form.site_url" />
        </a-form-model-item>
        <a-form-model-item label="简介" prop="description">
          <a-input v-model="form.description" />
        </a-form-model-item>
        <a-form-model-item label="版本">
          <div id="json-editor-version" class="json-editor" />
        </a-form-model-item>
        <a-form-model-item label="下载" prop="download_url">
          <a-input v-model="form.download_url" />
        </a-form-model-item>
        <a-form-model-item label="标签" prop="tags">
          <a-select
            mode="multiple"
            :value="form.tags"
            style="width: 100%"
            placeholder="Please select"
            @change="formTagChange"
          >
            <a-select-option v-for="item in tags" :key="item.id">
              {{ item.name }}
            </a-select-option>
          </a-select>
        </a-form-model-item>
        <a-form-model-item label="设置">
          <div id="json-editor-setting" class="json-editor" />
        </a-form-model-item>
        <a-form-model-item label="扩展">
          <div id="json-editor-extend" class="json-editor" />
        </a-form-model-item>
        <a-form-model-item label="状态">
          <a-select dropdown-class-name="item-min-width" :value="form.status" @change="formStatusChange">
            <a-select-option v-for="item in statuses" :key="item.key" :value="item.key">{{ item.value }}</a-select-option>
          </a-select>
        </a-form-model-item>
      </a-form-model>
      <div class="form-action">
        <a-space :size="16">
          <a-button :disabled="submitLoading" @click="drawClose">
            {{ $t('cancel') }}
          </a-button>
          <a-button type="primary" :loading="submitLoading" @click="formSubmit">
            {{ $t('submit') }}
          </a-button>
        </a-space>
      </div>
    </a-drawer>
  </div>
</template>

<script>
import { Software as Base, SoftwareTag } from '@/services';
import _ from 'lodash';
import JSONEditor from 'jsoneditor';
import 'jsoneditor/dist/jsoneditor.css';
import { isJSON } from '@/utils/util.js';

export default {
  name: 'Software',
  i18n: require('./i18n'),
  data() {
    const baseLimit = 100;
    return {
      loading: false,
      items: [],
      page: 1,
      offset: 0,
      limit: baseLimit,
      total: 0,

      pagination: {},
      pageSizeOptions: [
        String(baseLimit),
        String(baseLimit * 2),
      ],

      statuses: [],
      tags: [],
      checkedStatus: 1,
      checkedTag: [],

      current: {},

      editMode: false,
      drawVisible: false,
      submitLoading: false,
      formInit: {
        name: '',
        status: 1,
        site_url: '',
        description: '',
        tags: [],
        version: '',
        setting: '',
        extend: '',
      },
      form: {
        name: '',
        status: 1,
        site_url: '',
        description: '',
        tags: [],
        version: '',
        setting: '',
        extend: '',
      },
      rules: {
        name: [
          { required: true, message: '请输入名称', trigger: 'blur' },
        ],
      },

      jsonEditorInit: false,
      jsonEditorVersion: {},
      jsonEditorSetting: {},
      jsonEditorExtend: {},
    };
  },
  async created() {
    await this.getStatuses();
    await this.getTags();
    await this.index();
  },
  methods: {
    // 分页
    onSizeChange(current, size) {
      this.page = current;
      this.offset = (current - 1) * size;
      this.limit = this.offset + size;
      this.index();
    },
    onPageChange(page, pageSize) {
      this.page = page;
      this.offset = (page - 1) * pageSize;
      this.limit = this.offset + pageSize;
      this.index();
    },

    // 列表
    async index() {
      this.loading = true;
      const { offset, limit, checkedStatus: status, checkedTag: tag } = this;
      let tagStr = '';
      if (tag) {
        tagStr = tag.join(',');
      }
      const res = await Base.index({ offset, limit, status, tag: tagStr });
      if (res.data.code === 0) {
        const { items, totalCount } = res.data.data;
        this.items = items;
        this.total = totalCount;
      }
      this.loading = false;
    },
    indexStatusChange(status, checked) {
      if (checked) {
        this.checkedStatus = status;
      } else {
        this.checkedStatus = undefined;
      }
      this.index();
    },
    indexTagChange(item, checked) {
      if (checked) {
        if (typeof item === 'undefined') {
          this.checkedTag = [];
        } else {
          this.checkedTag.push(item.id);
        }
      } else {
        _.pull(this.checkedTag, item.id);
      }
      this.index();
    },
    initIndex() {
      this.page = 1;
      this.offset = 0;
      this.index();
    },

    async getStatuses() {
      const res = await Base.statuses();
      if (res.data.code === 0) {
        this.statuses = res.data.data.items;
      }
    },
    async getTags() {
      const res = await SoftwareTag.index({ offset: 0, limit: 100 });
      if (res.data.code === 0) {
        this.tags = res.data.data.items;
      }
    },

    async edit(id) {
      const res = await Base.edit(id);
      if (res.data.code === 0) {
        const item = res.data.data.item;
        this.current = item;
        this.form = item;
      }
    },

    async drawOpen(editMode = false, id = 0) {
      this.editMode = Boolean(editMode);
      this.form = { ...this.formInit };
      if (this.editMode) {
        await this.edit(id);
      }
      this.drawVisible = true;
      this.$nextTick(() => {
        if (!this.jsonEditorInit) {
          const containerVersion = document.getElementById('json-editor-version');
          const containerSetting = document.getElementById('json-editor-setting');
          const containerExtend = document.getElementById('json-editor-extend');
          const options = {
            modes: ['tree', 'code', 'form', 'text', 'view', 'preview'],
          };
          this.jsonEditorVersion = new JSONEditor(containerVersion, options);
          this.jsonEditorSetting = new JSONEditor(containerSetting, options);
          this.jsonEditorExtend = new JSONEditor(containerExtend, options);
          this.jsonEditorInit = true;
        }
        if (this.editMode) {
          this.jsonEditorVersion.set(this.current.version);
          this.jsonEditorSetting.set(this.current.setting);
          this.jsonEditorExtend.set(this.current.extend);
        } else {
          this.jsonEditorVersion.set({});
          this.jsonEditorSetting.set({});
          this.jsonEditorExtend.set({});
        }
      });
    },
    drawClose() {
      this.jsonEditorVersion.set('');
      this.jsonEditorSetting.set('');
      this.jsonEditorExtend.set('');
      this.$refs.drawerForm.resetFields();
      this.form = { ...this.formInit };
      this.editMode = false;
      this.current = {};
      this.drawVisible = false;
    },

    formStatusChange(value) {
      this.form.status = value;
    },
    formTagChange(value) {
      this.form.tags = value;
    },
    formSubmit() {
      this.$refs.drawerForm.validate(async valid => {
        try {
          if (valid) {
            const version = this.jsonEditorVersion.get();
            if (version && !isJSON(version)) {
              this.$message.error('version error');
              return false;
            }
            const setting = this.jsonEditorSetting.get();
            if (setting && !isJSON(setting)) {
              this.$message.error('setting error');
              return false;
            }
            const extend = this.jsonEditorExtend.get();
            if (extend && !isJSON(extend)) {
              this.$message.error('extend error');
              return false;
            }
            const submitForm = { ...this.form };
            submitForm.version = version;
            submitForm.setting = setting;
            submitForm.extend = extend;
            this.submitLoading = true;

            let res = {};
            if (this.editMode) {
              res = await Base.update({ id: this.current.id, ...submitForm });
            } else {
              res = await Base.create(submitForm);
            }

            this.submitLoading = false;
            if (res.data.code === 0) {
              this.$message.success(this.$t('result.success'));
              this.$refs.drawerForm.resetFields();
              if (this.editMode) {
                this.drawClose();
              }
              this.initIndex();
            } else {
              this.$message.error(res.data.msg ? res.data.msg : this.$t('result.error'));
            }
          } else {
            return false;
          }
        } catch (e) {
          console.log(e);
          this.$message.error('extend error');
        }
      });
    }
  }
};
</script>

<style lang="less" scoped>
@import "./index";
</style>
