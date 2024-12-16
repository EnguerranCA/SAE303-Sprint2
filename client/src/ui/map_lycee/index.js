const templateFile = await fetch("src/ui/map_lycee/template.html");
const template = await templateFile.text();

let MapLyceeView = {};

MapLyceeView.render = function (dataLycees) {
  var map = L.map("map").setView([45.83101313440399, 1.259036035081095], 10);

  // Import de la map
  L.tileLayer("https://tile.openstreetmap.org/{z}/{x}/{y}.png", {
    maxZoom: 16,
    attribution:
      '&copy; <a href="http://www.openstreetmap.org/copyright">OpenStreetMap</a>',
  }).addTo(map);

  // On crée un groupe de clusters
  var markers = L.markerClusterGroup({
    spiderfyOnMaxZoom: true,
    showCoverageOnHover: true,
    zoomToBoundsOnClick: false,
    maxClusterRadius: 60,
    freezeAtZoom: 10 // Niveau de zoom pour les régions
  });

  // On ajoute un marqueur sur la map pour chaque lycée
  for (let i = 0; i < dataLycees.length; i++) {
    let marker = L.marker([dataLycees[i].latitude, dataLycees[i].longitude]);
    marker.bindPopup(`<b>${dataLycees[i].appellation_officielle}</b><br> ${dataLycees[i].count} candidats`);
    markers.addLayer(marker);
  }

  // On ajoute le groupe de clusters à la map
  map.addLayer(markers);

  // Afficher le cumul des candidats dans la zone lors du clic sur un cluster
  markers.on('clusterclick', function (a) {
    let totalCandidats = 0;
    a.layer.getAllChildMarkers().forEach(marker => {
      let popupContent = marker.getPopup().getContent();
      let count = parseInt(popupContent.match(/(\d+) candidats/)[1]);
      totalCandidats += count;
    });

    L.popup()
      .setLatLng(a.latlng)
      .setContent(`Total candidats dans la zone: ${totalCandidats}`)
      .openOn(map);
  });
};

export { MapLyceeView };
