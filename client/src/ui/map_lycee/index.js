const templateFile = await fetch("src/ui/map_lycee/template.html");
const template = await templateFile.text();

let MapLyceeView = {};

MapLyceeView.render = function (data) {
  var map = L.map("map").setView([45.83101313440399, 1.259036035081095], 20);

  // Import de la map
  L.tileLayer("https://tile.openstreetmap.org/{z}/{x}/{y}.png", {
    maxZoom: 19,
    attribution:
      '&copy; <a href="http://www.openstreetmap.org/copyright">OpenStreetMap</a>',
  }).addTo(map);

  for (let i = 1; i < data.length; i++) {
    let lycee = data[i];

    var marker = L.marker([lycee.latitude, lycee.longitude]).addTo(map);

    marker.bindPopup(
      `<b>${lycee.nom}</b><br>${lycee.adresse}<br>${lycee.cp} ${lycee.ville}`
    );
  }

    
};

export { MapLyceeView };
