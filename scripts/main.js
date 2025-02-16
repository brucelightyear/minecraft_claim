import { system, world } from "@minecraft/server";

system.runInterval(() => {
    world.getAllPlayers().forEach(player => {
        player.sendMessage("Hello joueur !");
    });
}, 200); // Message toutes les 10 secondes