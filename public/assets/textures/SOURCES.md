# Texture sources and usage

This folder keeps the material assets used by the archive presentation together with their provenance. Third-party project imagery from the visual references is not included.

## Shipped in the archive

| File | Source | License | Project use |
| --- | --- | --- | --- |
| `paper-fiber-cc0.jpg` | [ambientCG Paper 001](https://ambientcg.com/view?id=Paper001) | [CC0](https://docs.ambientcg.com/license/) | The 1K color map is used as the subtle fiber layer on the hero objects and archive sheets. |
| `paper-folds-cc0.png` | [Crumpled Paper by Epicpanda65](https://commons.wikimedia.org/wiki/File:Crumpled_Paper.png) | [CC0 1.0](https://creativecommons.org/publicdomain/zero/1.0/) | Resized from 3440 x 2480 to 1600 x 1153 and used at low opacity as a fold/pressure map. |
| `torn-edge-paper.png` | Project-generated raster asset, 2026-08-03 | Project asset | Generated as a neutral photographed torn edge on chroma green, then keyed to transparency and cropped. No third-party scan is embedded. |

Attribution is not required for the two CC0 assets, but the sources are recorded here for provenance.

## Evaluated but not shipped

- [Poly Haven](https://polyhaven.com/license): safe candidate pool; its texture assets are CC0, including redistribution. No Poly Haven asset was needed in this pass.
- [Textures.com](https://www.textures.com/about/terms-of-use): its textures may be used in a website, but the raw files cannot be redistributed or released under an open-source license. That makes it a poor fit for checked-in portfolio assets.
- [Wikimedia torn paper photo by Pink Sherbet Photography](https://commons.wikimedia.org/wiki/File:Torn_Ripped_Wrinkled_Damaged_Paper_Free_High_Resolution_Texture_Creative_Commons_(8077074905).jpg): usable with CC BY 2.0 attribution and a modification notice; skipped because a neutral project-owned edge avoided the extra obligation and matched the design better.
- Ryan Miyoshi's website and video reference: used only to study layout and interaction. Its images, paper scans, typography assets, and project work are not copied into this repository.
