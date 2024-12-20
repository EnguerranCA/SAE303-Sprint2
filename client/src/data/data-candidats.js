let data = await fetch("./src/data/json/candidatures.json");
data = await data.json();

import { Lieux } from "./data-lieux.js";

let Candidats = {};

Candidats.getAll = function () {
  
  return data;
};


Candidats.getDepartements = function (typeDiplome) {
  // Format cible : { "01" : { "count" : { "generale" : 0, "STI2D" : 0, "other" : 0 }, "nom" : Ain, "code": 01} }
  let Index = {};

  for (let i = 0; i < data.length; i++) {
    let candidat = data[i];
    let compteur = 0;

    let dernierEtablissement = null;
    // On ne prend que les candidats ayant un baccalauréat du type demandé ou tous les candidats si typeDiplome = 0
    if (candidat.Baccalaureat.TypeDiplomeCode == typeDiplome || typeDiplome == 0) {
        dernierEtablissement = candidat.Scolarite[1];

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
      Index[departement] = { count: { generale: 0, sti2d: 0, other: 0, postbac: 0 }, appellation_officielle: departement, code: departement };

    } 

    
    // On incrémente le compteur de la filière correspondante
    if (candidat.Baccalaureat.TypeDiplomeCode === 1) {
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

    console.log(Index);

    return Index;
};

Candidats.getPostBacCandidats = function (radius) {
  let postBacCandidats = data.filter((candidat) => candidat.Baccalaureat.TypeDiplomeCode === 1);
  return postBacCandidats;
}



Candidats.formatChart = function (data, threshold) { 
  let departements = []

  for (let dept in data) {
    departements.push(data[dept].appellation_officielle);
  }

  // On trie les départements par ordre décroissant de candidats
  departements.sort((a, b) => (data[b]?.count?.generale || 0) + (data[b]?.count?.sti2d || 0) + (data[b]?.count?.postbac || 0) + (data[b]?.count?.other || 0) - ((data[a]?.count?.generale || 0) + (data[a]?.count?.sti2d || 0) + (data[a]?.count?.postbac || 0) + (data[a]?.count?.other || 0)));

  // On garde les départements où il y a plus de "threshold" candidats et on met les autres dans Autres
  let filteredDepartements = [];

  let autresCount = { generale: 0, sti2d: 0, postbac: 0, other: 0 };
  
  for (let dept of departements) {
    let totalCandidats = data[dept].count.generale + data[dept].count.sti2d + data[dept].count.postbac + data[dept].count.other;
    if (totalCandidats > threshold) {
      filteredDepartements.push(dept);
    } else {
      autresCount.generale += data[dept].count.generale;
      autresCount.sti2d += data[dept].count.sti2d;
      autresCount.postbac += data[dept].count.postbac;
      autresCount.other += data[dept].count.other;
    }
  }

  if (autresCount.generale > 0 || autresCount.sti2d > 0 || autresCount.postbac > 0 || autresCount.other > 0) {
    filteredDepartements.push('Autres');
    data['Autres'] = { appellation_officielle: 'Autres', count: autresCount };
  }

  departements = filteredDepartements;

  // On crée les catégories pour le graphique, l'axe y
  let categories = departements;

  // On crée les séries pour le graphique
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
  return { seriesData: seriesData, categories: categories };
}

export { Candidats };
