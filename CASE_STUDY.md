# Lucky Draw System — SS Builder & Prop Interior

## The problem this was built to solve

A real estate company called SS Builder & Prop Interior runs a property expo — a promotional event where people who register (usually by paying a membership fee) get entered into a "lucky draw," a live raffle where one winner is picked from all registered participants. Running an event like this by hand is a headache: someone has to keep a spreadsheet of everyone who signed up, check who has actually paid, physically write out receipts, and then, in front of a crowd, somehow pick a genuinely random name without anyone suspecting it was rigged.

This project replaces that entire manual process with a web application. Staff register participants (with their photo, ID, and proof-of-payment receipt), the system tracks who has been financially verified, and on the day of the event, a single button press runs a fair, computer-generated draw complete with a dramatic on-screen countdown and a winner announcement — the kind of moment that works well in front of a live audience. It also produces a professional, printable registration invoice for every participant, so the business has a paper trail for a process that involves people's money.

In short: it turns a spreadsheet-and-clipboard operation into a real software product, with the trustworthiness (auditability, verification, no-refund terms recorded) that matters when actual money and prizes are involved.

## What it actually does, end to end

The system has two main users in mind: an admin (event staff) who logs in to manage everything, and the "audience" who never touches the software directly but experiences the lucky draw moment on screen.

