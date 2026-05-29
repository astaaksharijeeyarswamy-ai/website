document.addEventListener('DOMContentLoaded', () => {

    /* ═══════════════════════════════════════════════════════ LOADER & INITIALIZATION */
    const initApp = () => {
        gsap.to('#loaderBar', { width: '100%', duration: 1.5, ease: 'power2.inOut' });
        setTimeout(() => {
            gsap.to('#loader', { opacity: 0, duration: 0.8, onComplete: () => {
                document.getElementById('loader').style.display = 'none';
                initGSAP();
                initCanvas();
                initSlideshow();
            }});
        }, 1800);
    };

    /* ═══════════════════════════════════════════════════════ SLIDESHOW */
    const initSlideshow = () => {
        const slides = document.querySelectorAll('#heroSlideshow .slide');
        if(!slides.length) return;
        let current = 0;
        setInterval(() => {
            slides[current].classList.remove('active');
            current = (current + 1) % slides.length;
            slides[current].classList.add('active');
        }, 6000);
    };

    /* ═══════════════════════════════════════════════════════ GSAP ANIMATIONS */
    gsap.registerPlugin(ScrollTrigger);

    const initGSAP = () => {
        // Navbar Scrolled Effect
        ScrollTrigger.create({
            start: 'top -50',
            onUpdate: (self) => {
                const nav = document.getElementById('navbar');
                if (self.direction === 1 || window.scrollY > 50) {
                    nav.classList.add('scrolled');
                } else {
                    nav.classList.remove('scrolled');
                }
            }
        });

        // Reveal Elements
        const utils = gsap.utils.toArray;
        
        utils('.reveal-up').forEach(el => {
            let delay = el.style.getPropertyValue('--d') || 0;
            gsap.to(el, { scrollTrigger: { trigger: el, start: "top 85%" }, y: 0, opacity: 1, duration: 0.8, delay: parseFloat(delay), ease: "power3.out" });
        });

        utils('.reveal-left').forEach(el => {
            gsap.to(el, { scrollTrigger: { trigger: el, start: "top 85%" }, x: 0, opacity: 1, duration: 0.8, ease: "power3.out" });
        });

        utils('.reveal-right').forEach(el => {
            gsap.to(el, { scrollTrigger: { trigger: el, start: "top 85%" }, x: 0, opacity: 1, duration: 0.8, ease: "power3.out" });
        });

        // Fundraiser Progress Bar Animation
        ScrollTrigger.create({
            trigger: '.fundraiser-section',
            start: "top 70%",
            onEnter: () => {
                const fill = document.getElementById('progressFill');
                const pct = document.getElementById('progressPct');
                // Target is ₹2,50,000 out of ₹5,00,000 (50%)
                const targetVal = 250000; 
                fill.style.width = '50%';
                
                // Animate Numbers
                gsap.to({ val: 0 }, {
                    val: 50, duration: 2, ease: "power2.out",
                    onUpdate: function() { pct.innerText = Math.round(this.targets()[0].val) + '%'; }
                });

                const raisedDisplay = document.getElementById('raisedDisplay');
                gsap.to({ val: 0 }, {
                    val: targetVal, duration: 2, ease: "power2.out",
                    onUpdate: function() { raisedDisplay.innerText = '₹' + Math.round(this.targets()[0].val).toLocaleString('en-IN'); }
                });

                const donorDisplay = document.getElementById('donorCountDisplay');
                gsap.to({ val: 0 }, {
                    val: 350, duration: 2, ease: "power2.out",
                    onUpdate: function() { donorDisplay.innerText = Math.round(this.targets()[0].val) + '+'; }
                });
            },
            once: true
        });
    };

    /* ═══════════════════════════════════════════════════════ COUNTDOWN TIMER */
    const eventDate = new Date('April 19, 2026 09:00:00').getTime();
    
    const updateCountdown = () => {
        const now = new Date().getTime();
        const distance = eventDate - now;

        if (distance < 0) {
            document.getElementById('cDays').innerText = "00";
            document.getElementById('cHours').innerText = "00";
            document.getElementById('cMins').innerText = "00";
            document.getElementById('cSecs').innerText = "00";
            return;
        }

        const days = Math.floor(distance / (1000 * 60 * 60 * 24));
        const hours = Math.floor((distance % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));
        const minutes = Math.floor((distance % (1000 * 60 * 60)) / (1000 * 60));
        const seconds = Math.floor((distance % (1000 * 60)) / 1000);

        // Big timer
        if(document.getElementById('cDays')) {
            document.getElementById('cDays').innerText = days.toString().padStart(2, '0');
            document.getElementById('cHours').innerText = hours.toString().padStart(2, '0');
            document.getElementById('cMins').innerText = minutes.toString().padStart(2, '0');
            document.getElementById('cSecs').innerText = seconds.toString().padStart(2, '0');
        }

        // Small bar timer
        if(document.getElementById('barD')) {
            document.getElementById('barD').innerText = days;
            document.getElementById('barH').innerText = hours;
            document.getElementById('barM').innerText = minutes;
        }
    };
    setInterval(updateCountdown, 1000);
    updateCountdown();

    /* ═══════════════════════════════════════════════════════ BACKGROUND PARTICLES */
    const initCanvas = () => {
        const canvas = document.getElementById('particleCanvas');
        if(!canvas) return;
        const ctx = canvas.getContext('2d');
        let width, height;
        let particles = [];

        const resize = () => {
            width = canvas.width = window.innerWidth;
            height = canvas.height = document.getElementById('hero').offsetHeight;
        };
        window.addEventListener('resize', resize);
        resize();

        const isMobile = window.innerWidth <= 768;
        const particleCount = isMobile ? 25 : 50;

        for (let i = 0; i < particleCount; i++) {
            particles.push({
                x: Math.random() * width,
                y: Math.random() * height,
                r: Math.random() * 2 + 0.5,
                dx: (Math.random() - 0.5) * 0.5,
                dy: (Math.random() - 0.5) * 0.5,
                opacity: Math.random() * 0.5 + 0.2
            });
        }

        const draw = () => {
            ctx.clearRect(0, 0, width, height);
            particles.forEach(p => {
                ctx.beginPath();
                ctx.arc(p.x, p.y, p.r, 0, Math.PI * 2);
                ctx.fillStyle = `rgba(255, 213, 79, ${p.opacity})`;
                ctx.fill();
                
                p.x += p.dx;
                p.y -= p.dy;
                
                if (p.x < 0 || p.x > width) p.dx = -p.dx;
                if (p.y < 0) p.y = height;
                if (p.y > height) p.y = 0;
            });
            requestAnimationFrame(draw);
        };
        draw();
    };

    /* ═══════════════════════════════════════════════════════ EVENT LISTENERS */
    
    // Lightbox Setup
    const galleryItems = document.querySelectorAll('.g-item');
    galleryItems.forEach(item => {
        item.addEventListener('click', () => {
            const idx = parseInt(item.getAttribute('data-index'));
            openLightbox(idx);
        });
    });

    // Scroll Depth Trigger (Better than exit-intent for mobile)
    let exitShown = false;
    window.addEventListener('scroll', () => {
        if(!exitShown && window.scrollY > (document.body.scrollHeight * 0.75)) {
            exitShown = true;
            document.getElementById('exitPopup').classList.add('active');
        }
    });

    // Close mobile menu on tap outside
    document.addEventListener('click', (e) => {
        const menu = document.getElementById('mobileMenu');
        const hamburger = document.getElementById('hamburgerBtn');
        if(menu && menu.classList.contains('active') && !menu.contains(e.target) && !hamburger.contains(e.target)) {
            closeMobileMenu();
        }
    });

    // Smooth scroll offset for fixed navbar
    document.querySelectorAll('a[href^="#"]').forEach(anchor => {
        anchor.addEventListener('click', function (e) {
            e.preventDefault();
            const targetId = this.getAttribute('href');
            if(targetId === '#') return;
            const targetEl = document.querySelector(targetId);
            if(targetEl) {
                const headerOffset = 80;
                const elementPosition = targetEl.getBoundingClientRect().top;
                const offsetPosition = elementPosition + window.pageYOffset - headerOffset;
                window.scrollTo({ top: offsetPosition, behavior: "smooth" });
            }
        });
    });

    initApp();
});


