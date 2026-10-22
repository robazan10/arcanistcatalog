# 3D Arcanist — `Images` folder schema & change log

Context for any Claude Code session working on the project that reads these Google Drive folders.
Last changed: 2026-10-22 (keycap series rebuilt from the owned models, with `meta.txt`; see "Changes made on 2026-10-22"). Before that: 2026-10-21 (type folders added, keycaps sorted by series) and 2026-10-09 (Cowork session). Synced to the Mac via Google Drive for desktop (streaming mode).

## Location
- macOS path: `/Users/arcanist/Library/CloudStorage/GoogleDrive-<account>/My Drive/3D Arcanist/Images`
- Drive path: `My Drive/3D Arcanist/Images`

## Structure: type → brand → product

```
Images/
├── 01 Figures/
│   ├── NomNom/                    151 product folders
│   │   └── Zoey - KPop Demon Hunters/   meta.txt + Cover.jpg + photos
│   ├── Tanuki/                    204 product folders
│   │   └── Voldemort/
│   └── myAnimate/                 31 product folders (no meta.txt yet)
│       └── Ace/
├── 02 Keycaps/
│   └── Hiko/                      67 series folders, meta.txt only (no photos yet)
│       └── Demon Slayer/          one product per series; its keycaps go in as photos
├── 03 Dice/                       empty for now; the shop's own designs go under an `Arcanist's Dice` brand folder
├── 04 Others/                     empty for now (deckboxes, accessories…)
└── Keycaps/                       leftover from the move; only a duplicate photo and empty folders; the owner deletes it
```

- **Always three levels:** `Images/<NN Type>/<Brand>/<Product>/`. The type becomes the side menu on the site; the brand becomes the chips inside each type.
- **The catalog script reads these three levels** (since the `feat/script-three-levels` PR, 2026-10-21): the type from the first level, the brand from the second. Every photo kept its Drive ID and sharing in the move, so the live site was never affected. Run `node index.js --dry-run` to see what a run would produce without changing anything.
- **Type folders are named in English,** with a number prefix (`01 `, `02 `…) that sets the menu order; the script hides the number. A type folder without a number goes last, with a warning; two folders with the same type name (like the leftover `Keycaps`) are merged into one type, with a warning. The site shows each type in the visitor's language through `src/i18n/dictionaries.ts` (Figures → "Figuras" on `/`); a type without a translation shows its folder name as is.
- **New types** are added by creating a folder at the first level (for example `05 Deckboxes`). A more specific name reads better in the menu than "Others".
- **Brand folders** keep the designer or studio name (Tanuki, NomNom, myAnimate, Hiko). The shop's own products go under `Arcanist's Dice`, so every product has a brand.
- **Product folders:** `meta.txt` (`name=`, `tags=`), a `Cover` image and the photos directly inside; subfolders are ignored. `category=` and `brand=` are no longer needed because the folders give them; existing `meta.txt` files keep working, and the script warns when they don't match the folders (the folder wins).
- **Keycaps are one product per series, anime, movie or game** (owner's choice, 2026-10-21): `02 Keycaps/Hiko/Demon Slayer/` holds every Demon Slayer keycap. Photo file names keep the character names; the characters go in `tags=` so searching a character still finds the series.
- **Product IDs stay brand + name** (`tanuki-voldemort`, `hiko-demon-slayer`), so they don't change when a product moves between types; the script warns if two products ever get the same ID.
- **Keep the root:** `Images/` itself stays where it is (its ID is `rootFolderId` and it's shared with the script's service account; folders created inside inherit that).
- `3D Arcanist/Hiko Keycaps/` (outside `Images/`) holds Hiko's model files (`.stl`, `.rar`) for printing, not catalog photos; it stays out of the catalog. The owner's working copy of the models is on the Mac at `Desktop/Arcanist's Dice/3D Models/Hiko Keycaps/`; the keycap series and their tags were built from it.
- `3D Arcanist/Keycaps archive/Hiko/` (outside `Images/`) holds the 32 keycap series as they were on 2026-10-21, with their 85 photos (Hiko's renders and promo images). The script doesn't read it; the owner picks photos from it for the new series folders.
- Some files may be cloud-only (not downloaded); reading them triggers a download.

## meta.txt format
UTF-8, `key=value` lines, no spaces around `=`. Only `name=` is required:
```
name=<exactly the product folder name>
tags=<comma-separated, no spaces after commas, lowercase>
```
The files written on 2026-10-09 and the keycap files written on 2026-10-22 also have `category=` and `brand=` (both the brand folder's name, e.g. `Hiko`; the owner asked for them on the keycaps). They still work; since the three-level script, the brand and category come from the folder, and a value that doesn't match only produces a warning. New files don't need them.
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

## Changes made on 2026-10-22
Done by Claude Code through the synced folder, with the owner's approval (moves and new files only; nothing deleted).

1. Moved the 32 series folders of 2026-10-21, with their 85 photos, from `Images/02 Keycaps/Hiko/` to `3D Arcanist/Keycaps archive/Hiko/` (outside `Images/`, so the script ignores them). The owner wanted the series folders to start without images.
2. Created one folder per series in `Images/02 Keycaps/Hiko/` for every Hiko model the owner has, each with only a `meta.txt` (`name=`, `category=Hiko`, `brand=Hiko`, `tags=`). 67 folders:
   - **The 32 earlier series**, recreated: Arcane, Berserk, Bleach, Chainsaw Man, Clair Obscur - Expedition 33, Dandadan, Deadpool, Demon Slayer, Donkey Kong Bananza, Dragon Ball, Evangelion, Hollow Knight, Hunter x Hunter, JoJo's Bizarre Adventure, Jujutsu Kaisen, KPop Demon Hunters, Kirby, Labubu, Mortal Kombat, My Hero Academia, Naruto, One Piece, Pokemon, Sailor Moon, Solo Leveling, Sonic, Spider-Man, Spy x Family, Stranger Things, Studio Ghibli, Super Mario, The Legend of Zelda.
   - **21 new series:** Attack on Titan, Cyberpunk Edgerunners, Digimon, Mob Psycho 100, One Punch Man, Frieren, The Apothecary Diaries, Witch Hat Atelier, Final Fantasy, Kingdom Hearts, The Amazing Digital Circus, Genshin Impact, League of Legends, Valorant, X-Men, Teenage Mutant Ninja Turtles, The Simpsons, Duolingo, Video Game Consoles, Japanese Masks, Sports Balls.
   - **14 Hiko originals, grouped by theme:** Cute Animals, Kitties, Dinosaurs, Christmas, Halloween, Valentine's Day, Spiritual Symbols, Aliens and Demons, Food, Sushi, Plants, Zodiac Signs (Aries), Owl Witch (Hiko's own design), Mimic Chest (a generic RPG mimic, not Frieren's).
3. **Tags come from the model file names** (owner's request): every character or object in the series' `.stl`/`.3mf` files and archives is a tag, cleaned of words like `keycap`, `by_hiko`, `stem`, `hollow`, `v2`, followed by the bilingual and media tags. Teemo, the Poros and Kindred are their own `League of Legends` series; `Arcane` keeps Caitlyn and Jinx. Pokemon stays one series with every Pokémon and ball as a tag.
4. Left out on purpose: `Smile_Keycaps` (a free set by another designer; owner's choice) and `ExtraClear/Cthulhu.stl` (same file name as the Smile set).

## Changes made on 2026-10-21
Done by Claude Code through the synced folder, with the owner's approval. Every move was a move (never a copy or delete) and was checked against Drive's server: all moved folders and files kept their Drive IDs, and the 1,734 photos used by the live site were all found in the new structure and still load publicly.

1. Created `01 Figures/`, `02 Keycaps/`, `03 Dice/`, `04 Others/`.
2. Moved `myAnimate/`, `Tanuki/` and `NomNom/` into `01 Figures/` (2,595 folder and file IDs compared before and after: all identical).
3. Sorted the keycap photos from `Keycaps/Images/` (76 loose photos + 5 series folders) into `02 Keycaps/Hiko/<series>/`: 85 photos in 32 series folders. Seven set or "portada" images were renamed `Cover.jpg` (marked ✱ below); all other photos kept their file names.
4. Left in `Keycaps/Images/`: `LUFFYS.jpg` (a byte-for-byte copy of `One Piece/LUFFYS.jpg`) and the 5 old series folders, now empty. Nothing was deleted; the owner deletes the leftover folder.

### Keycap series of 2026-10-21 (since 2026-10-22 in `3D Arcanist/Keycaps archive/Hiko/`)
| Series folder | Photos | Characters or sets |
|---|---|---|
| Arcane | 4 | Caitlyn, Jinx |
| Berserk | 2 | |
| Bleach | 3 | Ichigo + Kon ✱, Kon, hollow-mask Ichigo |
| Chainsaw Man | 2 | Vol I ✱, Vol II |
| Clair Obscur - Expedition 33 | 2 | Esquie |
| Dandadan | 7 | Jiji, Jiji Evil Eye, Momo, Turbo Granny |
| Deadpool | 1 | |
| Demon Slayer | 9 | set (Tanjiro, Nezuko, Zenitsu, Inosuke) ✱, Akaza, Giyu, Kokushibo, Muzan, Gyomei |
| Donkey Kong Bananza | 1 | |
| Dragon Ball | 5 | DBZ Vol I ✱ (+ render, unpainted print), DBZ Vol II, Goku Daima SSJ4 |
| Evangelion | 2 | |
| Hollow Knight | 1 | |
| Hunter x Hunter | 1 | ✱ |
| JoJo's Bizarre Adventure | 2 | Jotaro |
| Jujutsu Kaisen | 5 | set, Gojo, Maki Awakened |
| KPop Demon Hunters | 4 | Mira, Zoey and Rumi; Derpy and Sussie |
| Kirby | 2 | |
| Labubu | 1 | |
| Mortal Kombat | 1 | ninjas |
| My Hero Academia | 2 | |
| Naruto | 1 | |
| One Piece | 3 | Luffy, Zoro and Sanji; Luffys; Shanks |
| Pokemon | 2 | Eeveelutions Vol I ✱, Legendaries Vol II |
| Sailor Moon | 1 | |
| Solo Leveling | 7 | Jin-Woo, Igris, Beru, Tank |
| Sonic | 2 | |
| Spider-Man | 1 | Miles Morales and Gwen Stacy |
| Spy x Family | 1 | ✱ |
| Stranger Things | 1 | Demogorgon |
| Studio Ghibli | 5 | Calcifer and Kaonashi, Totoro, San (one folder: one photo mixes two movies) |
| Super Mario | 1 | Yoshi |
| The Legend of Zelda | 3 | Zelda, Link |

Several keycap photos are Hiko's promotional renders (Patreon logo or "HIKO" watermark). The owner will add more keycap series later from Hiko's unsorted models.

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
NomNom and Tanuki are now under `01 Figures/` (see the structure above). Every folder has a meta.txt. Folders marked † were created empty (meta.txt only) and are waiting for images.

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
- `01 Figures/myAnimate/` (31 folders) has no meta.txt yet.
- The 67 keycap series in `02 Keycaps/Hiko/` have no photos yet (the earlier ones are in `Keycaps archive/Hiko/`); they show "Fotos pronto" on the site until the owner adds photos and a `Cover`.
- The myAnimate folders have no `Cover` image yet.
- `Images/Keycaps/` is a leftover (a duplicate photo and empty folders) for the owner to delete.
- Folders marked † have no images yet. Code reading these folders should tolerate a character folder that contains only meta.txt.
- A few folder names keep typos from the source list on purpose (e.g. `Ayla - Crono Trigger`, `Malthael - Diablo 3 Repeaer of Souls`); tags use the correct spelling.