**Registering a participant.** An admin fills out a form with the participant's serial number, file number, full name, father's name, national ID number (CNIC — Pakistan's equivalent of a social security number), date of birth, gender, membership type, mobile number, and email. They also upload two photos: a picture of the person, and a photo of their fee payment receipt (the "voucher"). The form validates everything before submission — required fields, a real email pattern, image size limits (5MB for the headshot, 10MB for the receipt) — so bad data can't slip through from the UI. The two images are uploaded to Cloudinary (a cloud image-hosting service), where the person's photo is automatically resized into a clean square thumbnail.

**Verifying payment.** Every participant has a "BM Verification" flag — essentially "has staff confirmed this person's payment voucher is legitimate." This is the gatekeeper for the entire system: only verified participants are allowed into the actual lucky draw. This models the real business rule directly — you can register, but you don't become a draw candidate until someone confirms your payment.

**Running the draw.** When staff click "Lucky Draw," the app immediately starts a 15-second full-screen countdown animation — a spinning ring, particle effects, a shrinking number — designed to build suspense for a live audience. Behind the scenes, at the same moment, the app has already asked the server to pick a winner, so the dramatic pause is purely theatrical, not a loading delay. When the countdown hits zero, a winner reveal modal appears with confetti, the winner's photo and details, and win-probability statistics (e.g. "1 out of 214 = 0.47% chance"), with buttons to print the result or copy a shareable announcement to the clipboard.

**Generating invoices.** For any participant, staff can generate a polished, letter-quality "Lucky Draw Registration Invoice" — styled like a real business document with the company's branding, the participant's photo, their details, a non-refundable-payment notice, and signature lines for the participant, an office stamp, and an authorized signatory. This can be downloaded as a PDF or PNG image, generated client-side in the browser (no server rendering needed) using `html2canvas` (a library that turns a webpage into an image) and `jsPDF` (which then wraps that image into a properly sized PDF page).

**Managing the list.** A searchable, sortable, filterable table shows every participant, with live statistics (total registered, verified vs. pending, male/female split). Staff can search by name, ID number, phone, email, or file number; filter by verification status or gender; sort any column; and export the current filtered view to CSV or a print-friendly report — useful for reconciling against a physical sign-up sheet or an accountant's records.

## How it's built

This is a full custom application, not a page builder or a low-code tool — a "MERN-adjacent" stack (MongoDB database, Express server, React frontend, Node.js runtime), split into two independently deployable pieces:

**Backend** — Node.js with Express 5, talking to a MongoDB database through Mongoose (a library that maps JavaScript objects to database documents and enforces schema rules like "CNIC must be unique" or "gender must be Male or Female" at the data layer, not just in the form). Authentication uses JSON Web Tokens (JWTs) — a signed, tamper-proof token that proves who you are without the server needing to store session state — issued on login and checked on every request, either via an `Authorization: Bearer` header or an HTTP-only cookie. Passwords are hashed with bcrypt before ever touching the database, so even a database leak wouldn't expose plaintext passwords. Every member-management route sits behind an `isAdmin` middleware, so only authenticated admin accounts can view, add, edit, delete, or draw participants — a regular unauthenticated visitor gets nothing from the API.

Image uploads are handled with Multer (a file-upload library) piped directly into Cloudinary via in-memory streaming — files never touch the server's disk, they're received, streamed straight to Cloudinary, and only the resulting secure URL is saved to the database. This keeps the backend stateless and safe to redeploy without worrying about losing uploaded files.

**Frontend** — React 18 with Vite (a fast modern build tool) and Tailwind CSS for styling, React Router for navigation, and Framer Motion driving essentially all of the animation — the countdown ring, the winner confetti, the pulsing draw button, page transitions. State is organized into two React Contexts (shared app-wide state containers): one for authentication (`AuthContext`, tracking login state and redirecting unauthenticated users to `/login` automatically) and one for the participant data (`MembersContext`, wrapping every API call — fetch, add, update, delete, draw — behind simple functions so components never talk to `axios` directly). The UI is fully responsive and supports both light and dark themes throughout, including the invoice and modals.

Deployment is set up for Vercel on the frontend (a `vercel.json` config handles client-side routing so refreshing a page doesn't 404), with environment variables cleanly separating secrets (database connection string, JWT secret, Cloudinary keys) from code.

## The genuinely tricky engineering problem: making the countdown feel real without lying

The most interesting technical decision in this codebase is in `Home.jsx`'s `handleLuckyDraw` function. A live audience-facing "pick a random winner" moment has a conflicting set of requirements: it needs to feel suspenseful (so a fixed, theatrical countdown makes sense), but it also has to be provably fair — the actual selection has to happen on the server, using real randomness over the real, current list of verified participants, not be something the frontend fakes for show.

The solution: the moment the button is clicked, the app fires off the actual API call to the server (`performLuckyDraw()`) and, in the same instant, kicks off a 15-second visual countdown — both running concurrently. The server picks the winner via `Math.random()` over the list of verified members almost instantly; the app just holds onto that result and doesn't reveal it until the countdown finishes. So the drama is real screen time, but the fairness comes from an already-completed, tamper-proof server decision — nobody, including the person running the laptop, can influence the outcome after the button is pressed, and the audience isn't kept waiting on the server for the full 15 seconds; the delay is deliberate, not incidental.

The commit history shows this exact piece was revisited — one commit is literally titled "remove count down bug" — suggesting the timing coordination between the countdown animation and the async API result was a real source of bugs during development (a classic race-condition-adjacent problem: what happens if the countdown finishes before the network request does, or the component unmounts mid-countdown), and the current implementation (storing the promise, using a single `setTimeout` gated on both, cleaning up the interval in `useEffect`) is the result of iterating past that bug.

## Other real engineering decisions worth noting

**Data integrity is enforced at multiple layers, not just the form.** The Mongoose schema marks `serialNo`, `fileNo`, `cnic`, and `email` as unique, and the `addMember` controller does an explicit pre-check across all four fields before insert, returning a specific, human-readable error ("CNIC already exists" vs. a generic "duplicate key" database error). This is the kind of detail that matters once non-technical office staff are the ones using the system — a raw MongoDB duplicate-key error would be meaningless to them; a clear message tells them exactly what to fix.

**Only verified participants can win.** `getRandomMember` explicitly filters to `bmVerification: true` before selecting a winner. This is a business rule baked directly into the query, not something enforced only by UI convention — even if someone bypassed the UI and hit the API directly, an unverified participant cannot be selected as a winner.

**Auth defense in depth.** There are actually two separate authentication middlewares in the codebase (`middleware/authMiddleware.js` and `middlewares/authMiddleware.js`) — a strict `isLogin` gate, a lighter `attachUser` that decodes a token if present but doesn't block the request if it's missing, and an `isAdmin` check layered on top for anything touching participant data. This reflects a real, sensible security pattern (attach identity early, then enforce permission per-route) even if the duplication between the two folders is leftover scaffolding from early iteration that a later cleanup pass would consolidate.

**Client-first UX with server as source of truth.** Every create/update/delete in `MembersContext` optimistically updates local React state immediately after a successful API response, rather than re-fetching the entire list — so the UI feels instant even though every change round-trips through the database first.

**The invoice went through multiple design iterations.** The `PrintInvoice.jsx` file still contains the entire previous version of the invoice, commented out below the current implementation — a two-column layout with corner ribbons and a watermark — before it was redesigned into the current single-page, signature-line, terms-and-conditions layout. That's a visible record of a developer iterating on a real client-facing document until it looked professional enough to hand to an actual paying customer, not settling for the first version that worked.

## What the build history reveals

The entire project was built in roughly one week (December 20–27, 2025), and the commit sequence tells a clear, sensible story of how it was assembled: authentication system first, then the participants table, then full CRUD (create/read/update/delete) operations for managing participants, then the lucky draw feature itself, then skeleton loading states (placeholder UI shown while data is fetching, so the app never shows a blank screen), then the invoice/printing system, and finally UI polish and bug fixes. That ordering — get people in the door and data flowing before building the flashy centerpiece feature — reflects a builder who prioritizes a working foundation over jumping straight to the "fun part."

Small UX details throughout back this up: skeleton loaders (`LuckyDrawSkeleton`, `MembersTableSkeleton`) so the interface never flashes empty content while loading; a confirmation modal before every destructive delete; toasts and inline error messages instead of silent failures; keyboard (Escape-to-close) and click-outside handling on every modal; and scroll-shadow indicators on the data table so users always know there's more content off-screen.

## What this project demonstrates

This is a complete, working, real-world business application — not a tutorial clone or a toy CRUD demo. It has actual users (event staff), an actual financial process behind it (fee verification), a fairness-critical feature (the draw itself), and a client-facing deliverable (the invoice) that had to look genuinely professional because it would be handed to real paying customers. It shows the ability to:

- Design and secure a real authentication and authorization system (hashed passwords, signed tokens, route-level permission gates) rather than bolting on a login form for looks.
- Model real business rules directly into the data layer (verification gating, uniqueness constraints, schema-level validation) instead of relying only on client-side checks.
- Solve a genuinely non-trivial UX/fairness problem (the suspense countdown vs. server-side randomness) and visibly debug and fix it based on the commit history.
- Integrate real third-party infrastructure (Cloudinary for image storage, streamed uploads with no local disk dependency) in a way that's production-safe and stateless.
- Build a fully custom, animated, responsive interface from scratch, including a client-side PDF/image generation pipeline for a document that has to look like something a real business would print and sign.
- Iterate — the invoice redesign and the countdown bug fix both show a developer who revisits and improves their own work rather than shipping the first draft.
