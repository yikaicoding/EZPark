// ==========================================================================
// 1. REUSABLE BRAND LOGO ELEMENT
// ==========================================================================
class EzParkLogo extends HTMLElement {
    connectedCallback() {
        this.innerHTML = `
            <div class="logo-fallback">
                <div class="logo-icon-placeholder">
                    <img src="assets/ezpark logo.png" alt="EZPARK Icon">
                </div>
                <span class="ez">EZ</span><span class="park">PARK</span>
            </div>
        `;
    }
}
customElements.define('ezpark-logo', EzParkLogo);


// ==========================================================================
// 2. REUSABLE UNIVERSAL NAVIGATION SIDEBAR
// Supports attributes: role="student|admin" and active="link-identifier"
// ==========================================================================
class EzParkSidebar extends HTMLElement {
    connectedCallback() {
        const role = this.getAttribute('role') || 'student';
        const activeLink = this.getAttribute('active') || '';

        let menuLinksHTML = '';

        if (role === 'admin') {
            menuLinksHTML = `
                <li class="nav-item ${activeLink === 'overview' ? 'active' : ''}">
                    <a href="dashboard.html">Overview Hub</a>
                </li>
                <li class="nav-item ${activeLink === 'bays' ? 'active' : ''}">
                    <a href="#">Bay Configurations</a>
                </li>
                <li class="nav-item ${activeLink === 'users' ? 'active' : ''}">
                    <a href="#">User Permissions</a>
                </li>
                <li class="nav-item ${activeLink === 'reports' ? 'active' : ''}">
                    <a href="#">Analytics Reports</a>
                </li>
            `;
        } else {
            menuLinksHTML = `
                <li class="nav-item ${activeLink === 'find' ? 'active' : ''}">
                    <a href="user.html">Find Parking</a>
                </li>
                <li class="nav-item ${activeLink === 'reservations' ? 'active' : ''}">
                    <a href="#">My Reservations</a>
                </li>
                <li class="nav-item ${activeLink === 'history' ? 'active' : ''}">
                    <a href="#">Parking History</a>
                </li>
                <li class="nav-item ${activeLink === 'account' ? 'active' : ''}">
                    <a href="#">My Account</a>
                </li>
            `;
        }

        this.innerHTML = `
            <aside class="responsive-sidebar" id="sidebarMenu">
                <div class="brand-container hide-on-mobile">
                    <ezpark-logo></ezpark-logo>
                </div>

                <ul class="nav-links">
                    ${menuLinksHTML}
                </ul>

                <div class="sidebar-footer">
                    <a href="index.html" class="nav-logout">
                        <span>←</span> Leave Portal
                    </a>
                </div>
            </aside>
        `;
    }
}
customElements.define('ezpark-sidebar', EzParkSidebar);


// ==========================================================================
// 3. REUSABLE GLOBAL MOBILE HEADER & NAVIGATION DRAWER
// Automatically hooks up click bindings to any active ezpark-sidebar
// ==========================================================================
class EzParkMobileHeader extends HTMLElement {
    connectedCallback() {
        this.innerHTML = `
            <div class="mobile-nav-header">
                <ezpark-logo></ezpark-logo>
                <button class="menu-toggle-btn" id="menuToggleBtn">
                    <span></span>
                    <span></span>
                    <span></span>
                </button>
            </div>
        `;

        setTimeout(() => {
            const toggleBtn = this.querySelector('#menuToggleBtn');
            const sidebar = document.querySelector('#sidebarMenu');
            
            if (toggleBtn && sidebar) {
                toggleBtn.addEventListener('click', () => {
                    sidebar.classList.toggle('open');
                    toggleBtn.classList.toggle('active');
                });
            }
        }, 50);
    }
}
customElements.define('ezpark-mobile-header', EzParkMobileHeader);


