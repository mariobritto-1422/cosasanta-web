// Contenido JSON-LD de cosasanta Argentina y Latam.
// Se carga solo desde DatosEstructuradosLatam (con next/dynamic), así que
// este archivo no se descarga en /portal ni /europa.

const organizationSchema = {
  "@context": "https://schema.org",
  "@type": "Organization",
  "name": "cosasanta",
  "url": "https://cosasanta.com",
  "description": "Agencia de automatización con IA, desarrollo web y marketing digital para empresas de Argentina y Latam.",
  "address": {
    "@type": "PostalAddress",
    "addressLocality": "Posadas",
    "addressRegion": "Misiones",
    "addressCountry": "AR"
  },
  "contactPoint": {
    "@type": "ContactPoint",
    "contactType": "customer service",
    "availableLanguage": "Spanish",
    "url": "https://wa.me/543764745849"
  },
  "sameAs": [
    "https://www.instagram.com/cosa_santa/",
    "https://www.facebook.com/rollercomercial/",
    "https://www.linkedin.com/in/mariobritto"
  ]
};

const localBusinessSchema = {
  "@context": "https://schema.org",
  "@type": "LocalBusiness",
  "name": "cosasanta",
  "url": "https://cosasanta.com",
  "description": "Páginas web, bots de WhatsApp con IA, sistemas de gestión y marketing digital para clínicas, consultorios, salones de belleza y empresas de Argentina.",
  "address": {
    "@type": "PostalAddress",
    "addressLocality": "Posadas",
    "addressRegion": "Misiones",
    "addressCountry": "AR"
  },
  "areaServed": ["Buenos Aires", "Misiones", "Argentina", "Latam"],
  "priceRange": "$"
};

export default function JsonLdLatam() {
  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(organizationSchema) }}
      />
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(localBusinessSchema) }}
      />
    </>
  );
}
