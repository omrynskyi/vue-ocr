import Vue from "vue";
import Router from "vue-router";

Vue.use(Router);

export default new Router({
  routes: [
    // {
    //   path: "/",
    //   name: "OCR",
    //   component: require("@/components/OCR").default
    // },
    {
      path: "/",
      name: "cam",
      component: require("@/components/cam").default
    },
    {
      path: "*",
      redirect: "/"
    }
  ]
});
