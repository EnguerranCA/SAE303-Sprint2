import { Candidats } from "./data/data-candidats.js";
import { Lycees } from "./data/data-lycees.js";
import { Lieux } from "./data/data-lieux.js";
import L from "leaflet";

import "./index.css";

// Import des vues
import { HeaderView } from "./ui/header/index.js";
import { MapLyceeView } from "./ui/map_lycee/index.js";
import "leaflet.markercluster";
import "leaflet.markercluster.freezable";

let C = {};



C.init = async function () {
  await V.init();

  // On ajoute un listener sur les boutons pour afficher les lycées
  let postBacButton = document.querySelector("#postbac");
  postBacButton.addEventListener("click", C.handler_ClickPostBac);
  
  let neoBacheliersButton = document.querySelector("#neobacheliers");
  neoBacheliersButton.addEventListener("click", C.handler_ClickNeoBacheliers);
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

C.handler_ClickPostBac = async function () {
  V.clearMap();
  MapLyceeView.render(await Lycees.getPostBac());
};

C.handler_ClickNeoBacheliers = async function () {
  V.clearMap();
  MapLyceeView.render(await Lycees.getNeoBacheliers());
};


C.init();
