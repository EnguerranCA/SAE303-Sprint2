const templateFile = await fetch("src/ui/map_lycee/template.html");
const template = await templateFile.text();

let MapLyceeView = {};

MapLyceeView.render = function (dataLycees) {
  console.log(dataLycees);
  var map = L.map("map").setView([45.83101313440399, 1.259036035081095], 10);

  // Import de la map
  L.tileLayer("https://tile.openstreetmap.org/{z}/{x}/{y}.png", {
    maxZoom: 50,
    attribution:
      '&copy; <a href="http://www.openstreetmap.org/copyright">OpenStreetMap</a>',
  }).addTo(map);

  // On ajoute un marqueur sur la map pour chaque lycée
  for (let i = 0; i < dataLycees.length; i++) {
    let marker = L.marker([dataLycees[i].latitude, dataLycees[i].longitude]).addTo(map);
    marker.bindPopup(`<b>${dataLycees[i].appellation_officielle}</b><br> ${dataLycees[i].count} candidats`);
  }


};

export { MapLyceeView };
