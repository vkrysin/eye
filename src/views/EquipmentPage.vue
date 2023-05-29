<template>
  <div class="flex flex-col">
    <ion-header>
      <ion-toolbar class="flex h-16 font-sans text-black">
        <div
          class="ml-4 flex items-center rounded-lg bg-[#eeeeee] px-2 py-1 hover:cursor-pointer active:scale-95"
          slot="start"
          @click="openMainPage"
        >
          <ion-icon class="h-7 w-7" color="dark" :icon="arrowBackOutline" />
        </div>
        <ion-title class="text-center text-2xl"> {{ data.title }}</ion-title>
        <div
          class="flex justify-center pr-2 active:scale-95"
          slot="end"
          @click="openAlert"
        >
          <ion-icon
            class="h-7 w-7 text-red-700 hover:cursor-pointer"
            :icon="trashOutline"
          />
        </div>
        <!-- <ion-progress-bar type="indeterminate"></ion-progress-bar> -->
      </ion-toolbar>
    </ion-header>
    <div
      class="mx-4 mt-7 flex items-center justify-between border-b border-gray-300 pb-3"
    >
      <span class="text-base">Вкл/выкл отслеживание</span>
      <ion-toggle
        v-model="data.is_tracked"
        class="h-8 w-14"
        mode="ios"
        color="success"
        @click.stop="toggleTracking(item)"
      ></ion-toggle>
    </div>
    <svg class="mt-10 self-center" width="90%" height="300" ref="chart"></svg>
  </div>

  <ion-alert
    :is-open="isAlertOpen"
    :header="alertHeader"
    :buttons="alertButtons"
  ></ion-alert>
</template>

<script lang="ts" setup>
import axios from "axios";
import { ref, computed, onMounted, Ref } from "vue";
import { useRouter, useRoute } from "vue-router";
import {
  IonHeader,
  IonToolbar,
  IonTitle,
  IonInput,
  IonButton,
  IonIcon,
  IonItem,
  IonAlert,
  IonToggle,
} from "@ionic/vue";
import {
  cameraOutline,
  closeOutline,
  radioOutline,
  trashOutline,
  addCircleOutline,
  arrowBackOutline,
} from "ionicons/icons";

import {
  select,
  timeParse,
  scaleLinear,
  scaleTime,
  extent,
  line,
  axisBottom,
  axisLeft,
  timeFormat,
  area,
  curveMonotoneX,
  yScale,
} from "d3";

const chart: Ref<SVGElement> = ref(null);

// eslint-disable-next-line no-undef
const props = defineProps(["id", "equipmentType"]);

const router = useRouter();
const route = useRoute();

const data = ref({});

const chartData = [
  { date: "2023-02-28 15:12:08", value: 42 },
  { date: "2023-02-27 15:12:08", value: 62 },
  { date: "2023-02-21 15:12:08", value: 82 },
  { date: "2023-02-11 15:12:08", value: 92 },
  { date: "2023-02-01 15:12:08", value: 62 },
];

onMounted(() => {
  const margin = {
    left: chart.value.getBoundingClientRect().width * 0.12, // слева 5%
    bottom: chart.value.getBoundingClientRect().height * 0.1, // снизу 5%
    top: chart.value.getBoundingClientRect().height * 0.05,
  };

  const { height } = chart.value.getBoundingClientRect();
  const { width } = chart.value.getBoundingClientRect();

  const chartSvg = select(chart.value);
  const g = chartSvg.append("g");

  const parseTime = timeParse("%Y-%m-%d %H:%M:%S");

  const x = scaleTime()
    .domain(extent(chartData || [], (d) => parseTime(d.date)))
    .rangeRound([margin.left, width - 1]); // -1 для того, чтобы влезла правая граница нижней шкалы

  const y = scaleLinear()
    .domain(extent(chartData || [], (d) => d.value))
    .rangeRound([height - margin.bottom, margin.top]);

  const ln = line()
    .x((d) => x(parseTime(d.date)))
    .y((d) => y(d.value));

  const xAxis = g
    .append("g")
    .attr("transform", `translate(${0},${height - margin.bottom})`)
    .call(axisBottom(x).ticks(4).tickFormat(timeFormat("%H:%M")));
  const yAxis = g
    .append("g")
    .attr("transform", `translate(${margin.left}, 0)`)
    .call(axisLeft(y));

  xAxis.selectAll(".tick line").remove();
  xAxis.select(".domain").attr("stroke", "#3899f5");

  xAxis
    .selectAll(".tick text")
    .attr("color", "#3899f5")
    .attr("font-size", "16px")
    .attr("transform", `translate(0, ${margin.bottom * 0.3})`); // отступ для тиков

  yAxis.selectAll(".tick line").remove();

  yAxis
    .selectAll(".tick text")
    .attr("color", "#3899f5")
    .attr("font-size", "16px")
    .attr("transform", `translate(-${margin.left * 0.1}, 0)`);
  yAxis.select(".domain").remove();

  yAxis
    .selectAll(".tick")
    .append("line")
    .attr("class", "gridline")
    .attr("x1", 0)
    .attr("y1", 0)
    .attr("x2", width)
    .attr("y2", 0)
    .attr("stroke", "#86c0f7")
    .attr("stroke-dasharray", "2");

  // yAxis
  //   .append("text")
  //   .attr("transform", "rotate(-90)")
  //   .attr("text-anchor", "end")
  //   .attr("fill", "#3899f5")
  //   .attr("style", "font-family: Euclid; font-weight: 300")
  //   .attr("font-size", "18px")
  //   .attr("y", -margin.left * 0.6)
  //   .attr("x", -margin.top * 2)
  //   .text("Уровень качества");

  yAxis.selectAll(".tick:first-of-type line").remove(); // удаление сетки для первого элемента

  g.append("path")
    .datum(chartData || [])
    .attr("fill", "none")
    .attr("stroke", "#855CF8")
    .attr("stroke-width", 2)
    .attr("d", ln);
});

axios
  .get(
    `https://6e72-94-143-243-49.ngrok-free.app/api/${props.equipmentType}s/${props.id}`
  )
  .then((res) => (data.value = res.data));

const isAlertOpen = ref(false);
const alertHeader = ref("");

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
      removeEquipment(currentRemovedEquipment.value._id);
      closeAlert();
    },
  },
];

function openAlert() {
  currentRemovedEquipment.value = data.value;

  const name = props.equipmentType === "camera" ? "камеру" : "датчик";
  alertHeader.value = `Удалить ${name}?`;
  isAlertOpen.value = true;
}

function closeAlert() {
  isAlertOpen.value = false;
}

function removeEquipment(id: string) {
  axios
    .delete(
      `https://6e72-94-143-243-49.ngrok-free.app/api/${props.equipmentType}s/${id}`
    )
    .then(() => openMainPage());
}

function toggleTracking() {
  if (data.value.is_tracked) {
    axios.post(
      `https://6e72-94-143-243-49.ngrok-free.app/api/${props.equipmentType}s/${props.id}/tracking/stop`
    );
  } else {
    axios.post(
      `https://6e72-94-143-243-49.ngrok-free.app/api/${props.equipmentType}s/${props.id}/tracking/start`
    );
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
