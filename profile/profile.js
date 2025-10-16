// profile.js — GSAP-powered animations and interactions

// Ensure GSAP and plugins are available
if (typeof gsap === "undefined") {
  console.warn("GSAP not loaded");
} else {
  gsap.registerPlugin(ScrollTrigger, ScrollToPlugin);
}

// Page load animation
(function () {
  gsap.from("body", {
    opacity: 0,
    duration: 1.5,
    ease: "power2.out",
    onComplete: () => {
      document.body.style.opacity = 1; // Ensure it's visible
    },
  });
})();

// Mobile nav toggle
(function () {
  const navToggle = document.getElementById("nav-toggle");
  const navList = document.querySelector("header nav ul");
  navToggle?.addEventListener("click", () => {
    navList?.classList.toggle("hidden");
  });
})();

// Smooth scroll for anchor links
(function () {
  document.querySelectorAll('a[href^="#"]').forEach((anchor) => {
    anchor.addEventListener("click", function (e) {
      const href = this.getAttribute("href");
      if (href === "#" || href === "") return;
      const target = document.querySelector(href);
      if (!target) return;
      e.preventDefault();
      gsap.to(window, {
        duration: 1.2,
        scrollTo: { y: target, offsetY: 80 },
        ease: "power3.inOut",
      });
    });
  });
})();

// Section reveal animation
(function () {
  gsap.utils.toArray("section").forEach((section) => {
    gsap.from(section, {
      opacity: 0,
      y: 60,
      duration: 1.2,
      ease: "power3.out",
      scrollTrigger: {
        trigger: section,
        start: "top 90%",
        end: "bottom 10%",
        toggleActions: "play none none reverse",
      },
    });
  });
})();

// Stagger reveal for project cards — slower and smoother
(function () {
  const grid = document.querySelector("#projects .grid");
  if (!grid) return;
  const cards = grid.querySelectorAll(".project-card");
  gsap.from(cards, {
    opacity: 0,
    y: 40, // slightly smaller translate for a subtler effect
    stagger: 0.32, // wider stagger so cards appear more rhythmically
    duration: 1.4, // slower reveal
    ease: "power2.out", // gentler easing for smoothness
    scrollTrigger: {
      trigger: "#projects",
      start: "top 85%",
      // play once when entering - if you want repeat on reverse, remove this
      toggleActions: "play none none reverse",
    },
  });
})();

// Hover tilt effect for project cards
(function () {
  const cards = document.querySelectorAll(".project-card");
  cards.forEach((card) => {
    card.style.transformStyle = "preserve-3d";
    card.addEventListener("mousemove", (e) => {
      const rect = card.getBoundingClientRect();
      const x = e.clientX - rect.left; // x position within the element.
      const y = e.clientY - rect.top; // y position within the element.
      const cx = rect.width / 2;
      const cy = rect.height / 2;
      const dx = (x - cx) / cx;
      const dy = (y - cy) / cy;
      gsap.to(card, {
        rotationY: dx * 8,
        rotationX: -dy * 8,
        scale: 1.03,
        duration: 0.4,
        ease: "power2.out",
      });
    });
    card.addEventListener("mouseleave", () => {
      gsap.to(card, {
        rotationY: 0,
        rotationX: 0,
        scale: 1,
        duration: 0.6,
        ease: "elastic.out(1,0.5)",
      });
    });
  });
})();

// Optional: subtle header hide on scroll down, show on scroll up
(function () {
  let lastY = window.pageYOffset;
  const header = document.querySelector("header");
  if (!header) return;
  window.addEventListener("scroll", () => {
    const y = window.pageYOffset;
    if (y > lastY && y > 120) {
      // scrolling down
      header.style.transform = "translateY(-110%)";
      header.style.transition = "transform 0.35s ease";
    } else {
      // scrolling up
      header.style.transform = "translateY(0)";
    }
    lastY = y;
  });
})();

// Contact form submission with EmailJS
(function () {
  const form = document.getElementById("contact-form");
  if (!form) return;
  // Read EmailJS configuration from form data-attributes with sensible defaults
  const cfg = {
    service: form.dataset.serviceId || "service_w8vqpan",
    template: form.dataset.templateId || "",
    publicKey: form.dataset.publicKey || "",
  };

  // Initialize emailjs if public key is provided
  if (
    cfg.publicKey &&
    typeof emailjs !== "undefined" &&
    typeof emailjs.init === "function"
  ) {
    try {
      emailjs.init(cfg.publicKey);
    } catch (err) {
      console.warn("EmailJS init failed", err);
    }
  }

  form.addEventListener("submit", function (e) {
    e.preventDefault();

    if (typeof emailjs === "undefined") {
      alert(
        "EmailJS is not loaded. Please check your network or include the EmailJS SDK."
      );
      return;
    }

    if (!cfg.template) {
      alert(
        "Email template ID is not configured. Please set data-template-id on the contact form."
      );
      return;
    }

    // Ensure hidden fields match visible inputs (EmailJS template variables)
    try {
      const visibleName = document.getElementById("name")?.value || "";
      const visibleEmail = document.getElementById("email")?.value || "";
      const hiddenName = document.getElementById("hidden_user_name");
      const hiddenEmail = document.getElementById("hidden_user_email");
      if (hiddenName) hiddenName.value = visibleName;
      if (hiddenEmail) hiddenEmail.value = visibleEmail;
    } catch (ex) {
      console.warn("Failed to copy visible fields to hidden inputs", ex);
    }

    // Use sendForm which expects (serviceID, templateID, form)
    emailjs.sendForm(cfg.service, cfg.template, form).then(
      () => {
        alert("Message sent successfully!");
        form.reset();
      },
      (error) => {
        console.error("EmailJS error", error);
        alert(
          "Error sending message: " + (error?.text || JSON.stringify(error))
        );
      }
    );
  });
})();
