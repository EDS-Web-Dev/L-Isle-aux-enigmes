import Link from "next/link";
import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Mentions légales — L'Isle aux Énigmes",
};

export default function MentionsLegales() {
  return (
    <main className="min-h-dvh px-6 py-10 max-w-2xl mx-auto text-gray-700">
      <Link href="/" className="text-sm font-semibold text-emerald-700 underline">
        ← Retour à l&apos;accueil
      </Link>

      <h1 className="text-2xl font-extrabold text-gray-900 mt-6 mb-8">Mentions légales</h1>

      <section className="mb-8">
        <h2 className="text-base font-bold text-gray-900 mb-2">Éditeur du site</h2>
        <p className="text-sm leading-relaxed">
          EDS Web Dev
          <br />
          Contact : <a href="mailto:contact@eds-web.dev" className="underline">contact@eds-web.dev</a>
        </p>
      </section>

      <section className="mb-8">
        <h2 className="text-base font-bold text-gray-900 mb-2">Hébergement</h2>
        <p className="text-sm leading-relaxed">
          Vercel Inc.
          <br />
          340 S Lemon Ave #4133, Walnut, CA 91789, États-Unis
        </p>
      </section>

      <section className="mb-8">
        <h2 className="text-base font-bold text-gray-900 mb-2">Données personnelles</h2>
        <p className="text-sm leading-relaxed">
          L&apos;Isle aux Énigmes utilise la géolocalisation de ton appareil pour te
          guider dans les parcours. Cette position n&apos;est jamais envoyée à un
          serveur : elle reste uniquement sur ton téléphone, le temps de la partie.
          <br />
          <br />
          Ta progression dans un parcours est sauvegardée localement dans ton
          navigateur (stockage local), pour que tu puisses reprendre où tu t&apos;es
          arrêté. Ces données ne quittent jamais ton appareil et sont supprimées si
          tu vides les données de ton navigateur.
        </p>
      </section>

      <section className="mb-8">
        <h2 className="text-base font-bold text-gray-900 mb-2">Propriété intellectuelle</h2>
        <p className="text-sm leading-relaxed">
          L&apos;ensemble des textes, énigmes, visuels et illustrations de ce site
          est la propriété d&apos;EDS Web Dev, sauf mention contraire. Toute
          reproduction sans autorisation est interdite.
        </p>
      </section>

      <section>
        <h2 className="text-base font-bold text-gray-900 mb-2">Contact</h2>
        <p className="text-sm leading-relaxed">
          Pour toute question concernant le site, écris à{" "}
          <a href="mailto:contact@eds-web.dev" className="underline">contact@eds-web.dev</a>.
        </p>
      </section>
    </main>
  );
}
