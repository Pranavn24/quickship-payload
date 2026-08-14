      (() => {
        'use strict';
        const form = document.getElementById('quoteForm');
        if (!form) return;
        form.addEventListener('submit', (e) => {
          e.preventDefault();
          e.stopPropagation();
          form.classList.add('was-validated');
          if (form.checkValidity()) {
            const toastEl = document.getElementById('quoteToast');
            const toast = new bootstrap.Toast(toastEl, { delay: 4000 });
            toast.show();
          }
        });
      })();

      /* ---- Delhi→Mumbai rate table (same API as Bangalore) ---- */
      (() => {
        const surfaceHead = document.getElementById('dmSurfaceHead');
        const surfaceBody = document.getElementById('dmSurfaceBody');
        const airHead = document.getElementById('dmAirHead');
        const airBody = document.getElementById('dmAirBody');
        const errEl = document.getElementById('dmRateApiError');
        if (!surfaceHead || !surfaceBody || !airHead || !airBody) return;

        const DEFAULT_API_BASE = 'https://www.qshft.com/globalrest/api/website/';
        let apiBase = (typeof window.QS_API_BASE === 'string' && window.QS_API_BASE.trim())
          ? window.QS_API_BASE.trim()
          : DEFAULT_API_BASE;
        if (apiBase.slice(-1) !== '/') apiBase += '/';
        const url = apiBase + 'bangalore-rates?zone=C1';

        const esc = (v) => {
          const d = document.createElement('div');
          d.textContent = v == null ? '' : String(v);
          return d.innerHTML;
        };
        const fmtRs = (v) => {
          if (v == null || v === '' || Number.isNaN(Number(v))) return '—';
          return '₹' + Number(v).toLocaleString('en-IN');
        };

        function clampCouriers(couriers, maxCols) {
          return (Array.isArray(couriers) ? couriers : []).slice(0, maxCols);
        }

        function buildHead(couriers) {
          const cells = ['<th>Weight Slab</th>']
            .concat(couriers.map(c => '<th class="qs-th-courier">' + esc(c.label) + '</th>'))
            .concat(['<th class="qs-th-transit">Transit Days</th>']);
          return '<tr>' + cells.join('') + '</tr>';
        }

        function buildRows(couriers, rows, mode) {
          if (!Array.isArray(rows) || !rows.length) {
            return '<tr><td colspan="' + (couriers.length + 2) + '">No rates available.</td></tr>';
          }
          return rows.map((row) => {
            const rateTds = couriers.map((c) => {
              const val = row.rates ? row.rates[c.key] : null;
              const isBest = row.lowest_courier_key && row.lowest_courier_key === c.key && val !== null && val !== '';
              if (!isBest) return '<td>' + esc(fmtRs(val)) + '</td>';
              if (mode === 'air') {
                return '<td class="qs-fastest-cell">' + esc(fmtRs(val)) + ' <span class="qs-fastest-badge">Fastest</span></td>';
              }
              return '<td class="qs-best-cell">' + esc(fmtRs(val)) + ' <span class="qs-best-badge">Best</span></td>';
            }).join('');
            return '<tr><td>' + esc(row.weight_label || '') + '</td>' + rateTds + '<td class="qs-td-transit">' + esc(row.transit_days || '2–3 days') + '</td></tr>';
          }).join('');
        }

        fetch(url, { credentials: 'omit', headers: { Accept: 'application/json' } })
          .then((res) => {
            if (!res.ok) throw new Error('HTTP ' + res.status);
            return res.json();
          })
          .then((body) => {
            const data = body && body.data ? body.data : null;
            if (!data) throw new Error('Invalid response');

            const surface = data.surface || { couriers: [], rows: [] };
            const air = data.air || { couriers: [], rows: [] };

            const surfaceCouriers = clampCouriers(surface.couriers || [], 6);
            const airCouriers = clampCouriers(air.couriers || [], 6);

            surfaceHead.innerHTML = buildHead(surfaceCouriers);
            airHead.innerHTML = buildHead(airCouriers);
            surfaceBody.innerHTML = buildRows(surfaceCouriers, surface.rows || [], 'surface');
            airBody.innerHTML = buildRows(airCouriers, air.rows || [], 'air');
            if (errEl) errEl.style.display = 'none';
          })
          .catch((e) => {
            if (errEl) {
              errEl.style.display = 'block';
              errEl.textContent = 'Could not load live rates (' + e.message + '). Showing static table values.';
            }
          });
      })();

      /* ---- Courier cards (domestic-courier-cards API; keep same design) ---- */
      (() => {
        const grid = document.getElementById('dmCourierCardsGrid');
        const errEl = document.getElementById('dmCourierCardsError');
        if (!grid) return;

        const DEFAULT_API_BASE = 'https://www.qshft.com/globalrest/api/website/';
        let apiBase = (typeof window.QS_API_BASE === 'string' && window.QS_API_BASE.trim())
          ? window.QS_API_BASE.trim()
          : DEFAULT_API_BASE;
        if (apiBase.slice(-1) !== '/') apiBase += '/';

        const cfg = window.QS_COURIER_CARDS_D2M || {};
        const zone = String(cfg.zone || 'C1').toUpperCase();
        const mode = String(cfg.mode || 'SURFACE').toUpperCase();
        const limit = Number(cfg.limit || 6) || 6;
        const url = apiBase + 'domestic-courier-cards?zone=' + encodeURIComponent(zone);

        const esc = (v) => {
          const d = document.createElement('div');
          d.textContent = v == null ? '' : String(v);
          return d.innerHTML;
        };

        function badgeMeta(i) {
          const list = [
            { cls: 'qs-badge-orange', text: 'Best Value' },
            { cls: 'qs-badge-green', text: 'Reliable' },
            { cls: 'qs-badge-purple', text: 'Fastest' },
            { cls: 'qs-badge-pink', text: 'Amazon' },
            { cls: 'qs-badge-blue', text: 'Widespread' },
            { cls: 'qs-badge-orange', text: 'Affordable' }
          ];
          return list[i % list.length];
        }

        function bestForLabel(name, deliveryMode) {
          const n = String(name || '').toLowerCase();
          if (n.includes('delhivery')) return 'B2C eCommerce';
          if (n.includes('xpress')) return 'Fashion & Apparel';
          if (n.includes('blue')) return 'High-Value / Urgent';
          if (n.includes('ekart')) return 'Amazon Sellers';
          if (n.includes('dtdc')) return 'Tier-2 Reach';
          if (n.includes('shadowfax')) return 'D2C Startups';
          return String(deliveryMode || '').toUpperCase() === 'AIR' ? 'Urgent Shipments' : 'Cost-effective Shipping';
        }

        function renderCards(cards) {
          grid.innerHTML = cards.map((card, i) => {
            const badge = badgeMeta(i);
            return (
              '<div class="col">' +
                '<div class="card h-100 border qs-courier-card rounded-4">' +
                  '<div class="card-body p-4">' +
                    '<div class="d-flex justify-content-between align-items-center border-bottom pb-3 mb-3">' +
                      '<span class="fw-bold fs-6">' + esc(String(card.courier_name || '').toUpperCase()) + '</span>' +
                      '<span class="badge rounded-pill ' + badge.cls + '">' + esc(badge.text) + '</span>' +
                    '</div>' +
                    '<ul class="list-unstyled mb-0 qs-courier-list">' +
                      '<li class="d-flex justify-content-between py-2 border-bottom"><span class="text-muted">Starting Rate</span><span class="fw-semibold">' + esc(card.starting_rate_label || '—') + '</span></li>' +
                      '<li class="d-flex justify-content-between py-2 border-bottom"><span class="text-muted">Per Extra 500g</span><span class="fw-semibold">' + esc(card.per_extra_500g_label || '—') + '</span></li>' +
                      '<li class="d-flex justify-content-between py-2 border-bottom"><span class="text-muted">Transit Time</span><span class="fw-semibold">' + esc(card.transit_time || '—') + '</span></li>' +
                      '<li class="d-flex justify-content-between py-2 border-bottom"><span class="text-muted">Delivery Speed</span><span class="fw-semibold">' + esc(card.delivery_speed || '—') + '</span></li>' +
                      '<li class="d-flex justify-content-between py-2 border-bottom"><span class="text-muted">COD Charges</span><span class="fw-semibold">' + esc(card.cod_charges_label || card.cod_label || '—') + '</span></li>' +
                      '<li class="d-flex justify-content-between py-2 border-bottom"><span class="text-muted">Pincode Coverage</span><span class="fw-semibold">28,000+</span></li>' +
                      '<li class="d-flex justify-content-between py-2"><span class="text-muted">Best for</span><span class="fw-semibold text-primary">' + esc(bestForLabel(card.courier_name, card.delivery_mode)) + '</span></li>' +
                    '</ul>' +
                  '</div>' +
                '</div>' +
              '</div>'
            );
          }).join('');
        }

        fetch(url, { credentials: 'omit', headers: { Accept: 'application/json' } })
          .then((res) => {
            if (!res.ok) throw new Error('HTTP ' + res.status);
            return res.json();
          })
          .then((body) => {
            let cards = body && body.data && Array.isArray(body.data.cards) ? body.data.cards : [];
            if (!cards.length) throw new Error('No cards in response');
            if (mode !== 'ALL') {
              cards = cards.filter(c => String(c.delivery_mode || '').toUpperCase() === mode);
            }
            cards = cards.slice(0, Math.max(1, limit));
            if (!cards.length) throw new Error('No cards for selected mode');
            renderCards(cards);
            if (errEl) errEl.style.display = 'none';
          })
          .catch((e) => {
            if (errEl) {
              errEl.style.display = 'block';
              errEl.textContent = 'Could not load live courier cards (' + e.message + '). Showing static cards.';
            }
          });
      })();

      /* ---- Why QuickShift — auto-play slider (pixel-based, all screen sizes) ---- */
      (() => {
        const track    = document.getElementById('whyTrack');
        const dotsWrap = document.getElementById('whyDots');
        if (!track) return;

        const slides   = Array.from(track.children);
        const total    = slides.length;
        const GAP      = 24;
        let current    = 0;
        let dots       = [];
        let autoTimer  = null;

        function visibleCount() {
          const w = window.innerWidth;
          if (w >= 1025) return 3;
          if (w >= 640)  return 2;
          return 1;
        }

        function maxIndex() {
          return Math.max(0, total - visibleCount());
        }

        function containerWidth() {
          const outer = track.closest('.qs-why-slider-outer');
          return outer ? outer.getBoundingClientRect().width : track.parentElement.offsetWidth;
        }

        function setSlideSizes() {
          const vis = visibleCount();
          const cw  = containerWidth();
          if (cw <= 0) return;
          const sw  = (cw - GAP * (vis - 1)) / vis;
          slides.forEach((s, i) => {
            s.style.flex        = '0 0 auto';
            s.style.width       = sw + 'px';
            s.style.marginRight = (i === slides.length - 1) ? '0px' : GAP + 'px';
          });
        }

        function stepWidth() {
          return (slides[0] ? slides[0].offsetWidth : 0) + GAP;
        }

        function slideTo(idx, smooth) {
          const maxI = maxIndex();
          if (maxI === 0) { current = 0; track.style.transform = 'translateX(0)'; updateDots(); return; }
          current = ((idx % (maxI + 1)) + (maxI + 1)) % (maxI + 1);
          track.style.transition = smooth === false
            ? 'none'
            : 'transform 0.55s cubic-bezier(0.4, 0, 0.2, 1)';
          track.style.transform  = 'translateX(-' + (current * stepWidth()) + 'px)';
          updateDots();
        }

        function updateDots() {
          dots.forEach((d, i) => d.classList.toggle('active', i === current));
        }

        function stopAuto() {
          if (autoTimer) { clearInterval(autoTimer); autoTimer = null; }
        }

        function startAuto() {
          stopAuto();
          if (maxIndex() === 0) return;
          autoTimer = setInterval(() => slideTo(current + 1, true), 3000);
        }

        function buildDots() {
          dotsWrap.innerHTML = '';
          dots = [];
          current = Math.min(current, maxIndex());
          const count = maxIndex() + 1;
          for (let i = 0; i < count; i++) {
            const d = document.createElement('button');
            d.className = 'qs-why-dot' + (i === current ? ' active' : '');
            d.setAttribute('aria-label', 'Slide ' + (i + 1));
            d.addEventListener('click', () => { slideTo(i, true); stopAuto(); startAuto(); });
            dotsWrap.appendChild(d);
            dots.push(d);
          }
          slideTo(current, false);
          startAuto();
        }

        function init() {
          setSlideSizes();
          buildDots();
        }

        requestAnimationFrame(() => requestAnimationFrame(init));

        let resizeTimer;
        window.addEventListener('resize', () => {
          clearTimeout(resizeTimer);
          resizeTimer = setTimeout(() => {
            if (current > maxIndex()) current = 0;
            stopAuto();
            setSlideSizes();
            buildDots();
          }, 100);
        });
      })();
