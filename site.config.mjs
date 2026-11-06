// Preencha com a origem HTTPS pública, sem caminho, quando o domínio for definido.
export const siteOrigin = "";

export const legalService = {
  "@context": "https://schema.org",
  "@type": "LegalService",
  name: "Advocacia Rodrigues e Alves",
  telephone: "+55 18 99111-5560",
  address: {
    "@type": "PostalAddress",
    streetAddress: "Rua Humberto de Alençar Castelo Branco, 664, Morumbi",
    addressLocality: "Valparaíso",
    addressRegion: "SP",
    postalCode: "16880-000",
    addressCountry: "BR"
  },
  openingHours: "Mo-Fr 08:00-17:00",
  hasMap: "https://www.google.com/maps/place/?q=place_id:ChIJq0eMaRPllpQRk7ltd-jDEgw",
  sameAs: ["https://www.instagram.com/advocaciarodriguesealves/"]
};
