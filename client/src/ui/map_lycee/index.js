const templateFile = await fetch("src/ui/map_lycee/template.html");
const template = await templateFile.text();

let MapLyceeView = {};

MapLyceeView.render = function (dataLycees) {
  var map = L.map("map").setView([45.83101313440399, 1.259036035081095], 10);


  console.log(dataLycees);
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
    // maxClusterRadius: 60,
    freezeAtZoom: 10, // Niveau de zoom pour les régions
  });

  // On ajoute un marqueur sur la map pour chaque lycée
  for (let i = 0; i < dataLycees.length; i++) {
    let marker = L.marker([dataLycees[i].latitude, dataLycees[i].longitude]);
    marker.bindPopup(
      `<b>${dataLycees[i].appellation_officielle}</b><br> ${dataLycees[i].count.generale} candidats en Générale<br> ${dataLycees[i].count.sti2d} candidats en STI2D<br> ${dataLycees[i].count.other} autres candidats`
    );


    markers.addLayer(marker);
  }

  // On ajoute le groupe de clusters à la map
  map.addLayer(markers);

  // Afficher le cumul des candidats dans la zone lors du clic sur un cluster
  markers.on("clusterclick", function (a) {   
    let totalGenerale = 0;
    let totalSti2d = 0;
    let totalOther = 0;

    a.layer.getAllChildMarkers().forEach((marker) => {
      const popupContent = marker.getPopup().getContent();
      const generaleCount = parseInt(popupContent.match(/(\d+) candidats en Générale/)[1]);
      const sti2dCount = parseInt(popupContent.match(/(\d+) candidats en STI2D/)[1]);
      const otherCount = parseInt(popupContent.match(/(\d+) autres candidats/)[1]);

      totalGenerale += generaleCount;
      totalSti2d += sti2dCount;
      totalOther += otherCount;
    });

    L.popup()
      .setLatLng(a.latlng)
      .setContent(
        `Total candidats dans la zone:<br>Générale: ${totalGenerale}<br>STI2D: ${totalSti2d}<br>Autres: ${totalOther}`
      )
      .openOn(map);
  });
};

export { MapLyceeView };
