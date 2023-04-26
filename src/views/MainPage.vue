<template>
  <ion-header>
    <ion-toolbar class="font-sans text-black">
      <ion-title class="text-xl">Список оборудования(16)</ion-title>
      <!-- <ion-progress-bar type="indeterminate"></ion-progress-bar> -->
    </ion-toolbar>
  </ion-header>
  <ion-content class="h-[85%] overflow-y-scroll">
    <div class="mt-2 flex flex-wrap justify-between">
      <ion-card
        v-for="item in equipment.sort(compare)"
        :key="item.name"
        class="w-[44%]"
        :class="{ 'w-full': item.type === 'group' }"
      >
        <ion-card-header
          class="-mr-7 flex items-center justify-between pl-3 pt-2 pb-0"
        >
          <ion-toggle
            v-model="item.isTracking"
            mode="ios"
            color="success"
          ></ion-toggle>
          <ion-card-subtitle
            v-if="item.type === 'group'"
            class="mt-2 flex justify-center pl-3 font-sans text-xl font-medium text-black"
            >{{ item.name }}</ion-card-subtitle
          >
          <div class="mr-5 flex justify-center active:scale-95">
            <ion-icon class="h-10 w-10" color="dark" :icon="closeOutline" />
          </div>
        </ion-card-header>
        <template v-if="item.type !== 'group'">
          <div class="flex justify-center">
            <ion-icon
              class="h-16 w-16 pl-3"
              :icon="item.type === 'camera' ? cameraOutline : radioOutline"
            ></ion-icon>
          </div>
        </template>
        <template v-else>
          <ion-list>
            <ion-item
              v-for="sensor in item.children"
              :key="sensor.name"
              class="relative mr-2"
            >
              <ion-icon
                class="absolute my-2 h-10 w-10"
                :icon="radioOutline"
                slot="start"
              ></ion-icon>
              <div class="m-0 ml-20 flex items-end gap-3 font-sans text-lg">
                {{ sensor.name }}
                <div class="font-medium text-green-600">
                  {{ item.signalQuality }}
                </div>
              </div>

              <div class="-mr-2 flex justify-center active:scale-95" slot="end">
                <ion-icon class="h-7 w-7 text-red-700" :icon="trashOutline" />
              </div>
            </ion-item>
          </ion-list>
        </template>

        <div
          v-if="item.type !== 'group'"
          class="flex items-center justify-end py-2 pr-4 font-sans text-base font-bold text-green-600"
        >
          {{ item.signalQuality }}
        </div>
        <div
          v-else
          class="ml-24 flex items-center justify-between py-3 text-base"
        >
          <div>
            <span class="mr-2 font-sans font-normal text-black"
              >Среднее по группе:</span
            >
            <span class="font-semibold text-green-600">{{
              item.signalQuality
            }}</span>
          </div>
          <div class="mr-3 flex justify-center active:scale-95" slot="end">
            <ion-icon class="h-8 w-8 text-green-600" :icon="addCircleOutline" />
          </div>
        </div>
      </ion-card>
    </div>
  </ion-content>
  <ion-footer>
    <ion-toolbar>
      <div class="flex items-center justify-between px-7">
        <div
          class="flex items-center rounded-lg bg-[#e4e4e4] px-10 py-0.5 active:scale-95"
        >
          <ion-icon class="h-10 w-10" color="dark" :icon="radioOutline" />
        </div>
        <div
          class="flex items-center rounded-lg bg-[#e4e4e4] px-10 py-0.5 active:scale-95"
        >
          <img
            class="h-10 w-10"
            src="../../public/assets/icon/add_camera.svg"
            alt=""
          />
        </div>
      </div>
    </ion-toolbar>
  </ion-footer>
</template>

<script lang="ts" setup>
import { ref } from "vue";
import {
  IonHeader,
  IonToolbar,
  IonTitle,
  IonCard,
  IonToggle,
  IonCardSubtitle,
  IonCardHeader,
  IonIcon,
  IonButton,
  IonFooter,
  IonContent,
  IonList,
} from "@ionic/vue";
import {
  cameraOutline,
  closeOutline,
  radioOutline,
  trashOutline,
  addCircleOutline,
} from "ionicons/icons";

const equipment = ref([
  {
    type: "camera",
    name: "Camera 1",
    isTracking: true,
    signalQuality: 80,
  },
  {
    type: "camera",
    name: "Camera 4",
    isTracking: false,
    signalQuality: 80,
  },
  {
    type: "camera",
    name: "Camera 3",
    isTracking: true,
    signalQuality: 80,
  },
  {
    type: "sensor",
    name: "Sensor 2",
    isTracking: false,
    signalQuality: 80,
  },
  {
    type: "camera",
    name: "Camera 1",
    isTracking: true,
    signalQuality: 80,
  },
  {
    type: "camera",
    name: "Camera 4",
    isTracking: false,
    signalQuality: 80,
  },
  {
    type: "camera",
    name: "Camera 3",
    isTracking: true,
    signalQuality: 80,
  },
  {
    type: "sensor",
    name: "Sensor 2",
    isTracking: false,
    signalQuality: 80,
  },
  {
    type: "group",
    name: "Sensors G",
    isTracking: false,
    signalQuality: 80,
    children: [
      {
        type: "sensor",
        name: "Sensor 3",
        isTracking: false,
        signalQuality: 80,
      },
      {
        type: "sensor",
        name: "Sensor 4",
        isTracking: false,
        signalQuality: 80,
      },
    ],
  },
]);

function compare(a, b) {
  if (a.name < b.name) {
    return -1;
  }
  if (a.name > b.name) {
    return 1;
  }
  return 0;
}
</script>
