# 3D Arcanist — `Images` folder schema & change log

Context for any Claude Code session working on the project that reads these Google Drive folders.
Last reorganized: 2026-10-09 (Cowork session). Synced to the Mac via Google Drive for desktop (streaming mode).

## Location
- macOS path: `/Users/arcanist/Library/CloudStorage/GoogleDrive-<account>/My Drive/3D Arcanist/Images`
- Drive path: `My Drive/3D Arcanist/Images`

## Structure
```
Images/
├── NomNom/            # brand / category
│   └── <Character folder>/
│       ├── meta.txt   # metadata (see format below)
│       └── *.jpg|*.png (+ optional subfolders, e.g. Gumroad/, PaintStickers/)
├── Tanuki/
│   └── <Character folder>/ ...same layout...
├── Keycaps/           # NOT touched yet — no meta.txt generated
└── myAnimate/         # NOT touched yet — no meta.txt generated
```
- Exactly two levels: `Images/<Brand>/<Character>/`. No intermediate grouping folders (the old `Tanuki/ CHIBIS-TOONS/` was flattened and deleted).
- The brand folder name == `category` == `brand` in every meta.txt of that folder.
- Some files may be cloud-only (not downloaded); reading them triggers a download.

## meta.txt format
UTF-8, 4 lines, `key=value`, no spaces around `=`:
```
name=<exactly the character folder name>
category=<brand folder name>   # NomNom | Tanuki
brand=<brand folder name>      # same value as category
tags=<comma-separated, no spaces after commas, lowercase>
```
Example (`Tanuki/Gojo/meta.txt`):
```
name=Gojo
category=Tanuki
brand=Tanuki
tags=fullsize,tamaño completo,bust,busto,satoru gojo,gojo,jujutsu kaisen,jjk,strongest sorcerer,hechicero más fuerte,six eyes,infinity,infinito,limitless,blindfold,venda en los ojos,white hair,cabello blanco,teacher,maestro,anime,manga,serie
```

### Tag conventions
- Bilingual in the same `tags` line: each English tag is immediately followed by its Spanish translation when one exists (`fire,fuego`). Proper nouns, brands and words identical in both languages appear once.
- Japanese anime/manga also carry the romaji series title right after the English one (`demon slayer,guardianes de la noche,kimetsu no yaiba`).
- Model-type tags come first when they apply: `chibi`, `toon,caricatura`, `extra`, `bust,busto`, `fullsize,tamaño completo`, `diorama`.
  A folder tagged both `bust` and `fullsize` contains images of both sculpts (merged folders, see below).
- Media tags used: `anime, manga, serie, movie/película, game/videojuego, comic/cómic, cartoon/caricatura, animated/animado, book/libro, light novel/novela ligera`.

### Folder naming rules
- No underscores, no size words (`Bust`, `Fullsize`, `Chibi`, `Toon`, `Extra`) in Tanuki folder names, single spaces, no trailing spaces.
- Characters `: / \ ? * " < > |` are never used in names (`:` → ` - `, `/` → `-`).
- Exception: when a chibi/toon shares a name with a full model, the variant word is kept: `Batman Toon`, `Deadpool Toon`, `Frieren Chibi`, `Goku Chibi`.
- NomNom keeps its original descriptive names (`<Character> - <Series>`, chibis prefixed `Chibi ...`).

