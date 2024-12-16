import { Candidats } from "./data-candidats.js";

let dataLycee = await fetch("./src/data/json/lycees.json");
dataLycee = await dataLycee.json();

let dataCandidat = Candidats.getAll();

let Lycees = {};

Lycees.getAll = function () {
  return dataLycee;
};

Lycees.getLyceesAvecCandidats = function () {
  let returnedData = [];

  for (let i = 1; i < dataCandidat.length; i++) {
    let candidat = dataCandidat[i];

    // On récupère le code des derniers étblissements jusqu'à trouver un lycée
    for (let i = 0; i < 6; i++) {
      let codeLycee = candidat.Scolarite[i].UAIEtablissementorigine;

      // On trouve l'établissement en question
      let lycee = dataLycee.find((lycee) => lycee.numero_uai === codeLycee);

      // Si on a trouvé un lycée, on sort de la boucle
      if (lycee) {
        // On ajoute le lycée à la liste des lycées s'il n'y est pas déjà
        if (!returnedData.find((lycee) => lycee.numero_uai === codeLycee)) {
          lycee.count = 1;
          returnedData.push(lycee);
        } else {
          // On incrémente le compteur de lycée
          returnedData.find((lycee) => lycee.numero_uai === codeLycee).count++;
        }

        break;
      }
    }
  }
  return returnedData;
};

export { Lycees };
