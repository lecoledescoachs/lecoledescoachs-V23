// Fonction Netlify "submission-created" : Netlify l'execute automatiquement a
// chaque nouvelle soumission de formulaire verifiee (hors spam).
//
// Role : quand un candidat envoie le dossier de pre-inscription CQP IF
// (formulaire "dossier-preinscription-cqp-if"), elle envoie via Brevo :
//   1. un email de confirmation au candidat (4 papiers a reunir, un seul
//      appel a l'action : reserver l'appel avec Garry) ;
//   2. une notification detaillee a contact@lecoledescoachs.fr.
// Les autres formulaires sont ignores (le quiz d'eligibilite reste gere par
// le scenario Make existant).
//
// ======================================================================
// A FAIRE UNE SEULE FOIS (Netlify > Site configuration > Environment variables)
// ======================================================================
//   BREVO_API_KEY      = cle API Brevo (Brevo > SMTP et API > Cles API > Generer)
//   BREVO_SENDER_EMAIL = optionnel, par defaut contact@lecoledescoachs.fr
//                        (meme expediteur que le scenario Make du quiz)
//   PREINS_BCC_EMAIL   = optionnel, adresse qui recoit aussi une copie
//                        cachee de l'email envoye au candidat
// Puis redeployer le site. Sans BREVO_API_KEY la fonction ne fait rien
// (une ligne de log, aucune erreur, le formulaire continue de fonctionner).
//
// Logs : Netlify > Logs > Functions > submission-created.

