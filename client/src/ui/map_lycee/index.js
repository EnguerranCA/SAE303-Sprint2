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

  var marker = L.marker([45.83101313440399, 1.259036035081095]).addTo(map);

  marker.bindPopup("<b>Le Quick!</b><br>C'est l'épicentre de Limoges.").openPopup();

    
};

export { MapLyceeView };