/* ═══════════════════════════════════════════════════════ GLOBAL FUNCTIONS ══════════════════════ */

/* BILINGUAL TOGGLE */
let currentLang = 'en';
function toggleLang() {
    const btn = document.getElementById('langBtn');
    const enEls = document.querySelectorAll('.en');
    const teEls = document.querySelectorAll('.te');
    
    if (currentLang === 'en') {
        enEls.forEach(el => el.classList.add('hidden'));
        teEls.forEach(el => el.classList.remove('hidden'));
        btn.innerText = 'English';
        currentLang = 'te';
    } else {
        teEls.forEach(el => el.classList.add('hidden'));
        enEls.forEach(el => el.classList.remove('hidden'));
        btn.innerText = 'తెలుగు';
        currentLang = 'en';
    }
}

/* MOBILE MENU */
function toggleMobileMenu() {
    document.getElementById('mobileMenu').classList.toggle('active');
}
function closeMobileMenu() {
    document.getElementById('mobileMenu').classList.remove('active');
}

/* AUDIO TOGGLE (Placeholder) */
let isMuted = true;
let bgAudio = new Audio(''); // Provide real source here later
bgAudio.loop = true;

function toggleAudio() {
    const btn = document.getElementById('audioBtn');
    if(isMuted) {
        // bgAudio.play().catch(e => console.log('Audio needs user interaction'));
        btn.classList.remove('muted');
        isMuted = false;
        btn.innerHTML = '<i class="fas fa-volume-up"></i>';
    } else {
        // bgAudio.pause();
        btn.classList.add('muted');
        isMuted = true;
        btn.innerHTML = '<i class="fas fa-volume-mute"></i>';
    }
}

