# TECHNOVA — Responsive Website Using CSS Media Queries

> **College Laboratory Practical Submission**  
> **Course / Subject:** Web Technologies & Advanced UI/UX Development  
> **Practical Title:** Make a Website Mobile-Friendly Using CSS Media Queries  
> **UI/UX Theme:** Modern Orange & White Tech Edition  

---

## 1. Project Overview & Objective

### Objective
To transform a desktop-oriented, multi-column technology portal into a fully responsive, mobile-friendly website using pure **HTML5**, **CSS3**, and **CSS Media Queries**, without any external frameworks (such as Bootstrap, Tailwind, or React).

### Concept: "TECHNOVA"
A high-tech digital innovation platform showcasing autonomous intelligence, elastic cloud systems, modern web engineering, and next-generation cybersecurity.

---

## 2. Technology Stack

* **Markup:** Semantic HTML5 (`<header>`, `<nav>`, `<main>`, `<section>`, `<article>`, `<footer>`)
* **Styling:** Modern CSS3 with Design Tokens / CSS Variables (`:root`)
* **Layout Engines:** CSS Flexbox & CSS Grid
* **Responsiveness:** CSS3 Media Queries (`@media screen and (max-width: ...)`)
* **Scripting:** Minimal Vanilla JavaScript (strictly for accessible mobile menu toggling and scroll effects)
* **Graphics:** Native Inline Vector SVGs (zero external image dependencies, instant crisp rendering)

---

## 3. UI/UX Design System (Orange & White)

* **Primary Background:** Crisp Pure White (`#FFFFFF`) with warm off-white sections (`#FFFBF7`).
* **Signature Accent:** Electric Orange (`#FF6B00`) and Deep Amber (`#EA580C`).
* **Surface Cards:** Elevated pure white surfaces with soft shadows and glowing orange hover borders.
* **Typography:** Deep Slate Charcoal (`#0F172A`) for high-contrast, WCAG AAA readability on white surfaces.
* **Button Architecture:**
  * *Primary CTA:* Vibrant Orange gradient (`linear-gradient(135deg, #FF6B00, #EA580C)`) with white text.
  * *Secondary CTA:* White card button with subtle border, transitioning to orange on hover.

---

## 4. Website Structure & Sections

1. **Header & Navigation Bar:**
   * Desktop: Horizontal navigation with logo, page links, and a *"Get Started"* CTA button.
   * Mobile/Tablet: Collapses into an accessible **hamburger button** with a sliding off-canvas drawer.
2. **Hero Section:**
   * 2-column layout with status badge, primary & secondary action buttons, metric counters (SLA, Latency, Queries), and an animated SVG technology processor.
3. **Technology Categories (4 Cards):**
   * Displays *Artificial Intelligence*, *Cloud Computing*, *Web Development*, and *Cybersecurity* with custom icons, descriptions, and feature pills.
4. **Featured Platform Architecture:**
   * 2-column split with a live telemetry dashboard preview on one side and enterprise feature checklists with CTA on the other.
5. **Innovation Highlights (3 Cards):**
   * R&D showcase highlighting *Autonomous Edge Computing*, *Quantum-Safe Cryptography*, and *Real-Time Neural Analytics* with status tags and latency/throughput metrics.
6. **Call-To-Action Banner:**
   * Conversion banner inviting users to evaluate the platform or schedule technical briefings.
7. **Footer:**
   * 4-column layout including brand information, quick navigation, capabilities, and social links.

---

## 5. Responsive Transformation & Media Queries

The responsiveness is implemented across two key breakpoints:

### Breakpoint 1: Tablet Devices (`max-width: 768px`)
```css
@media screen and (max-width: 768px) {
  /* 1. Reveal Hamburger Menu Button */
  .hamburger-btn {
    display: flex;
  }

  /* 2. Hide Desktop Header CTA */
  .nav-cta-wrapper {
    display: none;
  }

  /* 3. Transform Navigation into Mobile Slide Drawer */
  .nav-menu {
    position: fixed;
    top: var(--nav-height);
    left: 0;
    width: 100%;
    height: calc(100vh - var(--nav-height));
    background-color: rgba(255, 255, 255, 0.98);
    backdrop-filter: blur(20px);
    flex-direction: column;
    padding: 2.5rem 2rem;
    transform: translateY(-120%);
    opacity: 0;
    pointer-events: none;
    transition: transform 0.35s ease, opacity 0.25s ease;
  }

  .nav-menu.open {
    transform: translateY(0);
    opacity: 1;
    pointer-events: auto;
  }

  /* 4. Convert 4-Column Technology Grid into 2x2 Grid */
  .tech-grid {
    grid-template-columns: repeat(2, 1fr);
  }

  /* 5. Stack 2-Column Sections Vertically */
  .hero-container,
  .featured-container {
    grid-template-columns: 1fr;
  }
}
```

