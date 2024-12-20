import { Candidats } from "./data/data-candidats.js";
import { Lycees } from "./data/data-lycees.js";
import { Lieux } from "./data/data-lieux.js";
import L from "leaflet";
import Highcharts from "highcharts";

import "./index.css";

// Import des vues
import { HeaderView } from "./ui/header/index.js";
import { MapLyceeView } from "./ui/map_lycee/index.js";
import { ChartView } from "./ui/chart/index.js";
import "leaflet.markercluster";
import "leaflet.markercluster.freezable";
let radius = 10;
let C = {};

C.init = async function () {
  await V.init();

  // On ajoute un listener sur les boutons pour afficher les lycées
  let postBacButton = document.querySelector("#postbac");
  postBacButton.addEventListener("change", C.handler_CheckBox);

  let neoBacheliersButton = document.querySelector("#neobacheliers");
  neoBacheliersButton.addEventListener("change", C.handler_CheckBox);

  let thresholdSlider = document.querySelector("#threshold");
  thresholdSlider.addEventListener("input", C.handler_SliderThreshold);

  let radiusSlider = document.querySelector("#radius");
  radiusSlider.addEventListener("input", C.handler_SliderRadius);


  ChartView.renderChart(
    Candidats.formatChart(Candidats.getDepartements(0), 10)
  );

  // On rend une première carte à l'arrivée
  C.handler_SliderRadius();
};

let V = {
  header: document.querySelector("#header"),
};

V.clearMap = function () {
  const element = document.querySelector("#map");
  element.remove();
  const newElement = document.createElement("div");
  newElement.id = "map";
  document.querySelector("#mapDiv").appendChild(newElement);
};

V.init = async function () {
  V.renderHeader();
  MapLyceeView.init
};

V.renderHeader = function () {
  V.header.innerHTML = HeaderView.render();
};

C.handler_ClickPostBac = function () {
  V.clearMap();
  MapLyceeView.render(Lycees.getPostBac());
};

C.handler_CheckBox = function () {
  let postbac = document.querySelector("#postbac").checked;
  let neoBacheliers = document.querySelector("#neobacheliers").checked;
  selectSeries(postbac, neoBacheliers);
};

C.handler_SliderThreshold = function () {
  let threshold = document.querySelector("#threshold").value;
  ChartView.renderChart(
    Candidats.formatChart(Candidats.getDepartements(0), threshold)
  );

  let thresholdValue = document.querySelector("#thresholdValue");
  thresholdValue.innerHTML = threshold;
};

C.handler_SliderRadius = function () {
  radius = document.querySelector("#radius").value;
  let radiusValue = document.querySelector("#radiusValue");
  radiusValue.innerHTML = radius;
  selectSeries(
    document.querySelector("#postbac").checked,
    document.querySelector("#neobacheliers").checked
  );
}

// Fonction pour afficher les lycées en fonction des séries demandées
let selectSeries = function (postbac, neoBacheliers) {
  if (postbac && neoBacheliers) {
    V.clearMap();
    radius = document.querySelector("#radius").value;
    MapLyceeView.render(
      Lycees.filtrerParDistance(Lycees.getAllLieux(), radius),
      radius
    );
  } else if (neoBacheliers) {
    V.clearMap();
    MapLyceeView.render(
      Lycees.filtrerParDistance(Lycees.getNeoBacheliers(), radius),
      radius
    );
  } else if (postbac) {
    V.clearMap();
    MapLyceeView.render(
      Lycees.filtrerParDistance(Lycees.getPostBac(), radius),
      radius
    );
  } else {
    V.clearMap();
    MapLyceeView.render([], radius);
  }
};


C.init();
