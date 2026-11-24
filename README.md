# OpenVintedBuddy

CRM local de gestion de dressing : React + TypeScript, API Go et MariaDB, avec une base d'extension WebExtension Chrome/Firefox.

## État du livrable

Cette première base contient un dashboard React navigable, des écrans Articles/Ventes/Comptabilité/Statistiques/Acheteurs/Objectifs/Paramètres, une création locale d'article côté interface, une API Go de santé et de gestion des articles, le schéma MariaDB et les fichiers de popup/manifeste Chrome et Firefox.

**Important :** les lignes d'exemple de l'interface sont des données de démonstration en mémoire. Les routes Go `GET/POST /api/products` sont reliées à MariaDB, mais le frontend doit encore être raccordé à ces routes pour persister les opérations. La popup affiche l'état du backend. Les manifestes sont des sources de packaging ; les fichiers compilés et icônes doivent être générés avant installation.

Aucune synchronisation Vinted n'est activée. L'utilisateur dispose d'un compte particulier et n'a pas d'accès à Vinted Pro Integrations. Le connecteur Vinted doit rester désactivé jusqu'à obtention d'une autorisation officielle. Ne pas utiliser de scraping, endpoints privés, cookies de session ou automatisation non autorisée.

## Prérequis

- Node.js 20+
- Go 1.23+
- Docker + Docker Compose

## Démarrage MariaDB

```bash
cp .env.example .env
# Modifiez les deux mots de passe dans .env
docker compose up -d
```

## Démarrage API Go

```bash
cd backend
go mod tidy
DATABASE_URL='ovb:VOTRE_MDP@tcp(127.0.0.1:3306)/openvintedbuddy?parseTime=true' go run ./cmd/api
```

API : `http://127.0.0.1:8787/api/health` et `http://127.0.0.1:8787/api/products`.

## Démarrage React

Dans un autre terminal :

```bash
cd frontend
npm install
npm run dev
```

Dashboard : `http://127.0.0.1:5173`.

## Extensions

Copier `manifest.chrome.json` vers `manifest.json` dans un dossier de build Chrome, puis charger ce dossier via `chrome://extensions` > Mode développeur > Charger l'extension non empaquetée. Pour Firefox, utiliser `manifest.firefox.json` renommé en `manifest.json`, puis `about:debugging` > Ce Firefox > Charger un module temporaire.

La popup s'attend à trouver `popup.html`, `popup.css` et `popup.js` dans le même dossier de build. Les chemins du dashboard supposent le serveur Vite local. Pour une distribution propre, intégrer le dashboard compilé dans les assets de l'extension ou le servir depuis une URL locale configurée.

## Sécurité locale

- L'API écoute sur `127.0.0.1`, pas sur toutes les interfaces réseau.
- MariaDB est publiée uniquement sur `127.0.0.1`.
- Les mots de passe d'exemple sont à remplacer avant usage.
- Ajouter une authentification locale et une validation stricte avant toute exposition réseau.