/* IMPACT CALCULATOR */
function updateImpact(val) {
    const amtLabel = document.getElementById('impactVal');
    const impactText = document.getElementById('impactText');
    const emoji = document.querySelector('.impact-emoji');
    
    amtLabel.innerText = parseInt(val).toLocaleString('en-IN');
    
    if (val < 5000) {
        emoji.innerText = '🌸';
        impactText.innerText = currentLang === 'en' ? 
            `Sponsors Pushpa Kainkaryam and daily deeparadhana.` : 
            `పుష్ప కైంకర్యం మరియు దీపారాధనకు అవసరమవుతుంది.`;
    } else if (val < 10000) {
        let devotees = Math.floor(val / 100);
        emoji.innerText = '🍛';
        impactText.innerText = currentLang === 'en' ? 
            `Sponsors meals for ${devotees} devotees for one full day through Annadanam.` : 
            `${devotees} భక్తులకు ఒక రోజు అన్నదానం.`;
    } else if (val < 25000) {
        emoji.innerText = '📚';
        impactText.innerText = currentLang === 'en' ? 
            `Supports a Vedic student's complete education and living expenses for months.` : 
            `ఒక వేద విద్యార్థి పరిపూర్ణ విద్యాభ్యాసానికి మద్దతు.`;
    } else {
        emoji.innerText = '🔥';
        impactText.innerText = currentLang === 'en' ? 
            `Provides critical support for the 108 Homa Gundas at the Ullipallem Ashtakshari Yagnam.` : 
            `ఉల్లిపాలెం అష్టాక్షరి మహా యజ్ఞంలో 108 హోమ గుండాలకు ప్రత్యేక మద్దతు.`;
    }
}
function donateImpact() {
    const amt = document.getElementById('impactSlider').value;
    setModalAmt(amt);
    openDonateModal();
}

/* LIGHTBOX LOGIC */
let currentLbIndex = 0;
const lbData = [
    { src: 'https://drive.google.com/uc?export=view&id=1_sMwGbm_-wUJPODoatheNlwtLeknq4kQ', cap: 'Official Thiru Nakshtram Poster' },
    { src: 'https://drive.google.com/uc?export=view&id=1acKGoi72iXDf-jvisgFCcnruiptA6QwO', cap: 'Press Conference — Pamphlet Release' },
    { src: 'https://drive.google.com/uc?export=view&id=1xFZADampFKRkpoH5fo4dJFJf8zvh0HIV', cap: 'Swami with Tirumala Jiyar Swamis' },
    { src: 'https://drive.google.com/uc?export=view&id=1XzFQz_VvgEWcFarrmxmXr1prMEJswf5W', cap: 'Bhikshatana — Agirippalli' },
    { src: 'https://drive.google.com/uc?export=view&id=1oG5UWhlDiSkpHGgN-kTCuLp2_9jknvl1', cap: 'Sacred Procession' },
    { src: 'https://drive.google.com/uc?export=view&id=1Wu3IWLIYKCZMsron-9DYmCfV5qRxnf4V', cap: 'Procession with Nadaswaram' },
    { src: 'https://drive.google.com/uc?export=view&id=1L3t6oi14TfcUejjTEEvUct-2KV2lXwnP', cap: 'Devotees in Procession' },
    { src: 'https://drive.google.com/uc?export=view&id=1ygcg4dLsKbPLhbthMgwijcv65_M5pxsD', cap: 'Bhikshatana Blessings' }
];

function openLightbox(idx) {
    currentLbIndex = idx;
    updateLightboxImg();
    document.getElementById('lightbox').classList.add('active');
}
function closeLightbox() {
    document.getElementById('lightbox').classList.remove('active');
    setTimeout(() => { document.getElementById('lbImg').src = ''; }, 300);
}
function lightboxNav(dir) {
    currentLbIndex += dir;
    if(currentLbIndex < 0) currentLbIndex = lbData.length - 1;
    if(currentLbIndex >= lbData.length) currentLbIndex = 0;
    
    // Quick fade effect
    const img = document.getElementById('lbImg');
    img.style.opacity = 0;
    setTimeout(() => { updateLightboxImg(); img.style.opacity = 1; }, 200);
}
function updateLightboxImg() {
    document.getElementById('lbImg').src = lbData[currentLbIndex].src;
    document.getElementById('lbCap').innerText = lbData[currentLbIndex].cap;
}

