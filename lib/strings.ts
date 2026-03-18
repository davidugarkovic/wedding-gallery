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
  adminPhotosCount: (n: number) => `${n} fotografija`,
  deleteButton: "Obriši",
  downloadAll: "Preuzmi sve",
  downloading: "Preuzimanje…",
  confirmDelete: "Obrisati ovu fotografiju?",
  logoutButton: "Odjavi se",
  noPhotos: "Još nema fotografija.",
  uploadedBy: "Učitao/la",
  storageUsed: (mb: string) => `${mb} MB učitano`,
};
