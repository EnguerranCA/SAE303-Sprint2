import { Candidats } from "./data-candidats.js";

let dataLieux = await fetch("./src/data/json/codespostaux.json");
dataLieux = await dataLieux.json();
dataLieux.sort((a, b) => a.code_postal.toString().padStart(6, '0').localeCompare(b.code_postal.toString().padStart(6, '0')));

console.log(dataLieux);


let Lieux = {};

Lieux.binarySearch = function (postalCode) {
  let min = 0;
  let max = dataLieux.length - 1;
  let guess;
  while (min <= max) {
    guess = Math.floor((min + max) / 2);
    if (dataLieux[guess].code_postal == postalCode) {
      return dataLieux[guess];
    } else if (dataLieux[guess].code_postal < postalCode) {
      min = guess + 1;
    } else {
      max = guess - 1;
    }
  }
}



Lieux.fetchPostalCode = async function (postalCode) {
  let result = await Lieux.binarySearch(postalCode);
  if (result) {
    return {
      nom_commune: result.nom_commune,
      latitude: result.latitude,
      longitude: result.longitude,
    };
  } else {
    console.log("Code postal non trouvé : " + postalCode);
    return {
      nom_commune: "Inconnu",
      latitude: 0,
      longitude: 0,
    };
  }
};



export { Lieux };
