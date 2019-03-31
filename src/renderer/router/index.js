import Vue from "vue";
import Router from "vue-router";
import OCR from "@/components/OCR";
import CAM from "@/components/CAM";
Vue.use(Router);

export default new Router({
  routes: [
    {
      path: "/",
      name: "OCR",
      component: OCR
    },
    {
      path: "/CAM",
      name: "CAM",
      component: CAM
    },
    {
      path: "*",
      redirect: "/"
    }
  ]
});
