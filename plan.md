# LEGAL SERVICES MARKETPLACE (LAWSUIT)
## Master Product Blueprint & Technical Architecture Plan
### End-to-End Implementation Guide for React Native Mobile Application, Node.js Backend & PostgreSQL Database

---

## 1. Executive Summary & System Overview

### 1.1 Vision and Core Purpose
The **Legal Services Marketplace** is an enterprise-grade digital platform designed to bridge the gap between legal practitioners (advocates, corporate lawyers, legal consultants) and clients (individuals, families, startups, and enterprises). The system democratizes legal access by providing:
1. **Frictionless Lawyer Discovery & Booking:** Multi-parameter search, verified professional profiles, transparent fee structures, and immediate online/offline appointment scheduling.
2. **Omnichannel Consultations:** Secure, confidential real-time video, audio, text chat, and physical in-person consultation appointments.
3. **Structured Document Services:** End-to-end legal drafting, contract review, affidavits, and legal notice preparation with built-in revision cycles, milestone-based escrow payments, and secure dispatch tracking.
4. **AI-Assisted Legal Triage ("Describe My Problem"):** Natural Language Processing (NLP) intake tool that extracts legal issues, classifies problems into jurisdictional practice areas, determines urgency, and recommends verified attorneys without delivering unauthorized legal advice.
5. **Full Lifecycle Case Management:** Centralized repository for ongoing legal cases, court hearing calendars, case files, client-lawyer notes, and order histories.
6. **Regulatory Compliance & High Trust:** Strict Bar Council verification mechanisms, end-to-end encryption for privileged attorney-client documents, transparent platform commissions, and comprehensive audit logs.

### 1.2 System Actors & Portals
The platform consists of three core interfaces interacting with a unified backend:
- **User Mobile App (React Native):** Cross-platform iOS and Android client for end-users seeking legal advice, booking consultations, tracking cases, and managing legal documents.
- **Lawyer Mobile App & Web Panel (React Native / Next.js):** Specialized workflow interface for advocates to manage practice calendars, accept/reschedule consultations, review client briefs, execute document drafting, track billings, and withdraw earnings.
- **Super Admin & Operations Panel (React / Next.js Web Portal):** Central command dashboard for platform administrators to verify advocate credentials, manage legal practice categories, oversee escrow transactions, arbitrate disputes, monitor audit trails, and manage marketing/CMS content.

```
+----------------------------------------------------------------------------------------------------+
|                                      CLIENT APPLICATION LAYER                                      |
+------------------------------------+----------------------------------+----------------------------+
|        User Mobile App             |        Lawyer App / Panel        |    Super Admin Web Panel   |
|   (React Native / Expo SDK 51+)    |  (React Native + Next.js Web)    |      (Next.js 14 / React)  |
+------------------------------------+----------------------------------+----------------------------+
                                        |                   |
                                        v                   v
+----------------------------------------------------------------------------------------------------+
|                                    API GATEWAY & SECURITY LAYER                                    |
+----------------------------------------------------------------------------------------------------+
|  • Cloudflare CDN / DDoS Protection        • Nginx Reverse Proxy / SSL Termination (TLS 1.3)       |
|  • JWT Authentication / Refresh Tokens     • Rate Limiting & DDOS Throttling (Redis Token Bucket)  |
|  • Role-Based Access Control (RBAC)        • Request Validation & Sanitization (Zod / Joi)         |
+----------------------------------------------------------------------------------------------------+
                                        |                   |
                                        v                   v
+----------------------------------------------------------------------------------------------------+
|                                 CORE NODE.JS APPLICATION SERVICES                                  |
+----------------------------------------------------------------------------------------------------+
|  • Auth & Identity Service                 • Lawyer Directory & Discovery Service                  |
|  • Consultation & Slot Engine              • WebRTC / Agora Signaling & Presence Engine            |
|  • Real-Time Chat Service (Socket.io)      • Document Services & Drafting Workflow Service         |
|  • Legal Triage AI Service (LLM / RAG)     • Billing, Escrow & Payout Engine                       |
|  • Case Management Service                 • Notification & Dispatch Engine (BullMQ)               |
+----------------------------------------------------------------------------------------------------+
           |                                  |                                  |
           v                                  v                                  v
+-----------------------+          +-----------------------+          +------------------------------+
|  POSTGRESQL 16 (SQL)  |          |      REDIS CACHE      |          |    OBJECT STORAGE (S3/R2)    |
+-----------------------+          +-----------------------+          +------------------------------+
| • Relational Entities |          | • Active Sessions     |          | • Encrypted Legal Documents  |
| • Spatial PostGIS     |          | • Real-time Presence  |          | • Bar Verification Records   |
| • Full-Text Search    |          | • BullMQ Job Queues   |          | • Signed Presigned URLs      |
| • Immutable Auditing  |          | • Slot Lock Mutexes   |          | • Consultation Recordings    |
+-----------------------+          +-----------------------+          +------------------------------+
```

---

## 2. Complete Technology Stack & Architectural Decisions

### 2.1 Mobile Application (React Native)
- **Framework:** **React Native 0.74+** using **Expo SDK 51 (Bare/Prebuild workflow)**.
  - *Rationale:* Delivers near-native performance on iOS and Android while offering rapid cross-platform development, OTA updates via EAS Update, robust native module bridging for WebRTC/Agora, and streamlined builds.
- **Language:** **TypeScript 5.4+** with strict mode enabled.
- **Navigation:** **React Navigation v6** (Native Stack Navigator, Bottom Tab Navigator, and Custom Drawer).
- **State Management:**
  - **Server State & Caching:** **TanStack Query (React Query v5)** for API fetching, query invalidation, optimistic updates, and offline caching.
  - **Client/Session State:** **Zustand** with persistent storage middleware for light, fast state management (auth tokens, active filters, user preferences).
- **Styling & UI Kit:** **NativeWind v4 (Tailwind CSS for React Native)** paired with **React Native Paper** / custom design system tokens for premium typography, spacing, and dark/light mode support.
- **Audio/Video Calling SDK:** **Agora RTC Engine (`react-native-agora`)** or **100ms LiveKit SDK** for ultra-low-latency, carrier-grade, encrypted video/audio consultations.
- **Real-Time Messaging:** **Socket.io-client** backed by local SQLite persistence via **WatermelonDB** / **MMKV** for zero-latency offline message reading.
- **Document Viewing & Uploading:** `react-native-document-picker`, `react-native-pdf`, `react-native-image-crop-picker`, and `react-native-fs`.
- **Push Notifications:** **Expo Notifications** / **Firebase Cloud Messaging (FCM)** with Apple Push Notification service (APNs).
- **Security:** **react-native-keychain** for hardware-backed keystore/keychain storage of JWT access and biometric refresh tokens.

### 2.2 Backend Architecture (Node.js)
- **Runtime:** **Node.js 20 LTS** with **TypeScript**.
- **Application Framework:** **NestJS** or **Express.js with Clean Hexagonal Architecture**.
  - *Recommendation:* **NestJS** for its modular architecture, native dependency injection, built-in validation pipes, microservice abstraction, OpenAPI/Swagger generation, and enterprise maintainability.
- **Database Access & ORM:** **Prisma ORM** or **Drizzle ORM** targeting **PostgreSQL 16**.
  - *Rationale:* Type-safe migrations, auto-generated database client, high query performance, and reliable relational integrity checks.
- **Real-Time Communication:** **Socket.io v4** with `@socket.io/redis-adapter` for multi-node horizontal scaling.
- **Background Jobs & Worker Queues:** **BullMQ** running on **Redis 7.2**.
  - Manages asynchronous tasks: appointment reminder triggers, slot expiration cleanups, automated payout processing, PDF watermarking, push/SMS notifications, and webhook retries.
- **Authentication & Authorization:** 
  - Dual-token JWT (Access Token: 15-min expiry; Refresh Token: 30-day rolling expiry stored in secure HTTP-only cookies on web, and hardware Keystore on mobile).
  - Multi-Factor Authentication via SMS OTP (Twilio / Msg91) for registration and lawyer payouts.
  - Role-Based Access Control (RBAC) with hierarchical permissions: `SUPER_ADMIN`, `SUPPORT_AGENT`, `LAWYER`, `CLIENT`.
- **API Documentation:** OpenAPI 3.0 / Swagger UI auto-generated from DTO decorators.

### 2.3 Database Tier (PostgreSQL 16)
- **Primary Database:** **PostgreSQL 16+**.
- **Extensions:**
  - `uuid-ossp` or `pgcrypto`: UUIDv4 primary keys for distributed security.
  - `postgis`: Geospatial coordinates for hyper-local lawyer discovery and distance-based filtering.
  - `pg_trgm`: Trigram indexing for fuzzy text search across lawyer names, specializations, and legal issues.
  - `pgvector`: Vector embeddings (OpenAI `text-embedding-3-small`) for the "Describe My Problem" semantic categorization engine.
- **Connection Pooling:** **pgBouncer** to support thousands of concurrent client connections without memory exhaustion.

### 2.4 Cloud Infrastructure & Third-Party Integrations
- **Cloud Provider:** AWS (ECS Fargate / EKS, RDS PostgreSQL, ElastiCache Redis, S3) or GCP (Cloud Run, Cloud SQL).
- **Object Storage:** **AWS S3** / **Cloudflare R2** with private buckets, server-side encryption (SSE-S3/KMS), and pre-signed expiring URLs (15-minute access window) for all legal documents.
- **Payment Gateway:** **Razorpay** / **Stripe** with webhook listeners, supporting marketplace escrow splits, automatic platform commission deductions, and automated payout routes (RazorpayX / Stripe Connect).
- **Communication Infrastructure:**
  - Video/Audio: **Agora RTC**
  - SMS & OTP: **Twilio** / **Msg91**
  - Transactional Email: **SendGrid** / **AWS SES**
  - Push Notifications: **Firebase Cloud Messaging (FCM)**

---

## 3. Complete Screen-by-Screen Implementation Specification (Screens 01 - 58)

The system provides 58 discrete screens across User App, Lawyer Panel, and Admin Portal as defined in the product blueprint. Below is the comprehensive architectural and component specification for each screen.

### 3.1 User App — Onboarding (Screens 01 – 05)

