/* Chemin d'un fichier de public/ (images des inventions…). Les pages
   du jeu sont à la racine du site ; le prototype du monde de MARTINE
   est dans martine/ et pose globalThis.__ASSET_ROOT = "../". */
export const assetUrl = (path) => (globalThis.__ASSET_ROOT || "") + path;
