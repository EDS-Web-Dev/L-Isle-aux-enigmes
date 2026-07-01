#!/usr/bin/env node
// Génère le hash SHA-256 à mettre dans le champ "reponse" d'un JSON de parcours.
// Usage : npm run hash -- "Ma Réponse"

const crypto = require("crypto");

function normalize(s) {
  return s
    .trim()
    .toLowerCase()
    .normalize("NFD")
    .replace(/[̀-ͯ]/g, "");
}

const answer = process.argv[2];
if (!answer) {
  console.error('Usage: npm run hash -- "Ma Réponse"');
  process.exit(1);
}

const hash = crypto.createHash("sha256").update(normalize(answer)).digest("hex");
console.log(hash);