#### Screen 01: Splash Screen
- **App:** User App & Lawyer App
- **Components:** Animated Brand Logo (`LottieView`), Tagline ("Trusted Legal Guidance, Anytime, Anywhere"), Loading Indicator, Network connectivity check.
- **Logic:** Checks hardware keychain for stored auth tokens. If valid, fetches `/api/v1/auth/me`; routes to `HomeDashboard` (User) or `LawyerDashboard` (Lawyer). If invalid or first launch, routes to `WelcomeScreen`.

#### Screen 02: Welcome Screen
- **App:** User App
- **Components:** High-impact hero carousel displaying platform value propositions ("Consult Top Advocates Online", "Draft Verified Legal Contracts", "Fast-Track Legal Problem Resolution"), "Find Legal Help" primary CTA, "I Am a Lawyer" secondary CTA, Language Selector dropdown (English, Hindi, Regional languages).
- **Navigation:** Routes to `MobileLogin` with role parameter (`CLIENT` vs `LAWYER`).

#### Screen 03: Mobile Login & OTP Verification Screen
- **App:** User App & Lawyer App
- **Components:** Country code picker (+91 default), 10-digit mobile number input, "Send OTP" button, Terms & Privacy policy checkbox, Auto-focusing 6-digit OTP input boxes, Resend OTP countdown timer (30s), SMS auto-fill handler (`react-native-otp-verify`).
- **APIs:** `POST /api/v1/auth/send-otp`, `POST /api/v1/auth/verify-otp`.
- **States:** Idle, Sending, Verifying, Error (Invalid OTP / Rate limited).

#### Screen 04: Profile Setup Screen
- **App:** User App
- **Components:** Profile photo avatar picker (camera/gallery upload), Full Name input, Email Address input, City/Pincode selector with auto-complete, Preferred Language multi-select chips.
- **APIs:** `POST /api/v1/users/profile`.
- **Validation:** Name min 3 chars, RFC 5322 email regex, required city selection.

#### Screen 05: Location & Permissions Priming Screen
- **App:** User App
- **Components:** Value-oriented permission explainer graphic ("Enable location to find court-practicing lawyers near your jurisdiction"), "Allow Location Access" button, "Skip for Now" text button, Push Notification permission trigger.
- **Logic:** Calls `expo-location` and `expo-notifications` system prompts; saves GPS coordinates to client session store.

---

### 3.2 User App — Home & Discovery (Screens 06 – 12)

#### Screen 06: Home Dashboard
- **App:** User App
- **Components:**
  - Header: User greeting, current city badge (tap to switch), notification bell icon with unread badge counter.
  - Search Bar: Quick trigger navigating to `SearchLawyers` with voice search icon.
  - Quick Action Banners: "Talk to a Lawyer Now" (Immediate consultation), "Describe My Problem" (AI Triage), "Draft a Document", "Legal Notice Assistance".
  - Active / Upcoming Consultation Card: Shows countdown timer, lawyer photo, scheduled time, and "Join Room" button when active.
  - Legal Category Grid (11 categories with custom vector icons).
  - Featured & Top-Rated Advocates horizontal carousel.
  - Educational Legal Guides & FAQ banner.
- **APIs:** `GET /api/v1/home/feed`, `GET /api/v1/appointments/upcoming-active`.

#### Screen 07: Search Lawyers Screen
- **App:** User App
- **Components:** Real-time debounced search input (300ms debounce), recent search history chips, popular search keywords ("Divorce lawyer", "Property registration", "Bail specialist"), auto-suggest dropdown list.
- **APIs:** `GET /api/v1/lawyers/search?q={query}`.

#### Screen 08: Legal Categories Screen
- **App:** User App
- **Components:** Categorized 2-column card grid displaying: Criminal Law, Civil Law, Family & Divorce, Property & Real Estate, Consumer Disputes, Cyber Crime, Employment & Labour, Corporate & Business, Cheque/Financial Disputes, Motor Accident & Insurance, and Other Legal Matters. Each category card shows title, sub-services count, and icon.
- **APIs:** `GET /api/v1/categories`.

#### Screen 09: Lawyer Listing Screen
- **App:** User App
- **Components:**
  - Sticky Top Bar: Search keyword + active filter count badge + sort trigger.
  - Lawyer Card Item: Avatar, Verified Bar Badge, Full Name, Court of Practice (e.g., "High Court & District Courts"), Years of Experience ("14+ Yrs Exp"), Primary Languages, Rating score & total review count (e.g., "★ 4.9 (124)"), Starting Consultation Fee (e.g., "₹799 / 20 mins"), Next Available Slot badge (e.g., "Available Today, 4:30 PM"), Online/Offline indicator chip.
  - Action buttons: "Book Now" and "View Profile".
- **APIs:** `GET /api/v1/lawyers?category_id={id}&page={n}&limit=10`.
- **States:** Infinite scroll pagination, skeleton loaders, zero-results empty state with "Broaden your search" CTA.

#### Screen 10: Filter & Sort Modal / Screen
- **App:** User App
- **Components:**
  - Sort By: Recommended, Highest Rating, Experience (High to Low), Price (Low to High), Next Available.
  - Filters: Specialization subcategories, City / Court Location, Experience Range slider (0-5, 5-10, 10-20, 20+ years), Consultation Mode (Chat, Audio, Video, In-Person), Fee range slider, Gender, Languages Spoken.
  - Sticky footer: "Reset All" button and "Apply Filters (N Lawyers Found)" button.
- **APIs:** Formulates query string for `GET /api/v1/lawyers`.

#### Screen 11: Lawyer Profile Screen
- **App:** User App
- **Components:**
  - Hero Section: High-res portrait, Verified Bar Council badge, Name, Designation, Bar Council Registration ID (masked or verified checkmark), Total consultations delivered.
  - About Tab: Professional biography, Educational qualifications (e.g., "LL.B - National Law School, LL.M - Harvard"), Bar Council enrollment date.
  - Courts of Practice: e.g., Supreme Court of India, Delhi High Court, Tis Hazari District Court.
  - Areas of Expertise: Category tags with specific sub-specialties.
  - Client Reviews & Ratings: Aggregate breakdown bar chart (5-star to 1-star), verified client review cards with date and verified consultation badge.
  - Consultation Modes & Pricing Cards: Video Call (₹999/20 min), Audio Call (₹699/20 min), Chat (₹499/day), In-Person Office Consultation (₹1,999/45 min).
  - Sticky Bottom CTA: "Book Consultation" button.
- **APIs:** `GET /api/v1/lawyers/:id`, `GET /api/v1/lawyers/:id/reviews`.

#### Screen 12: Compare / Shortlist Screen (MVP+)
- **App:** User App
- **Components:** Side-by-side comparison table of up to 3 shortlisted lawyers: Experience, Qualification, Court level, Consultation fee across modes, Ratings, Next availability slot. "Proceed to Book" button per column.
- **State:** Local Zustand shortlist store synced with `POST /api/v1/users/shortlist`.

---

### 3.3 User App — Consultation Booking (Screens 13 – 20)

#### Screen 13: Consultation Type Selection Screen
- **App:** User App
- **Components:** 4 selectable interactive cards with pricing, duration, and feature descriptions:
  - 1. Video Consultation: Face-to-face HD encrypted call, screen sharing, document review.
  - 2. Audio Consultation: Private voice call, quick legal guidance, low bandwidth friendly.
  - 3. Chat Consultation: 24-hour asynchronous messaging channel, document upload.
  - 4. In-Person Meeting: Physical office visit at advocate's registered chambers.
- **State:** Passes `consultation_mode` to booking wizard state.

#### Screen 14: Select Date & Time (Availability Calendar)
- **App:** User App
- **Components:**
  - Horizontal Date Carousel: 14 rolling calendar days showing Day, Date, and availability dot.
  - Time Slot Tabs: Morning (9 AM - 12 PM), Afternoon (12 PM - 4 PM), Evening (4 PM - 9 PM).
  - Time Slot Pills: e.g., "04:30 PM - 04:50 PM". Green = Available, Gray = Booked, Red = Conflict.
  - Timezone display badge.
- **APIs:** `GET /api/v1/lawyers/:id/availability?date=YYYY-MM-DD&mode={mode}`.
- **Logic:** Optimistic slot reservation mutex lock (locks slot in Redis for 10 minutes during checkout).

#### Screen 15: Booking Summary Screen
- **App:** User App
- **Components:** Selected lawyer mini-card, Consultation mode badge, Date & Time block, Client Details preview, Case Brief input field ("Briefly describe what you wish to discuss"), File Attachment component (upload previous court notices or agreements), Cost Breakdown (Consultation Fee, Platform Convenience Fee, GST/Taxes, Total Payable), Coupon code input with "Apply" button.
- **APIs:** `POST /api/v1/bookings/calculate-quote`.

#### Screen 16: Payment Screen
- **App:** User App
- **Components:** Integrated Payment Gateway Sheet (Razorpay / Stripe SDK): UPI (Google Pay, PhonePe, Paytm), Credit/Debit Cards, Net Banking, Digital Wallets. Security guarantee badge: "Funds held in secure marketplace escrow until consultation concludes."
- **APIs:** `POST /api/v1/payments/create-order`, `POST /api/v1/payments/verify`.

#### Screen 17: Booking Confirmation Screen
- **App:** User App
- **Components:** Animated success checkmark, Unique Booking Reference ID (`#LAW-2026-XXXXX`), "Add to Google/Apple Calendar" button, Consultation preparation guidelines (what documents to keep handy), "Go to My Consultations" button, "Back to Home" button.
- **Logic:** Dispatches push notifications and SMS confirmation with calendar invite link.

#### Screen 18: My Consultations Screen
- **App:** User App
- **Components:** Segmented Tab Control: "Upcoming", "Completed", "Cancelled".
  - Card elements: Lawyer name, avatar, mode icon, scheduled start time, countdown timer, Status Badge (`CONFIRMED`, `IN_PROGRESS`, `COMPLETED`, `CANCELLED`).
  - Active state: "Enter Consultation Room" CTA highlights 10 minutes prior to scheduled start.
  - Completed state: "Download Invoice", "View Notes & Files", "Leave a Review", "Book Follow-Up".
- **APIs:** `GET /api/v1/bookings/my-consultations?status={tab}`.

#### Screen 19: Consultation Room Screen
- **App:** User App & Lawyer App
- **Components:**
  - **Video/Audio Mode:** Full-screen Agora RTC surface view, remote video stream, local PIP camera feed, microphone mute toggle, camera flip/toggle, speakerphone toggle, screen share button, live elapsed call duration timer, end-call button.
  - **Integrated Drawer / Tab:**
    - Chat Drawer: In-session real-time message stream for exchanging references, court dates, and case laws.
    - Document Viewer: In-call preview of uploaded PDF briefs with pinch-to-zoom.
    - Private Session Notes (Lawyer only).