const FORM_NAME = "dossier-preinscription-cqp-if";
const DEFAULT_SENDER = "contact@lecoledescoachs.fr";
const TEMPLATE = "<!DOCTYPE html><html lang=\"fr\"><head><meta charset=\"utf-8\"><meta name=\"viewport\" content=\"width=device-width,initial-scale=1\"><meta name=\"color-scheme\" content=\"light only\"><title>Ton dossier est bien reçu</title><style>body{margin:0;padding:0;background:#EDEDED}a{text-decoration:none}@media (max-width:620px){.wrap{width:100%!important}.px{padding-left:24px!important;padding-right:24px!important}.h1{font-size:34px!important;line-height:1.12!important}.step td.num{width:44px!important}.btn a{display:block!important}}</style></head><body style=\"margin:0;padding:0;background:#EDEDED;font-family:Helvetica,Arial,sans-serif;color:#0A0A0A\"><div style=\"display:none;max-height:0;overflow:hidden;opacity:0;font-size:1px;line-height:1px;color:#EDEDED\">On étudie ton dossier et on revient vers toi sous 48&nbsp;h ouvrées. Voici les 4 papiers à nous envoyer pour compléter ton dossier.&#847;&zwnj;&nbsp;&#847;&zwnj;&nbsp;&#847;&zwnj;&nbsp;&#847;&zwnj;&nbsp;</div><table role=\"presentation\" width=\"100%\" cellpadding=\"0\" cellspacing=\"0\" style=\"background:#EDEDED\"><tr><td align=\"center\" style=\"padding:28px 12px\"><table role=\"presentation\" class=\"wrap\" width=\"600\" cellpadding=\"0\" cellspacing=\"0\" style=\"width:600px;max-width:600px;background:#FFFFFF;border-radius:20px;overflow:hidden\"><!-- En-tête --><tr><td class=\"px\" style=\"background:#0A0A0A;padding:34px 40px 30px\"><img src=\"https://lecoledescoachs.fr/assets/logo/logo-email.png\" width=\"190\" alt=\"L'École des Coachs\" style=\"display:block;border:0;width:190px;height:auto\"></td></tr><!-- Titre --><tr><td class=\"px\" style=\"background:#0A0A0A;padding:6px 40px 44px\"><p style=\"margin:0 0 14px;font-size:12px;letter-spacing:.22em;text-transform:uppercase;color:#9A9A9A;font-weight:700\">Pré-inscription CQP&nbsp;IF</p><h1 class=\"h1\" style=\"margin:0;font-family:Georgia,'Times New Roman',serif;font-style:italic;font-weight:400;font-size:42px;line-height:1.1;color:#FFFFFF\">Ton dossier est bien reçu, {{PRENOM}}.</h1></td></tr><!-- Intro --><tr><td class=\"px\" style=\"padding:36px 40px 8px\"><p style=\"margin:0 0 16px;font-size:17px;line-height:1.6;color:#0A0A0A\">Bonjour {{PRENOM}},</p><p style=\"margin:0 0 16px;font-size:17px;line-height:1.6;color:#0A0A0A\">Merci d'avoir pris le temps de remplir ta pré-inscription au CQP&nbsp;Instructeur&nbsp;Fitness. <strong>On étudie ton dossier et on revient vers toi sous 48&nbsp;heures ouvrées</strong>, par email ou par téléphone.</p>{{TEPLINE}}<p style=\"margin:0;font-size:17px;line-height:1.6;color:#0A0A0A\">Pour avancer plus vite, tu peux déjà réserver un appel avec Garry, puis réunir les 4 papiers ci-dessous.</p></td></tr><!-- CTA unique --><tr><td class=\"px\" style=\"padding:24px 40px 4px\"><table role=\"presentation\" width=\"100%\" cellpadding=\"0\" cellspacing=\"0\" style=\"background:#F4F4F4;border-radius:16px\"><tr><td style=\"padding:28px 26px 26px\"><p style=\"margin:0 0 6px;font-size:12px;letter-spacing:.2em;text-transform:uppercase;color:#6B6B6B;font-weight:700\">Gagne du temps</p><p style=\"margin:0 0 8px;font-size:21px;line-height:1.3;font-weight:700;color:#0A0A0A\">Réserve ton appel avec Garry.</p><p style=\"margin:0 0 20px;font-size:15px;line-height:1.55;color:#4A4A4A\">On fait le point sur ton projet, tes papiers et ton financement, et on répond à toutes tes questions.</p><table role=\"presentation\" class=\"btn\" cellpadding=\"0\" cellspacing=\"0\"><tr><td style=\"background:#0A0A0A;border-radius:999px\"><a href=\"https://calendly.com/ga-coachs/entretien-d-orientation-cqp-if\" style=\"display:inline-block;padding:15px 28px;font-size:15px;font-weight:700;color:#FFFFFF;font-family:Helvetica,Arial,sans-serif\">Choisir mon créneau&nbsp;&rarr;</a></td></tr></table></td></tr></table></td></tr><!-- Papiers --><tr><td class=\"px\" style=\"padding:30px 40px 6px\"><p style=\"margin:0 0 6px;font-size:12px;letter-spacing:.2em;text-transform:uppercase;color:#6B6B6B;font-weight:700\">Pour compléter ton dossier</p><p style=\"margin:0 0 22px;font-size:21px;line-height:1.3;font-weight:700;color:#0A0A0A\">Les 4 papiers à réunir.</p><table role=\"presentation\" class=\"step\" width=\"100%\" cellpadding=\"0\" cellspacing=\"0\"><tr><td class=\"num\" width=\"56\" valign=\"top\" style=\"padding:0 0 20px\"><table role=\"presentation\" cellpadding=\"0\" cellspacing=\"0\"><tr><td align=\"center\" valign=\"middle\" width=\"38\" height=\"38\" style=\"width:38px;height:38px;border-radius:19px;background:#0A0A0A;color:#FFFFFF;font-size:15px;font-weight:700\">1</td></tr></table></td><td valign=\"top\" style=\"padding:0 0 20px\"><p style=\"margin:0 0 4px;font-size:17px;font-weight:700;color:#0A0A0A\">Une pièce d'identité en cours de validité</p><p style=\"margin:0;font-size:15px;line-height:1.55;color:#4A4A4A\">Carte d'identité ou passeport.</p></td></tr><tr><td class=\"num\" width=\"56\" valign=\"top\" style=\"padding:0 0 20px\"><table role=\"presentation\" cellpadding=\"0\" cellspacing=\"0\"><tr><td align=\"center\" valign=\"middle\" width=\"38\" height=\"38\" style=\"width:38px;height:38px;border-radius:19px;background:#0A0A0A;color:#FFFFFF;font-size:15px;font-weight:700\">2</td></tr></table></td><td valign=\"top\" style=\"padding:0 0 20px\"><p style=\"margin:0 0 4px;font-size:17px;font-weight:700;color:#0A0A0A\">Ton PSC1</p><p style=\"margin:0;font-size:15px;line-height:1.55;color:#4A4A4A\">Premiers Secours Civiques niveau&nbsp;1, ou une équivalence reconnue. Il reste valable à vie.</p></td></tr><tr><td class=\"num\" width=\"56\" valign=\"top\" style=\"padding:0 0 20px\"><table role=\"presentation\" cellpadding=\"0\" cellspacing=\"0\"><tr><td align=\"center\" valign=\"middle\" width=\"38\" height=\"38\" style=\"width:38px;height:38px;border-radius:19px;background:#0A0A0A;color:#FFFFFF;font-size:15px;font-weight:700\">3</td></tr></table></td><td valign=\"top\" style=\"padding:0 0 20px\"><p style=\"margin:0 0 4px;font-size:17px;font-weight:700;color:#0A0A0A\">Un certificat médical</p><p style=\"margin:0;font-size:15px;line-height:1.55;color:#4A4A4A\">Daté de moins d'un&nbsp;an à l'entrée en formation, avec la mention «&nbsp;non contre-indication à la pratique et à l'encadrement des activités physiques et sportives&nbsp;».</p></td></tr><tr><td class=\"num\" width=\"56\" valign=\"top\" style=\"padding:0 0 6px\"><table role=\"presentation\" cellpadding=\"0\" cellspacing=\"0\"><tr><td align=\"center\" valign=\"middle\" width=\"38\" height=\"38\" style=\"width:38px;height:38px;border-radius:19px;background:#0A0A0A;color:#FFFFFF;font-size:15px;font-weight:700\">4</td></tr></table></td><td valign=\"top\" style=\"padding:0 0 6px\"><p style=\"margin:0 0 4px;font-size:17px;font-weight:700;color:#0A0A0A\">Une photo d'identité</p><p style=\"margin:0;font-size:15px;line-height:1.55;color:#4A4A4A\">Le dernier document pour valider ton dossier à 100&nbsp;%.</p></td></tr></table><p style=\"margin:22px 0 0;font-size:15px;line-height:1.6;color:#4A4A4A\">Une fois que tu as tout, envoie les 4 documents <strong style=\"color:#0A0A0A\">dans un seul email</strong> à <a href=\"mailto:contact@lecoledescoachs.fr\" style=\"color:#0A0A0A;font-weight:700;border-bottom:1px solid #0A0A0A\">contact@lecoledescoachs.fr</a>. Il t'en manque un&nbsp;? Aucun souci, on&nbsp;voit&nbsp;ça&nbsp;ensemble.</p></td></tr><!-- Signature --><tr><td class=\"px\" style=\"padding:34px 40px 40px\"><p style=\"margin:0 0 4px;font-size:16px;line-height:1.6;color:#0A0A0A\">À très vite,</p><p style=\"margin:0;font-family:Georgia,'Times New Roman',serif;font-style:italic;font-size:22px;line-height:1.3;color:#0A0A0A\">Garry Babaud</p><p style=\"margin:2px 0 0;font-size:14px;color:#6B6B6B\">Directeur, L'École des Coachs</p></td></tr><!-- Pied --><tr><td class=\"px\" style=\"background:#0A0A0A;padding:28px 40px 30px\"><p style=\"margin:0 0 8px;font-size:13px;line-height:1.6;color:#BDBDBD\">L'École des Coachs<br>537 Rue de la Juine, Olivet</p><p style=\"margin:0 0 14px;font-size:13px;line-height:1.6;color:#BDBDBD\"><a href=\"mailto:contact@lecoledescoachs.fr\" style=\"color:#FFFFFF\">contact@lecoledescoachs.fr</a> &nbsp;·&nbsp; <a href=\"tel:+33781282604\" style=\"color:#FFFFFF\">07 81 28 26 04</a> &nbsp;·&nbsp; <a href=\"https://lecoledescoachs.fr\" style=\"color:#FFFFFF\">lecoledescoachs.fr</a></p><p style=\"margin:0;font-size:11.5px;line-height:1.6;color:#8C8C8C\">Tu reçois cet email parce que tu as rempli notre dossier de pré-inscription au CQP&nbsp;IF. Tes données servent uniquement à étudier ta candidature.</p></td></tr></table></td></tr></table></body></html>";

