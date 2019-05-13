<template>
  <div>
    <!--Container-->
    <el-container class="hx-template-container">
      <!--Header-->
      <el-header class="hx-template-header">
        <div class="hx-logo"></div>
        <div
          v-loading="headerLoading"
          style="float: right;
					height: 60px;
					width: calc(100% - 200px);
					position: relative;"
        >
          <!--Header Menu-->
          <el-menu :default-active="state.menuActive" @select="select" mode="horizontal" router>
            <el-menu-item
              v-for="item in menu"
              :index="item.path"
              :key="item.path"
              v-text="item.name"
            ></el-menu-item>

            <el-submenu
              v-for="(item, index) in stadiumHeader"
              :index="item.stadiumUrl"
              :key="index"
            >
              <template slot="title">{{item.stadiumTitle}}</template>
              <el-menu-item
                v-for="val in submenuItem[index]"
                :index="val.path"
                :key="val.path"
                v-text="val.name"
              ></el-menu-item>
            </el-submenu>
          </el-menu>
          <div class="hx-template-header-right">
            <p class="hx-account align-center">{{ username }}</p>
            <div @click="dialogVisible=true">
              <i class="el-icon-back"></i>
              <span>退出登录</span>
            </div>
          </div>
        </div>
      </el-header>
      <!--Container children-->
      <el-container style="height: 100%;">
        <!--Aside-->
        <el-aside class="hx-template-aside">
          <!--Aside Menu-->
          <el-menu
            :unique-opened="true"
            @select="select"
            v-loading="sideLoading"
            :default-active="$route.path"
            v-if="sideBar"
            class="hx-aside-menu"
            router
          >
            <div v-for="(item, index) in sideBar" :key="index">
              <el-submenu v-if="sideBar[index].sub.length > 0" :index="item.path" :key="item.name">
                <template slot="title">{{item.name}}</template>
                <el-menu-item
                  v-for="val in item.sub"
                  :index="val.path"
                  :key="val.index"
                >{{val.name}}</el-menu-item>
              </el-submenu>
              <el-menu-item
                v-if="sideBar[index].sub.length === 0"
                :index="item.path"
                :key="item.name"
              >
                <template slot="title">{{item.name}}</template>
              </el-menu-item>
            </div>
          </el-menu>
        </el-aside>
        <!--Main-->
        <el-main class="hx-template-main">
          <transition name="fade" mode="out-in" appear>
            <!--Router View-->
            <router-view></router-view>
          </transition>
        </el-main>
      </el-container>
      <!--<el-footer class="hx-template-footer">-->
      <!--</el-footer>-->
    </el-container>
    <el-dialog
      class="hx-login-out-template"
      title="提示"
      :visible.sync="dialogVisible"
      width="40%"
      :close-on-click-modal="false"
      :close-on-press-escape="false"
    >
      <h3 class="align-center">确认退出韩希甄选商家端？</h3>
      <span slot="footer" class="dialog-footer">
        <el-button size="small" type="primary" @click="linkToLoginPage">确 定</el-button>
        <el-button size="small" @click="dialogVisible = false;">取 消</el-button>
      </span>
    </el-dialog>
  </div>
</template>