- **APIs:** `POST /api/v1/consultations/:id/join`, Socket.io signaling events, WebRTC ICE exchange.

#### Screen 20: Consultation Completion & Review Screen
- **App:** User App
- **Components:** Consultation summary card (Actual duration, lawyer name, date), 5-star interactive rating component, Category tags ("Punctual", "In-depth Legal Knowledge", "Clear Explanation", "Empathetic"), Written review text box, "Would you recommend this lawyer to others?" toggle, "Submit Feedback" button, "Request Follow-Up Consultation" shortcut.
- **APIs:** `POST /api/v1/reviews`.

---

### 3.4 User App — Legal Problem & Services (Screens 21 – 28)

#### Screen 21: Describe My Problem (AI Intake Triage)
- **App:** User App
- **Components:** Large auto-expanding text area ("Describe your situation in plain words... e.g., 'My landlord is refusing to return my security deposit after I vacated the apartment 3 months ago'"), Audio voice-to-text recording button, Legal Disclaimer ("AI problem description is for categorization and triage purposes only and does not constitute formal legal advice").
- **APIs:** `POST /api/v1/triage/analyze`.

#### Screen 22: Problem Details Screen
- **App:** User App
- **Components:** Auto-extracted information confirmation screen: Detected Category dropdown (user can override), Sub-category, Urgency Selector (Emergency: 24h Bail/Arrest; Urgent: 3-5 days; Standard inquiry), Incident Location / City, File uploader for relevant documents (rent agreement, police notice, bounced cheque copy).

#### Screen 23: Suggested Service & Lawyer Matching Screen
- **App:** User App
- **Components:** AI Analysis Summary Card ("Based on your issue, this pertains to Real Estate & Tenancy Law under the Model Tenancy Act"), Recommended Action cards ("1. Send a Legal Notice for recovery", "2. Book a 20-min Consultation with a Tenancy Lawyer"), Top 3 matched lawyers with high win/experience records in the specific issue, "Book Immediate Consultation" button.

#### Screen 24: Document Services Catalog Screen
- **App:** User App
- **Components:** Search bar for legal templates and custom drafting services. Service categories:
  - Business: Non-Disclosure Agreement (NDA), Founder's Agreement, Employment Contract, Service Agreement.
  - Personal: Rent Agreement, Will Drafting, General Power of Attorney, Name Change Affidavit.
  - Notices: Cheque Bounce Notice (Section 138), Eviction Notice, Consumer Complaint Notice, Breach of Contract Notice.
  - Service Card: Title, Delivery Timeline ("Delivered in 48 Hours"), Inclusions (1 Draft + 2 Revisions + Lawyer Consultation), Fixed Price.
- **APIs:** `GET /api/v1/document-services`.

#### Screen 25: Document Request Intake Screen
- **App:** User App
- **Components:** Dynamic multi-step form tailored to the selected document type (e.g., for Rent Agreement: Landlord Name, Tenant Name, Monthly Rent, Security Deposit, Lock-in Period, Property Address), Document upload for supporting identification, Custom instructions text area.

#### Screen 26: Quote & Order Summary Screen
- **App:** User App
- **Components:** Assigned Lawyer or Open Marketplace Bidding option, Scope of Work confirmation, Revision policy (2 free revisions included within 7 days), Delivery SLA deadline timestamp, Total cost breakdown, Payment checkout button (Escrow protection).
- **APIs:** `POST /api/v1/document-orders`.

#### Screen 27: Document Workspace Screen
- **App:** User App & Lawyer App
- **Components:**
  - Status Stepper: `Requirement Submitted` -> `Lawyer Assigned` -> `Drafting in Progress` -> `Draft v1 Shared` -> `Revision Requested` -> `Final Approved`.
  - Document Viewer & Version History: Download / Preview PDF or DOCX draft files with version tags (`v1.0`, `v1.1`, `v2.0 Final`).
  - Annotation & Feedback Panel: Client can highlight or leave timestamped comment threads requesting changes.
  - "Approve Final Document" button (triggers escrow release to lawyer) and "Request Revision" button.
- **APIs:** `GET /api/v1/document-orders/:id`, `POST /api/v1/document-orders/:id/revisions`.

#### Screen 28: Legal Notice Service Screen
- **App:** User App
- **Components:** Specialized workflow tracking for formal Legal Notices: Notice drafting -> Client approval -> Advocate signature with Bar Seal -> Registered Postal Dispatch tracking (Speed Post / Courier tracking number integration) -> Delivery proof slip upload.

---

### 3.5 User App — Case & Account (Screens 29 – 35)

#### Screen 29: My Cases Screen
- **App:** User App
- **Components:** Ongoing litigation and legal matter cards: Case Title (e.g., "Sharma vs. Apex Builders"), Case Number / CNR Number, Forum/Court (e.g., "State Consumer Disputes Redressal Commission"), Assigned Advocate, Next Hearing Date badge, Case Status (`FILED`, `EVIDENCE`, `ARGUMENTS`, `JUDGMENT`). Floating Action Button: "Link Existing Court Case".
- **APIs:** `GET /api/v1/cases`.

#### Screen 30: Case Details Screen
- **App:** User App
- **Components:**
  - Case Summary Header: Parties involved (Petitioner vs Respondent), Advocate in charge, Filing date.
  - Hearing Timeline: Chronological timeline of all past court proceedings with advocate's daily court orders summary.
  - Important Next Dates: Countdown to next hearing with reminder toggle.
  - Case Documents: Pleadings, Vakalatnama, Interim orders, Exhibits.
  - Lawyer Communication button (Direct chat or call booking).
- **APIs:** `GET /api/v1/cases/:id`.

#### Screen 31: Documents Vault Screen
- **App:** User App
- **Components:** Secure encrypted repository for personal legal identity documents (Aadhaar/Passport, Property Deeds, Marriage Certificate, Employment contracts). Categorized folders, upload document button, document sharing permissions (grant temporary access to lawyer X for 48 hours), file encryption badge.
- **APIs:** `GET /api/v1/vault`, `POST /api/v1/vault/grant-access`.

#### Screen 32: Notifications Screen
- **App:** User App & Lawyer App
- **Components:** Filterable notifications list: All, Bookings, Messages, Documents, Billing. Read/unread visual distinction, swipe to dismiss, tap to deep-link into the respective screen.
- **APIs:** `GET /api/v1/notifications`, `PATCH /api/v1/notifications/mark-read`.

#### Screen 33: Payments & Invoices Screen
- **App:** User App
- **Components:** Historical ledger of all transactions: Date, Booking / Order ID, Service Type, Amount Paid, Payment Method, Payment Status (`SUCCESS`, `REFUNDED`, `FAILED`), "Download Tax Invoice (PDF)" button.
- **APIs:** `GET /api/v1/payments/history`.

#### Screen 34: Profile & Settings Screen
- **App:** User App
- **Components:** Profile photo, Personal details editor, App language selector, Biometric Login toggle (FaceID / Fingerprint), Notification preferences (Push, SMS, WhatsApp), Privacy policy & Terms of Service, "Delete Account" / "Export My Legal Data" (GDPR/DPDP compliance), Logout button.

#### Screen 35: Help & Support Screen
- **App:** User App & Lawyer App
- **Components:** Frequently Asked Questions (searchable accordion), "Raise a Dispute / Ticket" form, Live Chat with Platform Support agent, Emergency hotline link.
- **APIs:** `POST /api/v1/support/tickets`.

---

### 3.6 Lawyer App / Panel (Screens 36 – 46)

#### Screen 36: Lawyer Login & Verification Onboarding
- **App:** Lawyer App
- **Components:** Multi-step credentialing wizard:
  - Step 1: Mobile OTP Login & Email verification.
  - Step 2: Bar Council Enrollment Number, State Bar Council selection, Year of Enrollment.
  - Step 3: Bar Council ID Card upload (front & back), Law Degree (LL.B/LL.M) certificate upload, Government ID (Aadhaar/PAN/Passport).
  - Step 4: Bank Account details for direct NEFT/IMPS settlement (Account number, IFSC code, Account holder name).
  - Verification Status Screen: "Application Submitted. Under verification by our Compliance Team (estimated 24-48 hours)."
- **APIs:** `POST /api/v1/lawyers/onboarding`.

#### Screen 37: Lawyer Dashboard
- **App:** Lawyer App
- **Components:**
  - Status Toggle: "Online / Available for Instant Consultation" switch.
  - Metrics Cards: Today's Appointments count, Pending Consultation Requests, Active Cases, Month-to-Date Earnings (₹).
  - Agenda Timeline: Real-time chronological schedule of today's video calls, audio calls, and chamber meetings.
  - Urgent Tasks: Document drafts awaiting review, pending client queries.
- **APIs:** `GET /api/v1/lawyers/dashboard`.

#### Screen 38: Lawyer Profile Editor
- **App:** Lawyer App
- **Components:** Professional bio markdown editor, Courts of Practice selector, Specialization tags selector, Languages spoken, Fee settings per consultation mode (Video, Audio, Chat, In-Person rates per 20/45 min), Upload chamber/office photos.
- **APIs:** `PUT /api/v1/lawyers/profile`.

#### Screen 39: Availability Calendar Management
- **App:** Lawyer App
- **Components:**
  - Weekly Recurring Schedule: Toggle days (Mon-Sun), set working hours (e.g., 09:00 - 13:00, 16:00 - 20:00), configure slot duration (15m, 20m, 30m, 45m, 60m), buffer time between calls (e.g., 5 mins).
  - Blocked Dates / Vacation Mode: Date picker to mark court holidays, vacation, or emergency leaves.
- **APIs:** `PUT /api/v1/lawyers/availability`.

#### Screen 40: Consultation Requests Screen
- **App:** Lawyer App
- **Components:** List of incoming booking requests: Client Name, Legal Category, Client Brief summary, Requested Slot. Action buttons: "Accept Booking", "Propose Reschedule", "Decline Request (with mandatory reason)".
- **APIs:** `PATCH /api/v1/appointments/:id/status`.

