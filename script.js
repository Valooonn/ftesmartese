(function () {
  const data = window.invitationData || {};
  function joinDisplayNames(...names) {
    return names.map((name) => (name || "").trim()).filter(Boolean).join(" & ");
  }
  const defaultCoupleNames = joinDisplayNames(data.brideName, data.groomName);
  const coupleNames = data.eventTitle || defaultCoupleNames;
  const templateType = (data.pageTitle || "").toLowerCase();
  const isKanagjegje = templateType.includes("kanagjeg");
  const isSynetie = templateType.includes("synet");
  const eventPersonName = (data.brideName || data.groomName || coupleNames).trim();
  const heroTitleText = (isKanagjegje || isSynetie) ? eventPersonName : coupleNames;
  function cleanFamilyName(value) {
    return (value || "")
      .replace(/^Familja\s+e\s+/i, "")
      .replace(/^Familja\s+/i, "")
      .trim();
  }
  function displayFamilyName(value, fallback) {
    return cleanFamilyName(value) || fallback || "";
  }
  function usefulFamilyName(value, fallback) {
    const cleaned = cleanFamilyName(value);
    if (!cleaned || /^(nuses|nusja|dh[eë]ndrit|dh[eë]ndri|t[eë]\s+af[eë]rmit)$/i.test(cleaned)) return fallback || eventPersonName;
    return cleaned;
  }
  const brideFamilyName = data.brideSurname || data.brideFamilyName || usefulFamilyName(data.brideFamily, data.brideName || eventPersonName);
  const groomFamilyName = data.groomSurname || data.groomFamilyName || usefulFamilyName(data.groomFamily, data.groomName || eventPersonName);
  const familyInviteMessage = isKanagjegje
    ? "Jeni të ftuar në kanagjegjen e vajzës sonë"
    : isSynetie
      ? "Jeni të ftuar në synetinë e djalit tonë"
      : "Jeni të ftuar në dasmën e fëmijëve tanë";
  const familyInviteFamilyName = isKanagjegje
    ? `Familja e ${brideFamilyName}`
    : isSynetie
      ? `Familja e ${groomFamilyName}`
      : `Familja e ${groomFamilyName} & ${brideFamilyName}`;
  const weddingDate = new Date(data.weddingDate);
  const previousCountdown = {};

  const els = {
    introScreen: document.getElementById("introScreen"),
    openingVideoLayer: document.getElementById("openingVideoLayer"),
    openingVideo: document.getElementById("openingVideo"),
    ambientLayer: document.getElementById("ambientLayer"),
    music: document.getElementById("backgroundMusic"),
    musicToggle: document.getElementById("musicToggle"),
    musicState: document.querySelector(".music-state"),
    heroVideo: document.getElementById("heroVideo"),
    heroImage: document.getElementById("heroImage"),
    galleryTrack: document.getElementById("galleryTrack"),
    lightbox: document.getElementById("lightbox"),
    lightboxImage: document.getElementById("lightboxImage"),
    lightboxClose: document.getElementById("lightboxClose"),
    giftSection: document.getElementById("giftSection"),
    giftInfo: document.getElementById("giftInfo"),
    mapButton: document.getElementById("mapButton"),
    rsvpYes: document.getElementById("rsvpYes"),
    rsvpNo: document.getElementById("rsvpNo"),
    contactButton: document.getElementById("contactButton"),
    fotoArtInstagram: document.getElementById("fotoArtInstagram"),
    countdown: document.getElementById("countdown"),
    passedMessage: document.getElementById("passedMessage")
  };

  function init() {
    setTextFields();
    setMedia();
    applyDesignAssets();
    setOptionalSections();
    setLinks();
    setupLuxuryDividers();
    createAmbientParticles();
    setupReactBitsInspiredMotion();
    setupIntro();
    setupMusicToggle();
    setupLightbox();
    setupGalleryCarousel();
    setupGradualBlurEffects();
    setupRevealAnimations();
    updateCountdown();
    setInterval(updateCountdown, 1000);
  }

  function setTextFields() {
    const values = {
      coupleNames,
      heroTitleText,
      familyInviteText: familyInviteMessage,
      familyInviteRespect: "Me respekt,",
      familyInviteFamily: familyInviteFamilyName,
      heroKicker: isKanagjegje ? "Kanagjegja e" : isSynetie ? "Synetia e" : "Dasma e",
      welcomeSectionEyebrow: data.welcomeSectionEyebrow || "Mirë se vini",
      welcomeSectionTitle: data.welcomeSectionTitle || "Një ditë që fillon një jetë",
      welcomeSectionText: data.welcomeSectionText || "Me zemër plot dashuri, ju ftojmë të bëheni pjesë e ditës më të veçantë të jetës sonë. Prania juaj do ta bëjë këtë festë edhe më të paharrueshme dhe do të jetë dhurata më e çmuar për ne.",
      welcomeSectionFamilyPrefix: data.welcomeSectionFamilyPrefix || "Nga familja",
      welcomeSectionNames: data.welcomeSectionNames || ((isKanagjegje || isSynetie) ? displayFamilyName(data.brideFamily, brideFamilyName) : joinDisplayNames(displayFamilyName(data.groomFamily, groomFamilyName), displayFamilyName(data.brideFamily, brideFamilyName))),
      studioName: data.studioName,
      fotoArtInstagramName: data.fotoArtInstagramName,
      introLine: data.introLine,
      displayDate: data.displayDate,
      displayTime: data.displayTime,
      locationName: data.locationName,
      address: data.address,
      contactPhone: data.contactPhone
    };

    document.querySelectorAll("[data-field]").forEach((element) => {
      const key = element.getAttribute("data-field");
      element.textContent = values[key] || "";
    });

    animateHeroName();
    document.title = `${data.pageTitle || "Ftesë Dasme"} - ${coupleNames}`;
  }

  function animateHeroName() {
    const heroName = document.querySelector(".hero-names");
    if (!heroName) return;

    heroName.innerHTML = heroTitleText
      .split(" ")
      .map((word) => `<span class="name-word">${word}</span>`)
      .join(" ");
  }

  function setMedia() {
    if (data.openingVideo) {
      els.openingVideo.removeAttribute("poster");
      els.openingVideo.src = data.openingVideo;
      els.openingVideo.addEventListener("loadeddata", () => {
        if (els.openingVideo.paused && els.openingVideo.readyState >= 2) {
          try {
            els.openingVideo.currentTime = 0.04;
          } catch (error) {
            
          }
        }
      }, { once: true });
      els.openingVideo.load();
      els.openingVideo.pause();
    }

    if (data.heroImage) {
      els.heroImage.style.backgroundImage = `url("${data.heroImage}")`;
      els.heroVideo.setAttribute("poster", data.heroImage);
    }

    prepareHeroVideo();

    if (data.music) {
      els.music.src = data.music;
    }

    els.galleryTrack.innerHTML = "";
    (data.galleryImages || []).forEach((imagePath, index) => {
      const button = document.createElement("button");
      button.className = "gallery-item";
      button.type = "button";
      button.style.backgroundImage = `url("${imagePath}")`;
      button.setAttribute("aria-label", `Hape foton ${index + 1}`);
      button.addEventListener("click", () => openLightbox(imagePath));
      els.galleryTrack.appendChild(button);
    });
  }

  function showHeroImage() {
    els.heroVideo.classList.remove("is-ready");
    els.heroImage.classList.add("is-visible");
  }

  async function applyDesignAssets() {
    if (window.location.protocol === "file:") return;

    const assets = data.designAssets || {};
    const assetMap = [
      ["luxuryBackground", "--asset-luxury-bg", "has-luxury-bg"],
      ["goldFrame", "--asset-gold-frame", "has-gold-frame"],
      ["floralCornerTop", "--asset-floral-top", "has-floral-top"],
      ["floralCornerBottom", "--asset-floral-bottom", "has-floral-bottom"],
    ];

    await Promise.all(assetMap.map(async ([key, property, className]) => {
      const path = assets[key];
      if (!path) return;

      try {
        const response = await fetch(path, { method: "HEAD", cache: "no-store" });
        if (response.ok) {
          document.documentElement.style.setProperty(property, `url("${path}")`);
          document.body.classList.add(className);
        }
      } catch (error) {
        
      }
    }));
  }

  async function prepareHeroVideo() {
    els.heroVideo.addEventListener("error", showHeroImage);
    els.heroVideo.addEventListener("loadeddata", () => {
      els.heroVideo.classList.add("is-ready");
      els.heroVideo.play().catch(showHeroImage);
    });

    if (!data.heroVideo) {
      showHeroImage();
      return;
    }

    if (window.location.protocol === "file:") {
      showHeroImage();
      return;
    }

    try {
      const response = await fetch(data.heroVideo, { method: "HEAD" });
      const size = Number(response.headers.get("content-length") || "0");
      if (response.ok && size > 0) {
        els.heroVideo.src = data.heroVideo;
        return;
      }
    } catch (error) {
      els.heroVideo.src = data.heroVideo;
      return;
    }

    showHeroImage();
  }

  function setOptionalSections() {
    const giftInfo = (data.giftInfo || "").trim();
    if (giftInfo) {
      els.giftInfo.textContent = giftInfo;
    } else {
      els.giftSection.hidden = true;
    }
  }

  function setLinks() {
    els.mapButton.href = data.googleMapsLink || "#";
    els.fotoArtInstagram.href = data.fotoArtInstagram || "#";
    const contactPhone = String(data.contactPhone || "").replace(/[^\d+]/g, "");
    els.contactButton.href = contactPhone ? `tel:${contactPhone}` : "#";
    els.rsvpYes.addEventListener("click", () => openWhatsApp(true));
    els.rsvpNo.addEventListener("click", () => openWhatsApp(false));
  }

  function getRsvpPhoneNumber() {
    return String(data.rsvpPhone || "").replace(/\D/g, "");
  }

  function getRsvpMessage(isAttending) {
    return isAttending
      ? [
          "Përshëndetje!",
          "Po, do të vij në dasmën tuaj. ❤️",
          "",
          "Numri i personave:"
        ].join("\n")
      : [
          "Përshëndetje!",
          "Fatkeqësisht nuk mund të marr pjesë në dasmën tuaj.",
          "",
        ].join("\n");
  }

  function buildWhatsAppUrl(phone, message) {
    return `https://wa.me/${phone}?text=${encodeURIComponent(message)}`;
  }

  function openWhatsApp(isAttending) {
    const phone = getRsvpPhoneNumber();
    if (!phone) return;
    window.open(buildWhatsAppUrl(phone, getRsvpMessage(isAttending)), "_blank", "noopener");
  }
  function setupLuxuryDividers() {
    const isRose = document.body.classList.contains("theme-kanagjegje");
    const isBlue = document.body.classList.contains("theme-synetie");
    const themeClass = isRose
      ? "rose-divider"
      : isBlue
        ? "blue-gold-divider"
        : "luxury-divider gold-divider";

    document.querySelectorAll(".section, .footer").forEach((section) => {
      if (section.classList.contains("family-section")) return;
      if (section.querySelector(":scope > .section-divider")) return;
      const divider = document.createElement("div");
      divider.className = "section-divider ornament-line " + themeClass;
      divider.setAttribute("aria-hidden", "true");
      section.prepend(divider);
    });
  }

  function setupIntro() {
    let introStarted = false;
    let introFinished = false;
    let fallbackTimer;

    const finishIntro = () => {
      if (introFinished) return;
      introFinished = true;
      clearTimeout(fallbackTimer);
      els.openingVideo.pause();
      els.introScreen.classList.add("intro-complete", "is-open");
      els.musicToggle.classList.remove("is-hidden");
      setTimeout(() => els.introScreen.remove(), 850);
    };

    els.openingVideo.addEventListener("ended", finishIntro);
    els.openingVideo.addEventListener("error", finishIntro);

    const startIntro = async () => {
      if (introStarted) return;
      introStarted = true;
      els.introScreen.setAttribute("aria-disabled", "true");
      els.introScreen.classList.add("opening");

      if (data.music) {
        els.music.play().catch(() => els.music.pause());
      }
      updateMusicButton();

      if (!data.openingVideo) {
        finishIntro();
        return;
      }

      els.openingVideo.pause();
      els.openingVideo.currentTime = 0;
      els.openingVideo.muted = true;
      els.openingVideo.playsInline = true;
      els.introScreen.classList.add("video-playing");

      try {
        await els.openingVideo.play();
        const duration = Number.isFinite(els.openingVideo.duration)
          ? els.openingVideo.duration * 1000 + 2000
          : 60000;
        fallbackTimer = setTimeout(finishIntro, Math.min(duration, 90000));
      } catch (error) {
        finishIntro();
      }
    };

    els.introScreen.addEventListener("click", startIntro);
    els.introScreen.addEventListener("keydown", (event) => {
      if (event.key === "Enter" || event.key === " ") {
        event.preventDefault();
        startIntro();
      }
    });
  }

  function setupMusicToggle() {
    els.musicToggle.addEventListener("click", async () => {
      if (els.music.paused) {
        try {
          await els.music.play();
        } catch (error) {
          els.music.pause();
        }
      } else {
        els.music.pause();
      }
      updateMusicButton();
    });

    els.music.addEventListener("play", updateMusicButton);
    els.music.addEventListener("pause", updateMusicButton);
  }

  function updateMusicButton() {
    const isPlaying = !els.music.paused;
    els.musicToggle.classList.toggle("is-paused", !isPlaying);
    els.musicToggle.setAttribute("aria-pressed", String(isPlaying));
    els.musicToggle.setAttribute("aria-label", isPlaying ? "Muzika ndezur" : "Muzika fikur");
    els.musicState.textContent = isPlaying ? "Muzika ndezur" : "Muzika fikur";
  }

  function updateCountdown() {
    const diff = weddingDate - new Date();

    if (Number.isNaN(weddingDate.getTime()) || diff <= 0) {
      els.countdown.hidden = true;
      els.passedMessage.hidden = false;
      return;
    }

    const values = {
      days: Math.floor(diff / 86400000),
      hours: Math.floor((diff / 3600000) % 24),
      minutes: Math.floor((diff / 60000) % 60),
      seconds: Math.floor((diff / 1000) % 60)
    };

    Object.entries(values).forEach(([id, value]) => {
      const element = document.getElementById(id);
      const text = String(value).padStart(2, "0");
      if (previousCountdown[id] !== text) {
        element.textContent = text;
        element.classList.remove("pulse");
        void element.offsetWidth;
        element.classList.add("pulse");
        previousCountdown[id] = text;
      }
    });
  }

  function setupGalleryCarousel() {
    if (!els.galleryTrack) return;

    const items = Array.from(els.galleryTrack.querySelectorAll(".gallery-item"));
    const gallerySection = els.galleryTrack.closest(".gallery-section");
    if (!gallerySection || !items.length) return;

    gallerySection.querySelector(".gallery-controls")?.remove();
    gallerySection.querySelector(".gallery-side-controls")?.remove();
    items.forEach((item) => item.classList.remove("is-active"));
    items[0].classList.add("is-active");

    let sliderShell = els.galleryTrack.closest(".gallery-slider-shell");
    if (!sliderShell) {
      sliderShell = document.createElement("div");
      sliderShell.className = "gallery-slider-shell";
      els.galleryTrack.parentNode.insertBefore(sliderShell, els.galleryTrack);
      sliderShell.appendChild(els.galleryTrack);
    }

    if (items.length < 2) return;

    gallerySection.classList.add("has-gallery-carousel");

    const prefersReducedMotion = window.matchMedia("(prefers-reduced-motion: reduce)");
    let currentIndex = 0;
    let autoplayTimer;
    let resumeTimer;
    let scrollFrame;
    let pointerInside = false;

    const sideControls = document.createElement("div");
    sideControls.className = "gallery-side-controls";
    sideControls.setAttribute("aria-label", "Kontrolli i fotove");

    const previousButton = document.createElement("button");
    previousButton.className = "gallery-arrow gallery-side-arrow gallery-side-prev";
    previousButton.type = "button";
    previousButton.setAttribute("aria-label", "Fotoja e meparshme");
    previousButton.textContent = "";

    const nextButton = document.createElement("button");
    nextButton.className = "gallery-arrow gallery-side-arrow gallery-side-next";
    nextButton.type = "button";
    nextButton.setAttribute("aria-label", "Fotoja tjeter");
    nextButton.textContent = "";

    const controls = document.createElement("div");
    controls.className = "gallery-controls gallery-dot-controls";

    const dots = document.createElement("div");
    dots.className = "gallery-dots";
    dots.setAttribute("aria-label", "Navigimi i galerise");

    const dotButtons = items.map((_, index) => {
      const dot = document.createElement("button");
      dot.className = "gallery-dot";
      dot.type = "button";
      dot.setAttribute("aria-label", `Shfaq foton ${index + 1}`);
      dot.addEventListener("click", () => {
        pauseAutoplay(9000);
        setActive(index, true);
      });
      dots.appendChild(dot);
      return dot;
    });

    sideControls.append(previousButton, nextButton);
    controls.append(dots);
    sliderShell.appendChild(sideControls);
    sliderShell.insertAdjacentElement("afterend", controls);

    function setActive(index, shouldScroll) {
      currentIndex = (index + items.length) % items.length;
      items.forEach((item, itemIndex) => {
        const isActive = itemIndex === currentIndex;
        item.classList.toggle("is-active", isActive);
        item.setAttribute("aria-current", isActive ? "true" : "false");
      });
      dotButtons.forEach((dot, dotIndex) => {
        dot.classList.toggle("is-active", dotIndex === currentIndex);
        dot.setAttribute("aria-current", dotIndex === currentIndex ? "true" : "false");
      });

      if (shouldScroll) {
        const target = items[currentIndex];
        const targetLeft = target.offsetLeft - ((els.galleryTrack.clientWidth - target.clientWidth) / 2);
        els.galleryTrack.scrollTo({
          left: Math.max(0, targetLeft),
          behavior: prefersReducedMotion.matches ? "auto" : "smooth"
        });
      }
    }

    function moveGallery(direction) {
      setActive(currentIndex + direction, true);
    }

    function stopAutoplay() {
      window.clearInterval(autoplayTimer);
      autoplayTimer = undefined;
    }

    function startAutoplay() {
      if (prefersReducedMotion.matches || pointerInside || document.hidden) return;
      stopAutoplay();
      autoplayTimer = window.setInterval(() => moveGallery(1), 4200);
    }

    function pauseAutoplay(delay) {
      stopAutoplay();
      window.clearTimeout(resumeTimer);
      resumeTimer = window.setTimeout(startAutoplay, delay);
    }

    previousButton.addEventListener("click", () => {
      pauseAutoplay(9000);
      moveGallery(-1);
    });

    nextButton.addEventListener("click", () => {
      pauseAutoplay(9000);
      moveGallery(1);
    });

    gallerySection.addEventListener("keydown", (event) => {
      if (event.key !== "ArrowLeft" && event.key !== "ArrowRight") return;
      event.preventDefault();
      pauseAutoplay(9000);
      moveGallery(event.key === "ArrowLeft" ? -1 : 1);
    });

    items.forEach((item) => {
      item.addEventListener("click", () => pauseAutoplay(10000));
      item.addEventListener("focus", () => pauseAutoplay(9000));
    });

    els.galleryTrack.addEventListener("scroll", () => {
      window.cancelAnimationFrame(scrollFrame);
      scrollFrame = window.requestAnimationFrame(() => {
        const trackRect = els.galleryTrack.getBoundingClientRect();
        const trackCenter = trackRect.left + trackRect.width / 2;
        let closestIndex = currentIndex;
        let closestDistance = Infinity;

        items.forEach((item, index) => {
          const rect = item.getBoundingClientRect();
          const itemCenter = rect.left + rect.width / 2;
          const distance = Math.abs(trackCenter - itemCenter);
          if (distance < closestDistance) {
            closestDistance = distance;
            closestIndex = index;
          }
        });

        if (closestIndex !== currentIndex) setActive(closestIndex, false);
      });
    }, { passive: true });

    els.galleryTrack.addEventListener("pointerdown", () => pauseAutoplay(9000), { passive: true });
    sliderShell.addEventListener("mouseenter", () => {
      pointerInside = true;
      stopAutoplay();
    });
    sliderShell.addEventListener("mouseleave", () => {
      pointerInside = false;
      startAutoplay();
    });

    document.addEventListener("visibilitychange", () => {
      if (document.hidden) {
        stopAutoplay();
      } else {
        startAutoplay();
      }
    });

    if (typeof prefersReducedMotion.addEventListener === "function") {
      prefersReducedMotion.addEventListener("change", () => {
        stopAutoplay();
        startAutoplay();
      });
    }

    setActive(0, false);
    startAutoplay();
  }

  function setupRevealAnimations() {
    const observer = new IntersectionObserver((entries) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          entry.target.querySelectorAll(".glass-card, .countdown-card, .gallery-item, .gallery-controls, .button-stack > *").forEach((item, index) => {
            const delay = (90 + index * 85) + "ms";
            item.style.transitionDelay = delay;
            item.style.animationDelay = delay;
          });
          entry.target.classList.add("is-visible");
          observer.unobserve(entry.target);
        }
      });
    }, {
      threshold: 0.16,
      rootMargin: "0px 0px -8% 0px"
    });

    document.querySelectorAll(".section-reveal").forEach((section) => observer.observe(section));
  }

  function setupLightbox() {
    els.lightboxClose.addEventListener("click", closeLightbox);
    els.lightbox.addEventListener("click", (event) => {
      if (event.target === els.lightbox) closeLightbox();
    });
    document.addEventListener("keydown", (event) => {
      if (event.key === "Escape") closeLightbox();
    });
  }

  function openLightbox(imagePath) {
    els.lightboxImage.src = imagePath;
    els.lightbox.classList.add("is-open");
    els.lightbox.setAttribute("aria-hidden", "false");
    document.body.classList.add("no-scroll");
  }

  function closeLightbox() {
    els.lightbox.classList.remove("is-open");
    els.lightbox.setAttribute("aria-hidden", "true");
    document.body.classList.remove("no-scroll");
  }

  function createAmbientParticles() {
    if (!els.ambientLayer) return;

    for (let i = 0; i < 18; i += 1) {
      const particle = document.createElement("span");
      particle.style.left = `${5 + Math.random() * 90}%`;
      particle.style.top = `${Math.random() * 100}%`;
      particle.style.animationDelay = `${Math.random() * 10}s`;
      particle.style.animationDuration = `${10 + Math.random() * 12}s`;
      els.ambientLayer.appendChild(particle);
    }
  }

  function setupReactBitsInspiredMotion() {
    const reduceMotionQuery = window.matchMedia("(prefers-reduced-motion: reduce)");
    const prefersReducedMotion = reduceMotionQuery.matches;
    document.body.classList.toggle("motion-reduced", prefersReducedMotion);
    document.body.classList.add("reactbits-motion-ready");

    const revealSelectors = [
      ".section-reveal > .eyebrow",
      ".section-reveal > h2",
      ".section-reveal .glass-card",
      ".section-reveal .countdown-card",
      ".section-reveal .gallery-item",
      ".section-reveal .gallery-controls",
      ".section-reveal .button-stack > *",
      ".section-reveal .map-card",
      ".section-reveal .minimal-card",
      ".section-reveal .fotoart-instagram"
    ];

    const revealItems = new Set();
    revealSelectors.forEach((selector) => {
      document.querySelectorAll(selector).forEach((item) => revealItems.add(item));
    });

    document.querySelectorAll(".section-reveal").forEach((section) => {
      const children = Array.from(section.querySelectorAll(Array.from(revealSelectors).join(",")));
      children.forEach((item, index) => {
        item.classList.add("rb-reveal-child");
        item.style.setProperty("--rb-delay", `${Math.min(index, 8) * 70}ms`);
      });
    });

    revealItems.forEach((item) => item.classList.add("rb-reveal-child"));

    document
      .querySelectorAll(".section-divider, .gold-divider, .luxury-divider, .rose-divider, .blue-gold-divider")
      .forEach((divider) => divider.classList.add("rb-divider"));

    document
      .querySelectorAll(".primary-button, .secondary-button, .gallery-arrow, .gallery-side-arrow, .music-toggle, .fotoart-instagram")
      .forEach((button) => button.classList.add("rb-button"));

    const rsvpSection = document.querySelector(".rsvp-section");
    if (rsvpSection) rsvpSection.classList.add("rb-rsvp-glow");
    const glareCards = document.querySelectorAll(".glass-card, .countdown-card, .gallery-item, .map-card, .minimal-card");
    glareCards.forEach((card) => {
      card.classList.add("rb-glare-card");
      card.style.setProperty("--glare-x", "50%");
      card.style.setProperty("--glare-y", "50%");
      card.style.setProperty("--glare-opacity", "0.3");
      card.style.setProperty("--glare-size", "300px");
      card.style.setProperty("--glare-angle", "-30deg");
      card.style.setProperty("--glare-duration", "800ms");

      const hasLayer = Array.from(card.children).some((child) => child.classList.contains("rb-glare-layer"));
      if (!hasLayer) {
        const glareLayer = document.createElement("span");
        glareLayer.className = "rb-glare-layer";
        glareLayer.setAttribute("aria-hidden", "true");
        card.prepend(glareLayer);
      }

      if (card.dataset.glareReady === "true" || prefersReducedMotion) return;
      card.dataset.glareReady = "true";

      let glareTimer;
      const updateGlare = (event) => {
        const rect = card.getBoundingClientRect();
        if (!rect.width || !rect.height) return;
        const x = Math.max(0, Math.min(100, ((event.clientX - rect.left) / rect.width) * 100));
        const y = Math.max(0, Math.min(100, ((event.clientY - rect.top) / rect.height) * 100));
        card.style.setProperty("--glare-x", `${x}%`);
        card.style.setProperty("--glare-y", `${y}%`);
        card.classList.add("is-glare-active");
        window.clearTimeout(glareTimer);
      };

      const softenGlare = () => {
        glareTimer = window.setTimeout(() => {
          card.classList.remove("is-glare-active");
          card.style.setProperty("--glare-x", "50%");
          card.style.setProperty("--glare-y", "50%");
        }, 180);
      };

      card.addEventListener("pointerenter", updateGlare);
      card.addEventListener("pointermove", updateGlare);
      card.addEventListener("pointerdown", updateGlare);
      card.addEventListener("pointerup", softenGlare);
      card.addEventListener("pointercancel", softenGlare);
      card.addEventListener("pointerleave", softenGlare);
    });
    if (!els.ambientLayer || prefersReducedMotion) return;

    els.ambientLayer.querySelectorAll(".rb-orb").forEach((orb) => orb.remove());

    const theme = document.body.classList.contains("theme-kanagjegje")
      ? "kanagjegje"
      : document.body.classList.contains("theme-synetie")
        ? "synetie"
        : "wedding";

    const presets = {
      wedding: [
        ["rb-flower", -8, 12, 128, -12, 0],
        ["rb-flower", 70, 22, 104, 10, 1.6],
        ["rb-flower", -10, 58, 112, 18, 3.3],
        ["rb-flower", 78, 75, 96, -14, 4.4],
        ["rb-gold-mote", 22, 18, 8, 0, 0.2],
        ["rb-gold-mote", 64, 44, 7, 0, 2.1],
        ["rb-gold-mote", 38, 82, 6, 0, 3.6]
      ],
      kanagjegje: [
        ["rb-petal", 12, 14, 18, -28, 0],
        ["rb-petal", 78, 20, 15, 35, 1.2],
        ["rb-petal", 22, 40, 13, 16, 2.1],
        ["rb-petal", 70, 52, 17, -18, 3.2],
        ["rb-petal", 16, 72, 14, 42, 4.1],
        ["rb-petal", 82, 80, 18, -32, 5],
        ["rb-rose-mote", 42, 26, 7, 0, 1.8],
        ["rb-rose-mote", 56, 66, 8, 0, 3.8]
      ],
      synetie: [
        ["rb-balloon", 8, 14, 42, -8, 0],
        ["rb-balloon rb-balloon-alt", 78, 18, 38, 8, 1.4],
        ["rb-cloud", 18, 38, 58, 0, 0.8],
        ["rb-cloud", 68, 62, 66, 0, 2.7],
        ["rb-star", 48, 24, 12, 0, 1.1],
        ["rb-star", 30, 72, 10, 0, 3.2],
        ["rb-star", 84, 78, 9, 0, 4.3],
        ["rb-confetti", 52, 46, 96, 0, 1.9]
      ]
    };

    presets[theme].forEach(([className, x, y, size, rotate, delay], index) => {
      const orb = document.createElement("span");
      orb.className = `rb-orb ${className}`;
      orb.style.setProperty("--rb-x", `${x}%`);
      orb.style.setProperty("--rb-y", `${y}%`);
      orb.style.setProperty("--rb-size", `${size}px`);
      orb.style.setProperty("--rb-rotate", `${rotate}deg`);
      orb.style.setProperty("--rb-delay", `${delay}s`);
      orb.style.setProperty("--rb-duration", `${10 + index * 0.8}s`);
      els.ambientLayer.appendChild(orb);
    });

    if (typeof reduceMotionQuery.addEventListener === "function") {
      reduceMotionQuery.addEventListener("change", (event) => {
        document.body.classList.toggle("motion-reduced", event.matches);
      });
    }
  }
  function setupGradualBlurEffects() {
    const prefersReducedMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;

    const createGradualBlur = (target, options = {}) => {
      if (!target || target.dataset.gradualBlurReady === "true") return;
      target.dataset.gradualBlurReady = "true";
      target.classList.add("rb-gradual-blur-host");

      const blur = document.createElement("span");
      blur.className = "rb-gradual-blur";
      blur.dataset.position = options.position || "bottom";
      blur.setAttribute("aria-hidden", "true");
      blur.style.setProperty("--gradual-height", options.height || "7rem");
      blur.style.setProperty("--gradual-opacity", String(options.opacity ?? 1));

      const divCount = options.divCount || 5;
      const strength = options.strength || 2;
      for (let i = 0; i < divCount; i += 1) {
        const layer = document.createElement("span");
        layer.className = "rb-gradual-blur-layer";
        const start = Math.pow(i / divCount, options.exponential ? 1.65 : 1) * 100;
        const end = Math.pow((i + 1) / divCount, options.exponential ? 1.65 : 1) * 100;
        const layerBlur = Math.max(0.35, strength * Math.pow(1.55, i - 1));
        layer.style.setProperty("--gradual-start", `${Math.max(0, start - 3)}%`);
        layer.style.setProperty("--gradual-end", `${Math.min(100, end + 14)}%`);
        layer.style.setProperty("--gradual-layer-blur", `${layerBlur.toFixed(2)}px`);
        blur.appendChild(layer);
      }

      if (prefersReducedMotion) blur.classList.add("is-reduced");
      target.appendChild(blur);
    };

    createGradualBlur(document.querySelector(".hero"), {
      position: "bottom",
      height: "7rem",
      strength: 2,
      divCount: 5,
      exponential: true,
      opacity: 1
    });

    createGradualBlur(document.querySelector(".gallery-slider-shell") || document.querySelector(".gallery-section"), {
      position: "bottom",
      height: "5.75rem",
      strength: 2,
      divCount: 5,
      exponential: true,
      opacity: 0.94
    });
  }

  init();
})();