<script>
export default {
  name: "App",
  data() {
    return {
      state: {
        menu: [],
        menuActive: ""
      },
      submenu: [],
      submenuItem: [],
      stadiumHeader: [],
      sideBarActive: "",
      dialogVisible: false,
      headerLoading: false,
      sideLoading: false,
      username: ""
    };
  },
  computed: {
    menu() {
      if (this.state.menu.length > 0) {
        let result = this.state.menu.map(val => {
          if (!val.submenu) {
            return {
              name: val.resourcesName,
              path: val.resourcesUrl
            };
          } else {
            this.submenu = this.submenu.concat(val);
          }
        });
        result.map((item, index) => {
          if (item === undefined) {
            result.splice(index, 1);
          }
        });
        return result;
      }
    },
    menuActive() {
      // return this.state.menu[0].resourcesUrl;
      return "/" + this.$route.fullPath.split("/")[1];
    },
    sideBar() {
      let sideBarList = [];
      let resourceId = "";
      if (this.state.menu.length > 0) {
        const menuObj = this.state.menu.find(val => {
          let compareUrl = "/" + val.resourcesUrl.split("/")[1];
          return compareUrl === this.menuActive;
        });
        if (menuObj) {
          let arr = [];
          if (menuObj.submenu) {
            resourceId = parseInt(this.$route.params.stadiumType);
            if (resourceId) {
              arr = arr.concat(menuObj.submenu[0].childResourcesEntityList);
            }
          } else {
            arr = menuObj.childResourcesEntityList;
          }
          sideBarList = arr.map(val => ({
            name: val.resourcesName,
            path:
              val.childResourcesEntityList.length === 0
                ? val.resourcesUrl
                : String(val.id),
            sub: val.childResourcesEntityList.map(val => ({
              name: val.resourcesName,
              path: String(val.resourcesUrl)
            }))
          }));
        }
      }
      return sideBarList;
    }
  },
  methods: {
    /**
     * 菜单激活回调
     * @param val
     */
    select(val) {
      localStorage.setItem("active", val);
    },
    /**
     * 跳转至登录页
     */
    linkToLoginPage() {
      this.$router.push({
        name: "login"
      });
    }
  },
  created() {
    this.state.menu = [
      {
        id: 1,
        resourcesUrl: "/businessSystem/1",
        resourcesName: "商家系统",
        childResourcesEntityList: [
          {
            id: 110,
            resourcesUrl: "",
            resourcesName: "订单管理",
            childResourcesEntityList: [
              {
                id: 111,
                resourcesUrl:
                  "/businessSystem/1/orderManagement/pendingPayment",
                resourcesName: "待付款订单",
                childResourcesEntityList: []
              },
              {
                id: 112,
                resourcesUrl: "/businessSystem/1/orderManagement/preDeliver",
                resourcesName: "待发货订单",
                childResourcesEntityList: []
              },
              {
                id: 113,
                resourcesUrl: "/businessSystem/1/orderManagement/hasDelivered",
                resourcesName: "已发货订单",
                childResourcesEntityList: []
              },
              {
                id: 114,
                resourcesUrl: "/businessSystem/1/orderManagement/hasCompleted",
                resourcesName: "已完成订单",
                childResourcesEntityList: []
              }
              // ,
              // {
              //   id: 114,
              //   resourcesUrl: "/businessSystem/1/orderManagement/refund",
              //   resourcesName: "退货订单",
              //   childResourcesEntityList: []
              // }
            ]
          },
          {
            id: 100,
            resourcesUrl: "",
            resourcesName: "商品管理",
            childResourcesEntityList: [
              {
                id: 101,
                resourcesUrl: "/businessSystem/1/goodsManagement/goodsList",
                resourcesName: "商品列表",
                childResourcesEntityList: []
              }
            ]
          }
        ]
      }
    ];

    if (!localStorage.getItem("active")) {
      localStorage.setItem("active", this.state.menu[0].resourcesUrl);
    } else {
      localStorage.setItem("active", this.$route.fullPath);
    }
    this.$router.push({
      path: localStorage.getItem("active")
    });
    this.state.menuActive = this.$route.fullPath;
  },
  watch: {
    submenu(val, oldVal) {
      val.map(item => {
        this.stadiumHeader.push({
          stadiumTitle: item.resourcesName,
          stadiumUrl: item.resourcesUrl
        });
        this.submenuItem.push(
          item.submenu.map(item1 => ({
            name: item1.resourcesName,
            path: item1.resourcesUrl
          }))
        );
      });
    }
  }
};
</script>

<style lang="less" scoped>
.hx-template-container {
  position: absolute;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  .hx-template-header {
    padding: 0;
    .hx-logo {
      width: 200px;
      height: 100%;
      float: left;
      position: relative;
      img {
        position: absolute;
        left: 0;
        top: 0;
        width: 100%;
        height: 100%;
      }
    }
    .hx-template-header-right {
      position: absolute;
      right: 20px;
      top: 0;
      line-height: 60px;
      cursor: pointer;
      font-size: 14px;
      display: flex;
      .hx-account {
        margin-right: 10px;
        color: rgba(15, 182, 211, 0.808);
        width: 100px;
        overflow: hidden;
        -ms-text-overflow: ellipsis;
        text-overflow: ellipsis;
        white-space: nowrap;
      }
      .login-out-style:hover {
        color: rgba(15, 182, 211, 0.808);
      }
    }
  }
  .hx-template-aside {
    height: 100%;
    width: 200px !important;
    .hx-aside-menu {
      height: 100%;
    }
  }
  .hx-template-main {
  }
  .hx-template-footer {
  }
}

.hx-login-out-template {
  .el-dialog__footer {
    text-align: center;
  }
}
</style>