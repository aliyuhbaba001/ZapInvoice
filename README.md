# ⚡ ZapInvoice

**Lightning-fast professional invoice generation made simple**

Hi there! 👋  
I'm excited to share **ZapInvoice**, a modern, web-based invoice generator I built to simplify billing for freelancers, small businesses, and entrepreneurs. My goal with this project is to make invoice creation effortless, professional, and completely client-side — no signups, no backend servers, and no data collection.

---

## 🚀 Quick Start

### Prerequisites
Before you begin, make sure you have:
- **Node.js 16+** and **npm** installed  
  👉 You can install Node using [nvm](https://github.com/nvm-sh/nvm#installing-and-updating)

### Local Development

To run ZapInvoice locally:

```bash
# Clone the repository
git clone https://github.com/aliyuhbaba001/ZapInvoice.git
cd zapinvoice

# Install dependencies
npm install

# Start the development server
npm run dev

Once started, open your browser and navigate to:
👉 **[http://localhost:8080](http://localhost:8080)**

### Build for Production

To build and preview the optimized production version:

```bash
# Create optimized production build
npm run build

# Preview production build locally
npm run preview
```

This starts a local server at **[http://localhost:4173](http://localhost:4173)** for testing your production build.

---

## 📋 Project Overview

I built ZapInvoice to address a common frustration: having to use overly complex accounting tools just to send a simple invoice. ZapInvoice runs entirely in the browser, ensuring **data privacy**, **speed**, and **simplicity** — while producing beautiful, professional invoices ready to send to clients.

### Core Objectives

* ⚡ **Speed**: Generate invoices in under 30 seconds
* 🔒 **Privacy**: All data stays on the user’s device
* 🧠 **Simplicity**: No learning curve, no setup time
* 🧾 **Professionalism**: Clean, branded, print-ready invoices
* 🧩 **Flexibility**: Works for freelancers, startups, and small businesses

---

## 🛠️ Technology Stack

### Frontend

* **TypeScript** — Type-safe, scalable development
* **React 18** — Functional components with hooks
* **Vite** — Lightning-fast build tool and dev server
* **Tailwind CSS** — Utility-first styling
* **shadcn/ui** — Accessible, customizable UI components

### Data & Storage

* **localStorage** — Persistent company and template data
* **sessionStorage** — Temporary invoice drafts
* **FileReader API** — Client-side logo uploads and optimization

### PDF & Export

* **jsPDF** — PDF generation with custom branding
* **html2canvas** — Captures and optimizes invoice previews

### Dev Environment

* **Git + GitHub** — Version control and collaboration
* **VS Code** — Recommended IDE
* **npm** — Dependency management
* **Prettier** — Enforces code formatting consistency

---

## 🏗️ Architecture

### Folder Structure

```
src/
├── components/
│   ├── LandingPage.tsx          # Marketing and overview section
│   ├── InvoiceGenerator.tsx     # Main invoice creation interface
│   ├── InvoicePreview.tsx       # Real-time preview display
│   ├── CompanySection.tsx       # Company info input
│   ├── ClientSection.tsx        # Client info input
│   ├── InvoiceItems.tsx         # Manage line items
│   ├── InvoiceSettings.tsx      # Invoice number, date, etc.
│   ├── PaymentSection.tsx       # Payment terms & notes
│   ├── ExportActions.tsx        # PDF export & print options
│   ├── TemplateManager.tsx      # Manage reusable templates
│   ├── StorageIndicator.tsx     # Auto-save status display
│   └── ui/                      # Reusable UI building blocks
├── hooks/
│   └── useInvoiceData.ts        # Centralized state management
├── lib/
│   ├── storage.ts               # Storage utilities
│   ├── pdfGenerator.ts          # PDF generation logic
│   ├── logoOptimizer.ts         # Image optimization
│   └── utils.ts                 # Shared utilities
└── pages/
    ├── Index.tsx                # Root page
    └── NotFound.tsx             # 404 handler
```

### Data Flow

1. User inputs invoice data
2. `useInvoiceData` manages app-wide state
3. Data auto-saves to `sessionStorage` every 2 seconds
4. The preview updates in real-time
5. PDF is generated using `jsPDF` and `html2canvas`

---

## ✨ Key Features

### 🔹 Real-Time Preview

* Live, WYSIWYG editing experience
* Fully responsive invoice design

### 🔹 Smart Data Persistence

* Auto-saves draft invoices every 2 seconds
* Local storage for company profiles and templates
* Automatic recovery of unsaved work

### 🔹 Professional PDF Export

* Branded, print-ready PDFs
* Embedded logos and page break handling
* Supports multi-page invoices

### 🔹 Logo Handling

* Drag-and-drop upload
* Auto optimization (max 200KB)
* Preview before embedding

### 🔹 Invoice Features

* Unlimited line items
* Automatic subtotal, tax, and total calculations
* Payment terms and custom notes
* Sequential invoice numbering

### 🔹 Export Options

* Download PDF
* Print directly from browser
* Duplicate invoices easily

---

## 💾 Storage Strategy

### localStorage (Persistent)

Stores company profiles, templates, and branding data.

```json
{
  "zapinvoice_company_profile": { ... },
  "zapinvoice_templates": [ ... ]
}
```

### sessionStorage (Temporary)

Holds current draft invoice data, auto-saved and cleared after export.

```json
{
  "zapinvoice_draft": { ... }
}
```

---

## ⚡ Performance Optimizations

* React **lazy loading** for code splitting
* Debounced auto-save to reduce write frequency
* **Memoization** for expensive renders
* Optimized image handling for faster PDF export

---

## 🎨 Design Decisions

### Why Client-Side Only?

I wanted users to retain **full privacy** and avoid dealing with backend hosting. Keeping it client-side means:

* No data leaves the device
* No server costs or latency
* Works offline once loaded

### Why jsPDF?

It gives me full control over the output, ensuring professional-quality PDFs with minimal dependencies.

### Why localStorage/sessionStorage?

It provides instant, reliable persistence without requiring user accounts or an API.

---

## 🔮 Future Enhancements

* [ ] Multi-currency support
* [ ] Email invoice directly to clients
* [ ] Invoice analytics and dashboard
* [ ] Cloud backup (optional)
* [ ] i18n and multiple languages
* [ ] Recurring invoice automation
* [ ] Payment tracking and reminders

---

## 🧪 Testing

Currently, I rely on TypeScript’s compile-time checks and manual browser testing.

Planned additions:

* Unit tests with **Vitest**
* Component tests with **React Testing Library**
* End-to-end tests with **Playwright**

To validate builds:

```bash
npm run type-check
npm run build
```

---

## 🧭 Development Workflow

1. Create a feature branch from `main`
2. Build and test locally at **[http://localhost:8080](http://localhost:8080)**
3. Use conventional commit messages
4. Push changes — deployment handled via Lovable

---

## 🎯 Branding

ZapInvoice reflects speed, simplicity, and professionalism:

* ⚡ Lightning motif for instant action
* **Raleway** font for modern typography
* Gradient accents for an energetic feel
* Minimalist UI to keep focus on what matters

---

## 📄 License

This project is **private and proprietary**.
All rights reserved.

---

## 🙏 Acknowledgments

* UI components from [shadcn/ui](https://ui.shadcn.com)
* Icons by [Lucide React](https://lucide.dev)
* Fonts from [Google Fonts](https://fonts.google.com)
