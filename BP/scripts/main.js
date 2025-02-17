import { world, system, MinecraftDimensionTypes } from "@minecraft/server";

// Store claims with persistence using world.getDynamicProperty and setDynamicProperty
const CLAIMS_PROPERTY = "claims_data";

// Initialize claims from stored data
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

world.afterEvents.blockPlace.subscribe((event) => {
    const { player, block } = event;

    // Check if it's a claim block
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
                // Break the placed block
                block.dimension.getBlock(block.location).setType("minecraft:air");
                return;
            }
        }

        // Create new claim
        claims.set(`${centerX},${centerZ}`, {
            owner: owner,
            x: centerX,
            z: centerZ,
            radius: 50 // Half-size (100x100)
        });

        // Save claims after modification
        saveClaims();

        player.sendMessage("§a🏰 Zone claimée ! Vous êtes en mode créatif.");
        try {
            player.runCommand("gamemode creative");
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
            } else {
                event.cancel = true;
                player.sendMessage("§c❌ Vous ne pouvez pas détruire la claim d'un autre joueur !");
            }
        }
    }
});

world.afterEvents.chatSend.subscribe((event) => {
    const { sender, message } = event;
    
    if (message === "!block") {
        try {
            sender.runCommand("give @s claim:block");
            sender.sendMessage("§a📦 Bloc de claim donné !");
        } catch (error) {
            console.warn("Failed to give claim block: ", error);
        }
    }
});

// Check player positions periodically
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
                    player.runCommand("gamemode creative");
                } else {
                    player.runCommand("gamemode adventure");
                }
            } else {
                player.runCommand("gamemode survival");
            }
        } catch (error) {
            console.warn("Error processing player position: ", error);
        }
    }
}, 40); // Check every 2 seconds