// LOADER
window.addEventListener("load", function () {
  let loader = document.getElementById("loader");
  if (loader) {
    setTimeout(function () {
      loader.style.opacity = "0";
      setTimeout(function () {
        loader.style.display = "none";
      }, 700);
    }, 1200); // 1.2s minimum load time so people can see it
  }
});

let menuBtn = document.getElementById("menuBtn");
let closeBtn = document.getElementById("closeBtn");
let mobileMenu = document.getElementById("mobileMenu");

if(menuBtn && mobileMenu){
  menuBtn.addEventListener("click", () => {
    mobileMenu.style.right = "0";
  });
}

if(closeBtn && mobileMenu){
  closeBtn.addEventListener("click", () => {
    mobileMenu.style.right = "-100%";
  });
}

let mobileLinks = document.querySelectorAll("#mobileMenu a");
mobileLinks.forEach(link => {
  link.addEventListener("click", () => {
    if(mobileMenu) mobileMenu.style.right = "-100%";
  });
});

function showToast(message){
  let toast = document.createElement("div");
  toast.innerText = message;
  toast.className = "fixed top-24 right-6 bg-primary text-black px-6 py-4 rounded-xl font-semibold z-50 animate-fade shadow-2xl";
  document.body.appendChild(toast);
  setTimeout(() => {
    toast.style.opacity = "0";
    setTimeout(() => {toast.remove()}, 300);
  }, 2000);
}

let foods = [
  {name:"Grilled Steak", category:"main", price:"$28", image:"https://images.unsplash.com/photo-1544025162-d76694265947?auto=format&fit=crop&w=900&q=80"},
  {name:"Italian Pizza", category:"main", price:"$20", image:"https://images.unsplash.com/photo-1565299624946-b28f40a0ae38?auto=format&fit=crop&w=900&q=80"},
  {name:"Seafood Pasta", category:"main", price:"$24", image:"https://images.unsplash.com/photo-1473093295043-cdd812d0e601?auto=format&fit=crop&w=900&q=80"},
  {name:"Bruschetta", category:"starter", price:"$12", image:"https://images.unsplash.com/photo-1572695157366-5e585ab2b69f?auto=format&fit=crop&w=900&q=80"},
  {name:"Caesar Salad", category:"starter", price:"$15", image:"https://images.unsplash.com/photo-1550304943-4f24f54ddde9?auto=format&fit=crop&w=900&q=80"},
  {name:"Chocolate Cake", category:"dessert", price:"$10", image:"https://images.unsplash.com/photo-1578985545062-69928b1d9587?auto=format&fit=crop&w=900&q=80"},
  {name:"Fruit Tart", category:"dessert", price:"$12", image:"https://images.unsplash.com/photo-1565958011703-44f9829ba187?auto=format&fit=crop&w=900&q=80"}
];

let menuContainer = document.getElementById("menuContainer");
let menuBtns = document.querySelectorAll(".menu-btn");
let currentCategory = "all";

function displayMenu(foodList){
  if(!menuContainer) return;
  menuContainer.innerHTML = "";
  foodList.forEach((food, i) => {
    menuContainer.innerHTML += `
    <div class="bg-zinc-900 rounded-3xl overflow-hidden shadow-lg hover:shadow-primary/20 reveal delay-${i%3}">
      <img src="${food.image}" class="w-full h-64 sm:h-72 object-cover hover:scale-110 duration-700" alt="${food.name}">
      <div class="p-6">
        <h3 class="text-xl sm:text-2xl font-heading">${food.name}</h3>
        <p class="text-gray-400 mt-3 text-sm sm:text-base">Premium dish prepared by our chef.</p>
        <div class="flex justify-between items-center mt-6">
          <span class="text-primary text-xl sm:text-2xl font-bold">${food.price}</span>
          <button class="orderBtn bg-primary text-black px-5 py-2 rounded-full hover:scale-105 duration-300" data-name="${food.name}">Order</button>
        </div>
      </div>
    </div>`;
  });
  attachOrderEvents();
  revealOnScroll(); // re-run for new items
}

if(menuContainer){ displayMenu(foods); }

menuBtns.forEach(btn => {
  btn.addEventListener("click", () => {
    currentCategory = btn.dataset.category;
    menuBtns.forEach(b => {
      b.classList.remove("bg-primary","text-black");
      b.classList.add("border","border-primary");
    });
    btn.classList.add("bg-primary","text-black");
    btn.classList.remove("border");
    filterMenu();
  });
});

function filterMenu(){
  let filtered = foods.filter(food => {
    return currentCategory === "all" || food.category === currentCategory;
  });
  displayMenu(filtered);
}

function attachOrderEvents(){
  document.querySelectorAll(".orderBtn").forEach(btn => {
    btn.addEventListener("click", (e) => {
      showToast(`😋 YUM! ${e.target.dataset.name} is on its way!`);
    });
  });
}
attachOrderEvents();

// SCROLL REVEAL SYSTEM
function revealOnScroll() {
    const reveals = document.querySelectorAll('.reveal,.reveal-left,.reveal-right');
    reveals.forEach(el => {
        const windowHeight = window.innerHeight;
        const elementTop = el.getBoundingClientRect().top;
        if (elementTop < windowHeight - 80) {
            el.classList.add('active');
        }
    });
}
window.addEventListener('scroll', revealOnScroll);
window.addEventListener('load', revealOnScroll);