/* MODALS (Donate, Thank you, Exit) */
function openDonateModal() {
    document.getElementById('donateModal').classList.add('active');
    closeMobileMenu();
}
function closeDonateModal() {
    document.getElementById('donateModal').classList.remove('active');
}
function modalOverlayClick(e) {
    if(e.target.id === 'donateModal') closeDonateModal();
}

function selectTier(amt) {
    setModalAmt(amt);
    openDonateModal();
}
function openCustomDonate() {
    const amt = document.getElementById('customAmt').value;
    if(amt >= 100) {
        setModalAmt(amt);
        openDonateModal();
    } else {
        showToast(currentLang==='en' ? 'Please enter a valid amount (Minimum ₹100)' : 'దయచేసి సరైన మొత్తం నమోదు చేయండి', true);
    }
}
function setCustom(amt) {
    document.getElementById('customAmt').value = amt;
    openCustomDonate();
}
function setModalAmt(amt) {
    document.getElementById('modalAmtInput').value = amt;
    document.querySelectorAll('.m-amt').forEach(btn => {
        if(btn.innerText.replace(/\D/g, '') == amt) {
            btn.classList.add('selected');
        } else {
            btn.classList.remove('selected');
        }
    });
}
function confirmDonation() {
    closeDonateModal();
    closeExitPopup();
    setTimeout(() => {
        document.getElementById('thankYouPopup').classList.add('active');
    }, 400);
}

function closeExitPopup() { document.getElementById('exitPopup').classList.remove('active'); }
function exitDonate(amt) { setModalAmt(amt); closeExitPopup(); setTimeout(() => openDonateModal(), 400); }
function proceedExit() { exitDonate(5116); }

function closeThankYou() { document.getElementById('thankYouPopup').classList.remove('active'); }

/* PAYMENT TABS */
function switchTab(btn, contentId) {
    document.querySelectorAll('.pay-tab').forEach(t => t.classList.remove('active'));
    document.querySelectorAll('.pay-content').forEach(c => c.classList.add('hidden'));
    btn.classList.add('active');
    document.getElementById(contentId).classList.remove('hidden');
}

/* UTILS */
function showToast(msg, isError = false) {
    const container = document.getElementById('toastContainer');
    if(!container) return;
    const toast = document.createElement('div');
    toast.className = `toast ${isError ? 'toast-err' : ''}`;
    toast.innerHTML = `<i class="fas ${isError ? 'fa-exclamation-circle' : 'fa-check-circle'}"></i> <span>${msg}</span>`;
    container.appendChild(toast);
    
    setTimeout(() => {
        toast.classList.add('hide');
        setTimeout(() => toast.remove(), 300);
    }, 4000);
}

function copyField(id) {
    const text = document.getElementById(id).innerText;
    navigator.clipboard.writeText(text).then(() => {
        showToast(currentLang==='en' ? "Copied to clipboard!" : "కాపీ చేయబడింది!");
    });
}

function submitVolunteer(e) {
    e.preventDefault(); showToast("Registration successful! Swami's team will contact you."); e.target.reset();
}
function submitRSVP(e) {
    e.preventDefault(); 
    showToast(currentLang==='en' ? "Thank you! Your RSVP for the Mahayagnam has been recorded." : "ధన్యవాదాలు! మీ హాజరు నమోదు చేయబడింది."); 
    e.target.reset();
}
function submitNewsletter(e) {
    e.preventDefault(); showToast("Successfully subscribed to Swami's updates."); e.target.reset();
}
function downloadCertificate() {
    showToast("Certificate downloaded successfully!");
}
function shareWhatsApp() {
    const msg = currentLang==='en' ? 
        "I just supported the sacred Ullipallem Ashtakshari Yagnam guided by Sri Sri Sri Tridandi Ashtakshari Sampat Kumar Ramanuja Jiyar Swami. Join the cause!" :
        "నేను శ్రీ శ్రీ శ్రీ అష్టక్షరీ సంపత్కుమార రామానుజ జీయర్ స్వామి వారి మహా యజ్ఞానికి దానం చేశాను. మీరు కూడా భాగస్వాములవ్వండి!";
    window.open(`https://wa.me/?text=${encodeURIComponent(msg)}`, '_blank');
}