#### Screen 41: Lawyer Appointment Detail Screen
- **App:** Lawyer App
- **Components:** Client profile summary, Selected mode, Case brief, Attached client documents, "Join Consultation Room" CTA, Private Lawyer Case Notes scratchpad, Prescribe Next Action (e.g., "File Legal Notice", "Book Follow-up").

#### Screen 42: Client Management Screen
- **App:** Lawyer App
- **Components:** Searchable client directory: Client Name, Total Consultations, Active Cases, Documents Exchanged, Last Interaction Date, Client quick action (Call, Message, Add Note).
- **APIs:** `GET /api/v1/lawyers/clients`.

#### Screen 43: Chat & Documents Screen
- **App:** Lawyer App & User App
- **Components:** Secure WhatsApp-style end-to-end messaging thread: Text messages, Voice notes, PDF preview bubbles, Image attachments, Read receipts (double ticks), Typing indicators, In-chat "Request Additional Document" action.
- **APIs:** Socket.io chat gateway, `GET /api/v1/chat/messages`.

#### Screen 44: Lawyer Case Management Screen
- **App:** Lawyer App
- **Components:** Full practice litigation management: Active Cases list, Hearing Calendar, Court Bench allocation, CNR number lookup, Daily Cause List sync, Client communication log.

#### Screen 45: Earnings & Payouts Screen
- **App:** Lawyer App
- **Components:**
  - Financial Metrics: Total Lifetime Earnings, Available Wallet Balance, Escrow Locked Balance (pending consultation completion), Lifetime Commission Paid.
  - "Withdraw Funds" button (triggers automated payout to verified bank account).
  - Payout History Table: Date, Payout ID, Amount, Bank Reference (UTR), Status (`PROCESSED`, `IN_TRANSIT`, `FAILED`).
- **APIs:** `GET /api/v1/lawyers/wallet`, `POST /api/v1/lawyers/payouts/request`.

#### Screen 46: Reviews & Profile Analytics Screen
- **App:** Lawyer App
- **Components:** Profile view count, Search appearance metrics, Conversion rate (Views to Bookings), Client rating breakdown, Client feedback cards with public "Reply as Lawyer" feature.
- **APIs:** `GET /api/v1/lawyers/analytics`.

---

### 3.7 Admin Panel (Screens 47 – 58)

#### Screen 47: Admin Dashboard
- **App:** Admin Web Portal
- **Components:** Real-time KPI counters: Total Active Users, Verified Lawyers, Pending Lawyer KYC Applications, Today's Consultations, Gross Merchandise Value (GMV), Platform Net Revenue, Active Disputes. Visual line charts for revenue trends and category distribution pie chart.
- **APIs:** `GET /api/v1/admin/dashboard/metrics`.

#### Screen 48: User Management Screen
- **App:** Admin Web Portal
- **Components:** Paginated data table of all users: User ID, Name, Phone, Email, Joined Date, Total Bookings, Status (`ACTIVE`, `SUSPENDED`, `FLAGGED`). Actions: View Activity Log, Suspend User, Reset Password, Impersonate View.
- **APIs:** `GET /api/v1/admin/users`, `PATCH /api/v1/admin/users/:id`.

#### Screen 49: Lawyer Verification & KYC Portal
- **App:** Admin Web Portal
- **Components:** Split-screen verification workstation:
  - Left pane: Lawyer submitted profile, Bar Council enrollment number, State Bar selection.
  - Right pane: High-res document viewer with zoom & pan for Bar Council ID card, Certificate of Practice, and Degree.
  - Verification Actions: "Approve & Issue Verified Badge", "Reject with Feedback" (e.g., "Bar ID blurry", "Name mismatch on Degree"), "Request Additional Documents".
- **APIs:** `GET /api/v1/admin/lawyer-verifications`, `POST /api/v1/admin/lawyer-verifications/:id/decision`.

#### Screen 50: Lawyer Management Screen
- **App:** Admin Web Portal
- **Components:** Master advocate directory: Edit lawyer category mappings, inspect pricing limits, override commission rates, toggle verification status, deactivate non-compliant lawyers.

#### Screen 51: Booking Management Screen
- **App:** Admin Web Portal
- **Components:** Complete ledger of all platform consultations: Filter by date range, lawyer, client, mode, and status. Force reschedule, manual cancellation, and emergency room link generation.

#### Screen 52: Payment, Commission & Payout Management
- **App:** Admin Web Portal
- **Components:** Escrow transaction logs, Gateway payment reconciliation, Platform commission calculator (15% standard, configurable per lawyer), Batch Payout Approval interface (Approve NEFT/IMPS transfers to lawyers), Refund issuance workstation.
- **APIs:** `GET /api/v1/admin/financials/ledger`, `POST /api/v1/admin/payouts/approve`.

#### Screen 53: Service & Category Management
- **App:** Admin Web Portal
- **Components:** CRUD manager for Legal Categories (Criminal, Civil, etc.), Sub-categories, and Document Drafting Service templates (Add new templates, configure base pricing, update form fields).

#### Screen 54: Content Management System (CMS) & Knowledge Base
- **App:** Admin Web Portal
- **Components:** Rich-text markdown editor for Home promotional banners, Legal Articles & Blogs, FAQ entries, Terms of Service, Privacy Policies, and Bar Council compliance disclaimers.

#### Screen 55: Complaints & Dispute Resolution Workstation
- **App:** Admin Web Portal
- **Components:** Dispute management queue: Client grievance tickets regarding lawyer no-shows, poor consultation quality, or delayed document drafts. Workstation displays call logs (duration, start/end timestamps), chat transcripts, and refund authorization buttons (Full Refund, Partial Refund, Reject Claim).
- **APIs:** `GET /api/v1/admin/disputes`, `POST /api/v1/admin/disputes/:id/resolve`.

#### Screen 56: Reports & Business Intelligence Analytics
- **App:** Admin Web Portal
- **Components:** Exportable reports (CSV, Excel, PDF): Monthly Financial Reconciliation, Lawyer Performance & Ratings, Customer Retention, High-Demand Legal Practice Areas by City, User Drop-off Funnel Analysis.

#### Screen 57: Notification Center & Broadcast Engine
- **App:** Admin Web Portal
- **Components:** Multi-channel broadcast composer: Send targeted Push Notifications, SMS broadcasts, or System Emails to specific audience segments (All Clients, All Lawyers, Unverified Lawyers, Clients in Delhi). Notification template editor.

#### Screen 58: Admin Roles, Permissions & Immutable Audit Logs
- **App:** Admin Web Portal
- **Components:** Role-Based Access Control matrix (`SUPER_ADMIN`, `COMPLIANCE_OFFICER`, `FINANCE_MANAGER`, `SUPPORT_AGENT`). Detailed tamper-proof audit log viewer: Timestamp, Actor IP address, Admin User, Action (`APPROVED_LAWYER_KYC`, `ISSUED_REFUND`), Target Record ID, Before & After JSON state diff.
- **APIs:** `GET /api/v1/admin/audit-logs`.

---

## 4. Complete SQL Database Architecture & Schema Specification

The relational database is built on **PostgreSQL 16**. Below is the complete SQL DDL schema including enums, tables, foreign keys, constraints, and optimized indexes.

