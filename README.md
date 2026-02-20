# Proteus

**Event-driven, GPU-accelerated virtual try-on on Linode Kubernetes Engine (LKE).** Open-source stack: LKE, NVIDIA GPU, KEDA, Redis, S3-compatible storage.

---

## Hackathon alignment

- **Platform:** Linode Kubernetes Engine (LKE); optional Linode Compute for local dev.
- **Open source:** Stack is open source (Express, React, PyTorch, CatVTON, Redis, KEDA, etc.).
- **Deployable:** Docker Compose for local run; Kubernetes manifests (namespace, Redis, PostgreSQL, Gateway, Weaver, Arbitrator, optional KEDA) for LKE.
- **Bonus:** GPU workloads (Weaver: CatVTON on NVIDIA GPU), AI/ML (diffusion-based VTON), advanced Kubernetes (KEDA scaling on Redis queue depth).

---

## What Proteus does

- User uploads a **user photo** and an **outfit photo** (any supported image format; HEIC/AVIF converted to JPEG in the browser).
- Backend runs **GPU inference** (CatVTON) to generate a virtual try-on image.
- User sees the result in a **history view**; **WebSocket** delivers job completion so the list refreshes automatically when a job finishes.

---

## System architecture

### Components

| Component      | Stack                                   | Status                | Role                                                                                                                                               |
| -------------- | --------------------------------------- | --------------------- | -------------------------------------------------------------------------------------------------------------------------------------------------- |
| **Gateway**    | Node.js (Express), `ws` (WebSocket)     | Implemented           | REST API (auth, VTON CRUD, presigned S3 URLs, job enqueue); WebSocket server at `/ws`; subscribes to Redis `events:job_done`, routes by `user_id`. |
| **Weaver**     | Python, PyTorch, Diffusers, CatVTON     | Implemented           | Consumes `queue:weaver_jobs`; GPU inference; uploads result to S3; publishes to `events:job_done` with `job_type: "try_on"`.                       |
| **Arbitrator** | Node.js                                 | Implemented           | Control loop: reads queue depth, sets Redis config (e.g. batch size) for Weaver.                                                                   |
| **Tailor**     | Python, SegFormer (planned)             | **To be implemented** | Intended: consume `queue:tailor_jobs`, outfit segmentation, publish to `events:job_done`. Queue and API route exist; worker not yet implemented.   |
| **Frontend**   | React, TanStack Query, WebSocket client | Implemented           | Auth, create VTON (upload images → S3 via presigned URL, create VTON, enqueue weaver job), history list, auto-refresh on job done via WebSocket.   |

### Data stores

- **PostgreSQL** — users, VTONs.
- **Redis** — queues `queue:weaver_jobs`, `queue:tailor_jobs`; pub/sub `events:job_done`.
- **S3-compatible storage** — e.g. AWS S3 or Linode Object Storage for uploads and results.

---

## Tech stack

- **Backend:** Node.js, Express, Prisma, Redis, AWS SDK (S3), JWT + cookie auth, `ws` for WebSocket.
- **Weaver:** Python, PyTorch, Diffusers, CatVTON-MaskFree, Redis, boto3 (S3).
- **Frontend:** React, Vite, TanStack Query, WebSocket (token auth), heic2any + canvas for image conversion.
- **Infra:** Docker, Kubernetes (LKE), optional KEDA (Redis list length for Weaver).

---

## API summary

- **Auth:** `POST /user/signup`, `POST /user/login`, `POST /user/logout`; protected routes use cookie/session.
- **User:** `GET/PUT/DELETE /user`, `GET /user/ws-token` (for WebSocket).
- **VTON:** `GET/POST /vton`, `PUT/DELETE /vton/:id`.
- **Images:** `POST /images/presignedUploadUrl`, `POST /images/presignedDownloadUrl` (body: `fileName`, `fileType` or `key`).
- **Jobs:** `POST /jobs/weaver` (body: `vton_id`, `user_snap_s3`, `uncleaned_outfit_s3`), `POST /jobs/tailor` (body: `vton_id`, `uncleaned_outfit_s3`) — Tailor route exists; worker **to be implemented**.
- **WebSocket:** `WS /ws` (query or header token from `/user/ws-token`). Messages: `job_type`, `user_id`, `vton_id`, `result_s3_key`, `status`, etc.

---

## Data flow (try-on path)

1. User selects two images in the frontend → frontend converts to JPEG if needed → requests presigned upload URL from Gateway → uploads directly to S3 → creates VTON via API → enqueues weaver job via `POST /jobs/weaver`.
2. Weaver pops job, downloads images from S3, runs CatVTON, uploads result to S3, publishes to `events:job_done`.
3. Gateway (subscribed to `events:job_done`) pushes event to the user's WebSocket; frontend refetches VTON list and shows the new try-on image (via presigned download URL).

---

## Running the project

**Prerequisites:** Node 20+, Python 3.10+ (Weaver), Docker (optional), Redis, PostgreSQL, S3-compatible storage.

- **Backend repository:** `npm install`, `cp .env.example .env` (fill DB, Redis, S3, JWT), `npm run db:push`, `npm run dev`. WebSocket and HTTP server run together.
- **Weaver:** See `weaver_service/README.md` for model download and env; run worker (e.g. `python -m weaver_service.main`) with Redis and S3 configured.
- **Arbitrator:** In the backend repository, `cd arbitrator && npm install && npm run dev`.
- **Frontend repository:** `npm install`, set `VITE_API_URL` to Gateway URL, `npm run dev`.
- **Docker Compose:** See backend repository's `docker-compose.yml` for local Redis, MinIO (or S3), Gateway, Weaver (if image built), etc.

---

## Deploying on LKE

- Use manifests in the backend repository (e.g. namespace `proteus`, Redis, PostgreSQL, Gateway, Weaver with GPU node selector, Arbitrator, optional KEDA ScaledObject for Weaver).
- **Secrets:** Store DB URL, Redis URL, S3 credentials, JWT secret in Kubernetes Secrets (e.g. `proteus-secrets`).
- **Ingress/TLS:** See backend repository's `k8s/` or deployment docs for exact file names and steps.

---

## Why it fits the hackathon

- **Creativity:** Event-driven VTON pipeline with real-time feedback and scalable queue-based design.
- **Technical execution:** GPU inference, WebSocket delivery, presigned S3 uploads (no backend file bytes), optional KEDA.
- **Platform:** Built for LKE and Linode (GPU nodes, Object Storage).
- **Open source:** No proprietary inference APIs; CatVTON, SegFormer (when Tailor is implemented), React, Express, Redis, KEDA.
- **Future potential:** Tailor (outfit cleaning) to be implemented; Arbitrator and KEDA allow scaling and batching improvements.

---

## Repository layout

- **Backend repository** — Gateway (Express + WebSocket), Arbitrator, Weaver service (Python), shared Python (`common/`), Prisma schema, Dockerfiles, `k8s/` (deployment manifests).
- **Frontend repository** — React app (Vite, TanStack Query, WebSocket client).
- **Tailor** — To be implemented (e.g. under backend repository's `tailor/` or similar); queue and API route exist.

---

## Demo / video

A 2–5 minute video demo is provided (or will be submitted) showing the project running on LKE or locally, including upload, job completion, and auto-refresh.
