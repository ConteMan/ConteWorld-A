(window["webpackJsonp"]=window["webpackJsonp"]||[]).push([["chunk-71948eca"],{"066e":function(t,e){t.exports={messages:{CN:{form:{platform:"平台",tags:"标签",title:"标题",published_at:"发布时间",info_at:"信息时间"}},HK:{form:{platform:"平台",title:"标题",tags:"标签",published_at:"发布时间",info_at:"信息时间"}},US:{form:{platform:"Platform",title:"Title",tags:"Tag",published_at:"Publish Time",info_at:"Information Time"}}}}},"1bed":function(t,e,n){"use strict";n.r(e);var i=function(){var t=this,e=t.$createElement,n=t._self._c||e;return n("page-view-slot",{staticClass:"no-page-header",attrs:{"show-header":!1},scopedSlots:t._u([{key:"router-view",fn:function(){return[n("div",{staticClass:"base-container",style:{height:t.worldlineContainerHeight}},[n("div",{staticClass:"bar"},[n("div",{staticClass:"type"},[t.types.length>0?[t._l(t.types,(function(e){return[n("div",{key:e.key,staticClass:"item",class:{active:e.key===t.type&&"list"===t.showType},on:{click:function(n){return t.changeType(e.key)}}},[t._v(" "+t._s(e.value)+" "),n("p",[t._v(t._s(e.total))])])]}))]:t._e()],2),n("div",{staticClass:"action"},[n("div",{staticClass:"item",class:{active:"action"===t.showType},on:{click:function(e){return t.changeShowType()}}},[t._v(" More ")])])]),n("div",{staticClass:"list-container",style:{height:t.listContainerHeight}},[n("div",{directives:[{name:"show",rawName:"v-show",value:"list"===t.showType,expression:"showType === 'list'"},{name:"infinite-scroll",rawName:"v-infinite-scroll",value:t.loadMore,expression:"loadMore"}],staticClass:"list-content",style:{height:t.listContainerHeight},attrs:{"infinite-scroll-delay":"1000","infinite-scroll-disabled":"busy","infinite-scroll-distance":"150","infinite-scroll-immediate-check":"true"}},[t.items.length?[t._l(t.items,(function(e){return[n("div",{key:e.id,staticClass:"list-item"},[n("div",[n("div",{staticClass:"pic"},[n("img",{attrs:{referrerpolicy:"no-referrer",src:e.content_origin.pic}})]),n("div",{staticClass:"title"},[n("a",{attrs:{href:e.content_origin.link,target:"_blank"}},[t._v(t._s(e.content))])]),n("div",{staticClass:"intro"},[t._v(" "+t._s(e.content_origin.author+" / "+e.content_origin.publisher+" / "+e.content_origin.publishDate)+" ")]),n("div",{staticClass:"rate"},[e.content_origin.rate?n("a-rate",{attrs:{disabled:""},model:{value:e.content_origin.rate,callback:function(n){t.$set(e.content_origin,"rate",n)},expression:"item.content_origin.rate"}}):t._e()],1),e.content_origin.comment?n("div",{staticClass:"comment"},[t._v(" "+t._s(e.content_origin.comment)+" ")]):t._e()]),n("div",{staticClass:"info"},[n("span",{staticClass:"time"},["douban"===e.platform?[t._v(" "+t._s(t.dayjs(e.platform_created_at).format("YYYY-MM-DD"))+" ")]:[t._v(" "+t._s(t.dayjs(e.platform_created_at).format("YYYY-MM-DD HH:mm:ss"))+" ")]],2),n("span",{staticClass:"platform-type"},[t._v(t._s(e.platform_type_des.value))])])])]}))]:t._e()],2),n("div",{directives:[{name:"show",rawName:"v-show",value:"action"===t.showType,expression:"showType === 'action'"}],staticClass:"action-content"},[n("div",{staticClass:"action-item"},[n("div",{staticClass:"left"},[t._v(" 同步数据 ")]),n("div",{staticClass:"right"},[n("a-space",[n("a-button",{attrs:{size:"small",loading:t.syncLoading},on:{click:function(e){return t.sync()}}},[t._v(" 同步 ")]),n("a-button",{attrs:{size:"small",loading:t.syncLoading},on:{click:function(e){return t.sync(!0)}}},[t._v(" 强制同步 ")])],1)],1)])])])])]},proxy:!0}])})},a=[],s=(n("99af"),n("96cf"),n("c964")),r=n("2ef0"),o=n.n(r),c=n("5a0c"),l=n.n(c),u=n("487a"),d=n.n(u),f=n("c5de"),m=n("dde5"),h={name:"Book",i18n:n("066e"),directives:{infiniteScroll:d.a},components:{PageViewSlot:f["a"]},data:function(){return{items:[],offset:0,type:"",limit:20,busy:!1,total:0,dayjs:l.a,types:[],pageHeight:document.body.clientHeight,showType:"list",syncLoading:!1}},computed:{worldlineContainerHeight:function(){return this.pageHeight-64+"px"},listContainerHeight:function(){return this.pageHeight-64+"px"}},created:function(){var t=this;return Object(s["a"])(regeneratorRuntime.mark((function e(){var n;return regeneratorRuntime.wrap((function(e){while(1)switch(e.prev=e.next){case 0:return e.next=2,t.getTypes();case 2:return e.next=4,t.index();case 4:n=t,window.onresize=function(){return function(){n.pageHeight=document.body.clientHeight}()};case 6:case"end":return e.stop()}}),e)})))()},methods:{init:function(){this.items=[],this.offset=0,this.busy=!1},index:function(){var t=this;return Object(s["a"])(regeneratorRuntime.mark((function e(){var n,i,a,s,r,c,l;return regeneratorRuntime.wrap((function(e){while(1)switch(e.prev=e.next){case 0:return n=t.offset,i=t.limit,a=t.type,e.next=3,m["b"].index({offset:n,limit:i,type:a});case 3:s=e.sent,0===s.data.code&&(r=s.data.data,c=r.items,l=r.totalCount,t.total=l,c.length>0?(t.items=o.a.concat(t.items,c),t.busy=!1):t.busy=!0);case 5:case"end":return e.stop()}}),e)})))()},loadMore:function(){this.offset+=this.limit,this.index()},getTypes:function(){var t=this;return Object(s["a"])(regeneratorRuntime.mark((function e(){var n;return regeneratorRuntime.wrap((function(e){while(1)switch(e.prev=e.next){case 0:return e.next=2,m["b"].types();case 2:n=e.sent,0===n.data.code&&(t.types=n.data.data.items,t.type=n.data.data.items[0].key);case 4:case"end":return e.stop()}}),e)})))()},changeType:function(t){if(this.changeShowType("list"),t===this.type)return!0;this.type=t,this.init(),this.index()},changeShowType:function(){var t=arguments.length>0&&void 0!==arguments[0]?arguments[0]:"action";this.showType=t},sync:function(){var t=arguments,e=this;return Object(s["a"])(regeneratorRuntime.mark((function n(){var i,a;return regeneratorRuntime.wrap((function(n){while(1)switch(n.prev=n.next){case 0:return i=t.length>0&&void 0!==t[0]&&t[0],e.syncLoading=!0,n.next=4,m["b"].sync(i);case 4:a=n.sent,e.syncLoading=!1,0===a.data.code?e.$message.success("搞定！（"+a.data.data.totalCount+"）"):e.$message.error("有点问题！");case 7:case"end":return n.stop()}}),n)})))()}}},p=h,g=(n("82b0"),n("2877")),v=Object(g["a"])(p,i,a,!1,null,"4542b8c4",null),y=v.exports;e["default"]=y},41063:function(t,e,n){},"487a":function(t,e,n){(function(e,n){t.exports=n()})(0,(function(){"use strict";var t="@@InfiniteScroll",e=function(t,e){var n,i,a,s,r,o=function(){t.apply(s,r),i=n};return function(){if(s=this,r=arguments,n=Date.now(),a&&(clearTimeout(a),a=null),i){var t=e-(n-i);t<0?o():a=setTimeout((function(){o()}),t)}else o()}},n=function(t){return t===window?Math.max(window.pageYOffset||0,document.documentElement.scrollTop):t.scrollTop},i=document.defaultView.getComputedStyle,a=function(t){var e=t;while(e&&"HTML"!==e.tagName&&"BODY"!==e.tagName&&1===e.nodeType){var n=i(e).overflowY;if("scroll"===n||"auto"===n)return e;e=e.parentNode}return window},s=function(t){return t===window?document.documentElement.clientHeight:t.clientHeight},r=function(t){return t===window?n(window):t.getBoundingClientRect().top+n(window)},o=function(t){var e=t.parentNode;while(e){if("HTML"===e.tagName)return!0;if(11===e.nodeType)return!1;e=e.parentNode}return!1},c=function(){if(!this.binded){this.binded=!0;var t=this,n=t.el,i=n.getAttribute("infinite-scroll-throttle-delay"),s=200;i&&(s=Number(t.vm[i]||i),(isNaN(s)||s<0)&&(s=200)),t.throttleDelay=s,t.scrollEventTarget=a(n),t.scrollListener=e(l.bind(t),t.throttleDelay),t.scrollEventTarget.addEventListener("scroll",t.scrollListener),this.vm.$on("hook:beforeDestroy",(function(){t.scrollEventTarget.removeEventListener("scroll",t.scrollListener)}));var r=n.getAttribute("infinite-scroll-disabled"),o=!1;r&&(this.vm.$watch(r,(function(e){t.disabled=e,!e&&t.immediateCheck&&l.call(t)})),o=Boolean(t.vm[r])),t.disabled=o;var c=n.getAttribute("infinite-scroll-distance"),u=0;c&&(u=Number(t.vm[c]||c),isNaN(u)&&(u=0)),t.distance=u;var d=n.getAttribute("infinite-scroll-immediate-check"),f=!0;d&&(f=Boolean(t.vm[d])),t.immediateCheck=f,f&&l.call(t);var m=n.getAttribute("infinite-scroll-listen-for-event");m&&t.vm.$on(m,(function(){l.call(t)}))}},l=function(t){var e=this.scrollEventTarget,i=this.el,a=this.distance;if(!0===t||!this.disabled){var o=n(e),c=o+s(e),l=!1;if(e===i)l=e.scrollHeight-c<=a;else{var u=r(i)-r(e)+i.offsetHeight+o;l=c+a>=u}l&&this.expression&&this.expression()}},u={bind:function(e,n,i){e[t]={el:e,vm:i.context,expression:n.value};var a=arguments;e[t].vm.$on("hook:mounted",(function(){e[t].vm.$nextTick((function(){o(e)&&c.call(e[t],a),e[t].bindTryCount=0;var n=function n(){e[t].bindTryCount>10||(e[t].bindTryCount++,o(e)?c.call(e[t],a):setTimeout(n,50))};n()}))}))},unbind:function(e){e&&e[t]&&e[t].scrollEventTarget&&e[t].scrollEventTarget.removeEventListener("scroll",e[t].scrollListener)}},d=function(t){t.directive("InfiniteScroll",u)};return window.Vue&&(window.infiniteScroll=u,Vue.use(d)),u.install=d,u}))},"82b0":function(t,e,n){"use strict";n("41063")},c5de:function(t,e,n){"use strict";var i=function(){var t=this,e=t.$createElement,n=t._self._c||e;return n("page-layout",{attrs:{desc:t.desc,"link-list":t.linkList,"show-header":t.showHeader}},[t.extraImage&&!t.isMobile?n("div",{staticClass:"extraImg",attrs:{slot:"extra"},slot:"extra"},[n("img",{attrs:{src:t.extraImage}})]):t._e(),n("page-toggle-transition",{attrs:{disabled:t.animate.disabled,animate:t.animate.name,direction:t.animate.direction}},[t._t("router-view")],2)],1)},a=[],s=n("f3f3"),r=n("45eb"),o=n("7664"),c=n("5880"),l={name:"PageView",components:{PageToggleTransition:o["a"],PageLayout:r["a"]},props:{showHeader:{type:Boolean,default:!0}},data:function(){return{page:{desc:"",linkList:[],extraImage:""}}},computed:Object(s["a"])(Object(s["a"])({},Object(c["mapState"])("setting",["isMobile","multiPage","animate"])),{},{desc:function(){return this.page.desc},linkList:function(){return this.page.linkList},extraImage:function(){return this.page.extraImage}})},u=l,d=(n("e1df"),n("2877")),f=Object(d["a"])(u,i,a,!1,null,"9a8bef78",null);e["a"]=f.exports},e1df:function(t,e,n){"use strict";n("e930")},e930:function(t,e,n){}}]);