```sql
-- ============================================================================
-- 1. EXTENSIONS & ENUMS
-- ============================================================================
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";
CREATE EXTENSION IF NOT EXISTS "pgcrypto";
CREATE EXTENSION IF NOT EXISTS "postgis";
CREATE EXTENSION IF NOT EXISTS "pg_trgm";

CREATE TYPE user_role_enum AS ENUM ('CLIENT', 'LAWYER', 'ADMIN', 'SUPPORT');
CREATE TYPE verification_status_enum AS ENUM ('UNSUBMITTED', 'PENDING', 'APPROVED', 'REJECTED', 'SUSPENDED');
CREATE TYPE consultation_mode_enum AS ENUM ('CHAT', 'AUDIO', 'VIDEO', 'OFFLINE');
CREATE TYPE appointment_status_enum AS ENUM ('PENDING', 'CONFIRMED', 'IN_PROGRESS', 'COMPLETED', 'CANCELLED', 'NO_SHOW', 'RESCHEDULED');
CREATE TYPE payment_status_enum AS ENUM ('INITIATED', 'SUCCESS', 'FAILED', 'REFUNDED', 'DISPUTED');
CREATE TYPE payout_status_enum AS ENUM ('REQUESTED', 'PROCESSING', 'PAID', 'REJECTED');
CREATE TYPE doc_order_status_enum AS ENUM ('REQUESTED', 'QUOTED', 'PAID', 'DRAFTING', 'IN_REVIEW', 'COMPLETED', 'CANCELLED');
CREATE TYPE dispute_status_enum AS ENUM ('OPEN', 'INVESTIGATING', 'RESOLVED_REFUNDED', 'RESOLVED_REJECTED', 'CLOSED');

-- ============================================================================
-- 2. USERS & AUTHENTICATION
-- ============================================================================
CREATE TABLE users (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    phone_country_code VARCHAR(5) NOT NULL DEFAULT '+91',
    phone_number VARCHAR(15) NOT NULL UNIQUE,
    email VARCHAR(255) UNIQUE,
    password_hash VARCHAR(255),
    role user_role_enum NOT NULL DEFAULT 'CLIENT',
    is_phone_verified BOOLEAN NOT NULL DEFAULT FALSE,
    is_email_verified BOOLEAN NOT NULL DEFAULT FALSE,
    is_active BOOLEAN NOT NULL DEFAULT TRUE,
    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE INDEX idx_users_phone ON users(phone_number);
CREATE INDEX idx_users_role ON users(role);

-- ============================================================================
-- 3. CLIENT PROFILES
-- ============================================================================
CREATE TABLE client_profiles (
    user_id UUID PRIMARY KEY REFERENCES users(id) ON DELETE CASCADE,
    full_name VARCHAR(100) NOT NULL,
    avatar_url TEXT,
    city VARCHAR(100),
    state VARCHAR(100),
    pincode VARCHAR(10),
    preferred_language VARCHAR(50) DEFAULT 'English',
    coordinates GEOMETRY(Point, 4326),
    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- ============================================================================
-- 4. LEGAL CATEGORIES & SPECIALIZATIONS
-- ============================================================================
CREATE TABLE categories (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    slug VARCHAR(100) NOT NULL UNIQUE,
    name VARCHAR(100) NOT NULL,
    description TEXT,
    icon_url TEXT,
    display_order INT DEFAULT 0,
    is_active BOOLEAN NOT NULL DEFAULT TRUE,
    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE TABLE specializations (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    category_id UUID NOT NULL REFERENCES categories(id) ON DELETE CASCADE,
    name VARCHAR(100) NOT NULL,
    description TEXT,
    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- ============================================================================
-- 5. LAWYER PROFILES & VERIFICATION
-- ============================================================================
CREATE TABLE lawyer_profiles (
    user_id UUID PRIMARY KEY REFERENCES users(id) ON DELETE CASCADE,
    full_name VARCHAR(100) NOT NULL,
    avatar_url TEXT,
    bar_council_number VARCHAR(100) NOT NULL UNIQUE,
    state_bar_council VARCHAR(100) NOT NULL,
    year_of_enrollment INT NOT NULL,
    experience_years INT NOT NULL DEFAULT 0,
    bio TEXT,
    qualification_summary TEXT,
    office_address TEXT,
    city VARCHAR(100) NOT NULL,
    state VARCHAR(100) NOT NULL,
    coordinates GEOMETRY(Point, 4326),
    languages TEXT[] DEFAULT ARRAY['English'],
    courts_of_practice TEXT[],
    verification_status verification_status_enum NOT NULL DEFAULT 'UNSUBMITTED',
    is_online_for_instant BOOLEAN NOT NULL DEFAULT FALSE,
    rating_average NUMERIC(3, 2) NOT NULL DEFAULT 0.00,
    rating_count INT NOT NULL DEFAULT 0,
    consultation_fee_chat NUMERIC(10, 2) DEFAULT 499.00,
    consultation_fee_audio NUMERIC(10, 2) DEFAULT 699.00,
    consultation_fee_video NUMERIC(10, 2) DEFAULT 999.00,
    consultation_fee_offline NUMERIC(10, 2) DEFAULT 1999.00,
    platform_commission_rate NUMERIC(5, 2) DEFAULT 15.00,
    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE INDEX idx_lawyer_city ON lawyer_profiles(city);
CREATE INDEX idx_lawyer_rating ON lawyer_profiles(rating_average DESC);
CREATE INDEX idx_lawyer_experience ON lawyer_profiles(experience_years DESC);
CREATE INDEX idx_lawyer_verification ON lawyer_profiles(verification_status);
CREATE INDEX idx_lawyer_coordinates ON lawyer_profiles USING GIST(coordinates);

CREATE TABLE lawyer_categories (
    lawyer_id UUID NOT NULL REFERENCES lawyer_profiles(user_id) ON DELETE CASCADE,
    category_id UUID NOT NULL REFERENCES categories(id) ON DELETE CASCADE,
    PRIMARY KEY (lawyer_id, category_id)
);

CREATE TABLE lawyer_verifications (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    lawyer_id UUID NOT NULL REFERENCES lawyer_profiles(user_id) ON DELETE CASCADE,
    bar_council_id_front_url TEXT NOT NULL,
    bar_council_id_back_url TEXT NOT NULL,
    degree_certificate_url TEXT NOT NULL,
    government_id_url TEXT NOT NULL,
    submitted_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    reviewed_at TIMESTAMPTZ,
    reviewed_by UUID REFERENCES users(id),
    status verification_status_enum NOT NULL DEFAULT 'PENDING',
    rejection_reason TEXT,
    admin_internal_notes TEXT
);

-- ============================================================================
-- 6. LAWYER AVAILABILITY & SLOTS
-- ============================================================================
CREATE TABLE lawyer_schedules (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    lawyer_id UUID NOT NULL REFERENCES lawyer_profiles(user_id) ON DELETE CASCADE,
    day_of_week SMALLINT NOT NULL CHECK (day_of_week BETWEEN 0 AND 6), -- 0=Sun, 6=Sat
    start_time TIME NOT NULL,
    end_time TIME NOT NULL,
    slot_duration_minutes INT NOT NULL DEFAULT 20,
    consultation_mode consultation_mode_enum NOT NULL,
    is_active BOOLEAN NOT NULL DEFAULT TRUE,
    CONSTRAINT check_time_order CHECK (start_time < end_time)
);

CREATE TABLE lawyer_blocked_dates (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    lawyer_id UUID NOT NULL REFERENCES lawyer_profiles(user_id) ON DELETE CASCADE,
    start_date DATE NOT NULL,
    end_date DATE NOT NULL,
    reason TEXT,
    CONSTRAINT check_date_order CHECK (start_date <= end_date)
);

-- ============================================================================
-- 7. APPOINTMENTS & CONSULTATIONS
-- ============================================================================
CREATE TABLE appointments (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    booking_reference VARCHAR(30) NOT NULL UNIQUE,
    client_id UUID NOT NULL REFERENCES users(id) ON DELETE RESTRICT,
    lawyer_id UUID NOT NULL REFERENCES users(id) ON DELETE RESTRICT,
    category_id UUID REFERENCES categories(id),
    consultation_mode consultation_mode_enum NOT NULL,
    status appointment_status_enum NOT NULL DEFAULT 'PENDING',
    scheduled_start TIMESTAMPTZ NOT NULL,
    scheduled_end TIMESTAMPTZ NOT NULL,
    client_case_brief TEXT,
    consultation_fee NUMERIC(10, 2) NOT NULL,
    platform_fee NUMERIC(10, 2) NOT NULL,
    tax_amount NUMERIC(10, 2) NOT NULL DEFAULT 0.00,
    total_amount NUMERIC(10, 2) NOT NULL,
    lawyer_net_earnings NUMERIC(10, 2) NOT NULL,
    cancellation_reason TEXT,
    cancelled_by UUID REFERENCES users(id),
    rescheduled_from_id UUID REFERENCES appointments(id),
    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    CONSTRAINT check_scheduled_times CHECK (scheduled_start < scheduled_end)
);

CREATE INDEX idx_appointments_client ON appointments(client_id);
CREATE INDEX idx_appointments_lawyer ON appointments(lawyer_id);
CREATE INDEX idx_appointments_status ON appointments(status);
CREATE INDEX idx_appointments_start ON appointments(scheduled_start);

CREATE TABLE consultation_rooms (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    appointment_id UUID NOT NULL UNIQUE REFERENCES appointments(id) ON DELETE CASCADE,
    agora_channel_name VARCHAR(100) NOT NULL UNIQUE,
    agora_token TEXT,
    started_at TIMESTAMPTZ,
    ended_at TIMESTAMPTZ,
    actual_duration_seconds INT DEFAULT 0,
    recording_url TEXT,
    lawyer_notes TEXT,
    is_completed BOOLEAN NOT NULL DEFAULT FALSE
);

-- ============================================================================
-- 8. REAL-TIME CHAT & MESSAGES
-- ============================================================================
CREATE TABLE chat_threads (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    appointment_id UUID UNIQUE REFERENCES appointments(id) ON DELETE SET NULL,
    client_id UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
    lawyer_id UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    last_message_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE TABLE chat_messages (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    thread_id UUID NOT NULL REFERENCES chat_threads(id) ON DELETE CASCADE,
    sender_id UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
    message_type VARCHAR(20) NOT NULL DEFAULT 'TEXT', -- 'TEXT', 'IMAGE', 'DOCUMENT', 'VOICE'
    message_text TEXT,
    file_url TEXT,
    file_name VARCHAR(255),
    file_size_bytes BIGINT,
    is_read BOOLEAN NOT NULL DEFAULT FALSE,
    read_at TIMESTAMPTZ,
    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE INDEX idx_chat_messages_thread ON chat_messages(thread_id, created_at DESC);

-- ============================================================================
-- 9. DOCUMENT SERVICES & ORDERS
-- ============================================================================
CREATE TABLE document_services (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    slug VARCHAR(100) NOT NULL UNIQUE,
    name VARCHAR(100) NOT NULL,
    category_id UUID REFERENCES categories(id),
    description TEXT,
    standard_price NUMERIC(10, 2) NOT NULL,
    delivery_sla_days INT NOT NULL DEFAULT 2,
    revisions_included INT NOT NULL DEFAULT 2,
    intake_schema JSONB NOT NULL, -- Dynamic form fields JSON Schema
    is_active BOOLEAN NOT NULL DEFAULT TRUE,
    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE TABLE document_orders (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    order_reference VARCHAR(30) NOT NULL UNIQUE,
    service_id UUID NOT NULL REFERENCES document_services(id),
    client_id UUID NOT NULL REFERENCES users(id),
    assigned_lawyer_id UUID REFERENCES users(id),
    status doc_order_status_enum NOT NULL DEFAULT 'REQUESTED',
    submitted_inputs JSONB NOT NULL,
    price_quote NUMERIC(10, 2) NOT NULL,
    platform_commission NUMERIC(10, 2) NOT NULL,
    delivery_deadline TIMESTAMPTZ,
    final_document_url TEXT,
    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE TABLE document_drafts (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    order_id UUID NOT NULL REFERENCES document_orders(id) ON DELETE CASCADE,
    version_number INT NOT NULL,
    file_url TEXT NOT NULL,
    file_name VARCHAR(255) NOT NULL,
    notes_from_lawyer TEXT,
    client_feedback TEXT,
    is_approved BOOLEAN NOT NULL DEFAULT FALSE,
    uploaded_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- ============================================================================
-- 10. CLIENT ENCRYPTED DOCUMENT VAULT
-- ============================================================================
CREATE TABLE document_vault (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
    document_title VARCHAR(200) NOT NULL,
    category VARCHAR(100),
    s3_key TEXT NOT NULL,
    s3_bucket VARCHAR(100) NOT NULL,
    file_size_bytes BIGINT NOT NULL,
    mime_type VARCHAR(100) NOT NULL,
    is_encrypted BOOLEAN NOT NULL DEFAULT TRUE,
    encryption_algorithm VARCHAR(50) DEFAULT 'AES-256-GCM',
    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE TABLE vault_access_grants (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    document_id UUID NOT NULL REFERENCES document_vault(id) ON DELETE CASCADE,
    granted_to_lawyer_id UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
    appointment_id UUID REFERENCES appointments(id),
    expires_at TIMESTAMPTZ NOT NULL,
    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- ============================================================================
-- 11. CASE MANAGEMENT
-- ============================================================================
CREATE TABLE cases (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    client_id UUID NOT NULL REFERENCES users(id),
    lawyer_id UUID NOT NULL REFERENCES users(id),
    case_title VARCHAR(255) NOT NULL,
    cnr_number VARCHAR(50),
    court_name VARCHAR(200) NOT NULL,
    case_type VARCHAR(100) NOT NULL,
    case_status VARCHAR(50) NOT NULL DEFAULT 'FILED',
    filing_date DATE,
    next_hearing_date DATE,
    petitioner_name VARCHAR(150),
    respondent_name VARCHAR(150),
    notes TEXT,
    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE TABLE case_hearings (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    case_id UUID NOT NULL REFERENCES cases(id) ON DELETE CASCADE,
    hearing_date DATE NOT NULL,
    court_room VARCHAR(50),
    judge_name VARCHAR(150),
    proceedings_summary TEXT,
    next_action TEXT,
    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- ============================================================================
-- 12. PAYMENTS, ESCROW & LAWYER WALLETS
-- ============================================================================
CREATE TABLE payments (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    transaction_reference VARCHAR(50) NOT NULL UNIQUE,
    user_id UUID NOT NULL REFERENCES users(id),
    appointment_id UUID REFERENCES appointments(id),
    document_order_id UUID REFERENCES document_orders(id),
    gateway_order_id VARCHAR(100) NOT NULL,
    gateway_payment_id VARCHAR(100),
    gateway_signature VARCHAR(255),
    amount NUMERIC(10, 2) NOT NULL,
    currency VARCHAR(5) NOT NULL DEFAULT 'INR',
    status payment_status_enum NOT NULL DEFAULT 'INITIATED',
    payment_method VARCHAR(50),
    gateway_response JSONB,
    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE INDEX idx_payments_user ON payments(user_id);
CREATE INDEX idx_payments_status ON payments(status);

CREATE TABLE lawyer_wallets (
    lawyer_id UUID PRIMARY KEY REFERENCES users(id) ON DELETE CASCADE,
    available_balance NUMERIC(10, 2) NOT NULL DEFAULT 0.00,
    escrow_locked_balance NUMERIC(10, 2) NOT NULL DEFAULT 0.00,
    total_withdrawn NUMERIC(10, 2) NOT NULL DEFAULT 0.00,
    updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE TABLE payout_requests (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    lawyer_id UUID NOT NULL REFERENCES users(id),
    amount NUMERIC(10, 2) NOT NULL,
    bank_account_number VARCHAR(50) NOT NULL,
    bank_ifsc_code VARCHAR(20) NOT NULL,
    status payout_status_enum NOT NULL DEFAULT 'REQUESTED',
    bank_reference_utr VARCHAR(100),
    processed_at TIMESTAMPTZ,
    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- ============================================================================
-- 13. REVIEWS, RATINGS & COMPLAINTS
-- ============================================================================
CREATE TABLE reviews (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    appointment_id UUID UNIQUE REFERENCES appointments(id) ON DELETE CASCADE,
    client_id UUID NOT NULL REFERENCES users(id),
    lawyer_id UUID NOT NULL REFERENCES users(id),
    rating INT NOT NULL CHECK (rating BETWEEN 1 AND 5),
    review_title VARCHAR(150),
    review_text TEXT,
    lawyer_reply_text TEXT,
    is_published BOOLEAN NOT NULL DEFAULT TRUE,
    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE TABLE disputes (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    dispute_reference VARCHAR(30) NOT NULL UNIQUE,
    raised_by_user_id UUID NOT NULL REFERENCES users(id),
    appointment_id UUID REFERENCES appointments(id),
    document_order_id UUID REFERENCES document_orders(id),
    issue_type VARCHAR(100) NOT NULL,
    description TEXT NOT NULL,
    evidence_urls TEXT[],
    status dispute_status_enum NOT NULL DEFAULT 'OPEN',
    admin_resolution_notes TEXT,
    resolved_by UUID REFERENCES users(id),
    refund_amount NUMERIC(10, 2) DEFAULT 0.00,
    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- ============================================================================
-- 14. NOTIFICATIONS & AUDIT LOGS
-- ============================================================================
CREATE TABLE notifications (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
    title VARCHAR(200) NOT NULL,
    body TEXT NOT NULL,
    category VARCHAR(50) NOT NULL, -- 'APPOINTMENT', 'PAYMENT', 'DOCUMENT', 'SYSTEM'
    payload JSONB,
    is_read BOOLEAN NOT NULL DEFAULT FALSE,
    read_at TIMESTAMPTZ,
    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE TABLE audit_logs (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    actor_id UUID REFERENCES users(id),
    actor_role VARCHAR(50),
    actor_ip VARCHAR(50),
    action VARCHAR(100) NOT NULL, -- e.g., 'VERIFIED_LAWYER', 'PROCESSED_REFUND'
    target_entity VARCHAR(100) NOT NULL,
    target_entity_id UUID,
    before_state JSONB,
    after_state JSONB,
    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE INDEX idx_audit_logs_actor ON audit_logs(actor_id);
CREATE INDEX idx_audit_logs_action ON audit_logs(action);
```

