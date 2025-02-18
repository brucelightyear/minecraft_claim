import { world, system } from "@minecraft/server";

// Store claims with persistence
const CLAIMS_PROPERTY = "claims_data";
let claims = new Map();

// Load stored claims
function loadClaims() {
    const storedClaims = world.getDynamicProperty(CLAIMS_PROPERTY);
    if (storedClaims) {
        claims = new Map(JSON.parse(storedClaims));
    }
}

// Save claims to persistent storage
function saveClaims() {
    player.sendMessage(JSON.stringify(Array.from(claims.entries())));
    world.setDynamicProperty(CLAIMS_PROPERTY, JSON.stringify(Array.from(claims.entries())));
}
 
// Load claims when the script starts
system.run(() => {
    loadClaims();
});

world.afterEvents.playerJoin.subscribe(event => {
    let player = event.player;
    player.sendMessage("Bienvenue sur le serveur !");
});

// Display all claims
function displayClaims(player) {
    try {
        if (claims.size === 0) {
            player.sendMessage("§e📝 Aucune claim n'existe actuellement.");
            return;
        }

        player.warn("§e📝 Liste des claims :");
        for (const [coords, claim] of claims) {
            const [x, z] = coords.split(",").map(Number);
            player.sendMessage(`§a👤 ${claim.owner} §f: [§b${x}§f, §b${z}§f] (Zone: §6${claim.radius * 2}x${claim.radius * 2}§f)`);
        }
    } catch (error) {
        console.warn("Failed to display claims: ", error);
    }
}

// Chat command handler
// world.afterEvents.chatSend.subscribe((eventData) => {
//     const { message, sender } = eventData;
//     console.warn("chatSend.subscribe: ");
//     if (message.toLowerCase() === "!block") {
//         try {
//             sender.runCommand("give @s claim:block");
//             sender.tell("§a📦 Bloc de claim donné !");
//         } catch (error) {
//             console.warn("Failed to give claim block: ", error);
//             sender.tell("§c❌ Erreur lors de l'attribution du bloc de claim.");
//         }
//     }
// });

// Block place handler
world.afterEvents.playerPlaceBlock.subscribe((eventData) => {
    const { player, block } = eventData;
    if (block.typeId === "claim:block") {
        try {
            console.warn("playerPlaceClaimBlock");        
            const centerX = Math.floor(block.location.x);
            const centerZ = Math.floor(block.location.z);
            const owner = player.name;
            
            // Check for overlapping claims
            for (const [_, existingClaim] of claims) {
                const dx = Math.abs(centerX - existingClaim.x);
                const dz = Math.abs(centerZ - existingClaim.z);
                
                if (dx <= existingClaim.radius + 50 && dz <= existingClaim.radius + 50) {
                    player.sendMessage("§c❌ Cette zone chevauche une claim existante !");
                    return;
                }
            }

            claims.set(`${centerX},${centerZ}`, {
                owner: owner,
                x: centerX,
                z: centerZ,
                radius: 50
            });

            saveClaims();
            player.sendMessage("§a🏰 Zone claimée ! Vous êtes en mode créatif.");
        } catch (error) {
            console.warn("Failed to place claim block: ", error);
        }
        try {
            player.runCommand("gamemode creative @s");
        } catch (error) {
            console.warn("Failed to set gamemode: ", error);
        }
        displayClaims(player);
    }
});

// Block break handler
world.afterEvents.playerBreakBlock.subscribe((eventData) => {
    const { player, block } = eventData;
    console.warn("playerBreakBlock"); 
    if (block.typeId === "claim:block") {
        try {
            console.warn("playerBreakClaimBlock");
            const centerX = Math.floor(block.location.x);
            const centerZ = Math.floor(block.location.z);
            const claimKey = `${centerX},${centerZ}`;
            
            if (claims.has(claimKey)) {
                const claim = claims.get(claimKey);
                if (claim.owner === player.name) {
                    claims.delete(claimKey);
                    saveClaims();
                    player.sendMessage("§e🏚️ Claim supprimée !");
                    try {
                        player.runCommand("gamemode survival @s");
                    } catch (error) {
                        console.warn("Failed to set gamemode: ", error);
                    }
                } else {
                    player.sendMessage("§c❌ Vous ne pouvez pas détruire la claim d'un autre joueur !");
                }
            }
        } catch (error) {
            console.warn("Failed to break claim block: ", error);
        }
        displayClaims(player);
    }
});

// Check player positions
system.runInterval(() => {
    for (const player of world.getAllPlayers()) {
        try {
            const { x, z } = player.location;
            let isInClaim = false;
            let claimOwner = null;

            for (const [_, claim] of claims) {
                const dx = Math.abs(x - claim.x);
                const dz = Math.abs(z - claim.z);

                if (dx <= claim.radius && dz <= claim.radius) {
                    isInClaim = true;
                    claimOwner = claim.owner;
                    break;
                }
            }

            if (isInClaim) {
                if (player.name === claimOwner) {
                    player.runCommand("gamemode survival @s");
                } else {
                    player.runCommand("gamemode adventure @s");
                }
            } else {
                player.runCommand("gamemode adventure @s");
            }
        } catch (error) {
            console.warn("Error processing player position: ", error);
        }
    }
}, 40);