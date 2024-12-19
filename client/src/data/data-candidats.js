let data = await fetch("./src/data/json/candidatures.json");
data = await data.json();

let Candidats = {};

Candidats.getAll = function () {
  return data;
};

Candidats.getDepartements = function (typeDiplome) {
  // Format cible : { "01" : { "count" : { "generale" : 0, "STI2D" : 0, "other" : 0 }} }
  let Index = {};


  for (let i = 0; i < data.length; i++) {
    let candidat = data[i];
    let compteur = 0;
    if (candidat.Baccalaureat.TypeDiplomeCode == typeDiplome || typeDiplome == 0) {
        let dernierEtablissement = {};


        for (let i = 0; i < 1; i++) {
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
      Index[departement] = { count: { generale: 0, sti2d: 0, other: 0, postbac: 0 } };
    } 

    
    // On incrémente le compteur de la filière correspondante
    if (candidat.Baccalaureat.TypeDiplomeCode === 1) {
      console.log("postbac")
      // On incrémente le compteur de postbac si le type de diplome est 4
      Index[departement].count.postbac++;
    } else if (candidat.Baccalaureat.SerieDiplomeCode === "Générale") {
      Index[departement].count.generale++;
    } else if (candidat.Baccalaureat.SerieDiplomeCode === "STI2D") {
      Index[departement].count.sti2d++;
    } else {
      Index[departement].count.other++;
    }
    }

    compteur++;
  }
    console.log(Index);

    return Index;
};

Candidats.getDepartements();

Candidats.formatChart = function (data, threshold) { 
  // On définie les noms de catégories par les noms de départements
  const departements = Object.keys(data);

  // On trie les département par ordre décroissant de candidats

  let seriesData = [
    {
      name: 'Générale',
      data: departements.map(dept => data[dept].count.generale)
    },
    {
      name: 'STI2D',
      data: departements.map(dept => data[dept].count.sti2d)
    },
    {
      name: 'Postbac',
      data: departements.map(dept => data[dept].count.postbac)
    },
    {
      name: 'Other',
      data: departements.map(dept => data[dept].count.other)
    }
  ];

  return seriesData;
}

export { Candidats };