// 3D CARD TILT EFFECT - PRO ADDITION
document.addEventListener('mousemove', e => {
    document.querySelectorAll('.bg-zinc-900.rounded-2xl,.bg-zinc-900.rounded-3xl').forEach(card => {
        const rect = card.getBoundingClientRect();
        if(e.clientX > rect.left && e.clientX < rect.right && e.clientY > rect.top && e.clientY < rect.bottom){
            const x = e.clientX - rect.left;
            const y = e.clientY - rect.top;
            const centerX = rect.width / 2;
            const centerY = rect.height / 2;
            const rotateX = (y - centerY) / 20;
            const rotateY = (centerX - x) / 20;
            card.style.transform = `perspective(1000px) rotateX(${rotateX}deg) rotateY(${rotateY}deg) translateY(-8px)`;
        } else {
            card.style.transform = 'perspective(1000px) rotateX(0) rotateY(0) translateY(0)';
        }
    });
});

let counters = document.querySelectorAll(".counter");
let counterStarted = false;
let counterObserver = new IntersectionObserver((entries) => {
  entries.forEach(entry => {
    if(entry.isIntersecting &&!counterStarted){
      counters.forEach(counter => {
        let target = Number(counter.dataset.target);
        let count = 0;
        let speed = target / 120;
        let update = () => {
          count += speed;
          if(count < target){
            counter.innerText = Math.floor(count).toLocaleString();
            requestAnimationFrame(update);
          } else {
            counter.innerText = target.toLocaleString();
          }
        };
        update();
      });
      counterStarted = true;
    }
  });
});
if(counters.length){ counterObserver.observe(counters[0]); }

let reviews = [
  {name:"Sarah Johnson", review:"The food was absolutely amazing. RoyalTaste gave us a 5 star dining experience.", role:"Food Blogger"},
  {name:"Michael Davis", review:"Best steak I have ever tasted. The atmosphere is perfect for special occasions.", role:"Business Owner"},
  {name:"Emily Carter", review:"Exceptional service and delicious meals. Will definitely come back again.", role:"Regular Customer"}
];

let reviewContainer = document.getElementById("reviewContainer");
if(reviewContainer){
  reviews.forEach((r, i) => {
    reviewContainer.innerHTML += `
    <div class="bg-zinc-900 rounded-3xl p-8 reveal delay-${i}">
      <div class="flex gap-1 text-primary text-xl">★ ★ ★ ★ ★</div>
      <p class="text-gray-300 mt-6 leading-8 text-sm sm:text-base">"${r.review}"</p>
      <h3 class="font-heading text-xl mt-6">${r.name}</h3>
      <p class="text-gray-500 text-sm">${r.role}</p>
    </div>`;
  });
}

let reservationForm = document.querySelector("#reservation form");
if(reservationForm){
  reservationForm.addEventListener("submit", (e) => {
    e.preventDefault();
    showToast("✅ Table reserved successfully!");
    reservationForm.reset();
  });
}

let contactForm = document.querySelector("#contact form");
if(contactForm){
  contactForm.addEventListener("submit", (e) => {
    e.preventDefault();
    showToast("📩 Message sent. We will reply soon!");
    contactForm.reset();
  });
}

let newsletterBtn = document.querySelector("section.bg-primary button");
if(newsletterBtn){
  newsletterBtn.addEventListener("click", (e) => {
    e.preventDefault();
    let input = newsletterBtn.previousElementSibling;
    if(input && input.value){
      showToast("🎉 Subscribed to newsletter!");
      input.value = "";
    }
  });
}

let storyBtn = document.querySelector("#chef button");
let storySection = document.getElementById("story");
let homeSection = document.getElementById("home");
let backHome = document.getElementById("backHome");

if(storyBtn && storySection){
  storyBtn.addEventListener("click", () => {
    document.querySelectorAll("section:not(#story), nav, footer").forEach(s => s.classList.add("hidden"));
    storySection.classList.remove("hidden");
    window.scrollTo({top:0, behavior:"smooth"});
  });
}

if(backHome && storySection){
  backHome.addEventListener("click", () => {
    storySection.classList.add("hidden");
    document.querySelectorAll("section:not(#story), nav, footer").forEach(s => s.classList.remove("hidden"));
    homeSection.scrollIntoView({behavior:"smooth"});
  });
}

document.querySelectorAll('a[href^="#"]').forEach(link => {
  link.addEventListener("click", (e) => {
    let target = document.querySelector(link.getAttribute("href"));
    if(target){
      e.preventDefault();
      target.scrollIntoView({behavior:"smooth"});
    }
  });
});



// GALLERY LIGHTBOX
let galleryImgs = document.querySelectorAll('.gallery-img');
let lightbox = document.getElementById('lightbox');
let lightboxImg = document.getElementById('lightboxImg');
let closeLightbox = document.getElementById('closeLightbox');

galleryImgs.forEach(img => {
    img.addEventListener('click', () => {
        if(lightbox && lightboxImg){
            lightboxImg.src = img.src;
            lightbox.classList.remove('hidden');
            lightbox.classList.add('flex');
        }
    });
});
if(closeLightbox){
    closeLightbox.addEventListener('click', () => {
        lightbox.classList.add('hidden');
        lightbox.classList.remove('flex');
    });
}

// EVENT FORM
let eventForm = document.getElementById('eventForm');
if(eventForm){
    eventForm.addEventListener('submit', (e) => {
        e.preventDefault();
        showToast("✅ Event request sent! We will contact you within 24hrs.");
        eventForm.reset();
    });
}