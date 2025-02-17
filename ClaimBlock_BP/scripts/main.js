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
    world.setDynamicProperty(CLAIMS_PROPERTY, JSON.stringify(Array.from(claims.entries())));
}

// Load claims when the script starts
system.runTimeout(() => {
    loadClaims();
}, 1);

// system.runInterval(() => {
//     world.getAllPlayers().forEach(player => {
//         player.sendMessage("Hello joueur !");
//     });
// }, 200); // Message toutes les 10 secondes

world.beforeEvents.chatSend.subscribe((event) => {
    const { message, sender } = event;
    
    if (message.toLowerCase() === "!block") {
        event.cancel = true; // Prevent the command from showing in chat
        try {
            sender.runCommandAsync("give @s claim:block");
            sender.sendMessage("§a📦 Bloc de claim donné !");
        } catch (error) {
            console.warn("Failed to give claim block: ", error);
            sender.sendMessage("§c❌ Erreur lors de l'attribution du bloc de claim.");
        }
    }
});

world.afterEvents.blockPlace.subscribe((event) => {
    const { player, block } = event;

    if (block.typeId === "claim:block") {
        const centerX = Math.floor(block.location.x);
        const centerZ = Math.floor(block.location.z);
        const owner = player.name;
        
        // Check for overlapping claims
        for (const [_, existingClaim] of claims) {
            const dx = Math.abs(centerX - existingClaim.x);
            const dz = Math.abs(centerZ - existingClaim.z);
            
            if (dx <= existingClaim.radius + 50 && dz <= existingClaim.radius + 50) {
                player.sendMessage("§c❌ Cette zone chevauche une claim existante !");
                block.dimension.getBlock(block.location).setType("minecraft:air");
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
        
        try {
            player.runCommandAsync("gamemode creative @s");
        } catch (error) {
            console.warn("Failed to set gamemode: ", error);
        }
    }
});

world.afterEvents.blockBreak.subscribe((event) => {
    const { player, block } = event;
    
    if (block.typeId === "claim:block") {
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
                    player.runCommandAsync("gamemode survival @s");
                } catch (error) {
                    console.warn("Failed to set gamemode: ", error);
                }
            } else {
                player.sendMessage("§c❌ Vous ne pouvez pas détruire la claim d'un autre joueur !");
            }
        }
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
                    player.runCommandAsync("gamemode creative @s");
                } else {
                    player.runCommandAsync("gamemode adventure @s");
                }
            } else {
                player.runCommandAsync("gamemode survival @s");
            }
        } catch (error) {
            console.warn("Error processing player position: ", error);
        }
    }
}, 40);