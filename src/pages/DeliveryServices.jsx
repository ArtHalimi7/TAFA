import { useEffect } from "react";
import useSEO from "../hooks/useSEO";

export default function DeliveryServices() {
  useSEO({
    title: "Shërbime Dorëzimi | AUTO TAFA",
    description:
      "Dorëzim i sigurt dhe i shpejtë i makinës tuaj drejt derës tuaj.",
  });

  useEffect(() => {
    window.scrollTo(0, 0);
  }, []);

  return (
    <main className="min-h-screen bg-black">
      {/* Hero Section */}
      <section className="relative min-h-[60vh] flex items-center justify-center px-6 sm:px-12 lg:px-24 py-20">
        <div className="absolute inset-0 bg-linear-b from-white/5 to-transparent" />
        <div className="relative max-w-4xl mx-auto text-center">
          <h1
            className="text-5xl sm:text-6xl lg:text-7xl font-bold text-white mb-6"
            style={{ fontFamily: "Cera Pro, sans-serif" }}
          >
            Shërbime Dorëzimi
          </h1>
          <p
            className="text-xl text-white/80 mb-8"
            style={{ fontFamily: "Montserrat, sans-serif" }}
          >
            Makinën tuaj të dorëzuar me siguri dhe kujdes në çdo cep të botës
          </p>
        </div>
      </section>

      {/* Content Section */}
      <section className="max-w-4xl mx-auto px-6 sm:px-12 lg:px-24 py-20">
        <div className="space-y-12">
          {/* Introduction */}
          <div>
            <h2
              className="text-4xl font-bold text-white mb-6"
              style={{ fontFamily: "Cera Pro, sans-serif" }}
            >
              Dorëzim i Sigurt & i Garantuar
            </h2>
            <p
              className="text-white/80 text-lg leading-relaxed"
              style={{ fontFamily: "Montserrat, sans-serif" }}
            >
              Në AUTO TAFA, dimë se makinës tuaj ju duhet kujdes maksimal gjatë
              transportit. Prandaj, ne ofrojmë shërbime të plota dorëzimi me
              sigurim të plotë, përvojë profesionale dhe transparency të plotë.
            </p>
          </div>

          {/* Delivery Options */}
          <div>
            <h2
              className="text-3xl font-bold text-white mb-6"
              style={{ fontFamily: "Cera Pro, sans-serif" }}
            >
              Opsionet e Dorëzimit
            </h2>
            <div className="grid sm:grid-cols-2 gap-6">
              {[
                {
                  title: "Dorëzim Lokal",
                  description: "Brenda qytetit ose zona të afërt",
                  features: [
                    "1-3 ditë",
                    "Dorëzim në ditën e caktuar",
                    "Shoqërues profesional",
                  ],
                },
                {
                  title: "Dorëzim Kombëtar",
                  description: "Në të gjithë vendin",
                  features: [
                    "3-7 ditë",
                    "Transporti siguruar",
                    "Ndjekje në kohë reale",
                  ],
                },
                {
                  title: "Dorëzim Ndërkombëtar",
                  description: "Në të gjithë Europën",
                  features: [
                    "7-21 ditë",
                    "Dokumenta të plotë",
                    "Asistencë në doganë",
                  ],
                },
                {
                  title: "Dorëzim Ekspress",
                  description: "Për urgjencë të veçantë",
                  features: ["24-48 orë", "Shoqërim 24/7", "Garantim maksimal"],
                },
              ].map((option, index) => (
                <div
                  key={index}
                  className="border border-white/10 rounded-lg p-6 hover:border-white/20 transition-colors duration-300"
                >
                  <h3
                    className="text-xl font-bold text-white mb-2"
                    style={{ fontFamily: "Cera Pro, sans-serif" }}
                  >
                    {option.title}
                  </h3>
                  <p className="text-white/60 text-sm mb-4">
                    {option.description}
                  </p>
                  <ul className="space-y-2">
                    {option.features.map((feature, idx) => (
                      <li
                        key={idx}
                        className="flex items-center text-white/70 text-sm"
                        style={{ fontFamily: "Montserrat, sans-serif" }}
                      >
                        <span className="w-1.5 h-1.5 bg-white rounded-full mr-2" />
                        {feature}
                      </li>
                    ))}
                  </ul>
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
              Procesi i Dorëzimit
            </h2>
            <div className="space-y-6">
              {[
                {
                  number: "01",
                  title: "Përgatitje",
                  description:
                    "Makinë kontrollohet plotësisht dhe përgatitet për transport.",
                },
                {
                  number: "02",
                  title: "Dokumentim",
                  description:
                    "Të gjitha dokumentet e makinës dhe transportit përgatiten.",
                },
                {
                  number: "03",
                  title: "Ngarkimi",
                  description:
                    "Makinë ngarkohet me kujdes në transportin e sigurisë maksimale.",
                },
                {
                  number: "04",
                  title: "Ndjekje",
                  description:
                    "Marrni përditësime të rregullta dhe ndjekje në kohë reale.",
                },
                {
                  number: "05",
                  title: "Dorëzim",
                  description:
                    "Makinë dorëzohet në adresën tuaj të kontrolluar plotësisht.",
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

          {/* Benefits */}
          <div>
            <h2
              className="text-3xl font-bold text-white mb-6"
              style={{ fontFamily: "Cera Pro, sans-serif" }}
            >
              Përfitimet e Shërbimit Tonë
            </h2>
            <div className="bg-white/5 border border-white/10 rounded-lg p-8">
              <div className="grid sm:grid-cols-2 gap-6">
                {[
                  "Sigurim i plotë gjatë transportit",
                  "Shoqërues profesional & të trajnuar",
                  "Ndjekje GPS në kohë reale",
                  "Dokumentet plotë të dorëzimit",
                  "Qimet transparente pa të fshehura",
                  "Garantim 100% siguria",
                ].map((benefit, index) => (
                  <div key={index} className="flex items-start">
                    <span className="text-white mr-3 mt-1">✓</span>
                    <span
                      className="text-white/80"
                      style={{ fontFamily: "Montserrat, sans-serif" }}
                    >
                      {benefit}
                    </span>
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* CTA */}
          <div className="bg-linear-r from-white/5 to-white/10 border border-white/10 rounded-lg p-8 text-center mt-12">
            <h3
              className="text-2xl font-bold text-white mb-4"
              style={{ fontFamily: "Cera Pro, sans-serif" }}
            >
              Rregulloni Dorëzimin Tuaj Sot
            </h3>
            <p
              className="text-white/70 mb-6"
              style={{ fontFamily: "Montserrat, sans-serif" }}
            >
              Kontaktohuni me ekipin tonë të dorëzimit për të marrë një kuotim
              të detalluar.
            </p>
            <a
              href="/contact"
              className="inline-block px-8 py-3 bg-white text-black font-bold rounded-lg hover:bg-white/90 transition-colors duration-300"
              style={{ fontFamily: "Montserrat, sans-serif" }}
            >
              Pyesni për Dorëzim
            </a>
          </div>
        </div>
      </section>
    </main>
  );
}