### Breakpoint 2: Mobile Phones (`max-width: 480px`)
```css
@media screen and (max-width: 480px) {
  /* 1. Scale Typography for Mobile Screens */
  .hero-title {
    font-size: 2rem;
    line-height: 1.2;
  }

  /* 2. Full-Width Stacked Touch-Friendly Buttons */
  .hero-actions,
  .cta-buttons {
    flex-direction: column;
    width: 100%;
  }

  .hero-actions .btn,
  .cta-buttons .btn {
    width: 100%;
  }

  /* 3. Collapse All Grids to 1 Column */
  .tech-grid,
  .innovations-grid,
  .footer-grid {
    grid-template-columns: 1fr;
    gap: 1.25rem;
  }

  /* 4. Stack Hero Statistics */
  .hero-stats {
    flex-direction: column;
    gap: 1.25rem;
  }

  .stat-divider {
    display: none;
  }
}
```

---

## 6. How to Run on Localhost

### Prerequisites
* Any web browser (Google Chrome, Microsoft Edge, Firefox, or Safari).
* Python 3 installed (built into Windows/macOS/Linux).

### Quick Start
1. Open PowerShell or Terminal in the project directory:
   ```powershell
   cd C:\Users\andrews\.gemini\antigravity\scratch\TECHNOVA
   ```
2. Start the local HTTP server:
   ```powershell
   python -m http.server 8080
   ```
3. Open your browser and go to:
   ```
   http://localhost:8080
   ```

---

## 7. How to Test Responsiveness (DevTools)

1. Open **Google Chrome** or **Edge** and navigate to `http://localhost:8080`.
2. Press **`F12`** (or right-click anywhere and click **Inspect**).
3. Press **`Ctrl + Shift + M`** to toggle the **Device Toolbar**.
4. Test the site across different viewports:
   * **1440px (Desktop):** 4-column cards, full horizontal navbar, 2-column hero.
   * **1024px (Laptop):** Proportional container scaling and compact typography.
   * **768px (Tablet):** Hamburger menu appears, technology cards switch to 2×2, sections stack.
   * **425px (Mobile):** Single-column layout, 100% width buttons, vertical metrics.
   * **375px (Small Mobile):** Zero horizontal overflow (`scrollWidth === clientWidth`).

---

## 8. Viva Voce / Practical Exam Key Questions

1. **What is the purpose of the viewport meta tag?**  
   `<meta name="viewport" content="width=device-width, initial-scale=1.0">` tells the mobile browser to set the viewport width to the device's physical screen width and sets the initial zoom scale to 1:1, preventing automatic down-scaling.

2. **Why use `box-sizing: border-box;`?**  
   It includes padding and border within the element's total width and height, preventing accidental horizontal overflow when applying padding to responsive elements.

3. **What is the difference between `@media screen and (max-width: 768px)` and `min-width`?**  
   `max-width` targets screens *up to* the specified pixel value (desktop-first degradation), whereas `min-width` targets screens *from* that width and above (mobile-first expansion).

4. **Why is `max-width: 100%; height: auto;` crucial for images?**  
   It prevents images and vector SVGs from exceeding their parent container's width while preserving their original aspect ratio.

---

## 9. File Directory

```text
TECHNOVA/
├── index.html                 # Semantic HTML5 desktop & mobile markup
├── style.css                  # CSS3 styling, variables, and media queries
├── script.js                  # Vanilla JavaScript for mobile navigation
├── README.md                  # Complete project documentation & lab submission guide
└── assets/                    # Project assets and SVG resources
```

---
*Created for College Laboratory Practical Demonstration — TECHNOVA 2026.*
