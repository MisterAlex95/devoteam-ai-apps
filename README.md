# Optimisation de l’Infrastructure Technique pour Jean (CTO)

## Objectif

Développer une solution qui permet de :

### 1. Ingestion et Analyse de Données Techniques

- Traiter des données simulées issues d’un fichier JSON ou d’un flux en temps réel.

### 2. Détection d’Anomalies

- Identifier des indicateurs anormaux (par exemple : utilisation excessive du CPU, latence élevée, etc.).

### 3. Génération de Recommandations

- Produire un rapport structuré (format JSON ou affichage console) proposant des actions concrètes pour optimiser la performance de l’infrastructure (répartition de charge, ajustement des ressources, etc.).

## Architecture Multi-Noeuds

Votre solution doit être organisée en plusieurs étapes (par exemple : ingestion →
analyse → recommandation). La structuration de ces étapes est laissée à votre
discrétion.

## Documentation

Expliquez vos choix techniques et architecturaux (langage, bibliothèques, etc.) via
des commentaires dans le code ou un document annexe.

---

## Principe

### V1

- extractation des donnée toutes les 30mins
- ingestion d'un extract par le node `ingestDataNode`
- analyse de la data par le node `analyzeNode`

### V2

- extractation des donnée toutes les 30mins
- ingestion d'un extract par le node `ingestDataNode`
- analyse de la data par le node `analyzeNode`