## Changes made on 2026-10-09
1. Generated/replaced `meta.txt` in every character folder that existed at the time (NomNom 94, Tanuki 114). The 11 pre-existing meta.txt files were overwritten.
2. Tanuki: moved all folders out of ` CHIBIS-TOONS/` into `Tanuki/`, then deleted the empty folder.
3. Tanuki: merged every Bust + Fullsize pair into one folder. All image files kept; a bust file whose name collided with a fullsize file got the suffix ` - Bust` (e.g. `Ciri_01 - Bust.jpg`, `desktop - Bust.ini`). Old meta.txt files inside bust folders were deleted.
4. Tanuki: renamed folders (cleanup + typo fixes: Hallow→Hollow Knight, Napa→Nappa, Invencible→Invincible, Endeavour→Endeavor, Hornet Tanuki→Hornet, M.Bison→M. Bison).
5. NomNom: only whitespace fixes — `Lucca - Chrono Trigger ` (trailing space) and `Chibi Derpy Tiger - Kpop  Demon Hunters` (double space).
6. Created 147 new character folders that contain ONLY meta.txt (no images yet — owner will add them): NomNom 57, Tanuki 90. Listed below.
7. Note: `NomNom/Avatar - Fire and Ash` is the character Varang (tagged as such).

### Tanuki rename / merge map (old → new)
| Old folder(s) | New folder |
|---|---|
| `AkuAku` | `Aku Aku` |
| `Archer`, `Archer_Bust` | `Archer` |
| `Ashe_Fullsize`, `Ashe_Bust` | `Ashe` |
| `BasilHawkins - Fullsize` | `Basil Hawkins` |
| `Batman FULLSIZE` | `Batman` |
| `Batman_Who_Laugh_Fullsize`, `Batman_Who_Laugh_BUST` | `Batman Who Laughs` |
| `Bayonetta_Fullsize`, `Bayonetta_Bust` | `Bayonetta` |
| `Blade_Fullsize`, `Blade_Bust` | `Blade` |
| `Bluto_FULLSIZE`, `Bluto_BUST` | `Bluto` |
| `Boros_BUST` | `Boros` |
| `Bridget_FULLSIZE`, `Bridget_BUST` | `Bridget` |
| `Chihiro_Fullsize`, `Chihiro_Bust` | `Chihiro` |
| `Ciri_Fullsize`, `Ciri_Bust` | `Ciri` |
| `Cyclops_Fullsize`, `Cyclops_Bust` | `Cyclops` |
| `Dante`, `Dante_Bust` | `Dante` |
| `Deadpool` | `Deadpool` |
| `Devilman_Fullsize`, `Devilman` | `Devilman` |
| `Electro`, `Electro_Bust` | `Electro` |
| `Endeavour` | `Endeavor` |
| `Freeza_Fullsize`, `Freeza Bust` | `Freeza` |
| `Frieren`, `Frieren_Bust` | `Frieren` |
| `Gaara_FULLSIZE`, `Gaara_BUST` | `Gaara` |
| `Galacta_Fullsize`, `Galacta_Bust` | `Galacta` |
| `Geralt`, `Geralt_Bust` | `Geralt` |
| `Gojo`, `Gojo_Bust` | `Gojo` |
| `Goku_FullSize` | `Goku` |
| `Green_Ranger`, `GreenRanger_Bust` | `Green Ranger` |
| `Guile Fullsize`, `Guile Bust` | `Guile` |
| `Guts`, `Guts_Bust` | `Guts` |
| `Hallow Knight` | `Hollow Knight` |
| `Hornet Tanuki` | `Hornet` |
| `Ichigo`, `Ichigo_Bust` | `Ichigo` |
| `Inosuke`, `Inosuke_Bust` | `Inosuke` |
| `Itadori_FULLSIZE`, `Itadori-Sukuna_BUST` | `Itadori` |
| `Joker_Batman_Fullsize`, `Joker_Batman_Bust` | `Joker - Batman` |
| `Joker_Persona_Fullsize`, `Joker_Persona_Bust` | `Joker - Persona 5` |
| `Kaido_Fullsize`, `Kaido_Bust` | `Kaido` |
| `Kokushibo`, `Kokushibo_Bust` | `Kokushibo` |
| `Kratos FULLSIZE`, `Kratos BUST` | `Kratos` |
| `Logan Fullsize`, `Logan Bust` | `Logan` |
| `M.Bison`, `M.Bison_Bust` | `M. Bison` |
| `Marco_Fullsize` | `Marco` |
| `Mark_Invencible`, `Mark_Invencible_BUST` | `Mark Invincible` |
| `Napa`, `Napa_Bust` | `Nappa` |
| `Nemesis_Fullsize`, `Nemesis_Bust` | `Nemesis` |
| `Orochimaru_Fullsize`, `Orochimaru_Bust` | `Orochimaru` |
| `Popeye_FullSize`, `Popeye_Bust` | `Popeye` |
| `PuriPuri_FULLSIZE`, `PuriPuri_BUST` | `Puri Puri` |
| `Raziel_FULLSIZE`, `Raziel_BUST` | `Raziel` |
| `Rhino_FULLSIZE`, `Rhino_BUST` | `Rhino` |
| `RockLee_FULLSIZE`, `RockLee_BUST` | `Rock Lee` |
| `Rudo_Fullsize`, `Rudo_Bust` | `Rudo` |
| `Sabo_Fullsize`, `Sabo_Bust` | `Sabo` |
| `Saitama_BUST` | `Saitama` |
| `Saitama_Vs_Boros_DIORAMA` | `Saitama vs Boros` |
| `Sandman_FULLSIZE`, `Sandman_BUST` | `Sandman` |
| `Shiryu`, `Shiryu_Bust` | `Shiryu` |
| `Sora_Fullsize`, `Sora_Bust` | `Sora` |
| `StaticShock_FULLSIZE` | `Static Shock` |
| `Tanjiro_Fullsize`, `Tanjiro_BUST` | `Tanjiro` |
| `Tarma_Fullsize`, `Tarma_Bust` | `Tarma` |
| `Thomas_Wayne_BUST` | `Thomas Wayne` |
| `Tifa`, `Tifa_Bust` | `Tifa` |
| `Trish_Fullsize`, `Trish_Bust` | `Trish` |
| `Vegeta_SSJ3_BUST` | `Vegeta SSJ3` |
| `Vivi_EXTRA` | `Vivi` |
| `Voldemort`, `Voldemort_Bust` | `Voldemort` |
| `War_Fullsize`, `War_Bust` | `War` |
| `Yamato_Fullsize`, `Yamato_Bust` | `Yamato` |
| `Zagreus_Fullsize`, `Zagreus_Bust` | `Zagreus` |
| `Zangief`, `Zangief_Bust` | `Zangief` |
| `Zenitsu_Fullsize`, `Zenitsu_Bust` | `Zenitsu` |
| `Zodd`, `Zodd_Bust` | `Zodd` |
| `CHIBIS-TOONS/Anya` | `Anya` |
| `CHIBIS-TOONS/Batman_Toon` | `Batman Toon` |
| `CHIBIS-TOONS/Cuphead` | `Cuphead` |
| `CHIBIS-TOONS/DeadPool_TOON` | `Deadpool Toon` |
| `CHIBIS-TOONS/Donatello_Toon` | `Donatello` |
| `CHIBIS-TOONS/Double_D` | `Double D` |
| `CHIBIS-TOONS/Ed` | `Ed` |
| `CHIBIS-TOONS/Eddy_EXTRA` | `Eddy` |
| `CHIBIS-TOONS/Frieren_CHIBI` | `Frieren Chibi` |
| `CHIBIS-TOONS/Goku_Chibi` | `Goku Chibi` |
| `CHIBIS-TOONS/Grinch_Chibi` | `Grinch` |
| `CHIBIS-TOONS/Heisenberg_Toon` | `Heisenberg` |
| `CHIBIS-TOONS/Itachi_Chibi` | `Itachi` |
| `CHIBIS-TOONS/Jack_EXTRA` | `Jack Skellington` |
| `CHIBIS-TOONS/King_Gomah_Chibi` | `King Gomah` |
| `CHIBIS-TOONS/Kira_CHIBI` | `Kira` |
| `CHIBIS-TOONS/Leonardo TMNT` | `Leonardo` |
| `CHIBIS-TOONS/Lord-Death` | `Lord Death` |
| `CHIBIS-TOONS/Mashle_Chibi` | `Mashle` |
| `CHIBIS-TOONS/Master Kame` | `Master Kame` |
| `CHIBIS-TOONS/Michelangelo TOON` | `Michelangelo` |
| `CHIBIS-TOONS/Momo` | `Momo` |
| `CHIBIS-TOONS/Mugman` | `Mugman` |
| `CHIBIS-TOONS/Nezuko_Chibi` | `Nezuko` |
| `CHIBIS-TOONS/Okarun_CHIBI` | `Okarun` |
| `CHIBIS-TOONS/Pennywise_Chibi` | `Pennywise` |
| `CHIBIS-TOONS/Rei_Chibi` | `Rei` |
| `CHIBIS-TOONS/Ryuk_Chibi` | `Ryuk` |
| `CHIBIS-TOONS/Sanji_CHIBI` | `Sanji` |
| `CHIBIS-TOONS/Superman_TOON` | `Superman` |
| `CHIBIS-TOONS/White_Beard_Chibi` | `Whitebeard` |
| `CHIBIS-TOONS/Wukong_Chibi` | `Wukong` |

