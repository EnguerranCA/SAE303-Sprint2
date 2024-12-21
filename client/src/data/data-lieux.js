import { Candidats } from "./data-candidats.js";

let dataLieux = await fetch("./src/data/json/codespostaux.json");
dataLieux = await dataLieux.json();
dataLieux.sort((a, b) => a.code_postal.toString().padStart(6, '0').localeCompare(b.code_postal.toString().padStart(6, '0')));



let Lieux = {};

let binarySearch = function (postalCode) {
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

Lieux.getDepartementName =  function (departementCode) {
  let departement =  binarySearch(postalCode);
  return departement.nom_departement;
}


Lieux.getPostalCode =  function (postalCode) {
  // Si le code postal ne fait pas 5 caractères, on le complète avec des 0 
  postalCode = postalCode.toString().padStart(5, '0');
  
  // Modifier le code postal selon les règles spécifiées
  if (postalCode.startsWith('97')) {
    postalCode = postalCode.substring(0, 3) + '00';
  } else {
    postalCode = postalCode.substring(0, 2) + '000';
  }
  
  let result = binarySearch(postalCode);
  if (result) {
    return {
      appellation_officielle: result.nom_departement,
      code_departement: result.code_departement,
      latitude: result.latitude,
      longitude: result.longitude,
    };
  } else {
    console.log("Code postal non trouvé : " + postalCode);
    return {
      nom_departement: "Inconnu",
      code_departement: "0",

      latitude: 0,
      longitude: 0,
    };
  }
};





export { Lieux };