---

## 5. End-to-End Workflows & Business Logic

### 5.1 End-to-End Workflow 1: Lawyer Discovery, Booking & Consultation

```
[User App]                  [Backend API & Redis]                 [Payment Gateway]             [Lawyer App]
    |                                 |                                   |                          |
 1. Selects Lawyer, Mode & Slot ----> |                                   |                          |
    |                                 |-- Checks Slot Availability        |                          |
    |                                 |-- Acquires Redis Mutex Lock (10m) |                          |
    | <---- Returns Order Quote ------|                                   |                          |
    |                                 |                                   |                          |
 2. Initiates Checkout -------------> |-- Creates Gateway Order --------> |                          |
    |                                 | <---- Returns Order Token --------|                          |
    | <---- Launches Native SDK ------|                                   |                          |
    |                                                                     |                          |
 3. Completes UPI / Card Payment ---------------------------------------> |                          |
    |                                                                     |-- Webhook (payment.auth) |
    |                                 |<----------------------------------|                          |
    |                                 |-- Verifies HMAC Signature         |                          |
    |                                 |-- Updates Status: CONFIRMED       |                          |
    |                                 |-- Locks Slot in PostgreSQL        |                          |
    |                                 |-- Dispatches FCM Push -------------------------------------> |
    | <---- Shows Booking Confirmed --|                                   |        Receives Alert &  |
    |                                 |                                   |        Calendar Sync     |
```

#### Detailed Execution Steps:
1. **Slot Mutex Locking:** When the user taps "Proceed to Pay", backend acquires a temporary distributed lock on key `slot:{lawyer_id}:{date}:{start_time}` in Redis with a 600-second TTL. This completely prevents race conditions and double bookings.
2. **Escrow Ingestion:** Payment of ₹999 is received by the Payment Gateway. Backend records the transaction as `SUCCESS`. The funds are credited to the platform merchant account, and an internal ledger entry puts ₹849.15 (Fee minus 15% commission) into `lawyer_wallets.escrow_locked_balance`.
3. **Room Provisioning:** 15 minutes prior to `scheduled_start`, a background BullMQ job initializes an encrypted Agora RTC Room channel `lawyer_{id}_client_{id}_{booking_id}` and generates dual dynamic join tokens valid for 45 minutes.
4. **Live Consultation Execution:** Both client and lawyer join via native Agora surfaces. Backend listens to Agora channel events via webhooks (`channel_create`, `user_join`, `user_leave`, `channel_destroy`). Actual call duration is tracked.
5. **Session Wrap-Up & Completion:** At scheduled end time + 5-minute grace period, room terminates. Status updates to `COMPLETED`. 
6. **Escrow Maturation:** Following a 24-hour dispute window without client complaints, BullMQ job moves ₹849.15 from `escrow_locked_balance` to `available_balance`, enabling instant withdrawal.
7. **Automated Review Prompt:** Push notification triggers on client's phone linking directly to Screen 20 (Rating & Feedback).

---

### 5.2 End-to-End Workflow 2: "Describe My Problem" AI Triage

```
+----------------------------------------------------------------------------------------------------+
|                                    AI LEGAL PROBLEM TRIAGE PIPELINE                                |
+----------------------------------------------------------------------------------------------------+
  1. Client Enters Problem Text (e.g., "Cheque of Rs. 5 Lakhs bounced with remark 'insufficient funds'")
                                        |
                                        v
  2. Input Sanitization & Guardrails: Filters PII, profanity, and self-harm keywords
                                        |
                                        v
  3. LLM Structured Analysis Prompt (OpenAI / Claude / Gemini API):
     • Output Format: JSON (Strict Schema)
     • Category Identification: "Financial Disputes / Negotiable Instruments Act"
     • Legal Issue: "Cheque Dishonour under Section 138 of NI Act"
     • Urgency Level: "High (Mandatory 30-Day Legal Notice Window)"
     • Recommended Action: "Draft and Dispatch Section 138 Statutory Legal Notice"
                                        |
                                        v
  4. Vector Embedding Search (pgvector):
     • Matches problem embedding against specialized lawyer practice embeddings
     • Filters by client's city / jurisdiction
                                        |
                                        v
  5. UI Presentation (Screen 23):
     • Plain-language breakdown of legal rights
     • Statutory Disclaimer: "Information only; consult an advocate for formal advice"
     • Top 3 Matched Lawyers + 1-Click "Dispatch Notice" Service Card
+----------------------------------------------------------------------------------------------------+
```

---

### 5.3 End-to-End Workflow 3: Document Drafting & Revision Service

1. **Intake Form Submission (Screen 25):** Client fills out dynamic schema fields and uploads existing draft/reference PDFs.
2. **Quotation & Escrow Deposit (Screen 26):** Fixed price (e.g., ₹2,499) paid into platform escrow.
3. **Lawyer Drafting (Screen 27):** Assigned lawyer receives intake packet, drafts document, and uploads `v1.0.docx` / `v1.0.pdf` within 48 hours SLA.
4. **Client Review & Inline Annotations:** Client reviews document in-app, can highlight clauses and submit revision queries. (Up to 2 revisions allowed within 7 days).
5. **Approval & Watermarking:** Upon client clicking "Approve Final Document", the backend strips any draft watermarks, applies a verifiable cryptographic SHA-256 seal and QR code verifying document authenticity, releases escrow to lawyer's wallet, and archives document in client's permanent Document Vault.

---

### 5.4 End-to-End Workflow 4: Lawyer Verification & Bar Council Validation

