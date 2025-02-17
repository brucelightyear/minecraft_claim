import { world, system, MinecraftDimensionTypes } from "@minecraft/server";

// Stocker les claims
let claims = new Map();

world.afterEvents.blockPlace.subscribe(event => {
    let { player, block } = event;

    // Vérifier si c'est le bloc de claim
    if (block.typeId === "claim:block") {
        let centerX = block.location.x;
        let centerZ = block.location.z;
        let owner = player.name;
        
        claims.set(`${centerX},${centerZ}`, {
            owner: owner,
            x: centerX,
            z: centerZ,
            radius: 50 // Demi-taille (100x100)
        });

        player.sendMessage(`🏰 Zone claimée ! Vous êtes en mode créatif.`);
        player.runCommand("gamemode creative");
    }
});

world.afterEvents.chatSend.subscribe(event => {
    let { sender, message } = event;
    
    if (message === "!block") {
        sender.runCommand("give @s claim:block");
        sender.sendMessage("📦 Bloc donné !");
    }
});


// Vérifier périodiquement la position des joueurs
system.runInterval(() => {
    for (let player of world.getPlayers()) {
        let { x, z } = player.location;
        let isInClaim = false;
        let claimOwner = null;

        for (let [key, claim] of claims) {
            let dx = Math.abs(x - claim.x);
            let dz = Math.abs(z - claim.z);

            if (dx <= claim.radius && dz <= claim.radius) {
                isInClaim = true;
                claimOwner = claim.owner;
                break;
            }
        }

        if (isInClaim) {
            if (player.name === claimOwner) {
                player.runCommand("gamemode creative");
            } else {
                player.runCommand("gamemode adventure");
            }
        } else {
            player.runCommand("gamemode survival");
        }
    }
}, 40); // Vérifie toutes les 2 secondes
