let data = await fetch("./src/data/json/candidatures.json");
data = await data.json();

let Candidats = {};

Candidats.getAll = function () {
  return data;
};

Candidats.getDepartements = function () {
  // Format cible : { "01" : { "count" : { "generale" : 0, "STI2D" : 0, "other" : 0 }} }
  let Index = {};

  for (let i = 0; i < data.length; i++) {
    let candidat = data[i];

    if (candidat.Baccalaureat.TypeDiplomeCode == 1) {
        let dernierEtablissement = {};
        for (let i = 0; i < candidat.Scolarite.length; i++) {
            if (candidat.Scolarite[i].CommuneEtablissementOrigineCodePostal) {
                dernierEtablissement = candidat.Scolarite[i];
                break;
            }
        }

    // Si le département n'est pas trouvé on passe au suivant
    if (!dernierEtablissement.CommuneEtablissementOrigineCodePostal) {
      continue;
    }

    // On récupère le département du candidat 
    let departement = dernierEtablissement.CommuneEtablissementOrigineCodePostal.substring(0, 2);


    
    // Si le département est en outre mer, on prend les 3 premiers caractères
    if (departement === "97") {
        departement = dernierEtablissement.CommuneEtablissementOrigineCodePostal.substring(0, 3);
        
    }
    
    // Si le département n'est pas déjà dans l'index, on l'ajoute
    if (!Index[departement]) {
      Index[departement] = { count: { generale: 0, sti2d: 0, other: 0 } };
    } 
    // On incrémente le compteur de la filière correspondante
    if (candidat.Baccalaureat.SerieDiplomeCode === "Générale") {
      Index[departement].count.generale++;
    } else if (candidat.Baccalaureat.SerieDiplomeCode === "STI2D") {
      Index[departement].count.sti2d++;
    } else {
      Index[departement].count.other++;
    }
    }
  }
    console.log(Index);

    return Index;
};

Candidats.getDepartements();

export { Candidats };
