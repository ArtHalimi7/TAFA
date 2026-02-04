import { useEffect } from "react";
import useSEO from "../hooks/useSEO";

export default function FinancingOptions() {
  useSEO({
    title: "Opcione Financimi | AUTO TAFA",
    description:
      "Zbulon opsionet fleksibël të financimit për makinën tuaj të re.",
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
            Opcione Financimi
          </h1>
          <p
            className="text-xl text-white/80 mb-8"
            style={{ fontFamily: "Montserrat, sans-serif" }}
          >
            Zgjedhje fleksibël dhe të përballueshme për të blerë makinën tuaj të
            dëshiruar
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
              Financim i Adaptuar për Juaj
            </h2>
            <p
              className="text-white/80 text-lg leading-relaxed"
              style={{ fontFamily: "Montserrat, sans-serif" }}
            >
              Në AUTO TAFA, ne kuptojmë që blerja e një makine luksoz është një
              investim i madh. Prandaj, ne ofrojmë një gamë të gjerë të
              opsioneve financimi të dizajnuara për të përmbushur nevojat tuaja
              specifike dhe aftësinë paguese.
            </p>
          </div>

          {/* Financing Options */}
          <div>
            <h2
              className="text-3xl font-bold text-white mb-6"
              style={{ fontFamily: "Cera Pro, sans-serif" }}
            >
              Opsionet Tona të Financimit
            </h2>
            <div className="space-y-6">
              {[
                {
                  title: "Financim Direkt",
                  features: [
                    "Korniza kohore fleksibël (12-72 muaj)",
                    "Norma interesi konkurruese",
                    "Aprovim i shpejtë",
                    "Pagese minimale në zbritje",
                  ],
                },
                {
                  title: "Qiraja Operacionale",
                  features: [
                    "Pagesa mujore të ulëta",
                    "Mirëmbajtja përfshihet",
                    "Asnje shqetësim me riparimin",
                    "Ndërroni makinën pas periudhës",
                  ],
                },
                {
                  title: "Trade-In Program",
                  features: [
                    "Përdorni makinën tuaj ekzistuese si zbritje",
                    "Vlerësim i drejtë dhe transparent",
                    "Redukto shumën e borxhit",
                    "Komplikimet minimale",
                  ],
                },
                {
                  title: "Pagesa me Rambursim",
                  features: [
                    "Pagesa nuk është e nevojshme gjatë periudhës së promociones",
                    "Kënaqësi më vonë me norma të barabarta",
                    "Ideal për rishikuesit",
                    "Fleksibiliteti maksimal",
                  ],
                },
              ].map((option, index) => (
                <div
                  key={index}
                  className="border border-white/10 rounded-lg p-6 hover:border-white/20 transition-colors duration-300"
                >
                  <h3
                    className="text-2xl font-bold text-white mb-4"
                    style={{ fontFamily: "Cera Pro, sans-serif" }}
                  >
                    {option.title}
                  </h3>
                  <ul className="space-y-3">
                    {option.features.map((feature, idx) => (
                      <li
                        key={idx}
                        className="flex items-center text-white/80"
                        style={{ fontFamily: "Montserrat, sans-serif" }}
                      >
                        <span className="w-2 h-2 bg-white rounded-full mr-3" />
                        {feature}
                      </li>
                    ))}
                  </ul>
                </div>
              ))}
            </div>
          </div>

          {/* How It Works */}
          <div>
            <h2
              className="text-3xl font-bold text-white mb-6"
              style={{ fontFamily: "Cera Pro, sans-serif" }}
            >
              Si Funksionon?
            </h2>
            <div className="grid sm:grid-cols-3 gap-6">
              {[
                {
                  step: "1",
                  title: "Zgjidh Opsionin",
                  description:
                    "Zgjedhni planin e financimit që përputhet më mirë me buxhetin tuaj.",
                },
                {
                  step: "2",
                  title: "Apliko",
                  description:
                    "Kompletoni aplikimin tonë të thjeshtë online ose personalisht.",
                },
                {
                  step: "3",
                  title: "Aprovim & Dorëzim",
                  description:
                    "Përfitoni aprovimin e shpejtë dhe filloni të drejtoni makinën tuaj të re.",
                },
              ].map((item, index) => (
                <div
                  key={index}
                  className="text-center p-6 border border-white/10 rounded-lg"
                >
                  <div className="text-4xl font-bold text-white/20 mb-3">
                    {item.step}
                  </div>
                  <h3
                    className="text-lg font-bold text-white mb-2"
                    style={{ fontFamily: "Cera Pro, sans-serif" }}
                  >
                    {item.title}
                  </h3>
                  <p
                    className="text-white/70 text-sm"
                    style={{ fontFamily: "Montserrat, sans-serif" }}
                  >
                    {item.description}
                  </p>
                </div>
              ))}
            </div>
          </div>

          {/* Requirements */}
          <div>
            <h2
              className="text-3xl font-bold text-white mb-6"
              style={{ fontFamily: "Cera Pro, sans-serif" }}
            >
              Kërkesa për Financim
            </h2>
            <div className="bg-white/5 border border-white/10 rounded-lg p-8">
              <ul
                className="space-y-4 text-white/80"
                style={{ fontFamily: "Montserrat, sans-serif" }}
              >
                <li className="flex items-start">
                  <span className="text-white mr-3 mt-1">✓</span>
                  <span>Të jeni të paktën 18 vjeç</span>
                </li>
                <li className="flex items-start">
                  <span className="text-white mr-3 mt-1">✓</span>
                  <span>Dokumento identiteti valide</span>
                </li>
                <li className="flex items-start">
                  <span className="text-white mr-3 mt-1">✓</span>
                  <span>Dëshmi e të ardhurave</span>
                </li>
                <li className="flex items-start">
                  <span className="text-white mr-3 mt-1">✓</span>
                  <span>Histori e mirë krediti (varia sipas planit)</span>
                </li>
                <li className="flex items-start">
                  <span className="text-white mr-3 mt-1">✓</span>
                  <span>Adresa e regjistruar</span>
                </li>
              </ul>
            </div>
          </div>

          {/* CTA */}
          <div className="bg-linear-r from-white/5 to-white/10 border border-white/10 rounded-lg p-8 text-center mt-12">
            <h3
              className="text-2xl font-bold text-white mb-4"
              style={{ fontFamily: "Cera Pro, sans-serif" }}
            >
              Të Gatshëm të Filloni?
            </h3>
            <p
              className="text-white/70 mb-6"
              style={{ fontFamily: "Montserrat, sans-serif" }}
            >
              Lidhuni me një nga përfaqësuesit tonë të financimit për të
              diskutuar opsionet e duhura për ju.
            </p>
            <a
              href="/contact"
              className="inline-block px-8 py-3 bg-white text-black font-bold rounded-lg hover:bg-white/90 transition-colors duration-300"
              style={{ fontFamily: "Montserrat, sans-serif" }}
            >
              Aplikim Financimi
            </a>
          </div>
        </div>
      </section>
    </main>
  );
}
