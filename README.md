# INCARNAT

Landing page de lancement d'un parfum, créée avec Next.js (App Router), React,
Tailwind CSS, Motion, Three.js, LottieFiles et Lucide.

## Développement

```sh
pnpm install
pnpm dev
```

`pnpm build` produit un site statique dans `out/`. `pnpm typecheck` vérifie TypeScript.
Le projet nécessite Node.js 20.9 ou supérieur.

## Direction artistique

INCARNAT est un nom de travail créatif. La date retenue est le **20 décembre 2026**,
soit deux mois après le brief du 20 octobre 2026. Les textes sont éditoriaux :
aucune composition olfactive, provenance ou caractéristique produit n'est inventée.

- `app/page.tsx` : textes, date, préchargement LottieFiles et événement calendrier.
- `app/globals.css` : direction artistique et adaptations aux petits écrans.
- `components/Perfume.tsx` : scène Three.js, éclairage et rotation liée au scroll.
- `public/parfum.glb` : copie du fichier fourni, conservé sans modification.

La scène ajuste les matériaux à l'exécution. La source GLB reste intacte.
Le modèle reste fixe pendant le défilement. Le chargement affiche une progression
réelle et une transition Motion. Une silhouette de secours apparaît si WebGL ou
le chargement du modèle échoue. Le mouvement flottant est désactivé si le système
demande de réduire les animations.

Le bouton « Gardez la date » télécharge un fichier `.ics`. Aucun service d'e-mail
ni formulaire de collecte n'est simulé. LottieFiles utilise son moteur WASM ;
son animation décorative n'empêche pas l'ouverture du site si ce moteur est indisponible.
