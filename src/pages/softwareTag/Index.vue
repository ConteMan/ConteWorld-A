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
        <a-form-model-item label="标题" prop="name">
          <a-input v-model="form.name" />
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
import { SoftwareTag as Base } from '@/services';

export default {
  name: 'SoftwareTag',
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
      checkedStatus: 1,

      current: {},

      editMode: false,
      drawVisible: false,
      submitLoading: false,
      form: {
        name: '',
        status: 1,
      },
      rules: {
        name: [
          { required: true, message: '标签是啥', trigger: 'blur' },
        ],
      },
    };
  },
  async created() {
    await this.getStatuses();
    await this.index();
  },
  methods: {
    // 分页
    onSizeChange(current, size) {
      this.page = current;
      this.offset = (current - 1) * size;
      this.limit = size;
      this.index();
    },
    onPageChange(page, pageSize) {
      this.page = page;
      this.offset = (page - 1) * pageSize;
      this.limit = pageSize;
      this.index();
    },

    // 列表
    async index() {
      this.loading = true;
      const { offset, limit, checkedStatus: status } = this;
      const res = await Base.index({ offset, limit, status });
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

    async edit(id) {
      const res = await Base.edit(id);
      if (res.data.code === 0) {
        const item = res.data.data.item;
        this.current = item;
        this.form.name = item.name;
        this.form.status = item.status;
      }
    },

    async drawOpen(editMode = false, id = 0) {
      this.editMode = Boolean(editMode);
      if (this.editMode) {
        await this.edit(id);
      }
      this.drawVisible = true;
    },
    drawClose() {
      this.drawVisible = false;
      this.$refs.drawerForm.resetFields();
      this.current = {};
    },

    formStatusChange(value) {
      this.form.status = value;
    },
    formSubmit() {
      this.$refs.drawerForm.validate(async valid => {
        if (valid) {
          this.submitLoading = true;
          let res = {};
          if (this.editMode) {
            res = await Base.update({ id: this.current.id, ...this.form });
          } else {
            res = await Base.create(this.form);
          }
          this.submitLoading = false;
          if (res.data.code === 0) {
            this.$message.success(this.$t('result.success'));
            this.$refs.drawerForm.resetFields();
            if (this.editMode) {
              this.current = {};
            }
            this.initIndex();
          } else {
            this.$message.error(res.data.msg ? res.data.msg : this.$t('result.error'));
          }
        } else {
          return false;
        }
      });
    }
  }
};
</script>

<style lang="less" scoped>
@import "./index";
</style>
