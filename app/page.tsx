"use client";

import { useState } from "react";
async function resizeImage(file: File, maxSize = 1024): Promise<File> {
  return new Promise((resolve, reject) => {
    const img = new Image();
    const url = URL.createObjectURL(file);
    

    img.onload = () => {
      URL.revokeObjectURL(url);

      let width = img.width;
      let height = img.height;

      if (width > height && width > maxSize) {
        height = Math.round((height * maxSize) / width);
        width = maxSize;
      } else if (height > maxSize) {
        width = Math.round((width * maxSize) / height);
        height = maxSize;
      }

      const canvas = document.createElement("canvas");
      canvas.width = width;
      canvas.height = height;

      const ctx = canvas.getContext("2d");
      if (!ctx) {
        reject(new Error("Canvas non disponible"));
        return;
      }

      ctx.drawImage(img, 0, 0, width, height);

      canvas.toBlob(
        (blob) => {
          if (!blob) {
            reject(new Error("Compression impossible"));
            return;
          }

          resolve(
            new File([blob], file.name.replace(/\.[^/.]+$/, ".jpg"), {
              type: "image/jpeg",
            })
          );
        },
        "image/jpeg",
        0.9
      );
    };

    img.onerror = reject;
    img.src = url;
  });
}
export default function Home() {
  const [previewImage, setPreviewImage] = useState<string | null>(null);
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [product] = useState("Poster");
  const [style, setStyle] = useState("Mafia Boss");
  const [clientImage, setClientImage] = useState<string | null>(null);
  const [designId, setDesignId] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);
  const [progressStep, setProgressStep] = useState("");
  const [imageUrl, setImageUrl] = useState<string | null>(null);

  async function handleFileChange(event: React.ChangeEvent<HTMLInputElement>) {
    const file = event.target.files?.[0];
    if (!file) return;

    const resizedFile = await resizeImage(file, 768);

    setSelectedFile(resizedFile);
    setPreviewImage(URL.createObjectURL(resizedFile));
    setClientImage(null);
    setDesignId(null);
    setImageUrl(null);
  }

  async function handleGenerate() {
    if (!selectedFile) {
      alert("Ajoute d'abord une photo.");
      return;
    }

    setLoading(true);
    setClientImage(null);
    setDesignId(null);

    setProgressStep("Analyse de la photo de votre animal...");
    setTimeout(() => setProgressStep("Création du personnage légendaire..."), 6000);
    setTimeout(() => setProgressStep("Peinture du portrait premium..."), 14000);
    setTimeout(() => setProgressStep("Intégration dans votre poster..."), 26000);
    setTimeout(() => setProgressStep("Finalisation du rendu haute qualité..."), 42000);

    const formData = new FormData();
    formData.append("image", selectedFile);
    formData.append("product", product);
    formData.append("style", style);

    const response = await fetch("/api/generate", {
      method: "POST",
      body: formData,
    });

    const data = await response.json();

    if (data.clientImage) {
      setClientImage(data.clientImage);
      setDesignId(data.designId);
      setImageUrl(data.imageUrl);
    } else {
      alert(data.error || "Erreur pendant la génération.");
    }

    setLoading(false);
  }

  function goToCheckout() {
  if (!designId || !imageUrl) {
    alert("Aucun design trouvé.");
    return;
  }

  window.location.href =
    `https://qven8i-s1.myshopify.com/products/t-shirt-animal-personnalise?designId=${designId}&imageUrl=${encodeURIComponent(imageUrl)}`;
  }

  return (
    <main className="min-h-screen bg-[#070609] text-white">
      <div className="pointer-events-none fixed inset-0 bg-[radial-gradient(circle_at_20%_10%,rgba(245,158,11,0.20),transparent_30%),radial-gradient(circle_at_80%_20%,rgba(147,51,234,0.18),transparent_30%),radial-gradient(circle_at_50%_90%,rgba(14,165,233,0.16),transparent_35%)]" />

      <header className="relative z-10 border-b border-white/10 bg-black/20 backdrop-blur">
        <div className="mx-auto flex max-w-7xl items-center justify-between px-6 py-5">
          <div className="text-xl font-black tracking-tight">PetLegend</div>
          <a
            href="#create"
            className="rounded-full border border-white/15 px-5 py-2 text-sm font-bold text-white/80 hover:bg-white/10"
          >
            Créer mon design
          </a>
        </div>
      </header>

      <section className="relative z-10 mx-auto max-w-7xl px-6 py-14">
        <div className="grid gap-10 lg:grid-cols-2 lg:items-center">
          <div>
            <div className="mb-5 inline-flex rounded-full border border-amber-300/30 bg-amber-300/10 px-4 py-2 text-sm text-amber-100">
              Créations IA personnalisées pour animaux
            </div>

            <h1 className="text-5xl font-black tracking-tight md:text-7xl">
              Transforme ton animal en œuvre légendaire.
            </h1>

            <p className="mt-6 max-w-xl text-lg leading-8 text-white/65">
              Upload une photo, choisis un style, et découvre ton compagnon
              directement sur un produit premium avant de commander.
            </p>
          </div>

          <div
            id="create"
            className="rounded-[2rem] border border-white/10 bg-white/[0.05] p-6 shadow-2xl"
          >
            <div className="rounded-[1.5rem] bg-black/40 p-6">
              <h2 className="text-2xl font-black">Créer mon design</h2>
              <p className="mt-2 text-sm text-white/50">
                Choisis une photo claire de ton animal.
              </p>

              <div className="mt-6">
                {!selectedFile ? (
                  <label className="flex cursor-pointer items-center justify-center rounded-2xl border border-dashed border-amber-300/40 bg-amber-300/10 px-6 py-8 text-center font-bold text-amber-100 transition hover:bg-amber-300/15">
                    Choisir une photo
                    <input
                      className="hidden"
                      type="file"
                      accept="image/*"
                      onChange={handleFileChange}
                    />
                  </label>
                ) : (
                  <div className="rounded-2xl border border-emerald-300/30 bg-emerald-300/10 p-4 text-emerald-100">
                    Photo sélectionnée : {selectedFile.name}
                  </div>
                )}
              </div>

              <div className="mt-5 grid gap-4 sm:grid-cols-2">
                <SelectBox
                  label="Style"
                  value={style}
                  onChange={setStyle}
                  options={["Mafia Boss", "Imperial", "Elfique"]}
                />
              </div>

              <button
                onClick={handleGenerate}
                disabled={loading}
                className="mt-6 w-full rounded-2xl bg-gradient-to-r from-amber-300 via-orange-300 to-pink-300 px-6 py-4 text-lg font-black text-black transition hover:scale-[1.01] disabled:opacity-70"
              >
                {loading ? progressStep || "Création en cours..." : "Générer mon poster"}
              </button>

            </div>
          </div>
        </div>

        <section className="mt-14 rounded-[2rem] border border-white/10 bg-white/[0.05] p-6">
          {!previewImage && !clientImage && (
            <div className="flex h-[460px] items-center justify-center rounded-[1.5rem] border border-dashed border-white/15 text-center text-white/40">
              Ton résultat apparaîtra ici après génération
            </div>
          )}

          {previewImage && !clientImage && (
            <div className="grid gap-6 md:grid-cols-2">
              <ImageBlock title="Photo originale" src={previewImage} />
              <div className="flex items-center justify-center rounded-[1.5rem] border border-dashed border-white/15 text-white/40">
                Clique sur “Générer mon design”
              </div>
            </div>
          )}

          {clientImage && (
            <div className="grid gap-8 md:grid-cols-2 md:items-center">
              <ImageBlock title="Photo originale" src={previewImage || ""} />

              <div>
                <p className="mb-3 text-sm text-amber-200">Résultat généré</p>
                <img
                  src={clientImage}
                  alt="Résultat généré"
                  className="w-full rounded-[1.5rem] shadow-2xl"
                />

                <button
                  onClick={goToCheckout}
                  className="mt-5 w-full rounded-2xl bg-emerald-400 px-6 py-4 text-lg font-black text-black hover:bg-emerald-300"
                >
                  Passer à la commande
                </button>

                <p className="mt-3 text-center text-sm text-white/45">
                  Passez à l'étape suivante pour finaliser votre commande et
                  renseigner vos informations de livraison.
                </p>
              </div>
            </div>
          )}
        </section>
      </section>
    </main>
  );
}

function SelectBox({
  label,
  value,
  onChange,
  options,
}: {
  label: string;
  value: string;
  onChange: (value: string) => void;
  options: string[];
}) {
  return (
    <div>
      <label className="text-sm font-medium text-white/75">{label}</label>
      <select
        className="mt-2 w-full rounded-2xl border border-white/10 bg-neutral-900 p-4"
        value={value}
        onChange={(e) => onChange(e.target.value)}
      >
        {options.map((option) => (
          <option key={option} value={option}>
            {option}
          </option>
        ))}
      </select>
    </div>
  );
}

function ImageBlock({ title, src }: { title: string; src: string }) {
  return (
    <div>
      <p className="mb-3 text-sm text-white/50">{title}</p>
      <img
        src={src}
        alt={title}
        className="max-h-[480px] w-full rounded-[1.5rem] object-contain"
      />
    </div>
  );
}