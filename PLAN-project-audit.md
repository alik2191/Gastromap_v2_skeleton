# 📋 PLAN: Project Audit & Next Steps

## Overview
This plan focuses on bringing the application to the target architecture (V2), integrating with Supabase, and implementing advanced admin features. Recently, significant focus has been placed on **English Localization** and **Premium UI/UX** for the public-facing Dashboard.

**Project Type**: WEB (React + Vite + Supabase)

---

## 🎯 Success Criteria
- [x] Architecture follows FSD-lite (Router and Providers moved to `src/app`).
- [ ] Supabase fully integrated (Auth + DB).
- [x] **Filter Modal fully translated and redesigned (Premium Card Layout).**
- [x] Dark mode contrast optimized for all micro-copy and badges.
- [ ] All Dashboard and Admin pages work with real data.

---

## 🛠 Tech Stack
- **Frontend**: React, Vite, Tailwind CSS, DaisyUI.
- **State**: Zustand (Auth, Favorites), TanStack Query (Locations).
- **Backend**: Supabase.
- **Automation**: AG-Kit (Agents), Google Maps Platform MCP.

---

## 🏗 Task Breakdown

### Phase 1: Structural Alignment & Core Logic
| ID | Task | Agent | Skill | Priority | Dependencies |
|----|------|-------|-------|----------|--------------|
| 1.1 | Refactoring `src/app`: Move router and QueryClient | `frontend-specialist` | `clean-code` | P1 | ✅ Done |
| 1.2 | Setup Supabase Client and `.env` template | `backend-specialist` | `api-patterns` | P0 | In Progress |
| 1.3 | Implement `useAuth` hook and integrate with `Zustand` | `backend-specialist` | `react-best-practices` | P1 | 1.2 |

### Phase 2: Data & Locations
| ID | Task | Agent | Skill | Priority | Dependencies |
|----|------|-------|-------|----------|--------------|
| 2.1 | DB Migration: Execute SQL scripts in Supabase | `database-architect` | `database-design` | P0 | 1.2 |
| 2.2 | CRUD for specific locations in `useLocationsStore` | `backend-specialist` | `api-patterns` | P1 | 2.1 |
| 2.3 | **Localization**: Translate all tags/features to English | `frontend-specialist` | `i18n` | P1 | ✅ Done |

### Phase 3: Admin Enhancements (The "Big Stuff")
| ID | Task | Agent | Skill | Priority | Dependencies |
|----|------|-------|-------|----------|--------------|
| 3.1 | Create `ImportWizard` component | `frontend-specialist` | `frontend-design` | P1 | ✅ Done |
| 3.2 | Integrate Google Maps MCP for enrichment | `orchestrator` | `intelligent-routing` | P1 | 3.1 |
| 3.3 | Implement Export to CSV/JSON | `backend-specialist` | `clean-code` | P2 | - |

### Phase 4: UX Refinements & Localization (Current Focus)
| ID | Task | Agent | Skill | Priority | Dependencies |
|----|------|-------|-------|----------|--------------|
| 4.1 | **Redesign Filter Modal**: Switch to Card Grid Layout | `frontend-specialist` | `ui-ux` | P0 | ✅ Done |
| 4.2 | **Contrast Optimization**: Improve text readability in Dark Mode | `frontend-specialist` | `accessibility` | P1 | ✅ Done |
| 4.3 | **Test Filters**: Verify filtering logic with new English tags | `tester` | `testing` | P0 | **NEXT STEP** |

---

## 🧪 Phase X: Verification Checklist
- [ ] `npm run build` passes without errors.
- [ ] `security_scan.py` finds no vulnerabilities in Supabase connection.
- [ ] `AdminLocationsPage.test.jsx` passes successfully.
- [x] Check contrast and mobile adaptability of new UI elements.
- [ ] **Verify that selecting English filters correctly queries the Russian/Raw data in DB.**

---
## ✅ NEXT STEPS
1. **TEST FILTERS**: Ensure that clicking "Morning" or "Cafe" correctly filters the list, utilizing the translation layer if necessary.
2. Commit all recent UI changes to Git.
3. Configure Supabase project for real data connection.
