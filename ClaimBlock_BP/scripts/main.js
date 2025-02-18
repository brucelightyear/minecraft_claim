import { world, BlockLocation, MinecraftBlockTypes, system } from "@minecraft/server";

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
system.run(() => {
    loadClaims();
});

// Chat command handler
world.events.chat.subscribe((eventData) => {
    const { message, sender } = eventData;
    
    if (message.toLowerCase() === "!block") {
        try {
            sender.runCommand("give @s claim:block");
            sender.tell("§a📦 Bloc de claim donné !");
        } catch (error) {
            console.warn("Failed to give claim block: ", error);
            sender.tell("§c❌ Erreur lors de l'attribution du bloc de claim.");
        }
    }
});

// Block place handler
world.events.playerPlaceBlock.subscribe((eventData) => {
    const { player, block } = eventData;
    
    if (block.typeId === "claim:block") {
        const centerX = Math.floor(block.location.x);
        const centerZ = Math.floor(block.location.z);
        const owner = player.name;
        
        // Check for overlapping claims
        for (const [_, existingClaim] of claims) {
            const dx = Math.abs(centerX - existingClaim.x);
            const dz = Math.abs(centerZ - existingClaim.z);
            
            if (dx <= existingClaim.radius + 50 && dz <= existingClaim.radius + 50) {
                player.tell("§c❌ Cette zone chevauche une claim existante !");
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
        player.tell("§a🏰 Zone claimée ! Vous êtes en mode créatif.");
        
        try {
            player.runCommand("gamemode creative @s");
        } catch (error) {
            console.warn("Failed to set gamemode: ", error);
        }
    }
});

// Block break handler
world.events.playerBreakBlock.subscribe((eventData) => {
    const { player, block } = eventData;
    
    if (block.typeId === "claim:block") {
        const centerX = Math.floor(block.location.x);
        const centerZ = Math.floor(block.location.z);
        const claimKey = `${centerX},${centerZ}`;
        
        if (claims.has(claimKey)) {
            const claim = claims.get(claimKey);
            if (claim.owner === player.name) {
                claims.delete(claimKey);
                saveClaims();
                player.tell("§e🏚️ Claim supprimée !");
                try {
                    player.runCommand("gamemode survival @s");
                } catch (error) {
                    console.warn("Failed to set gamemode: ", error);
                }
            } else {
                player.tell("§c❌ Vous ne pouvez pas détruire la claim d'un autre joueur !");
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
                    player.runCommand("gamemode creative @s");
                } else {
                    player.runCommand("gamemode adventure @s");
                }
            } else {
                player.runCommand("gamemode survival @s");
            }
        } catch (error) {
            console.warn("Error processing player position: ", error);
        }
    }
}, 40);