(window["webpackJsonp"]=window["webpackJsonp"]||[]).push([["chunk-6a544486"],{"90ac":function(e,t,a){"use strict";a("e9d9")},d8e6:function(e,t){e.exports={messages:{CN:{addTitle:"添加",form:{name:"名称",code:"编码",des:"描述",value_type:"值类型",value:"值内容",status:"状态"},result:{addSuccess:"添加成功！",addError:"添加失败!"}},HK:{addDrawerTitle:"添加",form:{name:"名称",code:"编码",des:"描述",value_type:"值类型",value:"值内容",status:"状态"},result:{addSuccess:"添加成功！",addError:"添加失败!"}},US:{addDrawerTitle:"Add",form:{name:"Name",code:"Code",des:"Description",value_type:"ValueType",value:"Value",status:"Status"},result:{addSuccess:"Add Success！",addError:"Add Failed!"}}}}},e9d9:function(e,t,a){},f4ee:function(e,t,a){"use strict";a.r(t);var r=function(){var e=this,t=e.$createElement,a=e._self._c||t;return a("a-card",{attrs:{bordered:!1}},[a("div",[a("div",{staticClass:"operator"},[a("a-button",{attrs:{type:"primary"},on:{click:e.showAdd}},[e._v(e._s(e.$t("add")))])],1),a("a-table",{attrs:{"row-key":"id","data-source":e.items,columns:e.columns,bordered:!0,pagination:e.pagination,scroll:{x:1e3}},on:{change:e.handleTableChange},scopedSlots:e._u([{key:"status",fn:function(t){return a("span",{},[a("a-tag",{attrs:{color:t.color}},[e._v(" "+e._s(t.value)+" ")])],1)}},{key:"date",fn:function(t){return a("span",{},[e._v(" "+e._s(e.$dayjs(t).format("YYYY-MM-DD HH:mm:ss"))+" ")])}},{key:"action",fn:function(t,r){return a("span",{},[a("a",{on:{click:function(t){return e.showEdit(r.id)}}},[e._v(e._s(e.$t("edit")))]),a("a-divider",{attrs:{type:"vertical"}}),a("a-popconfirm",{attrs:{title:e.$t("delConfirm"),"ok-text":"Yes","cancel-text":"No"},on:{confirm:function(t){return e.destroy(r.id)}}},[a("a",{attrs:{href:"#"}},[e._v(e._s(e.$t("delete")))])])],1)}}])}),a("a-drawer",{attrs:{title:e.$emptyObj(e.current)?e.$t("add"):e.$t("edit"),width:720,visible:e.drawerVisible,"body-style":{paddingBottom:"80px"}},on:{close:e.drawerClose}},[a("a-form-model",{ref:"drawerForm",attrs:{model:e.form,rules:e.rules,layout:"vertical"}},[a("a-row",{attrs:{gutter:16}},[a("a-col",{attrs:{span:24}},[a("a-form-model-item",{ref:"name",attrs:{label:e.$t("form.name"),prop:"name"}},[a("a-input",{on:{blur:function(){e.$refs.name.onFieldBlur()}},model:{value:e.form.name,callback:function(t){e.$set(e.form,"name",t)},expression:"form.name"}})],1)],1)],1),a("a-row",{attrs:{gutter:16}},[a("a-col",{attrs:{span:24}},[a("a-form-model-item",{attrs:{label:e.$t("form.code"),prop:"code"}},[a("a-input",{attrs:{disabled:e.codeInputDisable},model:{value:e.form.code,callback:function(t){e.$set(e.form,"code",t)},expression:"form.code"}})],1)],1)],1),a("a-row",{attrs:{gutter:16}},[a("a-col",{attrs:{span:24}},[a("a-form-model-item",{attrs:{label:e.$t("form.value_type"),prop:"value_type"}},[a("a-select",{model:{value:e.form.value_type,callback:function(t){e.$set(e.form,"value_type",t)},expression:"form.value_type"}},[a("a-select-option",{attrs:{value:"string"}},[e._v(" STRING ")]),a("a-select-option",{attrs:{value:"json"}},[e._v(" JSON ")]),a("a-select-option",{attrs:{value:"number"}},[e._v(" NUMBER ")])],1)],1)],1)],1),a("a-row",{attrs:{gutter:16}},[a("a-col",{attrs:{span:24}},[a("a-form-model-item",{attrs:{label:e.$t("form.value"),prop:"value"}},[a("a-textarea",{attrs:{rows:4},model:{value:e.form.value,callback:function(t){e.$set(e.form,"value",t)},expression:"form.value"}})],1)],1)],1),a("a-row",{attrs:{gutter:16}},[a("a-col",{attrs:{span:24}},[a("a-form-model-item",{attrs:{label:e.$t("form.des"),prop:"des"}},[a("a-textarea",{attrs:{rows:4},model:{value:e.form.des,callback:function(t){e.$set(e.form,"des",t)},expression:"form.des"}})],1)],1)],1),a("a-row",{attrs:{gutter:16}},[a("a-col",{attrs:{span:24}},[a("a-form-model-item",{attrs:{label:e.$t("form.status"),prop:"status"}},[a("a-radio-group",{model:{value:e.form.status,callback:function(t){e.$set(e.form,"status",t)},expression:"form.status"}},e._l(e.statuses,(function(t){return a("a-radio",{key:t.key,attrs:{value:t.key}},[e._v(" "+e._s(t.value)+" ")])})),1)],1)],1)],1)],1),a("div",{staticClass:"drawBottom"},[a("a-space",[a("a-button",{on:{click:e.resetForm}},[e._v(" "+e._s(e.$t("reset"))+" ")]),a("a-button",{attrs:{type:"primary",loading:e.submitLoading},on:{click:e.submit}},[e._v(" "+e._s(e.$t("submit"))+" ")])],1)],1)],1)],1)])},s=[],n=(a("96cf"),a("c964")),o=a("f3f3"),i=a("dde5"),d={name:"Config",i18n:a("d8e6"),data:function(){return{items:[],page:1,per_page:10,columns:[{title:"ID",dataIndex:"id",fixed:"left",width:60},{title:this.$t("form.name"),dataIndex:"name",width:200},{title:this.$t("form.code"),dataIndex:"code",width:200},{title:this.$t("form.value_type"),dataIndex:"value_type",width:100},{title:this.$t("form.value"),dataIndex:"value"},{title:this.$t("form.des"),dataIndex:"des",width:150},{title:this.$t("created_at"),dataIndex:"created_at",width:200,scopedSlots:{customRender:"date"}},{title:this.$t("updated_at"),dataIndex:"updated_at",width:200,scopedSlots:{customRender:"date"}},{title:this.$t("status"),dataIndex:"statusObj",width:100,scopedSlots:{customRender:"status"}},{title:this.$t("action"),key:"action",fixed:"right",width:120,scopedSlots:{customRender:"action"}}],pagination:{},current:{},drawerVisible:!1,statuses:[],formInit:{name:void 0,code:void 0,des:void 0,value_type:"text",value:void 0,status:1},form:{name:void 0,code:void 0,des:void 0,value_type:"text",value:void 0,status:1},rules:{name:[{required:!0,message:"请输入名称",trigger:"blur"}],code:[{required:!0,message:"请输入编码",trigger:"blur"}],value_type:[{required:!0,message:"请选择值类型",trigger:"blur"}],value:[{required:!0,message:"请输入值内容",trigger:"blur"}],status:[{required:!0,message:"请选择状态",trigger:"blur"}]},submitLoading:!1,codeInputDisable:!1}},mounted:function(){this.initIndex(),this.getStatuses()},methods:{handleTableChange:function(e){var t=Object(o["a"])({},this.pagination);t.current=e.current,this.pagination=t,this.index({page:e.current,per_page:e.pageSize})},index:function(e){var t=this;return Object(n["a"])(regeneratorRuntime.mark((function a(){var r,s;return regeneratorRuntime.wrap((function(a){while(1)switch(a.prev=a.next){case 0:return a.next=2,i["h"].index(e);case 2:r=a.sent,t.items=r.data.data.items,s=Object(o["a"])({},t.pagination),s.total=r.data.data.total_count,t.pagination=s;case 7:case"end":return a.stop()}}),a)})))()},initIndex:function(){var e={page:this.page,per_page:this.per_page};this.index(e);var t=Object(o["a"])({},this.pagination);t.current=this.page,this.pagination=t},getStatuses:function(){var e=this;return Object(n["a"])(regeneratorRuntime.mark((function t(){var a;return regeneratorRuntime.wrap((function(t){while(1)switch(t.prev=t.next){case 0:return t.next=2,i["h"].statuses();case 2:a=t.sent,0===a.data.code&&(e.statuses=a.data.data.items);case 4:case"end":return t.stop()}}),t)})))()},showAdd:function(){var e=this;this.drawerVisible=!0,this.$nextTick((function(){e.codeInputDisable=!1,e.form=e.formInit,e.current={},e.$refs.drawerForm.resetFields()}))},showEdit:function(e){var t=this;return Object(n["a"])(regeneratorRuntime.mark((function a(){var r,s;return regeneratorRuntime.wrap((function(a){while(1)switch(a.prev=a.next){case 0:return a.next=2,i["h"].edit(e);case 2:r=a.sent,0===r.data.code?(s=r.data.data.res,t.drawerVisible=!0,t.codeInputDisable=!1,t.$nextTick((function(){t.current=s,t.form=s,t.$refs.drawerForm.resetFields()}))):t.$message.error(r.data.msg?r.data.msg:t.$t("result.editError"));case 4:case"end":return a.stop()}}),a)})))()},submit:function(){var e=this;return Object(n["a"])(regeneratorRuntime.mark((function t(){return regeneratorRuntime.wrap((function(t){while(1)switch(t.prev=t.next){case 0:e.$refs.drawerForm.validate(function(){var t=Object(n["a"])(regeneratorRuntime.mark((function t(a){var r;return regeneratorRuntime.wrap((function(t){while(1)switch(t.prev=t.next){case 0:if(!a){t.next=16;break}if(e.submitLoading=!0,r={},!e.$emptyObj(e.current)){t.next=9;break}return t.next=6,i["h"].create(e.form);case 6:r=t.sent,t.next=12;break;case 9:return t.next=11,i["h"].update(e.current.id,e.form);case 11:r=t.sent;case 12:e.submitLoading=!1,0===r.data.code?(e.$message.success(e.$t("result.success")),e.drawerVisible=!1,e.initIndex()):e.$message.error(r.data.msg?r.data.msg:e.$t("result.error")),t.next=17;break;case 16:return t.abrupt("return",!1);case 17:case"end":return t.stop()}}),t)})));return function(e){return t.apply(this,arguments)}}());case 1:case"end":return t.stop()}}),t)})))()},destroy:function(e){var t=this;return Object(n["a"])(regeneratorRuntime.mark((function a(){var r;return regeneratorRuntime.wrap((function(a){while(1)switch(a.prev=a.next){case 0:return a.next=2,i["h"].destroy(e);case 2:r=a.sent,0===r.data.code?(t.$message.success(t.$t("result.success")),t.initIndex()):t.$message.error(r.data.msg?r.data.msg:t.$t("result.error"));case 4:case"end":return a.stop()}}),a)})))()},resetForm:function(){this.$refs.drawerForm.resetFields()},drawerClose:function(){this.drawerVisible=!1}}},u=d,c=(a("90ac"),a("2877")),l=Object(c["a"])(u,r,s,!1,null,"b9b97adc",null),m=l.exports;t["default"]=m}}]);