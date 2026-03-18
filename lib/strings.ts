function photoNominative(n: number): string {
  const mod10 = n % 10;
  const mod100 = n % 100;
  if (mod100 >= 11 && mod100 <= 19) return "fotografija";
  if (mod10 === 1) return "fotografija";
  if (mod10 >= 2 && mod10 <= 4) return "fotografije";
  return "fotografija";
}

function photoAccusative(n: number): string {
  const mod10 = n % 10;
  const mod100 = n % 100;
  if (mod100 >= 11 && mod100 <= 19) return "fotografija";
  if (mod10 === 1) return "fotografiju";
  if (mod10 >= 2 && mod10 <= 4) return "fotografije";
  return "fotografija";
}

export const S = {
  // Guest page
  pageTitle: "Podijelite vaše fotografije",
  pageSubtitle: "Svaka vaša fotografija je dragocjeno sjećanje.",
  uploadButton: "Dodajte fotografije",
  cameraButton: "Uslikajte trenutak",
  namePlaceholder: "Vaše ime (opciono)",
  uploading: "Učitavanje…",
  uploadSuccess: "Hvala! Vaše fotografije su sačuvane.",
  yourPhotos: "Vaše fotografije",
  uploadMore: "Dodajte još fotografija",
  dropHint: "Odaberite fotografije sa vašeg uređaja",
  processing: "Priprema fotografija…",
  preparingFile: "Priprema…",
  cancelButton: "Odustani",
  uploadPhotos: (n: number) => `Učitajte ${n} ${photoAccusative(n)}`,

  // Errors
  errorFileType: "Dozvoljen je samo upload fotografija (JPEG, PNG, WebP).",
  errorFileSize: (mb: number) => `Fotografija je prevelika. Maksimalna veličina je ${mb} MB.`,
  errorTooMany: (max: number) => `Možete učitati najviše ${max} fotografija odjednom.`,
  errorUpload: "Greška pri učitavanju. Molimo pokušajte ponovo.",
  errorGeneric: "Nešto je pošlo naopako. Molimo pokušajte ponovo.",

  // Admin
  adminLoginTitle: "Prijava za administratora",
  adminLoginSubtitle: "Pristup galeriji vjenčanja",
  passwordLabel: "Lozinka",
  loginButton: "Prijavi se",
  loginError: "Pogrešna lozinka. Pokušajte ponovo.",
  adminGalleryTitle: "Galerija vjenčanja",
  adminPhotosCount: (n: number) => `${n} ${photoNominative(n)}`,
  deleteButton: "Obriši",
  downloadAll: "Preuzmi sve",
  downloading: "Preuzimanje…",
  confirmDelete: "Obrisati ovu fotografiju?",
  logoutButton: "Odjavi se",
  noPhotos: "Još nema fotografija.",
  uploadedBy: "Učitao/la",
  storageUsed: (mb: string) => `${mb} MB učitano`,
};