1. **Lawyer Application (Screen 36):** Advocate inputs Bar Council ID, State Bar Council, enrollment year, and uploads photo of Bar Certificate and ID.
2. **Automated OCR & Data Validation:** Backend runs OCR on uploaded Bar ID to verify name matches submitted profile.
3. **Admin Compliance Workstation Review (Screen 49):** Compliance officer inspects documents against State Bar Council public directories.
4. **Decision Dispatch:**
   - **Approved:** Status flips to `APPROVED`. System issues verified tick badge, activates lawyer's public listing, and enables schedule configuration.
   - **Rejected:** Rejection notification with specific defect description sent via SMS/Push. Lawyer can resubmit corrected documents without re-entering entire profile.

---

## 6. Comprehensive Backend REST & WebSocket API Specification

All endpoints are versioned under `/api/v1` and return standardized JSON envelopes:
```json
{
  "success": true,
  "data": { ... },
  "message": "Operation completed successfully",
  "meta": { "page": 1, "total": 100 }
}
```

### 6.1 Authentication & Profile Endpoints
| Method | Route | Auth / Role | Description |
| :--- | :--- | :--- | :--- |
| `POST` | `/api/v1/auth/send-otp` | Public | Sends 6-digit SMS OTP to client or lawyer phone |
| `POST` | `/api/v1/auth/verify-otp` | Public | Verifies OTP; issues JWT Access & Refresh tokens |
| `POST` | `/api/v1/auth/refresh-token` | Public (Bearer) | Exchanges valid refresh token for fresh access token |
| `GET` | `/api/v1/auth/me` | Authenticated | Returns current authenticated user and profile |
| `POST` | `/api/v1/users/profile` | Client | Updates client profile name, email, city, coordinates |
| `POST` | `/api/v1/lawyers/onboarding` | Lawyer | Submits Bar Council credentials and KYC docs |

### 6.2 Lawyer Directory & Availability Endpoints
| Method | Route | Auth / Role | Description |
| :--- | :--- | :--- | :--- |
| `GET` | `/api/v1/categories` | Public | Retrieves all active legal categories & specializations |
| `GET` | `/api/v1/lawyers` | Public | Search/filter lawyers by category, city, fee, rating |
| `GET` | `/api/v1/lawyers/:id` | Public | Detailed lawyer public profile with fees and bio |
| `GET` | `/api/v1/lawyers/:id/availability` | Public | Returns available 20/45-min slots for given date |
| `PUT` | `/api/v1/lawyers/availability` | Lawyer | Updates weekly recurring hours and slot durations |
| `POST` | `/api/v1/lawyers/blocked-dates` | Lawyer | Blocks out vacation dates or court hearing leaves |

### 6.3 Appointments & Consultation Endpoints
| Method | Route | Auth / Role | Description |
| :--- | :--- | :--- | :--- |
| `POST` | `/api/v1/bookings/calculate-quote` | Client | Calculates consultation fee, taxes, and discounts |
| `POST` | `/api/v1/bookings/create` | Client | Initializes appointment; locks slot in Redis (10m) |
| `GET` | `/api/v1/bookings/my-consultations` | Client/Lawyer | Returns paginated upcoming, completed, cancelled |
| `GET` | `/api/v1/bookings/:id` | Client/Lawyer | Detailed view of appointment, notes, and room status |
| `PATCH` | `/api/v1/bookings/:id/status` | Lawyer/Admin | Accepts, rejects, or marks appointment rescheduled |
| `POST` | `/api/v1/consultations/:id/join` | Client/Lawyer | Generates Agora RTC channel token and opens room |
| `POST` | `/api/v1/consultations/:id/complete` | Lawyer/Admin | Marks consultation finished; triggers review prompt |

### 6.4 Real-Time Chat Endpoints
| Method | Route | Auth / Role | Description |
| :--- | :--- | :--- | :--- |
| `GET` | `/api/v1/chat/threads` | Client/Lawyer | Returns active conversation threads |
| `GET` | `/api/v1/chat/threads/:id/messages` | Client/Lawyer | Paginated message history (50 per page) |
| `POST` | `/api/v1/chat/upload` | Client/Lawyer | Uploads PDF/image attachment; returns secure S3 URL |

### 6.5 Document Services & Orders Endpoints
| Method | Route | Auth / Role | Description |
| :--- | :--- | :--- | :--- |
| `GET` | `/api/v1/document-services` | Public | Returns catalog of document drafting services |
| `POST` | `/api/v1/document-orders` | Client | Submits document requirement form and inputs |
| `GET` | `/api/v1/document-orders/:id` | Client/Lawyer | Retrieves order status, drafts, and comment thread |
| `POST` | `/api/v1/document-orders/:id/drafts` | Lawyer | Uploads new revision draft (`.docx`/`.pdf`) |
| `POST` | `/api/v1/document-orders/:id/approve`| Client | Approves final draft; releases escrow payout |

### 6.6 Payments, Wallet & Financial Endpoints
| Method | Route | Auth / Role | Description |
| :--- | :--- | :--- | :--- |
| `POST` | `/api/v1/payments/create-order` | Client | Creates Razorpay/Stripe order for checkout |
| `POST` | `/api/v1/payments/verify` | Client | Verifies payment gateway signature and updates status |
| `POST` | `/api/v1/payments/webhook` | Public (Secret) | Gateway webhook handler for asynchronous events |
| `GET` | `/api/v1/lawyers/wallet` | Lawyer | Returns available, locked escrow, and past payouts |
| `POST` | `/api/v1/lawyers/payouts/request` | Lawyer | Requests withdrawal to verified bank account |

### 6.7 Admin Management Endpoints
| Method | Route | Auth / Role | Description |
| :--- | :--- | :--- | :--- |
| `GET` | `/api/v1/admin/dashboard/metrics` | Admin | Real-time platform KPI statistics and GMV |
| `GET` | `/api/v1/admin/lawyer-verifications` | Admin | Fetches pending advocate verification queue |
| `POST` | `/api/v1/admin/lawyer-verifications/:id/decision` | Admin | Approves or rejects lawyer verification |
| `POST` | `/api/v1/admin/disputes/:id/resolve` | Admin | Arbitrates dispute; triggers automated refund |
| `GET` | `/api/v1/admin/audit-logs` | Admin | Queryable immutable security and admin action log |

### 6.8 WebSocket Real-Time Event Architecture (Socket.io)
The socket server operates on namespaces `/chat` and `/consultation`:
- **Client -> Server Events:**
  - `join_thread`: `{ thread_id: string }`
  - `send_message`: `{ thread_id: string, text: string, type: string, file_url?: string }`
  - `typing_start`: `{ thread_id: string }`
  - `typing_stop`: `{ thread_id: string }`
  - `mark_read`: `{ thread_id: string, message_ids: string[] }`
  - `call_signal`: `{ room_id: string, signal_data: any }`
- **Server -> Client Events:**
  - `new_message`: Full message object
  - `user_typing`: `{ user_id: string }`
  - `message_read_receipt`: `{ message_ids: string[], read_at: string }`
  - `appointment_reminder`: `{ appointment_id: string, starts_in_minutes: number }`
  - `call_incoming`: `{ appointment_id: string, caller_name: string, mode: string }`

---

## 7. Security, Privacy & Legal Regulatory Compliance Architecture

### 7.1 Attorney-Client Privilege & Document Confidentiality
Legal marketplaces handle highly sensitive legal records, matrimonial disputes, criminal allegations, and proprietary corporate agreements. The architecture enforces zero-trust privacy controls:
1. **Server-Side Encryption at Rest (SSE-KMS / AES-256-GCM):** Every document uploaded to S3/R2 is encrypted with an isolated encryption key per document.
2. **Ephemeral Presigned URLs:** Files are never exposed via public URLs. The mobile app requests temporary S3 presigned URLs with an expiration lifetime of strictly 15 minutes.
3. **Time-Bound Vault Access Delegation:** When a client shares a document with a lawyer for a consultation, an entry in `vault_access_grants` grants access that automatically expires 48 hours following the conclusion of the consultation.
4. **Permanent Audit Logging:** Every document download, view, or permission change is permanently recorded in `audit_logs`.

### 7.2 Bar Council Compliance & Marketplace Ethics
To adhere to Bar Council regulations (e.g., Bar Council of India Rule 36 of Bar Council of India Rules prohibiting advocates from soliciting work or advertising):
1. **No Promotional Claims or Subjective Ranking:** Search algorithms sort advocates based purely on objective client-selected parameters (location, court of practice, verified experience, fee range, user reviews). The platform does not use terms like "Best Criminal Lawyer" or "Top Rated in Delhi".
2. **Platform Intermediary Status:** The platform acts strictly as a technology intermediary under the Information Technology Act. Clear statutory disclaimers clarify that the platform does not provide legal advice, does not guarantee litigation outcomes, and that fees paid represent professional consultation charges set directly by the independent advocates.
3. **Platform Fee Separation:** Invoices explicitly separate:
   - *Professional Consultation Fee* (payable directly to the independent advocate).
   - *Technology Platform Facilitation Fee* (charged by the platform for SaaS services, cloud infrastructure, and video connectivity).

---

## 8. React Native Project Folder Structure

