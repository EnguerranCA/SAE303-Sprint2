const templateFile = await fetch("src/ui/map_lycee/template.html");
const template = await templateFile.text();

let MapLyceeView = {};

MapLyceeView.render = function (dataLycees, radius) {
  let map = L.map("map").setView([45.83101313440399, 1.259036035081095], 10);

  // Import de la map
  L.tileLayer("https://tile.openstreetmap.org/{z}/{x}/{y}.png", {
    maxZoom: 16,
    attribution:
      '&copy; <a href="http://www.openstreetmap.org/copyright">OpenStreetMap</a>',
  }).addTo(map);

  // On crée un groupe de clusters
  let markers = L.markerClusterGroup({
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
      `<b>${dataLycees[i].appellation_officielle}</b><br> ${dataLycees[i].count.generale} candidats en Générale<br> ${dataLycees[i].count.sti2d} candidats en STI2D <br> ${dataLycees[i].count.postbac} candidats en Post-Bac <br> ${dataLycees[i].count.other} autres candidats`
    );

    markers.addLayer(marker);
  }

  // On crée un cercle centré sur Limoges de rayon Radius kilomètres
  let circle = L.circle([45.83101313440399, 1.259036035081095], {
    color: "blue",
    fillColor: "blue",
    fillOpacity: 0.1,
    radius: radius * 1000,
  }).addTo(map);

  // On ajoute le groupe de clusters à la map
  map.addLayer(markers);

  // Afficher le cumul des candidats dans la zone lors du clic sur un cluster
  markers.on("clusterclick", function (a) {
    let totalGenerale = 0;
    let totalSti2d = 0;
    let totalOther = 0;
    let totalPostbac = 0;

    a.layer.getAllChildMarkers().forEach((marker) => {
      const popupContent = marker.getPopup().getContent();
      const generaleCount = parseInt(
        popupContent.match(/(\d+) candidats en Générale/)[1]
      );
      const sti2dCount = parseInt(
        popupContent.match(/(\d+) candidats en STI2D/)[1]
      );
      const otherCount = parseInt(
        popupContent.match(/(\d+) autres candidats/)[1]
      );
      const postbacCount = parseInt(
        popupContent.match(/(\d+) candidats en Post-Bac/)[1]
      );

      totalGenerale += generaleCount;
      totalSti2d += sti2dCount;
      totalOther += otherCount;
      totalPostbac += postbacCount;
    });

    // On crée la popup
    L.popup()
      .setLatLng(a.latlng)
      .setContent(
        `Total candidats dans la zone:<br>Générale: ${totalGenerale}<br>STI2D: ${totalSti2d}<br>Post-Bac: ${totalPostbac}  <br>Autres: ${totalOther}`
      )
      .openOn(map);
  });
};
export { MapLyceeView };
