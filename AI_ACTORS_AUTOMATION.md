# HackHub AI Automation & Actors Analysis

## 🎭 System Actors (5 User Roles)

```
┌──────────────────────────────────────────────────────────────┐
│                    HACKHUB SYSTEM ACTORS                      │
├────────────┬───────────┬──────────┬───────────┬──────────────┤
│  ADMIN     │ ORGANIZER │  JUDGE   │  MENTOR   │ PARTICIPANT  │
│  (root)    │ (host)    │(evaluator)│(guide)    │(competitor)  │
└────────────┴───────────┴──────────┴───────────┴──────────────┘
```

### 1. 👑 ADMIN (Role: `admin`)
- **Permissions**: Full platform access (inherits all other role permissions)
- **AI Access**: Can trigger all AI services, access Agent SDK, view all data
- **Responsible for**: User management (ban/unban), system configuration, oversight
- **Dashboard**: `/dashboard/admin` — system health, total users, AI requests, reports

### 2. 🏢 ORGANIZER (Role: `organizer`)
- **Permissions**: Can also act as `admin` via permission system
- **AI Access**: Can trigger AI evaluation, run similarity checks, access Agent SDK
- **Responsible for**:
  - Creating/managing hackathons (CRUD)
  - Publishing hackathons and results
  - Assigning judges to hackathons
  - Sending announcements to participants
  - Triggering AI evaluation on submissions
  - Running cross-submission similarity/plagiarism checks
  - Generating certificates for participants

### 3. ⚖️ JUDGE (Role: `judge`)
- **Permissions**: Inherits admin privileges for scoring actions
- **AI Access**: Can trigger AI evaluation on submissions, view leaderboard
- **Responsible for**:
  - Viewing assigned hackathon submissions
  - Submitting scores with criteria-based evaluation
  - Finalizing scores (locks them, triggers average recalculation)
  - Viewing leaderboard rankings
  - **AI Collaboration**: Can trigger AI evaluation to assist their scoring

### 4. 🧠 MENTOR (Role: `mentor`)
- **Permissions**: Can view hackathons and participants
- **AI Access**: Can access Agent SDK for guidance/mentoring prompts
- **Responsible for**:
  - Guiding participants
  - Providing feedback
  - Using AI assistant for mentoring support

### 5. 🚀 PARTICIPANT (Role: `participant`)
- **Permissions**: Can register, create teams, submit projects
- **AI Access**: Can request AI team matching
- **Responsible for**:
  - Registering for hackathons
  - Creating/joining teams
  - Inviting members / requesting to join
  - Creating project submissions (draft → submit)
  - Viewing own scores, certificates, and AI evaluations
  - **AI Collaboration**: Uses AI team matching to find compatible teammates

---

## 🤖 AI Systems Architecture

```
┌─────────────────────────────────────────────────────────────────────┐
│                      HACKHUB AI ECOSYSTEM                           │
│                                                                     │
│  ┌──────────────┐    ┌───────────────┐    ┌────────────────────┐   │
│  │   Frontend   │    │ Django Backend│    │  FastAPI AI Service│   │
│  │   (React)    │◄──►│  (DRF + Chan) │◄──►│  (Python + OpenAI) │   │
│  └──────────────┘    └───────┬───────┘    └────────────────────┘   │
│                              │                                      │
│                     ┌────────┴────────┐                             │
│                     │  Agent SDK      │                             │
│                     │  (Cursor SDK)   │                             │
│                     └─────────────────┘                             │
└─────────────────────────────────────────────────────────────────────┘
```

### AI Service Endpoints (FastAPI on port 8001)

| Endpoint | Method | AI Model | Purpose |
|----------|--------|----------|---------|
| `/evaluate/submission` | POST | OpenAI GPT-4 | Score projects on innovation, docs, complexity |
| `/match/teams` | POST | OpenAI GPT-4 | Suggest optimal team compositions |
| `/similarity/check` | POST | TF-IDF + Cosine Sim | Detect plagiarism across submissions |
| `/health` | GET | — | Service health check |

### Django AI Bridge (API v1)

