// Translations
let translations = {};
let currentLang = "en";

// Load translation files
async function loadTranslations() {
  try {
    const [enResponse, jaResponse] = await Promise.all([
      fetch("translations/en.json"),
      fetch("translations/ja.json"),
    ]);

    if (!enResponse.ok || !jaResponse.ok) {
      throw new Error("Failed to load translation files");
    }

    translations.en = await enResponse.json();
    translations.ja = await jaResponse.json();

    // Initialize language after translations are loaded
    initializeLanguage();
  } catch (error) {
    console.error("Error loading translations:", error);
    // Fallback: continue with default language
    initializeLanguage();
  }
}

function setLanguage(lang) {
  if (!translations[lang]) {
    console.warn(`Translation for language "${lang}" not found`);
    return;
  }

  currentLang = lang;
  document.documentElement.lang = lang;

  // Update all translatable elements
  document.querySelectorAll("[data-i18n]").forEach((el) => {
    const key = el.getAttribute("data-i18n");
    if (translations[lang][key]) {
      el.textContent = translations[lang][key];
    }
  });

  // Update toggle buttons
  document.querySelectorAll(".lang-option").forEach((btn) => {
    btn.classList.toggle("active", btn.dataset.lang === lang);
  });

  // Save preference
  localStorage.setItem("preferred-lang", lang);
}

function initializeLanguage() {
  // Language toggle
  document.getElementById("langToggle").addEventListener("click", () => {
    const newLang = currentLang === "en" ? "ja" : "en";
    setLanguage(newLang);
  });

  // Check for saved preference or browser language
  const savedLang = localStorage.getItem("preferred-lang");
  const browserLang = navigator.language.startsWith("ja") ? "ja" : "en";
  const initialLang = savedLang || browserLang;
  if (initialLang !== "en") {
    setLanguage(initialLang);
  }
}

// Load translations when DOM is ready
if (document.readyState === "loading") {
  document.addEventListener("DOMContentLoaded", loadTranslations);
} else {
  loadTranslations();
}

// Intersection Observer for scroll animations
const observerOptions = {
  root: null,
  rootMargin: "0px",
  threshold: 0.1,
};

const observer = new IntersectionObserver((entries) => {
  entries.forEach((entry) => {
    if (entry.isIntersecting) {
      const delay = entry.target.dataset.delay || 0;
      setTimeout(() => {
        entry.target.classList.add("visible");
      }, delay);
      observer.unobserve(entry.target);
    }
  });
}, observerOptions);

// Observe all elements with data-animate attribute
document.querySelectorAll("[data-animate]").forEach((el) => {
  observer.observe(el);
});

// Smooth scroll for navigation links
document.querySelectorAll('a[href^="#"]').forEach((anchor) => {
  anchor.addEventListener("click", function (e) {
    e.preventDefault();
    const target = document.querySelector(this.getAttribute("href"));
    if (target) {
      target.scrollIntoView({
        behavior: "smooth",
        block: "start",
      });
    }
  });
});

// Parallax effect on hero section
window.addEventListener("scroll", () => {
  const scrolled = window.pageYOffset;
  const hero = document.querySelector(".hero-content");
  if (hero && scrolled < window.innerHeight) {
    hero.style.transform = `translateY(${scrolled * 0.3}px)`;
    hero.style.opacity = 1 - (scrolled / window.innerHeight) * 0.5;
  }
});
