import { useEffect } from "react";
import useSEO from "../hooks/useSEO";

export default function CustomSourcing() {
  useSEO({
    title: "Furnizim Custom | AUTO TAFA",
    description:
      "Shërbimi ynë i furnizimit custom vë në dispozicion makinat më të kërkuara në treg.",
  });

  useEffect(() => {
    window.scrollTo(0, 0);
  }, []);

  return (
    <main className="min-h-screen bg-black">
      {/* Hero Section */}
      <section className="relative min-h-[60vh] flex items-center justify-center px-6 sm:px-12 lg:px-24 py-20">
        <div className="absolute inset-0 bg-gradient-to-b from-white/5 to-transparent" />
        <div className="relative max-w-4xl mx-auto text-center">
          <h1
            className="text-5xl sm:text-6xl lg:text-7xl font-bold text-white mb-6"
            style={{ fontFamily: "Cera Pro, sans-serif" }}
          >
            Furnizim Custom
          </h1>
          <p
            className="text-xl text-white/80 mb-8"
            style={{ fontFamily: "Montserrat, sans-serif" }}
          >
            Gjej makinën e ëndrrave tuaj me ndihmën e ekipit tonë të ekspertëve
          </p>
        </div>
      </section>

      {/* Content Section */}
      <section className="max-w-4xl mx-auto px-6 sm:px-12 lg:px-24 py-20">
        <div className="space-y-12">
          {/* What is Custom Sourcing */}
          <div>
            <h2
              className="text-4xl font-bold text-white mb-6"
              style={{ fontFamily: "Cera Pro, sans-serif" }}
            >
              Çfarë është Furnizimi Custom?
            </h2>
            <p
              className="text-white/80 text-lg leading-relaxed mb-4"
              style={{ fontFamily: "Montserrat, sans-serif" }}
            >
              Furnizimi custom është një shërbim eksklusiv i AUTO TAFA ku ne
              punojmë drejtpërdrejtë me ju për të gjetur dhe siguruar makinën e
              përsosur sipas kërkesave dhe buxhetit tuaj. Pavarësisht nëse jeni
              duke kërkuar një model të veçantë, vit specifik, ose
              karakteristika të caktuara, ekipi ynë i dedikuar do të sigurojë që
              të gjeni atë.
            </p>
          </div>

          {/* Benefits */}
          <div>
            <h2
              className="text-3xl font-bold text-white mb-6"
              style={{ fontFamily: "Cera Pro, sans-serif" }}
            >
              Përfitimet e Furnizimit Custom
            </h2>
            <div className="grid sm:grid-cols-2 gap-8">
              {[
                {
                  title: "Kërkesë Personalizuar",
                  description:
                    "Ne dëgjojmë kërkesat tuaja dhe kërkojmë përmendimisht në rrjetin tonë global.",
                },
                {
                  title: "Kontroll Cilësie",
                  description:
                    "Çdo makinë kontrollohet plotësisht përpara dorëzimit për të garantuar cilësinë e lartë.",
                },
                {
                  title: "Çmimet Konkurruese",
                  description:
                    "Jemi në gjendje të ofrojmë çmimet më të mira me marrëdhëniet tona të gjera.",
                },
                {
                  title: "Mbështetje e Plotë",
                  description:
                    "Ekipi ynë ju përshërbon në secilin hap të procesit të blerjes.",
                },
              ].map((benefit, index) => (
                <div
                  key={index}
                  className="border border-white/10 rounded-lg p-6 hover:border-white/20 transition-colors duration-300"
                >
                  <h3
                    className="text-xl font-bold text-white mb-3"
                    style={{ fontFamily: "Cera Pro, sans-serif" }}
                  >
                    {benefit.title}
                  </h3>
                  <p
                    className="text-white/70"
                    style={{ fontFamily: "Montserrat, sans-serif" }}
                  >
                    {benefit.description}
                  </p>
                </div>
              ))}
            </div>
          </div>

          {/* Process */}
          <div>
            <h2
              className="text-3xl font-bold text-white mb-6"
              style={{ fontFamily: "Cera Pro, sans-serif" }}
            >
              Si Funksionon Procesi?
            </h2>
            <div className="space-y-6">
              {[
                {
                  number: "01",
                  title: "Konsultim Fillestar",
                  description:
                    "Kontaktohuni me ne dhe diskutoni kërkesat tuaja specifike për makinën.",
                },
                {
                  number: "02",
                  title: "Kërkesa & Cilësimi",
                  description:
                    "Ne kërkojmë në rrjetin tonë global dhe jua paraqesim opsionet më të mira.",
                },
                {
                  number: "03",
                  title: "Kontroll & Verifikim",
                  description:
                    "Makinat kalojnë inspeksion të plotë mekanik dhe pamor.",
                },
                {
                  number: "04",
                  title: "Dokumente & Dorëzim",
                  description:
                    "Ne përgatisim të gjitha dokumentet dhe rregullojmë dorëzimin sipas dëshirës tuaj.",
                },
              ].map((step, index) => (
                <div key={index} className="flex gap-6">
                  <div className="text-3xl font-bold text-white/20 min-w-12">
                    {step.number}
                  </div>
                  <div>
                    <h3
                      className="text-xl font-bold text-white mb-2"
                      style={{ fontFamily: "Cera Pro, sans-serif" }}
                    >
                      {step.title}
                    </h3>
                    <p
                      className="text-white/70"
                      style={{ fontFamily: "Montserrat, sans-serif" }}
                    >
                      {step.description}
                    </p>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* CTA */}
          <div className="bg-gradient-to-r from-white/5 to-white/10 border border-white/10 rounded-lg p-8 text-center mt-12">
            <h3
              className="text-2xl font-bold text-white mb-4"
              style={{ fontFamily: "Cera Pro, sans-serif" }}
            >
              Gati të Filloni?
            </h3>
            <p
              className="text-white/70 mb-6"
              style={{ fontFamily: "Montserrat, sans-serif" }}
            >
              Kontaktohuni me ekipin tonë sot për të diskutuar nevojat tuaja të
              furnizimit custom.
            </p>
            <a
              href="/contact"
              className="inline-block px-8 py-3 bg-white text-black font-bold rounded-lg hover:bg-white/90 transition-colors duration-300"
              style={{ fontFamily: "Montserrat, sans-serif" }}
            >
              Kontakto Më
            </a>
          </div>
        </div>
      </section>
    </main>
  );
}
