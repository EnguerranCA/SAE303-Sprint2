import { Candidats } from "./data-candidats.js";
import { Lieux } from "./data-lieux.js";

let dataLycee = await fetch("./src/data/json/lycees.json");
dataLycee = await dataLycee.json();
dataLycee.sort((a, b) => a.numero_uai.localeCompare(b.numero_uai));

let dataCandidat = Candidats.getAll();

let Lycees = {};

Lycees.getAll = function () {
  return dataLycee;
};

Lycees.binarySearch = function (lyceeCode) {
  let min = 0;
  let max = dataLycee.length - 1;
  let guess;
  while (min <= max) {
    guess = Math.floor((min + max) / 2);
    if (dataLycee[guess].numero_uai === lyceeCode) {
      return dataLycee[guess];
    } else if (dataLycee[guess].numero_uai < lyceeCode) {
      min = guess + 1;
    } else {
      max = guess - 1;
    }
  }
}
Lycees.getLyceesAvecCandidats = function () {
  let returnedData = [];
  let refusedData = [];

  for (let i = 1; i < dataCandidat.length; i++) {
    let candidat = dataCandidat[i];

    // On récupère le code des derniers étblissements jusqu'à trouver un lycée
    for (let j = 0; j < 6; j++) {
      let codeLycee = candidat.Scolarite[j].UAIEtablissementorigine;

      // Recherche dichotomique du lycée
      let lycee = Lycees.binarySearch(codeLycee);

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

      if (j === 5) {
        
        refusedData.push(candidat);
      }
    }
  }
  for (let refuse of refusedData) {
    console.log(refuse.Scolarite[0].CommuneEtablissementOrigineLibelle + " " + refuse.Scolarite[0].UAIEtablissementorigine);
  }
  return returnedData;
};

Lycees.getNeoBacheliers = function () {
  let returnedData = [];

  for (let i = 1; i < dataCandidat.length; i++) {

    let candidat = dataCandidat[i];

    // On récupère le statut du baccaulauréat pour voir si il est en préparation ou déjà obtenu
    if (candidat.Baccalaureat.TypeDiplomeLibelle === 'Baccalauréat en préparation') {
      let codeLycee = candidat.Scolarite[0].UAIEtablissementorigine;
      
      // Recherche dichotomique du lycée
      let lycee = Lycees.binarySearch(codeLycee);

      // Si on a trouvé un lycée, on sort de la boucle
      if (lycee) {
        // On ajoute le lycée à la liste des lycées s'il n'y est pas déjà
        if (!returnedData.find((lycee) => lycee.numero_uai === codeLycee)) {
          
          // On regarde le type de baccalauréat
            lycee.count = {
            generale: 0,
            sti2d: 0,
            other: 0
            };

            switch (candidat.Baccalaureat.Filiere) {
            case 'Générale':
              lycee.count.generale++;
              break;
            case 'STI2D':
              lycee.count.sti2d++;
              break;
            default:
              lycee.count.other++;
              break;
            }

          returnedData.push(lycee);
        } else {
          // On incrémente le compteur en fonction de la filère
          switch (candidat.Baccalaureat.SerieDiplomeCode) {
            case 'Générale':
              lycee.count.generale++;
              break;
            case 'STI2D':
              lycee.count.sti2d++;
              break;
            default:
              lycee.count.other++;
              break;
            }
        }
      } else {
        console.log("Lycée non trouvé pour le candidat : " + candidat.Scolarite[0].CommuneEtablissementOrigineLibelle + " " + candidat.Scolarite[0].UAIEtablissementorigine);
      }
    }
  }
  console.log(returnedData);
  return returnedData;
};

Lycees.getPostBac = async function () {
  let returnedData = [];

  let departements = Candidats.getDepartements();

  for (let departement in departements) {
    let postalCode = departement.padEnd(5, '0');

    let location = await Lieux.fetchPostalCode(postalCode);

    returnedData.push({
      count: departements[departement].count,
      appellation_officielle: location.nom_commune,
      latitude: location.latitude,
      longitude: location.longitude
    });
  }

  console.log(returnedData);
  return returnedData;
};


export { Lycees };


// Lycees.getPostBac = async function () {
//   let returnedData = [];

//   for (let i = 1; i < dataCandidat.length; i++) {
//     let candidat = dataCandidat[i];
//     if (candidat.Baccalaureat.TypeDiplomeLibelle === 'Baccalauréat obtenu') {
//       let postalCode = candidat.Scolarite[0].CommuneEtablissementOrigineCodePostal;

//       if (!postalCode) {
//         continue;
//       }

//       let location = await Lieux.fetchPostalCode(postalCode);
//       console.log(location);
      
//       let existingLocation = returnedData.find(loc => loc.appellation_officielle == location.nom_commune);

//       if (existingLocation) {
//         existingLocation.count.other++;
//       } else {
//         existingLocation = {
//           appellation_officielle: location.nom_commune,
//           count: {
//             generale: 0,
//             sti2d: 0,
//             other: 1
//           },
//           latitude: location.latitude,
//           longitude: location.longitude
//         };
//         returnedData.push(existingLocation);
//       }


//   }
  
// }
// console.log(returnedData);
// return returnedData;
// }