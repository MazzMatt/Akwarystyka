(() => {
  const getTarget = element => document.querySelector(element.dataset.bsTarget || element.getAttribute("href"));

  const closeDropdowns = except => {
    document.querySelectorAll(".dropdown.show").forEach(dropdown => {
      if (dropdown !== except) {
        dropdown.classList.remove("show");
        dropdown.querySelector(".dropdown-menu")?.classList.remove("show");
      }
    });
  };

  const showCarouselItem = (carousel, nextIndex) => {
    const items = [...carousel.querySelectorAll(".carousel-item")];
    if (!items.length) return;

    const currentIndex = items.findIndex(item => item.classList.contains("active"));
    const safeIndex = (nextIndex + items.length) % items.length;
    items.forEach((item, index) => item.classList.toggle("active", index === safeIndex));

    const event = new CustomEvent("slid.bs.carousel", {
      detail: { from: currentIndex, to: safeIndex },
      bubbles: true
    });
    Object.defineProperty(event, "from", { value: currentIndex });
    Object.defineProperty(event, "to", { value: safeIndex });
    carousel.dispatchEvent(event);
  };

  const startCarousel = carousel => {
    const interval = Number(carousel.dataset.bsInterval || 5000);
    if (carousel.dataset.bsRide !== "carousel" || interval <= 0) return;
    window.setInterval(() => {
      const items = [...carousel.querySelectorAll(".carousel-item")];
      const currentIndex = items.findIndex(item => item.classList.contains("active"));
      showCarouselItem(carousel, currentIndex + 1);
    }, interval);
  };

  document.addEventListener("click", event => {
    const collapseButton = event.target.closest("[data-bs-toggle='collapse']");
    if (collapseButton) {
      const target = getTarget(collapseButton);
      if (target) {
        const isOpen = target.classList.toggle("show");
        collapseButton.setAttribute("aria-expanded", String(isOpen));
      }
      return;
    }

    const dropdownButton = event.target.closest("[data-bs-toggle='dropdown']");
    if (dropdownButton) {
      event.preventDefault();
      const dropdown = dropdownButton.closest(".dropdown");
      const menu = dropdown?.querySelector(".dropdown-menu");
      if (!dropdown || !menu) return;
      const shouldOpen = !dropdown.classList.contains("show");
      closeDropdowns(dropdown);
      dropdown.classList.toggle("show", shouldOpen);
      menu.classList.toggle("show", shouldOpen);
      return;
    }

    const carouselButton = event.target.closest("[data-bs-slide]");
    if (carouselButton) {
      const carousel = document.querySelector(carouselButton.dataset.bsTarget);
      if (!carousel) return;
      const items = [...carousel.querySelectorAll(".carousel-item")];
      const currentIndex = items.findIndex(item => item.classList.contains("active"));
      showCarouselItem(carousel, currentIndex + (carouselButton.dataset.bsSlide === "prev" ? -1 : 1));
      return;
    }

    closeDropdowns();
  });

  document.addEventListener("DOMContentLoaded", () => {
    document.querySelectorAll(".carousel").forEach(startCarousel);
  });
})();
