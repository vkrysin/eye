import { createRouter, createWebHistory } from "@ionic/vue-router";
import { RouteRecordRaw } from "vue-router";
import AddEquipmentPage from "@/views/AddEquipmentPage.vue";
import EquipmentPage from "@/views/EquipmentPage.vue";

const routes: Array<RouteRecordRaw> = [
  // DEFAULT LAYOUT
  {
    path: "/",
    redirect: "/home",
  },
  {
    path: "/home",
    component: () => import("@/views/MainPage.vue"),
  },
  {
    path: "/add_equipment/:equipmentName",
    name: "addEquipmentPage",
    component: AddEquipmentPage,
  },

  {
    path: "/equipment_page/:equipmentType/:id",
    name: "equipmentPage",
    component: EquipmentPage,
    props: true,
  },

  // NOT FOUND
  {
    path: "/:pathMatch(.*)*",
    name: "not-found",
    component: () => import("@/views/not-found.vue"),
  },
];

const router = createRouter({
  history: createWebHistory(process.env.BASE_URL),
  routes,
});

export default router;
