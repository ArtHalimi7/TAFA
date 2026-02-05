import { useEffect, useState } from "react";
import useSEO from "../hooks/useSEO";

export default function FinancingOptions() {
  const [downPaymentPercent, setDownPaymentPercent] = useState(20);
  const [financingMonths, setFinancingMonths] = useState(60);
  const [examplePrice, setExamplePrice] = useState(50000); // Example car price

  useSEO({
    title: "Opcione Financimi | AUTO TAFA",
    description:
      "Zbulon opsionet fleksibël të financimit për makinën tuaj të re.",
  });

  useEffect(() => {
    window.scrollTo(0, 0);
  }, []);

  const formatPrice = (price) => {
    if (!price || price === 0) return "€0";
    return `€${Math.round(price).toLocaleString("en-US", {
      minimumFractionDigits: 0,
      maximumFractionDigits: 0,
    })}`;
  };

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
              Financim i Adaptuar për Ju
            </h2>
            <p
              className="text-white/80 text-lg leading-relaxed"
              style={{ fontFamily: "Montserrat, sans-serif" }}
            >
              Në AUTO TAFA, ne kuptojmë që blerja e një makine luksoze është një
              investim i madh. Prandaj, ne ofrojmë një gamë të gjerë të
              opsioneve financimi të dizajnuara për të përmbushur nevojat e juaja
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
                    "Korniza kohore fleksibël (24-60 muaj)",
                    "Pa norma interesi",
                    "Aprovim i shpejtë",
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

          {/* 0% Interest Financing Calculator */}
          <div className="bg-linear-r from-white/5 to-white/8 border border-white/15 rounded-lg p-8 lg:p-10">
            <h2
              className="text-3xl font-bold text-white mb-2"
              style={{ fontFamily: "Cera Pro, sans-serif" }}
            >
              Financim pa Interes (0%)
            </h2>
            <p
              className="text-white/60 mb-8"
              style={{ fontFamily: "Montserrat, sans-serif" }}
            >
              Llogaritni pagesat e juaja mujore me 0% norma interes
            </p>

            <div className="grid lg:grid-cols-2 gap-8">
              {/* Left - Calculator Form */}
              <div className="space-y-6">
                {/* Example Price Input */}
                <div>
                  <label
                    className="text-xs text-white/70 uppercase tracking-wider block mb-3"
                    style={{ fontFamily: "Montserrat, sans-serif" }}
                  >
                    Çmimi i Automjetit (€)
                  </label>
                  <input
                    type="number"
                    value={examplePrice}
                    onChange={(e) => setExamplePrice(Number(e.target.value))}
                    className="w-full bg-white/10 border border-white/20 rounded-lg px-4 py-2 text-white placeholder-white/40 focus:outline-none focus:border-white/40"
                    style={{ fontFamily: "Montserrat, sans-serif" }}
                    placeholder="50000"
                  />
                </div>

                {/* Down Payment */}
                <div>
                  <div className="flex justify-between items-center mb-2">
                    <label
                      className="text-xs text-white/70 uppercase tracking-wider"
                      style={{ fontFamily: "Montserrat, sans-serif" }}
                    >
                      Pagesa Paraprakisht ({downPaymentPercent}%)
                    </label>
                    <span
                      className="text-sm font-semibold text-white"
                      style={{ fontFamily: "Cera Pro, sans-serif" }}
                    >
                      {formatPrice((examplePrice * downPaymentPercent) / 100)}
                    </span>
                  </div>
                  <input
                    type="range"
                    min="5"
                    max="50"
                    value={downPaymentPercent}
                    onChange={(e) =>
                      setDownPaymentPercent(parseInt(e.target.value))
                    }
                    className="w-full h-1.5 bg-white/20 rounded-lg appearance-none cursor-pointer accent-white"
                  />
                  <div className="flex justify-between text-xs text-white/40 mt-1.5">
                    <span>5%</span>
                    <span>50%</span>
                  </div>
                </div>

                {/* Financing Duration */}
                <div>
                  <div className="flex justify-between items-center mb-2">
                    <label
                      className="text-xs text-white/70 uppercase tracking-wider"
                      style={{ fontFamily: "Montserrat, sans-serif" }}
                    >
                      Periudha Financimi
                    </label>
                    <span
                      className="text-sm font-semibold text-white"
                      style={{ fontFamily: "Cera Pro, sans-serif" }}
                    >
                      {financingMonths} muaj
                    </span>
                  </div>
                  <div className="grid grid-cols-4 gap-1.5">
                    {[24, 36, 48, 60].map((months) => (
                      <button
                        key={months}
                        onClick={() => setFinancingMonths(months)}
                        className={`py-1.5 rounded text-xs font-medium transition-all duration-300 ${
                          financingMonths === months
                            ? "bg-white text-black"
                            : "bg-white/10 text-white/70 hover:bg-white/20 hover:text-white"
                        }`}
                        style={{ fontFamily: "Montserrat, sans-serif" }}
                      >
                        {months}mo
                      </button>
                    ))}
                  </div>
                </div>
              </div>

              {/* Right - Summary */}
              <div className="space-y-4">
                {/* Monthly Payment */}
                <div className="bg-white/10 border border-white/20 rounded-lg p-4">
                  <p
                    className="text-xs text-white/60 uppercase tracking-wider mb-2"
                    style={{ fontFamily: "Montserrat, sans-serif" }}
                  >
                    Pagesa Mujore (0% Interes)
                  </p>
                  <p
                    className="text-3xl lg:text-4xl font-bold text-white"
                    style={{ fontFamily: "Cera Pro, sans-serif" }}
                  >
                    {formatPrice(
                      (examplePrice * (1 - downPaymentPercent / 100)) /
                        financingMonths,
                    )}
                  </p>
                </div>

                {/* Summary */}
                <div className="bg-white/5 border border-white/15 rounded-lg p-4 space-y-3">
                  <div className="flex justify-between text-sm">
                    <span className="text-white/60">Çmimi i automjetit:</span>
                    <span className="text-white font-medium">
                      {formatPrice(examplePrice)}
                    </span>
                  </div>
                  <div className="flex justify-between text-sm">
                    <span className="text-white/60">Pagesa paraprakisht:</span>
                    <span className="text-white font-medium">
                      {formatPrice((examplePrice * downPaymentPercent) / 100)}
                    </span>
                  </div>
                  <div className="border-t border-white/10 pt-3 flex justify-between text-sm">
                    <span className="text-white/60">Shuma për financim:</span>
                    <span className="text-white font-medium">
                      {formatPrice(
                        examplePrice * (1 - downPaymentPercent / 100),
                      )}
                    </span>
                  </div>
                  <div className="border-t border-white/10 pt-3 flex justify-between text-sm font-bold">
                    <span className="text-white">Shuma në interes:</span>
                    <span className="text-green-400">€0</span>
                  </div>
                </div>

                <p
                  className="text-xs text-white/40 italic"
                  style={{ fontFamily: "Montserrat, sans-serif" }}
                >
                  *Ky është një llogaritës shembulli. Kontaktoni për detaje të
                  sakta të financimit.
                </p>
              </div>
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
              Të Gatshëm për të Filluar?
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
              Aplikioni Tani
            </a>
          </div>
        </div>
      </section>
    </main>
  );
}