```
lawsuit-mobile/
├── App.tsx                          # Root entry point
├── app.json                         # Expo configuration
├── package.json
├── tsconfig.json
├── tailwind.config.js               # NativeWind v4 configuration
└── src/
    ├── api/                         # TanStack Query hooks & Axios instance
    │   ├── client.ts                # Axios interceptors (JWT auth injection & refresh)
    │   ├── auth.api.ts
    │   ├── lawyers.api.ts
    │   ├── bookings.api.ts
    │   ├── chat.api.ts
    │   ├── documents.api.ts
    │   └── cases.api.ts
    ├── assets/                      # SVGs, Icons, Lottie animations, Fonts
    │   ├── animations/
    │   ├── icons/
    │   └── images/
    ├── components/                  # Reusable UI component library
    │   ├── common/                  # Buttons, Inputs, Badges, Modals, Loaders
    │   │   ├── Button.tsx
    │   │   ├── Input.tsx
    │   │   ├── Badge.tsx
    │   │   └── Skeleton.tsx
    │   ├── lawyer/                  # LawyerCard, AvailabilityPill, RatingStars
    │   ├── consultation/            # VideoSurface, CallControls, ChatBubble
    │   └── document/                # DocumentViewer, VersionItem, DraftUploader
    ├── navigation/                  # React Navigation configurations
    │   ├── RootNavigator.tsx
    │   ├── AuthNavigator.tsx
    │   ├── ClientTabNavigator.tsx
    │   ├── LawyerTabNavigator.tsx
    │   └── types.ts                 # Strongly-typed route params
    ├── screens/                     # Complete 58 Screen implementations
    │   ├── auth/                    # Screens 01-05, 36
    │   │   ├── SplashScreen.tsx
    │   │   ├── WelcomeScreen.tsx
    │   │   ├── LoginScreen.tsx
    │   │   ├── ProfileSetupScreen.tsx
    │   │   └── PermissionsScreen.tsx
    │   ├── client/
    │   │   ├── discovery/           # Screens 06-12
    │   │   │   ├── HomeScreen.tsx
    │   │   │   ├── SearchScreen.tsx
    │   │   │   ├── CategoryScreen.tsx
    │   │   │   ├── LawyerListingScreen.tsx
    │   │   │   ├── FilterModal.tsx
    │   │   │   └── LawyerProfileScreen.tsx
    │   │   ├── booking/             # Screens 13-20
    │   │   │   ├── ConsultationTypeScreen.tsx
    │   │   │   ├── SlotSelectionScreen.tsx
    │   │   │   ├── BookingSummaryScreen.tsx
    │   │   │   ├── PaymentScreen.tsx
    │   │   │   ├── BookingConfirmationScreen.tsx
    │   │   │   ├── MyConsultationsScreen.tsx
    │   │   │   ├── ConsultationRoomScreen.tsx
    │   │   │   └── ReviewScreen.tsx
    │   │   ├── services/            # Screens 21-28
    │   │   │   ├── DescribeProblemScreen.tsx
    │   │   │   ├── ProblemDetailsScreen.tsx
    │   │   │   ├── SuggestedServiceScreen.tsx
    │   │   │   ├── DocumentServicesScreen.tsx
    │   │   │   ├── DocumentRequestScreen.tsx
    │   │   │   ├── OrderSummaryScreen.tsx
    │   │   │   ├── DocumentWorkspaceScreen.tsx
    │   │   │   └── LegalNoticeScreen.tsx
    │   │   └── account/             # Screens 29-35
    │   │       ├── MyCasesScreen.tsx
    │   │       ├── CaseDetailsScreen.tsx
    │   │       ├── VaultScreen.tsx
    │   │       ├── NotificationsScreen.tsx
    │   │       ├── InvoicesScreen.tsx
    │   │       ├── SettingsScreen.tsx
    │   │       └── HelpScreen.tsx
    │   └── lawyer/                  # Screens 37-46
    │       ├── DashboardScreen.tsx
    │       ├── ProfileEditorScreen.tsx
    │       ├── CalendarManagerScreen.tsx
    │       ├── RequestsScreen.tsx
    │       ├── AppointmentDetailScreen.tsx
    │       ├── ClientManagerScreen.tsx
    │       ├── ChatScreen.tsx
    │       ├── CaseManagerScreen.tsx
    │       ├── EarningsWalletScreen.tsx
    │       └── AnalyticsScreen.tsx
    ├── services/                    # Native device services
    │   ├── agora.service.ts         # Agora RTC audio/video engine wrappers
    │   ├── socket.service.ts        # Socket.io connection manager
    │   ├── notification.service.ts  # Push notification triggers & listeners
    │   └── storage.service.ts       # MMKV & Secure Keychain handlers
    ├── store/                       # Zustand client state stores
    │   ├── authStore.ts
    │   ├── bookingStore.ts
    │   └── filterStore.ts
    ├── theme/                       # Colors, Typography, Shadows
    └── types/                       # Shared TypeScript domain models
```

---

## 9. Node.js Backend Modular Architecture

```
lawsuit-backend/
├── src/
│   ├── main.ts                      # NestJS bootstrapping, validation pipes, Swagger
│   ├── app.module.ts
│   ├── config/                      # Environment variables, database & JWT configurations
│   ├── common/                      # Shared filters, interceptors, decorators, guards
│   │   ├── decorators/              # @CurrentUser(), @Roles()
│   │   ├── guards/                  # JwtAuthGuard, RolesGuard
│   │   ├── interceptors/            # LoggingInterceptor, TransformInterceptor
│   │   └── filters/                 # AllExceptionsFilter
│   ├── modules/
│   │   ├── auth/                    # Authentication, OTP, Tokens, RBAC
│   │   ├── users/                   # Client profiles, preferences
│   │   ├── lawyers/                 # Lawyer directory, profile, search, verification
│   │   ├── availability/            # Schedules, slots calculation, Redis mutex lock
│   │   ├── appointments/            # Booking lifecycle, status machine, reminders
│   │   ├── consultations/           # Agora token generator, room lifecycle, duration
│   │   ├── chat/                    # Socket.io chat gateway, message persistence
│   │   ├── triage/                  # AI Describe My Problem, LLM classification
│   │   ├── documents/               # Document services catalog, orders, drafts, revisions
│   │   ├── vault/                   # S3 encrypted storage, presigned URLs, access grants
│   │   ├── cases/                   # Case management, court hearings, cause lists
│   │   ├── payments/                # Razorpay/Stripe, webhooks, escrow ledger, splits
│   │   ├── payouts/                 # Lawyer wallets, bank transfers, payout approval
│   │   ├── reviews/                 # Client reviews, ratings aggregation
│   │   ├── disputes/                # Dispute tickets, admin arbitration, refunds
│   │   ├── notifications/           # Push notifications (FCM), SMS (Twilio), Email (SES)
│   │   └── admin/                   # Admin dashboard, audit logs, CMS, user management
│   ├── database/
│   │   ├── prisma.service.ts        # Database client instance
│   │   ├── schema.prisma            # Schema definition
│   │   └── migrations/              # Versioned SQL migration files
│   └── jobs/                        # BullMQ background workers
│       ├── appointment-reminder.worker.ts
│       ├── slot-cleanup.worker.ts
│       ├── payout-batch.worker.ts
│       └── document-seal.worker.ts
├── test/                            # Jest unit & e2e test suites
├── Dockerfile
├── docker-compose.yml
└── package.json
```

---

## 10. Phased Implementation Roadmap & Milestones

### Phase 1: MVP & Core Marketplace (Weeks 1 – 6)
- **Sprint 1 (Infrastructure & Authentication):**
  - PostgreSQL schema deployment with migrations.
  - Node.js NestJS backend scaffolding with JWT and SMS OTP auth.
  - React Native app setup with Navigation and Tailwind NativeWind.
  - Screens 01-05 (User Onboarding) & Screen 36 (Lawyer Registration).
- **Sprint 2 (Discovery & Profiles):**
  - Category and Lawyer Directory APIs with filtering and spatial sorting.
  - Screens 06-12 (Home, Search, Categories, Listing, Filters, Lawyer Profile).
  - Screens 37-39 (Lawyer Dashboard, Profile Editor, Availability Calendar).
- **Sprint 3 (Booking Engine & Payments):**
  - Slot availability calculator with Redis mutex locking.
  - Razorpay / Stripe payment gateway integration.
  - Screens 13-17 (Consultation Selection, Calendar, Summary, Payment, Confirmation).
  - Screens 40-41 (Lawyer Consultation Requests & Appointment Details).
- **Sprint 4 (Consultation Execution & Admin Verification):**
  - Agora RTC audio/video consultation room with timer and controls (Screens 18-20).
  - Screens 47-50 (Admin Dashboard, Lawyer Verification, User Management).
  - Push notification triggers for appointments and confirmations.

### Phase 2: Document Services & Case Management (Weeks 7 – 10)
- **Sprint 5 (Real-Time Messaging & Vault):**
  - Socket.io chat server with file uploads and read receipts (Screen 43).
  - Client Encrypted Document Vault with presigned URLs (Screen 31).
- **Sprint 6 (Document Drafting Workflow):**
  - Document Services catalog and dynamic intake schema (Screens 24-26).
  - Document Workspace with revision annotations and approval lifecycle (Screen 27).
  - Legal Notice assistance tracking (Screen 28).
- **Sprint 7 (Case Management & Lawyer Financials):**
  - Case file tracking, court hearing dates, and cause lists (Screens 29-30, Screen 44).
  - Lawyer wallet balance, payout request engine, and bank transfers (Screen 45).
  - Screens 51-53 (Admin Booking, Payment & Category Management).

### Phase 3: AI Intelligence, Disputes & Production Hardening (Weeks 11 – 14)
- **Sprint 8 (AI Problem Triage):**
  - "Describe My Problem" LLM pipeline with prompt guardrails and vector matching (Screens 21-23).
- **Sprint 9 (Dispute Resolution & Audit Controls):**
  - Dispute intake, evidence upload, and admin arbitration workstation (Screens 55, 35).
  - Immutable audit logging system (Screen 58) and notification center (Screen 57).
  - Screens 32-34 (User Notifications, Invoices, Profile Settings) & Screen 46 (Lawyer Analytics).
- **Sprint 10 (Security Audits, Load Testing & Store Submission):**
  - OWASP API security audit, penetration testing, and rate limiting verification.
  - Agora call quality testing across 3G/4G networks.
  - Apple App Store & Google Play Store submission packaging via EAS Build.

---

## 11. Production DevOps, Deployment & Monitoring Architecture

- **Containerization & Orchestration:** Backend packaged in lightweight Alpine Docker containers running on **AWS ECS Fargate** or **Kubernetes (EKS)** behind an Application Load Balancer.
- **Database Resilience:** **AWS RDS PostgreSQL (Multi-AZ)** with synchronous standby replica, daily automated snapshots, and read replicas for search queries.
- **Caching & Queue Cluster:** **AWS ElastiCache Redis** cluster with multi-node replication for session tokens, socket scaling, and BullMQ workers.
- **CI/CD Pipeline (GitHub Actions):**
  - Linting (`eslint`), TypeScript type checking (`tsc`), and unit/integration tests (`jest`).
  - Automated Docker build, vulnerability scanning with Trivy, and deployment to staging/production clusters.
  - Mobile OTA updates and binary builds via **Expo Application Services (EAS Build & Update)**.
- **Observability & Logging:**
  - **Structured Logging:** `pino` with JSON output shipped to AWS CloudWatch / Datadog.
  - **Error Tracking:** **Sentry** SDK integrated in both React Native mobile app and Node.js backend.
  - **Metrics & Telemetry:** Prometheus metrics exporter scraped by Grafana dashboards tracking active calls, API latencies (p95, p99), HTTP 5xx errors, and WebSocket connections.