| Endpoint | Method | Allowed Roles | Purpose |
|----------|--------|---------------|---------|
| `/ai/evaluate/submissions/<id>/` | POST | Organizer, Judge, Admin | Trigger AI project evaluation |
| `/ai/team-match/<hackathon_id>/` | POST | Participant, Admin | Get AI team recommendations |
| `/ai/similarity/<hackathon_id>/` | POST | Organizer, Admin | Run plagiarism detection |
| `/ai/agent/prompt/` | POST | Admin, Organizer, Judge, Mentor | Send prompt to Agent SDK |

---

## 🔄 AI Automation Flows (Per Actor)

### Flow 1: AI Project Evaluation (Organizer & Judge)

```
Organizer/Judge clicks "AI Evaluate" on submission
  → POST /ai/evaluate/submissions/{id}/
  → Django ai_bridge calls FastAPI /evaluate/submission
  → FastAPI sends to OpenAI GPT-4 with structured prompt
  → GPT-4 returns { innovationScore, documentationScore, complexityScore, overallScore, summary, suggestions }
  → Result stored in submission.ai_evaluation (JSON field)
  → Displayed on Submission page as formatted card
```

**Used by**: Organizer (to assess quality), Judge (to supplement manual scoring)
**Automation level**: Semi-automated (triggered manually, runs AI automatically)

### Flow 2: AI Team Matching (Participant)

```
Participant clicks "Find Teammates" on hackathon
  → POST /ai/team-match/{hackathon_id}/
  → Request includes user's skills + all registered participant IDs
  → Django ai_bridge calls FastAPI /match/teams
  → FastAPI sends to OpenAI GPT-4 with skill vectors
  → GPT-4 returns suggested team compositions with match scores
  → Response: { suggestions: [{teamId, members, matchScore, reasoning}] }
```

**Used by**: Participant (to find compatible teammates)
**Automation level**: Fully automated (AI generates suggestions for user approval)

### Flow 3: Similarity/Plagiarism Detection (Organizer)

```
Organizer clicks "Check Similarity" after submissions close
  → POST /ai/similarity/{hackathon_id}/
  → Sends all submissions' descriptions + titles
  → FastAPI computes TF-IDF vectors → cosine similarity matrix
  → Returns all pairs with similarity >30%, flags pairs >70%
  → Response: { pairs: [{submission1_id, submission2_id, similarity_score, flagged}] }
```

**Used by**: Organizer (to detect potential plagiarism)
**Automation level**: Fully automated (statistical analysis, no LLM needed)

### Flow 4: Automated Hackathon Status Engine

```
Every 5 minutes (cron job / management command):
  → update_hackathon_statuses() runs
  → For each uncancelled hackathon:
      Compares dates against registration_start, registration_end, start_date, end_date, submission_deadline
      Status transitions:
        draft → published → registration_open → ongoing → judging → completed
      OR: If no submissions → draft → published → registration_open → ongoing → completed
      
  → send_submission_deadline_warnings() runs
  → For hackathons where deadline is <60 minutes away:
      Finds teams without submitted projects
      Sends real-time notification to each team member
```

**Status Lifecycle (7 states fully automated)**:
```
DRAFT ──► PUBLISHED ──► REGISTRATION_OPEN ──► ONGOING ──► JUDGING ──► COMPLETED
   │                                                    │
   └── CANCELLED (manual)                               └── COMPLETED (if no submissions)
```
**Automation level**: Fully automated (runs on cron, transitions without human intervention)

### Flow 5: Certificate Auto-Issuance

```
Organizer publishes results:
  → POST /hackathons/{id}/results/publish/
  → All submissions ranked by final_score
  → For each participant registered in hackathon:
      → issue_certificate() creates Certificate with unique UUID
      → create_notification() sends real-time alert: "Certificate ready"
      → Notification includes verification_id for sharing
  → Hackathon status → "completed"
```

**Used by**: Organizer (trigger), Participants (receive), Anyone (verify)
**Verification**: Public endpoint `/certificates/verify/{uuid}` — no auth required
**Automation level**: Semi-automated (triggered by one action, then fully automated)

### Flow 6: Scoring Finalization & Ranking