function esc(v) {
  return String(v == null ? "" : v)
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;");
}

function cleanPrenom(v) {
  // Securite : un prenom ne contient que des lettres, espaces, tirets et apostrophes.
  // Tout le reste (liens, chiffres, symboles) est retire, pour qu'on ne puisse pas
  // utiliser le formulaire pour envoyer un message piege depuis notre adresse.
  const s = String(v == null ? "" : v).normalize("NFC").replace(/[^\p{L}\s'’-]/gu, "").trim().replace(/\s+/g, " ").slice(0, 40);
  if (!s) return "";
  return s.charAt(0).toUpperCase() + s.slice(1);
}

const TEP_LINE = "<p style=\"margin:0 0 16px;font-size:17px;line-height:1.6;color:#0A0A0A\">Tu as choisi de passer les TEP en décembre : la prochaine session a lieu le <strong>samedi 19 décembre 2026</strong>, chez Top Fitness, à Saint-Jean-de-Braye.</p>";

function tepLine(dateTests) {
  // Affichee seulement si le candidat a choisi decembre et si la session n'est pas passee.
  const ok = String(dateTests || "").trim() === "Décembre" && Date.now() < Date.UTC(2026, 11, 19, 8, 0, 0);
  return ok ? TEP_LINE : "";
}

function buildCandidateEmail(prenomRaw, dateTests) {
  const prenom = cleanPrenom(prenomRaw);
  let html = TEMPLATE.split("{{TEPLINE}}").join(tepLine(dateTests));
  let subject;
  if (prenom) {
    html = html.split("{{PRENOM}}").join(esc(prenom));
    subject = prenom + ", ton dossier est bien reçu";
  } else {
    html = html.split(", {{PRENOM}}.").join(".").split("Bonjour {{PRENOM}},").join("Bonjour,");
    subject = "Ton dossier est bien reçu";
  }
  return { html, subject };
}

const SECTIONS = [
  ["Identité", [["Nom", "nom"], ["Prénom", "prenom"], ["Email", "email"], ["Téléphone", "telephone"], ["Date de naissance", "date_naissance"], ["Ville de naissance", "ville_naissance"], ["Adresse", "adresse"], ["Ville", "ville"]]],
  ["Session et parcours", [["Session souhaitée", "session_formation"], ["Date des tests souhaitée", "date_tests"], ["Parcours choisi", "parcours_formation"]]],
  ["Situation", [["Situation actuelle", "situation_actuelle"], ["Pratique de la musculation", "pratique_musculation"], ["Fréquence", "frequence_pratique"], ["Objectif pro", "objectif_pro"]]],
  ["Prérequis", [["PSC1", "psc1"], ["Certificat médical", "certificat_medical"], ["Autre diplôme", "autre_diplome"], ["Lequel", "autre_diplome_lequel"]]],
  ["Financement", [["Financement", "financement"]]],
  ["Handicap", [["Handicap", "handicap"]]],
  ["Motivation", [["Motivation", "motivation"]]],
  ["Rythme", [["Disponible", "rythme_disponible"], ["Contrainte", "rythme_contrainte"]]],
  ["Communication", [["Groupe WhatsApp", "whatsapp_groupe"], ["Découverte", "decouverte"], ["Page précédente", "page_precedente"], ["utm_source", "utm_source"], ["utm_medium", "utm_medium"], ["utm_campaign", "utm_campaign"]]],
];

function buildInternalEmail(d) {
  let html = "<h2>Nouveau dossier de pré-inscription CQP IF</h2>";
  for (const [title, fields] of SECTIONS) {
    const lines = fields
      .filter(([, key]) => d[key] != null && String(d[key]).trim() !== "")
      .map(([label, key]) => esc(label) + " : " + esc(d[key]).replace(/\n/g, "<br>"));
    if (lines.length) html += "<p><strong>" + esc(title) + "</strong><br>" + lines.join("<br>") + "</p>";
  }
  const who = [cleanPrenom(d.prenom), String(d.nom || "").trim()].filter(Boolean).join(" ");
  return { html, subject: "Nouveau dossier de pré-inscription CQP IF : " + (who || "candidat") };
}

async function sendBrevo(apiKey, payload) {
  const controller = new AbortController();
  const timer = setTimeout(() => controller.abort(), 8000);
  try {
    const resp = await fetch("https://api.brevo.com/v3/smtp/email", {
      method: "POST",
      headers: { "api-key": apiKey, "content-type": "application/json", accept: "application/json" },
      body: JSON.stringify(payload),
      signal: controller.signal,
    });
    if (!resp.ok) {
      const text = await resp.text().catch(() => "");
      console.error("Brevo refus", resp.status, text.slice(0, 300));
      return false;
    }
    return true;
  } catch (e) {
    console.error("Brevo erreur reseau", e && e.message);
    return false;
  } finally {
    clearTimeout(timer);
  }
}

exports.handler = async (event) => {
  try {
    const body = JSON.parse(event.body || "{}");
    const p = body.payload || {};
    if ((p.form_name || "") !== FORM_NAME) return { statusCode: 200, body: "ignore" };

    const apiKey = process.env.BREVO_API_KEY;
    if (!apiKey) {
      console.log("BREVO_API_KEY absente : aucun email envoye pour le dossier.");
      return { statusCode: 200, body: "no key" };
    }
    const d = p.data || {};
    const senderEmail = process.env.BREVO_SENDER_EMAIL || DEFAULT_SENDER;
    const sender = { name: "L'École des Coachs", email: senderEmail };
    const candidateEmail = String(d.email || p.email || "").trim();
    const emailOk = /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(candidateEmail);

    // 1. notification interne (toujours)
    const internal = buildInternalEmail(d);
    const internalPayload = {
      sender: { name: "Site L'École des Coachs", email: senderEmail },
      to: [{ name: "L'École des Coachs", email: DEFAULT_SENDER }],
      subject: internal.subject,
      htmlContent: internal.html,
    };
    if (emailOk) internalPayload.replyTo = { email: candidateEmail, name: [d.prenom, d.nom].filter(Boolean).join(" ") || candidateEmail };
    const okInternal = await sendBrevo(apiKey, internalPayload);

    // 2. confirmation au candidat
    // Securite : si le prenom contient un lien, une adresse ou des chiffres, c'est
    // tres probablement un robot : on ne renvoie pas d'email a l'adresse saisie
    // (la notification interne part quand meme, pour verification).
    const rawPrenom = String(d.prenom || "");
    const suspicious = /https?:|www\.|@|\.[a-z]{2,}\/|\d{3,}/i.test(rawPrenom) || rawPrenom.length > 60;
    if (suspicious) console.log("Prenom suspect : pas de confirmation envoyee au candidat.");
    let okCandidate = false;
    if (emailOk && !suspicious) {
      const mail = buildCandidateEmail(d.prenom, d.date_tests);
      const payload = {
        sender,
        replyTo: { name: "L'École des Coachs", email: DEFAULT_SENDER },
        to: [{ email: candidateEmail, name: cleanPrenom(d.prenom) || candidateEmail }],
        subject: mail.subject,
        htmlContent: mail.html,
      };
      if (process.env.PREINS_BCC_EMAIL) payload.bcc = [{ email: process.env.PREINS_BCC_EMAIL }];
      okCandidate = await sendBrevo(apiKey, payload);
    } else {
      console.error("Email candidat invalide, confirmation non envoyee :", candidateEmail);
    }
    console.log("Pre-inscription traitee. interne=" + okInternal + " candidat=" + okCandidate);
    return { statusCode: 200, body: "ok" };
  } catch (e) {
    console.error("submission-created erreur", e && e.message);
    return { statusCode: 200, body: "erreur geree" };
  }
};

// Exporte pour les tests locaux uniquement.
exports._buildCandidateEmail = buildCandidateEmail;
exports._buildInternalEmail = buildInternalEmail;
