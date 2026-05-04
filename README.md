# CentiCare HIS

Professional Hospital Information System (HIS) dashboard for managing clinical surveillance, pharmacy inventory, and patient medical records.

## 🏥 Key Features

- **Clinical Surveillance**: Real-time patient monitoring with SBAR, IV sheets, and laboratory tracking.
- **Nursing Kardex**: Advanced task management for shift handovers and critical care workflows.
- **Interactive Ward Map**: Visual bed management with real-time status indicators.
- **Pharmacy & Inventory**: Comprehensive stock tracking with crash cart management and emergency medicine monitoring.
- **Secure Medical Charts**: Data Privacy Act compliant audit logs and imaging/radiology reporting.
- **Staff Accounts**: Individual profile management with tiered permissions.

## 🛡️ Ethical & Legal Compliance

CentiCare HIS is designed with strict adherence to Philippine clinical and data standards:

- **RA 10173 (Data Privacy Act of 2012)**: All patient data processing follows NPC-mandated security measures including access control and audit logging.
- **Clinical Accountability**: Mandatory audit trails for all medical entries (vitals, meds, SBAR).
- **Privacy by Design**: Role-based access ensures health information is only available on a "need-to-know" basis.

## 🚀 Tech Stack

- **Frontend**: React 19 + TypeScript
- **Styling**: Tailwind CSS 4
- **Animations**: Framer Motion
- **Icons**: Lucide React
- **Build Tool**: Vite

## 🛠️ Getting Started

### Prerequisites

- Node.js (v18 or higher)
- npm

### Installation

1. Clone the repository:
   ```bash
   git clone https://github.com/your-username/centicare-his.git
   ```

2. Install dependencies:
   ```bash
   npm install
   ```

3. Start the development server:
   ```bash
   npm run dev
   ```

### Building for Production

To create an optimized production build:

```bash
npm run build
```

The output will be in the `dist/` directory, ready to be hosted on any static site hosting service (GitHub Pages, Vercel, Netlify, Cloud Run).

## 📄 License

This project is licensed under the Apache License 2.0. See the [LICENSE](LICENSE) file for details.

## 🛡️ Security Note

This is a clinical dashboard frontend. Ensure proper backend authentication and data encryption are implemented before using with real patient data.
