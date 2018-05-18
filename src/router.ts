import { Component, Vue } from "vue-property-decorator";
import Router from "vue-router";

// @ts-ignore
import LoadDashboard from "@/views/LoadDashboard.vue";
//@ts-ignore
import Dashboard from "@/views/Dashboard.vue";
//@ts-ignore
import NewWallet from "@/views/NewWallet.vue";

Vue.use(Router);

export default new Router({
  routes: [
    {
      path: "/dashboard/load",
      name: "LoadDashboard",
      component: LoadDashboard
    },
    {
      path: "/dashboard",
      name: "Dashboard",
      component: Dashboard
    },
    {
      path: "/wallet/new",
      name: "NewWallet",
      component: NewWallet
    }
  ]
});
