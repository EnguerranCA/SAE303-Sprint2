import { Candidats } from "./data-candidats.js";
import { Lieux } from "./data-lieux.js";

let dataLycee = await fetch("./src/data/json/lycees.json");
dataLycee = await dataLycee.json();
dataLycee.sort((a, b) => a.numero_uai.localeCompare(b.numero_uai));

let dataCandidat = Candidats.getAll();

//  On modifie dataLycee pour ajouter à chaque lycée où il y a des candidats le nombre de candidats

for (let candidat of dataCandidat) {
  // Si le candidat est en préparation de baccalauréat, on regarde le lycée d'origine et on modifie son count si il est dans la liste
  if (
    candidat.Baccalaureat.TypeDiplomeLibelle === "Baccalauréat en préparation"
  ) {
    let codeLycee = candidat.Scolarite[0].UAIEtablissementorigine;
    let lycee = dataLycee.find((lycee) => lycee.numero_uai === codeLycee);
    if (lycee) {
      // Si le lycée n'a pas de count, on l'initialise
      if (!lycee.count) {
        lycee.count = {
          generale: 0,
          sti2d: 0,
          other: 0,
          postbac: 0,
        };
      }
      // On incrémente le compteur en fonction de la filière
      switch (candidat.Baccalaureat.SerieDiplomeCode) {
        case "Générale":
          lycee.count.generale++;
          break;
        case "STI2D":
          lycee.count.sti2d++;
          break;
        default:
          lycee.count.other++;
          break;
      }
    }
  }

  // Si le candidat a déjà obtenu son baccalauréat, on regarde le lycée d'origine et on modifie son count si il est dans la liste

  // Si le candidat est un post bac, on regarde la dernière ville où il a étudié et on récupère le code postal pour trouver le département et récupérer la latitude et longitude
  // Lycees.getPostBac()
}

// On enlève les lycées qui n'ont pas de candidats
dataLycee = dataLycee.filter((lycee) => lycee.count);

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
};
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
  }
  return returnedData;
};

Lycees.trierParRayon = function (dataCandidat, rayon) {
  
}

Lycees.getNeoBacheliers = function () {
  return dataLycee;
};

Lycees.getPostBac = function () {
  let returnedData = [];

  let candidats = Candidats.getPostBacCandidats();

  for (let candidat of candidats) {
    if (candidat.Scolarite[0].CommuneEtablissementOrigineCodePostal) {
      let location = Lieux.getPostalCode(
        candidat.Scolarite[0].CommuneEtablissementOrigineCodePostal
      );

      let existingLocation = returnedData.find(
        (loc) => loc.code_departement === location.code_departement
      );

      if (existingLocation) {
        existingLocation.count.postbac++;
      } else {
        returnedData.push({
          count: {
            generale: 0,
            sti2d: 0,
            other: 0,
            postbac: 1,
          },
          appellation_officielle: location.appellation_officielle,
          code_departement: location.code_departement,
          latitude: location.latitude,
          longitude: location.longitude,
        });
      }
    }
  }
  return returnedData;
};

Lycees.getAllLieux = function () {

  let returned = Lycees.getPostBac().concat(Lycees.getNeoBacheliers());
  return returned;
}

Lycees.getPostBac();


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
