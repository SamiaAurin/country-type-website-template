'use strict';

let globalScript = {
  init: function () {
    this.headerScroll();
    this.socialLinkShare();
    this.setDynamicYear();
    this.imageCarousel();
    this.viewAvailabilityText();
  },
  headerScroll: function () {
    window.onscroll = function () {
      if (document.body.scrollTop > 0 || document.documentElement.scrollTop > 0) {
        document.getElementById("header")?.classList?.add("scrolling");
      } else {
        document.getElementById("header")?.classList?.remove("scrolling");
      }
    };
  },
  socialLinkShare: function () {
    const fbLinks = document.querySelectorAll('.js-share-facebook');
    const xLinks = document.querySelectorAll('.js-share-twitter');
    const whatsAppLinks = document.querySelectorAll('.js-share-whatsapp');
    const copyLinks = document.querySelectorAll('.js-copy-current-url');
    const mailTos = document.querySelectorAll(".js-share-mail");
    fbLinks?.forEach(fbLink => {
      fbLink?.addEventListener("click", () => {
        window.open(
          `https://www.facebook.com/sharer/sharer.php?u=${window.location.href}`,
          "_blank"
        );
      });
    });
    xLinks?.forEach(xLink => {
      xLink?.addEventListener("click", () => {
        window.open(
          `https://twitter.com/share?url=${window.location.href}`,
          "_blank"
        );
      });
    });
    whatsAppLinks?.forEach(whatsAppLink => {
      whatsAppLink?.addEventListener("click", () => {
        window.open(
          `https://api.whatsapp.com/send?text=${encodeURIComponent(
            window.location.href
          )}`,
          "_blank"
        );
      });
    });
    copyLinks?.forEach(copyLink => {
      copyLink?.addEventListener("click", () => {
        navigator.clipboard
          .writeText(window.location.href)
          .then(() => {
            const alert = document.createElement("div");
            alert.className = 'cus-alert';
            alert.innerHTML = 'Link copied to clipboard!';
            alert.style.backgroundColor = '#4caf50';
            alert.style.color = 'white';
            alert.style.textAlign = 'center';
            alert.style.borderRadius = '5px';
            alert.style.padding = '10px';
            alert.style.position = 'fixed';
            alert.style.top = '20px';
            alert.style.left = '50%';
            alert.style.transform = 'translateX(-50%)';
            alert.style.zIndex = '1000';
            document.body.append(alert);
            setTimeout(() => {
              alert.remove();
            }, 2000);
          })
          .catch((err) => {
            console.error("Failed to copy: ", err);
          });
      });
    });
    mailTos?.forEach(mailTo => {
      mailTo?.addEventListener("click", () => {
        window.open(
          `mailto:?subject=I wanted you to see this site&amp;body=Check out this site ${window.location.href}`
        );
      });
    });
  },
  setDynamicYear: function () {
    const yearElement = document.querySelector('#current_year');
    if (yearElement) {
      yearElement.textContent = new Date().getFullYear();
    }
  },
  imageCarousel: function () {
    const container = document.querySelector('.features_images');
    const items = document.querySelectorAll('.features_image');
    const indicators = document.querySelector('.car_dots');

    let currentIndex = 0;
    let startX = 0;
    let currentX = 0;
    let isDragging = false;
    let startTime = 0;
    let isAnimating = false;

    if (!container || items.length === 0 || !indicators) return;

    // Create indicators
    items.forEach((_, index) => {
      const dot = document.createElement('button');
      dot.classList.add('car_dot');
      dot.setAttribute('aria-label', `Go to slide ${index + 1}`);
      if (index === 0) {
        dot.classList.add('active');
        dot.setAttribute('aria-current', 'true');
      }
      dot.addEventListener('click', () => goToSlide(index));
      indicators.appendChild(dot);
    });

    function updateIndicators() {
      document.querySelectorAll('.car_dot').forEach((dot, index) => {
        dot.classList.toggle('active', index === currentIndex);
        dot.setAttribute('aria-current', index === currentIndex);
      });
    }

    function goToSlide(index, smooth = true) {
      if (window.innerWidth > 768 || isAnimating) return;

      isAnimating = true;
      currentIndex = Math.max(0, Math.min(index, items.length - 1));

      items.forEach(item => {
        item.style.transition = smooth ? 'transform 0.3s ease' : 'none';
        item.style.transform = `translateX(-${currentIndex * 100}%)`;
      });

      updateIndicators();

      setTimeout(() => {
        isAnimating = false;
      }, smooth ? 300 : 0);
    }

    function handleTouchStart(e) {
      if (window.innerWidth > 768) return;
      isDragging = true;
      startX = e.touches[0].clientX;
      currentX = startX;
      startTime = Date.now();

      items.forEach(item => {
        item.style.transition = 'none';
      });
    }

    function handleTouchMove(e) {
      if (!isDragging) return;
      e.preventDefault();
      currentX = e.touches[0].clientX;
      const diff = (startX - currentX);
      let transform = -currentIndex * 100 - (diff / container.offsetWidth) * 100;

      // Add resistance at the edges
      if ((currentIndex === 0 && diff < 0) ||
        (currentIndex === items.length - 1 && diff > 0)) {
        transform = -currentIndex * 100 - (diff / container.offsetWidth) * 50;
      }

      items.forEach(item => {
        item.style.transform = `translateX(${transform}%)`;
      });
    }

    function handleTouchEnd() {
      if (!isDragging) return;
      isDragging = false;

      const diff = startX - currentX;
      const timeDiff = Date.now() - startTime;
      const velocity = Math.abs(diff / timeDiff);

      if (Math.abs(diff) > 50 || velocity > 0.5) {
        if (diff > 0 && currentIndex < items.length - 1) {
          currentIndex++;
        } else if (diff < 0 && currentIndex > 0) {
          currentIndex--;
        }
      }

      goToSlide(currentIndex);
    }

    // Touch events
    container.addEventListener('touchstart', handleTouchStart, { passive: false });
    container.addEventListener('touchmove', handleTouchMove, { passive: false });
    container.addEventListener('touchend', handleTouchEnd);

    // Prevent default touch behavior to avoid scroll interference
    container.addEventListener('touchmove', (e) => {
      if (isDragging) e.preventDefault();
    }, { passive: false });

    // Handle window resize
    window.addEventListener('resize', () => {
      if (window.innerWidth > 992) {
        items.forEach(item => {
          item.style.transform = '';
          item.style.transition = '';
        });
      } else {
        goToSlide(currentIndex, false);
      }
    });
  },
  viewAvailabilityText: function () {
    const replacements = [
      { id: "recently_booked_properties", text: "EXPLORE" },
      { id: "tab_tiles_section", text: "RESERVE" },
      { id: "trending_stays_section", text: "RESERVE" }
    ];

    replacements.forEach(({ id, text }) => {
      const element = document.getElementById(id);
      if (element) {
        const walk = document.createTreeWalker(
          element,
          NodeFilter.SHOW_TEXT,
          null,
          false
        );
        let node;
        while (node = walk.nextNode()) {
          node.textContent = node.textContent.replace(/View Availability/g, text);
        }
      }
    });
  },

};

globalScript.init();