```
Judge finalizes a score:
  → PATCH /judging/{id}/finalize/
  → Score is locked (is_finalized = True)
  → Submission's final_score recalculated:
      AVG(all finalized scores for this submission)
  → When organizer publishes results:
      All submissions sorted by final_score
      Each gets rank assigned (1st, 2nd, ...)
      Teams updated with rank + final_score
```

**Automation level**: Hybrid (judge finalizes manually, system auto-computes averages)

### Flow 7: Real-Time Notification System

```
Any system event triggers create_notification():
  → Notification saved to database (Notification model)
  → Django Channels sends WebSocket event to user's room: "user_{id}"
  → Socket.IO client receives and shows toast notification
  → Notification also persisted for page refresh

Trigger Events:
  • Team invites (team:invite)
  • Join requests (team:join_request)  
  • Request resolved (team:request_resolved)
  • Hackathon announcements (hackathon:announcement)
  • Submission received (submission:submitted)
  • Deadline warnings (submission:deadline_warning)
  • Results published (results:published)
  • Certificate ready (certificate:ready)
```

**Automation level**: Fully automated (event-driven, no manual sending required)

---

## 📊 AI Automation Matrix

```
┌────────────────────────────┬──────────────────────┬────────────────┬──────────────────┐
│       AI FEATURE           │     TRIGGERED BY     │  AUTOMATION    │  RESPONSE TIME   │
├────────────────────────────┼──────────────────────┼────────────────┼──────────────────┤
│ Project Evaluation         │ Organizer / Judge    │ Semi-automated │ ~3-5 sec (GPT-4) │
│ Team Matching              │ Participant          │ Fully auto     │ ~3-5 sec (GPT-4) │
│ Similarity Detection       │ Organizer            │ Fully auto     │ <1 sec (TF-IDF)  │
│ Status Engine              │ Cron (5 min)         │ Fully auto     │ Instant          │
│ Deadline Warnings          │ Cron (30 min)        │ Fully auto     │ Instant          │
│ Certificate Issuance       │ Results publish      │ Semi-automated │ Instant          │
│ Score Finalization         │ Judge + System       │ Hybrid         │ Instant          │
│ Real-time Notifications    │ Any system event     │ Fully auto     │ <100ms           │
│ Agent SDK Assistant        │ Admin/Org/Judge/Ment │ User-triggered │ Variable         │
└────────────────────────────┴──────────────────────┴────────────────┴──────────────────┘
```

## 🔗 Actor → AI Feature Mapping

```
                    │  AI Eval  │ Team Match │ Similarity │ Status Auto │ Notifications │ Certs │ Agent SDK
────────────────────┼───────────┼────────────┼────────────┼─────────────┼───────────────┼───────┼───────────
  ADMIN             │    ✅     │    ✅      │    ✅      │    ✅       │    ✅        │  ✅   │   ✅
  ORGANIZER         │    ✅     │    ❌      │    ✅      │    ✅       │    ✅        │  ✅   │   ✅
  JUDGE             │    ✅     │    ❌      │    ❌      │    ✅       │    ✅        │  ❌   │   ✅
  MENTOR            │    ❌     │    ❌      │    ❌      │    ✅       │    ✅        │  ❌   │   ✅
  PARTICIPANT       │    ❌     │    ✅      │    ❌      │    ✅       │    ✅        │  ✅   │   ❌
```

---

## 💡 Key Automation Insights

1. **3 AI Models in use**: GPT-4 (evaluation + matching), TF-IDF (similarity), Rule-based (status engine)
2. **2 Automation Patterns**: 
   - **User-triggered AI**: Evaluation, matching, similarity — user clicks, AI processes
   - **System-scheduled AI**: Status updates, deadline warnings — cron-driven, no human needed
3. **5-second SLA**: AI service configured with 8-second timeout, GPT-4 typically responds in 3-5 seconds
4. **Graceful degradation**: All AI endpoints return 503 with error message if AI service is unavailable
5. **Event-driven real-time**: Notifications flow instantly from any action → WebSocket → user's browser
6. **Offline-capable frontend**: Socket.IO reconnects automatically, notifications persisted in DB