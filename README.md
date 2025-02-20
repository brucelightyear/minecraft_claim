# Minecraft Bedrock Claims System

<div align="center">
  <img src="ClaimBlock_RP/pack_icon.png" alt="Claims System Logo" width="128" height="128">
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

> A powerful territory claiming system for Minecraft Bedrock Edition that automatically manages player gamemodes based on territory ownership.

---

A Minecraft Bedrock Edition script that implements a territory claiming system with automatic gamemode switching. Players can claim territories and receive creative mode privileges within their claimed areas while other players are restricted to adventure mode.

## 🌍 Available Languages

- 🇬🇧 [English](README.md)
- 🇫🇷 [Français](README.fr.md)

## Features

- Territory claiming using special claim blocks
- Automatic gamemode switching based on territory ownership:
  - Creative mode in your own territory
  - Adventure mode in others' territories
  - Survival mode in unclaimed areas
- Anti-overlap protection for claims
- Persistent storage of claims
- In-game commands for managing claims

## Commands

- `!claim_anchor` - Receive a claim block
- `!claims` - Display all current territory claims
- `!clear-claims` - Remove all claims (use with caution)

## How It Works

### Claiming Territory

1. Use the `!claim_anchor` command to get a claim block
2. Place the claim block to create a territory
3. A 100x100 area (50 blocks radius) will be claimed around the block
4. Claims cannot overlap with existing territories

### Territory Management

- Only the owner can break their claim block
- Claims are automatically saved and persist between server restarts
- The system continuously monitors player positions and updates gamemodes accordingly

### Gamemode Rules

Players will automatically switch between different gamemodes:
- **Creative Mode**: When in your own territory
- **Adventure Mode**: When in someone else's territory
- **Survival Mode**: When in unclaimed areas

## Technical Details

- Uses the Minecraft Bedrock Edition scripting API
- Implements persistent storage using dynamic properties
- Runs position checks every 2 seconds (40 ticks)
- Claims are stored as coordinates with owner information and radius
- Includes error handling and debugging messages

## Installation

1. Download both .mcpack files from the [latest release](https://github.com/brucelightyear/minecraft_claim/releases/tag/v1.0.12):
   - ClaimBlock_BP.mcpack (Behavior Pack)
   - ClaimBlock_RP.mcpack (Resource Pack)
2. Double-click each .mcpack file to automatically install them in Minecraft
3. Create a new world or edit an existing one and activate both packs in the world settings

## Dependencies

- Minecraft Bedrock Edition

## Language

The script includes French language messages. Update the messages in the code to change the language.

## Error Handling

The script includes comprehensive error handling and will log errors to the console while attempting to maintain functionality.

## Contributing

Feel free to submit issues and pull requests to help improve the system.

## License

This project is licensed under the MIT License - see the LICENSE file for details.
