// Ndryshoni vetëm vlerat më poshtë për çdo klient.
// Të gjitha tekstet, linket, fotot, videoja dhe muzika lexohen nga ky objekt.
const invitationData = {
  studioName: "Foto Studio ART",
  fotoArtInstagramName: "Foto Art Gostivar",
  fotoArtInstagram: "https://www.instagram.com/fotoartgostivar/",
  brideName: "Nje femer", // Ndrysho emrin e nuses këtu
  groomName: "Valon", // Ndrysho emrin e dhëndrit këtu
  weddingDate: "2026-08-15T19:00:00",
  displayDate: "15 Gusht 2026",
  displayTime: "19:00",
  locationName: "Restorant Eleganca",
  address: "Gostivar, Maqedonia e Veriut",
  googleMapsLink: "https://maps.google.com/",
  music: "assets/music/wedding-music.mp3",
  openingVideo: "assets/images/opening-video.mp4",
  heroImage: "assets/images/hero.jpg",
  heroVideo: "assets/images/video-dance.mp4",
  galleryImages: [
    "assets/images/photo1.jpg",
    "assets/images/photo2.jpg",
    "assets/images/photo3.jpg"
  ],
  // Opsionale: eksportoni këto elemente nga Canva/Figma në këto shtigje.
  // Nëse një skedar mungon, ftesa përdor automatikisht dekorimet CSS.
  designAssets: {
    luxuryBackground: "assets/images/luxury-bg.png",
    goldFrame: "assets/images/gold-frame.png",
    floralCornerTop: "assets/images/floral-corner-top.png",
    floralCornerBottom: "assets/images/floral-corner-bottom.png"
  },
  familyText: "Me gëzim ju ftojmë të merrni pjesë në dasmën e fëmijëve tanë.",
  brideFamily: "Familja e nuses",
  groomFamily: "Familja e dhëndrit",
  giftInfo: "",
  rsvpPhone: "38970123456",
  contactPhone: "070 123 456",
  introLine: "Me dashuri ju ftojmë të festoni me ne."
};

window.invitationData = invitationData;
