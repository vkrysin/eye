<template>
  <ion-header>
    <ion-toolbar class="flex h-16 font-sans text-black">
      <ion-title class="text-2xl"
        >Список оборудования({{ equipment.length }})</ion-title
      >
      <!-- <ion-progress-bar type="indeterminate"></ion-progress-bar> -->
    </ion-toolbar>
  </ion-header>
  <ion-content class="h-[85%] overflow-y-auto">
    <div class="mt-2 flex flex-wrap justify-between">
      <!-- :class="{ 'w-full': item.type === 'group' }" -->
      <ion-card
        v-for="item in equipment.sort(compare)"
        :key="item._id"
        class="w-[44%] hover:cursor-pointer"
        @click="openEquipmentPage(item)"
      >
        <ion-card-header
          class="-mr-7 flex items-center justify-between pl-3 pt-2 pb-0"
        >
          <ion-toggle
            v-model="item.is_tracked"
            mode="ios"
            color="success"
            @click.stop="toggleTracking(item)"
          ></ion-toggle>
          <!-- <ion-card-subtitle
            v-if="item.type == 'group'"
            class="mt-2 flex justify-center pl-3 font-sans text-xl font-medium text-black"
            >{{ item.name }}</ion-card-subtitle
          > -->
          <div
            class="mr-5 flex justify-center hover:cursor-pointer active:scale-95"
            @click.stop="openAlert(item)"
          >
            <ion-icon class="h-10 w-10" color="dark" :icon="closeOutline" />
          </div>
        </ion-card-header>
        <div class="flex justify-center">
          <ion-icon
            class="h-16 w-16 pl-3"
            :icon="item.type === 'camera' ? cameraOutline : radioOutline"
          ></ion-icon>
        </div>
        <div class="flex justify-center py-2 text-base">
          {{ item.title ? item.title : "no-title" }}
        </div>
        <!-- <template v-else>
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

              <div
                class="-mr-2 flex justify-center active:scale-95"
                slot="end"
                @click="openAlert('датчик')"
              >
                <ion-icon class="h-7 w-7 text-red-700" :icon="trashOutline" />
              </div>
            </ion-item>
          </ion-list>
        </template> -->

        <!-- <div>
          <div
            class="flex items-center justify-end py-2 pr-4 font-sans text-base font-bold text-green-600"
          >
            {{ item.signalQuality }}
          </div>
        </div> -->
        <!-- <div
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
          <div
            class="mr-3 flex justify-center active:scale-95"
            slot="end"
            @click="openAddSensorPage"
          >
            <ion-icon class="h-8 w-8 text-green-600" :icon="addCircleOutline" />
          </div>
        </div> -->
      </ion-card>
    </div>
  </ion-content>
  <ion-footer>
    <ion-toolbar>
      <div class="flex items-center justify-between px-7">
        <div
          class="flex items-center rounded-lg bg-[#e4e4e4] px-10 py-0.5 active:scale-95"
          @click="openAddSensorPage"
        >
          <ion-icon class="h-10 w-10" color="dark" :icon="radioOutline" />
        </div>
        <div
          class="flex items-center rounded-lg bg-[#e4e4e4] px-10 py-0.5 active:scale-95"
          @click="openAddCameraPage"
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
  <ion-alert
    :is-open="isAlertOpen"
    :header="alertHeader"
    :buttons="alertButtons"
  ></ion-alert>
</template>

<script lang="ts" setup>
import { ref } from "vue";
import axios from "axios";

import {
  IonHeader,
  IonToolbar,
  IonTitle,
  IonCard,
  IonToggle,
  IonCardSubtitle,
  IonCardHeader,
  IonIcon,
  IonFooter,
  IonContent,
  IonList,
  IonItem,
  IonAlert,
} from "@ionic/vue";
import {
  cameraOutline,
  closeOutline,
  radioOutline,
  trashOutline,
  addCircleOutline,
} from "ionicons/icons";

import { useRouter } from "vue-router";
const router = useRouter();

const equipment1 = ref([
  {
    type: "camera",
    is_tracked: "camera",
    title: "Camera 1",
    url: "",
    zmq_port: 2180,
    _id: "fdsfd",
  },
]);

const equipment = ref([]);

const isAlertOpen = ref(false);
const alertHeader = ref("Датчик");

const currentRemovedEquipment = ref({});

const alertButtons = [
  {
    text: "Отмена",
    role: "cancel",
    handler: () => {
      closeAlert();
    },
  },
  {
    text: "Да",
    role: "confirm",
    handler: () => {
      removeEquipment(
        currentRemovedEquipment.value._id,
        currentRemovedEquipment.value.type
      );
      closeAlert();
    },
  },
];

getEquipment();

function openAlert(equipment: object) {
  currentRemovedEquipment.value = equipment;

  const name = equipment.type === "camera" ? "камеру" : "датчик";
  alertHeader.value = `Удалить ${name}?`;
  isAlertOpen.value = true;
}

function closeAlert() {
  isAlertOpen.value = false;
}

function getEquipment() {
  equipment.value = [];

  axios
    .get("https://6e72-94-143-243-49.ngrok-free.app/api/cameras")
    .then((res) => {
      res.data.forEach((item) =>
        equipment.value.push({
          ...item,
          type: "camera",
        })
      );
    });

  axios
    .get("https://6e72-94-143-243-49.ngrok-free.app/api/sensors")
    .then((res) => {
      res.data.forEach((item) =>
        equipment.value.push({
          ...item,
          type: "sensor",
        })
      );
    });

  console.log(equipment.value);
}

function removeEquipment(id: string, type: string) {
  if (type === "camera") {
    axios
      .delete(`https://6e72-94-143-243-49.ngrok-free.app/api/cameras/${id}`)
      .then(() => getEquipment());
  } else {
    axios
      .delete(`https://6e72-94-143-243-49.ngrok-free.app/api/sensors/${id}`)
      .then(() => getEquipment());
  }
}

function toggleTracking(item) {
  if (item.is_tracked) {
    axios.post(
      `https://6e72-94-143-243-49.ngrok-free.app/api/${item.type}s/${item._id}/tracking/stop`
    );
  } else {
    axios.post(
      `https://6e72-94-143-243-49.ngrok-free.app/api/${item.type}s/${item._id}/tracking/start`
    );
  }
}

function compare(a, b) {
  if (a.title < b.title) {
    return -1;
  }
  if (a.title > b.title) {
    return 1;
  }
  return 0;
}

function openAddCameraPage() {
  router.push("/add_equipment/camera");
}
function openAddSensorPage() {
  router.push("/add_equipment/sensor");
}

function openEquipmentPage(item) {
  router.push({
    name: "equipmentPage",
    params: { id: item._id, equipmentType: item.type },
  });
}
</script>
<style>
ion-alert.custom-alert {
  --backdrop-opacity: 0.7;
}

.custom-alert .alert-button-group {
  padding: 8px;
}

button.alert-button.alert-button-confirm {
  background-color: var(--ion-color-success);
  color: var(--ion-color-success-contrast);
}

.md button.alert-button.alert-button-confirm {
  border-radius: 4px;
}
</style>