## Current folders
Every folder has a meta.txt. Folders marked † were created empty (meta.txt only) and are waiting for images.

### NomNom (151)
- A friend by the water - Chibi NomNom Original †
- Alastor - Hazbin Hotel
- Alduin - The Elder Scrolls V - Skyrim †
- Alex Luis Armstrong - Fullmetal Alchemist
- Alicia - Clair Obscur - Expedition 33 †
- Alleria Windrunner - Warcraft III
- Alone and Low - Little Nightmare III
- Amarant - Final Fantasy IX †
- Amaterasu - Okami †
- Atsu - Ghost of Yotei
- Auron - Final Fantasy X †
- Avatar - Fire and Ash
- Ayla - Crono Trigger
- Balrog - Lord of the Rings
- Barbatos - Gundam †
- Batman - Batman Beyond †
- Beelstarmon - Digimon †
- Black Rose - .Hack †
- Carl - Dungeon Crawler Carl †
- Chibi Bill cypher - Gravity falls
- Chibi Courage the Cowardly Dog
- Chibi Derpy Tiger - Kpop Demon Hunters
- Chibi Esquie - Clair Obscur Expedition 33
- Chibi Five Nights at Freddy’s 2
- Chibi Gawr Gura
- Chibi Gir - Invader Zim
- Chibi Jinshi - The Apothecary Diaries
- Chibi Maomao - Apothecary Diaries
- Chibi Nergigante - Monster Hunter World
- Chibi Noco - Expedition 33
- Chibi Paper Mario
- Chibi R2D2 - Star Wars
- Chibi Rem Ram Re Zero
- Chibi Sailor moon
- Chibi Skeletor - He-man
- Chibi The Black Knight - Monty Python and the Holy Grail
- Chibi Thousand Sunny - One Piece
- Chibi Tiny Smaug
- Chibi Vanellope - Wreck it Ralph
- Coco - Witch Hat Atelier †
- Crono - Chrono Trigger
- Cthulhu - Mythos
- Dark Samus - Metroid Prime 2 †
- Death - Puss in Boots
- Dracula - Castlevania
- Dragonborn - Skyrim
- Dustin - Stranger Things - Tales From '85 †
- Eiko - Final Fantasy IX †
- Eleven - Stranger Things - Tales From '85 †
- Elizabeth - Bioshock Infinite †
- Esil Radiru - Solo Leveling
- Frog - Crono Trigger
- Ganondorf - Zelda Tears of the Kingdom
- Genichiro Ashina - Sekiro - Shadows Die Twice †
- Gustave - Clair Obscur Expedition 33
- Gyomei - Demon Slayer
- Hornet - Hollow Knight
- Ichigo Kurosaki - Bleach
- Inuyasha †
- Iroh - Avatar
- Jack Sparrow - Pirates of the Caribbean
- Jaina Proudmoore - World of Warcraft
- Jester Lavorre - The Mighty Nein †
- Jij - Dandadan
- Jim Hawkins - Treasure Planet
- Jiraiya - Naruto †
- Katara - Last Air Bender
- Kenshin - Samurai X
- Kida - Atlantis
- Kronk - The Emperor's New Groove
- Lady - Devil May Cry †
- Lady Death †
- Lampmaster - Clair Obscur Expedition 33
- Leon S. Kennedy - Resident Evil Requiem †
- Lina Inverse - Slayers †
- Lucas - Stranger Things - Tales From '85 †
- Lucca - Chrono Trigger
- Lune - Clair Obscur Expedition 33
- Maelle - Clair Obscur Expedition 33
- Magus - Chrono Trigger
- Maka Albarn - Soul Eater †
- Malevola - Dispatch
- Malthael - Diablo 3 Repeaer of Souls †
- Marcille - Delicious in Dungeon
- Marcille X Frieren †
- Marle - Chrono Trigger
- MaryJane and Gwen - Spiderman †
- Max - Stranger Things - Tales From '85 †
- Melinoe - Hades 2
- Mewtwo - Pokemon
- Midna - Zelda
- Mike - Stranger Things - Tales From '85 †
- Mira - Kpop Demon Hunters
- Mitsuri - Demon Slayer
- Morrigan - Dragon Age Origins †
- Morrigan Aensland †
- Muichiro - Demon Slayer
- Naked Snake - Metal Gear Snake Eater
- Nezuko
- Nightcrawler - X-men †
- Obi-wan Kenobi - Star Wars †
- Ori and Naru - Ori and the Blind Forest
- Percival De Rolo - Legend of Vox Machina
- Pikachu - Pokemon
- Qifrey - Witch Hat Atelier †
- Quina Quen - Final Fantasy IX †
- Raziel - Soul Reaver
- Red XIII - Final Fantasy VII Rebirth †
- Riju - Breath of the Wild †
- Rikku - Final Fantasy X
- Riza Hawkeye - Fullmetal Alchemist
- Robo - Chrono Trigger
- Rosalina - Super Mario Galaxy †
- Rose - Legend of Dragoon
- Roxas - Kingdom Hearts 2 †
- Ruby Rose †
- Rumi - Kpop Demon Hunters
- Ryuk - Death Note
- Samwise - Lord of The Rings
- Sanemi - Demon Slayer
- Sanji - One Piece †
- Sciel - Expedition 33
- Seras Victoria - Hellsing Ultimate
- Skeletor †
- Solaire of Astora - Dark Souls
- Spawn - Spawn comics †
- Spider-Noir †
- Spiderman - Brand New Day †
- Squall Leonhart - Final Fantasy
- Steiner - Final Fantasy IX †
- Suki - Avatar The Last Airbende
- Super Mario Galaxy Movie †
- T-60 Power Armor - Fall out 4
- The Iron Giant †
- Tidus - Final Fantasy X
- Trevor Belmont - Castlevania
- Trunks - DragonBall Z †
- Ty Lee - Avatar †
- Uchiha Itachi - Naruto Shippuden
- Valrie NomNom Original
- Vin - Mistborn †
- Wargreymon - Digimon
- Will - Stranger Things - Tales From '85 †
- Xenomorph - Alien
- Yoruichi Shihoin - Bleach †
- Ysera - World of Warcraft †
- Yugi Muto - Yu-gi-oh
- Yuna - Final Fantasy X
- Yzma - Emperors New Groove
- Zagreus - Hades
- Zoey - KPop Demon Hunters

