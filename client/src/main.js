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
  postBacButton.addEventListener("click", C.handler_ClickPostBac);

  let neoBacheliersButton = document.querySelector("#neobacheliers");
  neoBacheliersButton.addEventListener("click", C.handler_ClickNeoBacheliers);

  let tousButton = document.querySelector("#tous");
  tousButton.addEventListener("click", C.handler_ClickTous);

  let thresholdSlider = document.querySelector("#threshold");
  thresholdSlider.addEventListener("input", C.handler_SliderThreshold);


  
  ChartView.renderChart(
    Candidats.formatChart(Candidats.getDepartements(0), 10)
  );
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
};

V.renderHeader = function () {
  V.header.innerHTML = HeaderView.render();
};

C.handler_ClickPostBac = function () {
  V.clearMap();
  MapLyceeView.render(Lycees.getPostBac());
};

C.handler_ClickNeoBacheliers = function () {
  V.clearMap();
  MapLyceeView.render(Lycees.getNeoBacheliers());
};

C.handler_ClickTous = function () {
  V.clearMap();
  radius = document.querySelector("#radius").value;
  MapLyceeView.render(Lycees.filtrerParDistance(Lycees.getAllLieux(),radius),radius);
};

C.handler_SliderThreshold = function () {
  let threshold = document.querySelector("#threshold").value;
  ChartView.renderChart(
    Candidats.formatChart(Candidats.getDepartements(0), threshold)
  );
  
  let thresholdValue = document.querySelector("#thresholdValue");
  thresholdValue.innerHTML = threshold;
}

C.init();
