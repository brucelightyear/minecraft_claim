# Système de Revendication pour Minecraft Bedrock

<div align="center">
  <img src="ClaimBlock_RP/pack_icon.png" alt="Logo du Système de Revendication" width="128" height="128">
</div>

```
   _____ _       _                 _____           _             
  / ____| |     (_)               / ____|         | |            
 | |    | | __ _ _ _ __ ___  ___| (___  _   _ ___| |_ ___ _ __ ___
 | |    | |/ _` | | '_ ` _ \/ __|\___ \| | | / __| __/ _ \ '_ ` _ \
 | |____| | (_| | | | | | | \__ \____) | |_| \__ \ ||  __/ | | | | |
  \_____|_|\__,_|_|_| |_| |_|___/_____/ \__, |___/\__\___|_| |_| |_|
                                          __/ |                      
                                         |___/                       
```

[![License: MIT](https://img.shields.io/badge/License-MIT-yellow.svg)](https://opensource.org/licenses/MIT)
[![Minecraft: Bedrock](https://img.shields.io/badge/Minecraft-Bedrock-green.svg)](https://www.minecraft.net/)
[![Version](https://img.shields.io/badge/version-1.0.12-blue.svg)](https://github.com/brucelightyear/minecraft_claim/releases)

> Un puissant système de revendication de territoire pour Minecraft Bedrock Edition qui gère automatiquement les modes de jeu des joueurs en fonction de la propriété du territoire.

---

Un script pour Minecraft Bedrock Edition qui implémente un système de revendication de territoire avec changement automatique de mode de jeu. Les joueurs peuvent revendiquer des territoires et recevoir des privilèges en mode créatif dans leurs zones revendiquées, tandis que les autres joueurs sont limités au mode aventure.

## 🌍 Langues Disponibles

- 🇬🇧 [English](README.md)
- 🇫🇷 [Français](README.fr.md)


## Fonctionnalités

- Revendication de territoire à l'aide de blocs spéciaux
- Changement automatique de mode de jeu selon la propriété du territoire :
  - Mode créatif dans votre propre territoire
  - Mode aventure dans les territoires des autres
  - Mode survie dans les zones non revendiquées
- Protection anti-chevauchement des revendications
- Stockage persistant des revendications
- Commandes en jeu pour gérer les revendications

## Commandes

- `!claim_anchor` - Recevoir un bloc de revendication
- `!claims` - Afficher toutes les revendications de territoire actuelles
- `!clear-claims` - Supprimer toutes les revendications (à utiliser avec précaution)

## Fonctionnement

### Revendiquer un Territoire

1. Utilisez la commande `!claim_anchor` pour obtenir un bloc de revendication
2. Placez le bloc de revendication pour créer un territoire
3. Une zone de 100x100 (rayon de 50 blocs) sera revendiquée autour du bloc
4. Les revendications ne peuvent pas chevaucher les territoires existants

### Gestion du Territoire

- Seul le propriétaire peut casser son bloc de revendication
- Les revendications sont automatiquement sauvegardées et persistent entre les redémarrages du serveur
- Le système surveille continuellement la position des joueurs et met à jour les modes de jeu en conséquence

### Règles des Modes de Jeu

Les joueurs changeront automatiquement de mode de jeu :
- **Mode Créatif** : Dans leur propre territoire
- **Mode Aventure** : Dans le territoire de quelqu'un d'autre
- **Mode Survie** : Dans les zones non revendiquées

## Détails Techniques

- Utilise l'API de script de Minecraft Bedrock Edition
- Implémente un stockage persistant utilisant des propriétés dynamiques
- Effectue des vérifications de position toutes les 2 secondes (40 ticks)
- Les revendications sont stockées sous forme de coordonnées avec les informations du propriétaire et le rayon
- Inclut la gestion des erreurs et des messages de débogage

## Installation

1. Téléchargez les deux fichiers .mcpack depuis la [dernière version](https://github.com/brucelightyear/minecraft_claim/releases/tag/v1.0.12) :
   - ClaimBlock_BP.mcpack (Pack de Comportement)
   - ClaimBlock_RP.mcpack (Pack de Ressources)
2. Double-cliquez sur chaque fichier .mcpack pour les installer automatiquement dans Minecraft
3. Créez un nouveau monde ou modifiez un monde existant et activez les deux packs dans les paramètres du monde

## Dépendances

- Minecraft Bedrock Edition

## Langue

Le script inclut des messages en français. Mettez à jour les messages dans le code pour changer de langue.

## Gestion des Erreurs

Le script inclut une gestion complète des erreurs et enregistrera les erreurs dans la console tout en essayant de maintenir la fonctionnalité.

## Contribution

N'hésitez pas à soumettre des problèmes et des pull requests pour aider à améliorer le système.

## Licence

Ce projet est sous licence MIT - voir le fichier LICENSE pour plus de détails.