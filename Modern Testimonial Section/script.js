const createTestimonialSlider = ({
  data,
  selectors,
  autoRotateDelay = 5000
}) => {
  const state = {
    currentIndex: 0,
    autoRotateInterval: null,
    isMobile: window.innerWidth <= 768
  };

  const els = {
    track: document.querySelector(selectors.track),
    indicators: document.querySelector(selectors.indicators),
    prevBtn: document.querySelector(selectors.prevBtn),
    nextBtn: document.querySelector(selectors.nextBtn)
    // autoRotateToggle: document.querySelector(selectors.autoRotateToggle)
  };

  const renderTestimonials = () => {
    els.track.innerHTML = data
      .map(
        ({ text, name, city, image }, index) => `
            <div class="testimonial-card ${index === 0 ? "active" : ""}">
              <div class="card-inner">
                <div class="quote-icon"><i class="fas fa-quote-left"></i></div>
                <p class="testimonial-text">${text}</p>
                <div class="user-info">
                  <img src="${image}" alt="${name}" class="user-image" />
                  <div class="user-details">
                    <div class="user-name">${name}</div>
                    <div class="user-city">${city}</div>
                  </div>
                </div>
              </div>
            </div>
          `
      )
      .join("");
  };

  const renderIndicators = () => {
    els.indicators.innerHTML = data
      .map(
        (_, index) => `
            <div 
              class="indicator ${index === 0 ? "active" : ""}" 
              data-index="${index}">
            </div>
          `
      )
      .join("");
  };

  const updateSlider = () => {
    const { currentIndex, isMobile } = state;
    const cards = els.track.querySelectorAll(".testimonial-card");
    const dots = els.indicators.querySelectorAll(".indicator");

    cards.forEach((card, i) =>
      card.classList.toggle("active", i === currentIndex)
    );
    dots.forEach((dot, i) =>
      dot.classList.toggle("active", i === currentIndex)
    );

    const cardWidth = isMobile ? 100 : 100 / 3;
    els.track.style.transform = `translateX(-${currentIndex * cardWidth}%)`;
  };

  const goToSlide = index => {
    state.currentIndex = index;
    updateSlider();
    resetAutoRotation();
  };

  const showNextSlide = () => {
    state.currentIndex = (state.currentIndex + 1) % data.length;
    updateSlider();
    resetAutoRotation();
  };

  const showPrevSlide = () => {
    state.currentIndex = (state.currentIndex - 1 + data.length) % data.length;
    updateSlider();
    resetAutoRotation();
  };

  //   const startAutoRotation = () => {
  //     if (els.autoRotateToggle?.checked) {
  //       state.autoRotateInterval = setInterval(showNextSlide, autoRotateDelay);
  //     }
  //   };

  const stopAutoRotation = () => {
    clearInterval(state.autoRotateInterval);
  };

  const resetAutoRotation = () => {
    stopAutoRotation();
    // startAutoRotation();
  };

  //   const toggleAutoRotation = () => {
  //     els.autoRotateToggle?.checked ? startAutoRotation() : stopAutoRotation();
  //   };

  const handleResize = () => {
    const wasMobile = state.isMobile;
    state.isMobile = window.innerWidth <= 768;
    if (wasMobile !== state.isMobile) updateSlider();
  };

  const attachEventListeners = () => {
    els.prevBtn?.addEventListener("click", showPrevSlide);
    els.nextBtn?.addEventListener("click", showNextSlide);
    // els.autoRotateToggle?.addEventListener("change", toggleAutoRotation);
    window.addEventListener("resize", handleResize);

    // Indicator click via delegation
    els.indicators?.addEventListener("click", e => {
      const indicator = e.target.closest(".indicator");
      if (indicator) {
        goToSlide(Number(indicator.dataset.index));
      }
    });
  };

  const init = () => {
    renderTestimonials();
    renderIndicators();
    attachEventListeners();
    updateSlider();
    // startAutoRotation();
  };

  return {
    init,
    next: showNextSlide,
    prev: showPrevSlide,
    goTo: goToSlide,
    stop: stopAutoRotation
    // start: startAutoRotation
  };
};

document.addEventListener("DOMContentLoaded", () => {
  const testimonials = [
    {
      id: 1,
      text: "This service has completely transformed how I manage my business. The efficiency and user-friendly interface have saved me countless hours each week. Highly recommended!",
      name: "Sarah Johnson",
      city: "New York, NY",
      image: "https://randomuser.me/api/portraits/women/44.jpg"
    },
    {
      id: 2,
      text: "I've tried many similar platforms, but none compare to the quality and support I've received here. The team is responsive and the features are exactly what I needed.",
      name: "Michael Chen",
      city: "San Francisco, CA",
      image: "https://randomuser.me/api/portraits/men/32.jpg"
    },
    {
      id: 3,
      text: "As a small business owner, finding affordable yet powerful tools is crucial. This platform delivers on all fronts and has helped grow my customer base significantly.",
      name: "Emily Rodriguez",
      city: "Miami, FL",
      image: "https://randomuser.me/api/portraits/women/68.jpg"
    },
    {
      id: 4,
      text: "The attention to detail and customer-centric approach is remarkable. I've recommended this service to all my colleagues and they've had equally positive experiences.",
      name: "David Wilson",
      city: "Chicago, IL",
      image: "https://randomuser.me/api/portraits/men/75.jpg"
    },
    {
      id: 5,
      text: "Implementation was seamless and the results were immediate. The analytics dashboard provides insights I didn't even know I needed. A game-changer for my workflow.",
      name: "Jennifer Lee",
      city: "Seattle, WA",
      image: "https://randomuser.me/api/portraits/women/26.jpg"
    }
  ];

  const slider = createTestimonialSlider({
    data: testimonials,
    selectors: {
      track: ".testimonial-track",
      indicators: ".indicators",
      prevBtn: ".prev-btn",
      nextBtn: ".next-btn"
      //   autoRotateToggle: "#autoRotateToggle"
    },
    autoRotateDelay: 5000
  });

  slider.init();
});
