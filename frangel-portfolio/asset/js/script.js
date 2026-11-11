/* Frangel Florendo portfolio scripts (plain JavaScript, no libraries) */
(function () {
    'use strict';

    var reduceMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    var header = document.querySelector('.site-header');

    /* ---------- Footer year ---------- */
    var year = document.getElementById('year');
    if (year) year.textContent = new Date().getFullYear();

    /* ---------- Hero entrance ---------- */
    requestAnimationFrame(function () {
        requestAnimationFrame(function () {
            document.body.classList.add('is-loaded');
        });
    });

    /* ---------- Workflow animation: pause when off screen or when motion is reduced ---------- */
    var flowSvg = document.querySelector('.flow-svg');
    if (flowSvg && flowSvg.pauseAnimations) {
        if (reduceMotion) {
            flowSvg.pauseAnimations();
        } else if ('IntersectionObserver' in window) {
            new IntersectionObserver(function (entries) {
                entries.forEach(function (entry) {
                    if (entry.isIntersecting) flowSvg.unpauseAnimations();
                    else flowSvg.pauseAnimations();
                });
            }).observe(flowSvg);
        }
    }

    /* ---------- Scroll: header style, progress bar, back-to-top ring ---------- */
    var progress = document.querySelector('.progress span');
    var toTop = document.querySelector('.to-top');
    var ring = document.querySelector('.ring-fill');
    var ticking = false;

    function onScroll() {
        var y = window.scrollY;
        var max = document.documentElement.scrollHeight - window.innerHeight;
        var p = max > 0 ? Math.min(y / max, 1) : 0;

        header.classList.toggle('scrolled', y > 10);
        if (progress) progress.style.transform = 'scaleX(' + p + ')';
        if (ring) ring.style.strokeDashoffset = (132 * (1 - p)).toFixed(1);
        if (toTop) toTop.classList.toggle('show', y > 600);
        ticking = false;
    }

    window.addEventListener('scroll', function () {
        if (!ticking) {
            requestAnimationFrame(onScroll);
            ticking = true;
        }
    }, { passive: true });
    onScroll();

    /* ---------- Mobile menu ---------- */
    var burger = document.querySelector('.burger');
    var navList = document.getElementById('nav-list');

    function setMenu(open) {
        burger.setAttribute('aria-expanded', String(open));
        burger.setAttribute('aria-label', open ? 'Close menu' : 'Open menu');
        navList.classList.toggle('open', open);
        document.body.classList.toggle('menu-open', open);
        header.classList.toggle('menu-active', open);
    }

    if (burger && navList) {
        burger.addEventListener('click', function () {
            setMenu(!navList.classList.contains('open'));
        });

        navList.querySelectorAll('a').forEach(function (link) {
            link.addEventListener('click', function () { setMenu(false); });
        });

        document.addEventListener('keydown', function (e) {
            if (e.key === 'Escape' && navList.classList.contains('open')) {
                setMenu(false);
                burger.focus();
            }
        });

        window.addEventListener('resize', function () {
            if (window.innerWidth > 820 && navList.classList.contains('open')) setMenu(false);
        });
    }

    /* ---------- Highlight the nav link for the section in view ---------- */
    var navLinks = document.querySelectorAll('.nav-list a');
    var sections = document.querySelectorAll('main section[id]');

    if ('IntersectionObserver' in window) {
        var sectionObserver = new IntersectionObserver(function (entries) {
            entries.forEach(function (entry) {
                if (!entry.isIntersecting) return;
                var id = entry.target.id;
                navLinks.forEach(function (link) {
                    link.classList.toggle('active', link.getAttribute('href') === '#' + id);
                });
            });
        }, { rootMargin: '-45% 0px -50% 0px' });

        sections.forEach(function (s) { sectionObserver.observe(s); });
    }

    /* ---------- Reveal content as it scrolls into view ---------- */
    var reveals = document.querySelectorAll('.reveal');

    // Stagger items that share a parent
    var groups = new Map();
    reveals.forEach(function (el) {
        var parent = el.parentElement;
        var count = groups.get(parent) || 0;
        el.style.setProperty('--d', Math.min(count * 0.09, 0.36) + 's');
        groups.set(parent, count + 1);
    });

    if (reduceMotion || !('IntersectionObserver' in window)) {
        reveals.forEach(function (el) { el.classList.add('in'); });
    } else {
        var revealObserver = new IntersectionObserver(function (entries, obs) {
            entries.forEach(function (entry) {
                if (entry.isIntersecting) {
                    entry.target.classList.add('in');
                    obs.unobserve(entry.target);
                }
            });
        }, { threshold: 0.12, rootMargin: '0px 0px -40px 0px' });

        reveals.forEach(function (el) { revealObserver.observe(el); });
    }

    /* ---------- Contact form (sends to Formspree without leaving the page) ---------- */
    var form = document.querySelector('.contact-form');

    if (form) {
        var status = form.querySelector('.form-status');
        var button = form.querySelector('button[type="submit"]');
        var label = button.querySelector('.btn-label');
        var emailPattern = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

        function setStatus(message, type) {
            status.textContent = message;
            status.className = 'form-status' + (type ? ' ' + type : '');
        }

        form.querySelectorAll('input[required], textarea[required]').forEach(function (input) {
            input.addEventListener('input', function () {
                input.closest('.field').classList.remove('invalid');
            });
        });

        form.addEventListener('submit', async function (e) {
            e.preventDefault();

            var firstInvalid = null;
            form.querySelectorAll('input[required], textarea[required]').forEach(function (input) {
                var value = input.value.trim();
                var bad = !value || (input.type === 'email' && !emailPattern.test(value));
                input.closest('.field').classList.toggle('invalid', bad);
                if (bad && !firstInvalid) firstInvalid = input;
            });

            if (firstInvalid) {
                setStatus('Fill in every field with a valid email address, then send again.', 'error');
                firstInvalid.focus();
                return;
            }

            button.disabled = true;
            label.textContent = 'Sending...';
            setStatus('');

            try {
                var response = await fetch(form.action, {
                    method: 'POST',
                    body: new FormData(form),
                    headers: { Accept: 'application/json' }
                });

                if (response.ok) {
                    form.reset();
                    setStatus('Message sent. I\'ll reply to your email soon.', 'ok');
                } else {
                    setStatus('The message didn\'t send. Try again, or email me at frangelflorendo9@gmail.com.', 'error');
                }
            } catch (err) {
                setStatus('The message didn\'t send. Check your connection and try again.', 'error');
            } finally {
                button.disabled = false;
                label.textContent = 'Send message';
            }
        });
    }
})();