// ==========================================================================
// 4. REUSABLE 7-DAY ROLLING CALENDAR ENGINE
// Handles date math logic and horizontal swiping layouts natively
// ==========================================================================
class EzParkCalendar extends HTMLElement {
    connectedCallback() {
        this.innerHTML = `
            <div class="date-selection-zone">
                <span class="control-label">Select Booking Date</span>
                <div class="date-carousel">
                    <button class="carousel-arrow" id="compPrevDateBtn">‹</button>
                    <div class="date-cards-wrapper" id="compDateCardsWrapper"></div>
                    <button class="carousel-arrow" id="compNextDateBtn">›</button>
                </div>
            </div>
        `;

        const wrapper = this.querySelector('#compDateCardsWrapper');
        const prevBtn = this.querySelector('#compPrevDateBtn');
        const nextBtn = this.querySelector('#compNextDateBtn');

        const dayNames = ["SUN", "MON", "TUE", "WED", "THU", "FRI", "SAT"];
        const monthNames = ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"];

        let today = new Date();
        
        for (let i = 0; i < 7; i++) {
            let futureDate = new Date();
            futureDate.setDate(today.getDate() + i);
            
            let dayNum = futureDate.getDate();
            let dayName = dayNames[futureDate.getDay()];
            let monthName = monthNames[futureDate.getMonth()];
            
            const card = document.createElement('div');
            card.classList.add('date-card');
            if (i === 0) card.classList.add('active'); 
            
            card.innerHTML = `
                <span class="date-num">${dayNum} ${monthName}</span>
                <span class="date-day">${dayName} ${i === 0 ? '(TODAY)' : ''}</span>
            `;
            
            card.addEventListener('click', () => {
                this.querySelectorAll('.date-card').forEach(c => c.classList.remove('active'));
                card.classList.add('active');
            });
            
            wrapper.appendChild(card);
        }

        nextBtn.addEventListener('click', () => { wrapper.scrollLeft += 120; });
        prevBtn.addEventListener('click', () => { wrapper.scrollLeft -= 120; });
    }
}
customElements.define('ezpark-calendar', EzParkCalendar);


// ==========================================================================
// 5. REUSABLE CONTEXTUAL SLIDING BOOKING DRAWER
// ==========================================================================
class EzParkBookingPanel extends HTMLElement {
    connectedCallback() {
        this.innerHTML = `
            <div class="booking-drawer-wrapper" id="bookingDrawer">
                <div class="drawer-header">
                    <div>
                        <h3 class="panel-title" style="font-size: 18px !important; tracking: -0.01em;">Confirm Booking</h3>
                        <p class="drawer-spot-display">Spot <span id="drawerBayLabel" class="mono-text">—</span></p>
                    </div>
                    <button class="drawer-close-x" id="closeDrawerBtn">×</button>
                </div>
                
                <div class="drawer-details-box">
                    <div class="drawer-row"><span>Vehicle Plate</span> <strong class="mono-text">PPP-505</strong></div>
                </div>

                <div class="input-group">
                    <label class="control-label">Arrival Time</label>
                    <input type="time" id="arrivalTimeInput" class="global-select" value="08:00">
                </div>

                <div class="input-group">
                    <label class="control-label">Select Duration</label>
                    <select class="global-select">
                        <option value="1">1 Hour (Quick Lecture)</option>
                        <option value="2">2 Hours (Standard Lab Slot)</option>
                        <option value="4">4 Hours (Half-Day Study)</option>
                    </select>
                </div>

                <div class="drawer-actions">
                    <button class="btn-primary full-width-btn" id="submitBookingBtn">Confirm Reservation</button>
                </div>
            </div>
        `;

        this.querySelector('#closeDrawerBtn').addEventListener('click', () => {
            document.getElementById('bookingDrawer').classList.remove('active');
            document.querySelectorAll('.parking-spot').forEach(s => s.classList.remove('selected-target'));
        });
    }
}
customElements.define('ezpark-booking-panel', EzParkBookingPanel);

