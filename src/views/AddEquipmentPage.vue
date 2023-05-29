<template>
  <ion-header>
    <ion-toolbar class="flex h-16 font-sans text-black">
      <div
        class="ml-4 flex items-center rounded-lg bg-[#eeeeee] px-2 py-1 active:scale-95"
        slot="start"
        @click="openMainPage"
      >
        <ion-icon class="h-7 w-7" color="dark" :icon="arrowBackOutline" />
      </div>
      <ion-title class="text-2xl"
        >Добавление
        {{ equipmentType === "camera" ? "камеры" : "датчика" }}</ion-title
      >
      <!-- <ion-progress-bar type="indeterminate"></ion-progress-bar> -->
    </ion-toolbar>
  </ion-header>
  <div class="m-4 flex h-full flex-col gap-5">
    <ion-item fill="outline">
      <ion-label position="floating">Название</ion-label>
      <ion-input placeholder="Введите текст" v-model="title"></ion-input>
    </ion-item>
    <ion-item v-if="equipmentType === 'camera'" fill="outline">
      <ion-label position="floating">Порт zmq</ion-label>
      <ion-input placeholder="Введите текст" v-model="zmqPort"></ion-input>
    </ion-item>
    <ion-item v-if="equipmentType === 'camera'" fill="outline">
      <ion-label position="floating">URL</ion-label>
      <ion-input placeholder="Введите текст" v-model="url"></ion-input>
    </ion-item>
    <ion-item v-if="equipmentType === 'sensor'" fill="outline">
      <ion-label position="floating">Mqtt topic</ion-label>
      <ion-input placeholder="Введите текст" v-model="mqttTopic"></ion-input>
    </ion-item>
    <ion-item v-if="equipmentType === 'sensor'" fill="outline">
      <ion-label position="floating">Mqtt field</ion-label>
      <ion-input placeholder="Введите текст" v-model="mqttField"></ion-input>
    </ion-item>

    <ion-button
      class="no-ripple text-md h-14 font-bold"
      shape="round"
      color="success"
      @click.once="save"
      >Добавить {{ equipmentType === "camera" ? "камеру" : "датчик" }}
    </ion-button>
  </div>
</template>

<script lang="ts" setup>
import axios from "axios";
import { ref, computed } from "vue";
import { useRouter, useRoute } from "vue-router";
import {
  IonHeader,
  IonToolbar,
  IonTitle,
  IonInput,
  IonButton,
  IonIcon,
  IonItem,
} from "@ionic/vue";
import {
  cameraOutline,
  closeOutline,
  radioOutline,
  trashOutline,
  addCircleOutline,
  arrowBackOutline,
} from "ionicons/icons";

enum EquipmentType {
  camera = "камера",
  sensor = "датчик",
}

const router = useRouter();
const route = useRoute();

const title = ref("");

const zmqPort = ref(0);
const url = ref("");

const mqttTopic = ref(0);
const mqttField = ref(0);

const equipmentType = computed(() => {
  return route.params.equipmentName === "camera" ? "camera" : "sensor";
});

function save() {
  if (equipmentType.value === "camera") {
    axios
      .post("https://6e72-94-143-243-49.ngrok-free.app/api/cameras", {
        title: title.value,
        url: url.value,
        zmq_port: zmqPort.value,
      })
      .then(() => openMainPage());
  } else {
    axios
      .post("https://6e72-94-143-243-49.ngrok-free.app/api/sensors", {
        title: title.value,
        mqtt_topic: mqttTopic.value,
        mqtt_field: mqttField.value,
      })
      .then(() => openMainPage());
  }
}
function openMainPage() {
  router.push("/");
}
</script>

<style scoped>
.no-ripple {
  --ripple-color: transparent;
}
</style>