### Tanuki (204)
- Agumon
- Aku Aku
- Albedo †
- Allen the Alien †
- Android 18 †
- Anya
- Archer
- Ashe
- Asterix †
- Asuka
- Baba Yaga †
- Baby Sinclair †
- Basil Hawkins
- Batman
- Batman Toon
- Batman Who Laughs
- Battle Beast †
- Bayonetta
- Beast †
- Behelit
- Big Boss †
- Blade
- Bluto
- Bomberman †
- Boros
- Bridget
- Cart Titan †
- Cha Hae-in †
- Chel †
- Chihiro
- Chocobo †
- Chun-Li †
- Ciri
- Cody †
- Colossus †
- Colossus Toon †
- Cuphead
- Cyclops
- Dante
- Daredevil †
- Darth Vader †
- Deadpool
- Deadpool Toon
- Death - Darksiders †
- Death - Puss in Boots †
- Deidara †
- Deku †
- Devilman
- Donatello
- Double D
- Dovahkiin †
- Dr. Octopus †
- Ed
- Eddy
- Edward Kenway †
- Electro
- Endeavor
- Eva 01 †
- Faye †
- Freeza
- Frieren
- Frieren Chibi
- Fury †
- Gaara
- Galacta
- Geralt
- Ghost Rider †
- Goblin Slayer †
- Gohan SSJ2 †
- Gojo
- Goku
- Goku Chibi
- Goliath †
- Green Lantern †
- Green Ranger
- Grey Matter †
- Griffith †
- Grinch
- Guile
- Guts
- Happy †
- Heisenberg
- Hollow Knight
- Hornet
- Ichigo
- Inosuke
- Invincible †
- Itachi
- Itadori
- Jack Skellington
- Jeff †
- Jin Kazama †
- Jinx
- Jiraiya †
- Joker - Batman
- Joker - Persona 5
- Juggernaut †
- Kaido
- Kid Goku & Bulma †
- King Gomah
- Kingpin †
- Kira
- Kisame †
- Knuckles †
- Kokushibo
- Kon †
- Kratos
- Krusty the Clown †
- L - Death Note †
- Leon S. Kennedy †
- Leonardo
- Logan
- Lord Death
- Luffy
- M. Bison
- Magneto
- Mai Shiranui †
- Maki †
- Malenia †
- Marco
- Mark Invincible
- Mashle
- Master Chief †
- Master Kame
- May †
- Meruem
- Michelangelo
- Miguel †
- Minato †
- Momo
- Moogle †
- Morrigan †
- Motoko †
- Mr. Burns †
- Mugman
- Musashi †
- Nappa
- Naruto
- Nemesis
- Neo Cortex †
- Nezuko
- Obelix †
- Okarun
- Ori
- Ornstein †
- Orochimaru
- Pakkun †
- Pennywise
- Phoenix Ikki †
- Pochita †
- Popeye
- Prince of Persia †
- Puri Puri
- Raphael †
- Raziel
- Red Ranger †
- Rei
- Rhino
- Rock Lee
- Rogue †
- Rudo
- Ryuk
- Sabo
- Sagat †
- Saitama
- Saitama vs Boros
- Sandman
- Sanji
- Sesshomaru †
- Shadow †
- Shiryu
- Silver Surfer †
- Sora
- Spider-Punk †
- Spike Spiegel †
- Static Shock
- Stitch †
- Sung Jin-Woo †
- Superman
- Tanjiro
- Tanya Degurechaff †
- Tarma
- Taz †
- Thomas Wayne
- Tifa
- Trish
- Vault Boy †
- Vegeta SSJ3
- Venom †
- Vincent Valentine †
- Vivi
- Voldemort
- War
- Whitebeard
- Wolf Princess †
- Wolverine †
- Wonder Woman †
- Wukong
- Yamato
- Yennefer †
- Zagreus
- Zangief
- Zenitsu
- Zodd

## Known gaps
- `Keycaps/` and `myAnimate/` have no meta.txt yet.
- Folders marked † have no images yet. Code reading these folders should tolerate a character folder that contains only meta.txt.
- A few folder names keep typos from the source list on purpose (e.g. `Ayla - Crono Trigger`, `Malthael - Diablo 3 Repeaer of Souls`); tags use the correct spelling.
