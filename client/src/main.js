import { Candidats } from "./data/data-candidats.js";
import { Lycees } from "./data/data-lycees.js";
import L from "leaflet";
import "./index.css";

// Import des vues
import { HeaderView } from "./ui/header/index.js";
import { MapLyceeView } from "./ui/map_lycee/index.js"; 

let C = {};

C.init = async function () {
  V.init();
  console.log(Candidats.getAll());
  console.log(Lycees.getAll());
};

let V = {
  header: document.querySelector("#header"),
};

V.init = function () {
  V.renderHeader();

  MapLyceeView.render();
};

V.renderHeader = function () {
  V.header.innerHTML = HeaderView.render();


};


C.init();
