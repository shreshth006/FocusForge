# Documented Development Steps

## Step 1: Requirement Understanding
- Reviewed assignment guidelines and evaluation criteria.
- Selected a project that is original, useful, and feasible within assignment timeline.

## Step 2: Planning the App Structure
- Decided four core modules:
  - Task Input
  - Task List
  - Focus Timer
  - Summary Dashboard
- Planned Local Storage integration for persistence.

## Step 3: UI Design (HTML + CSS)
- Built a responsive multi-card layout.
- Created clean forms, lists, and buttons for better usability.
- Added priority tags and clear visual hierarchy.

## Step 4: JavaScript Logic Implementation
- Implemented task operations: add, toggle complete, delete, clear completed.
- Implemented timer logic: start, pause, reset, mode switch.
- Added session completion count and alert feedback.

## Step 5: Data Persistence
- Stored tasks and focus sessions in Local Storage.
- Loaded saved data on page refresh.

## Step 6: Testing and Bug Fixing
- Tested edge cases:
  - Empty form prevention
  - Timer mode switching while running
  - Task count accuracy
  - Data persistence on reload
- Fixed UI and logic inconsistencies.

## Step 7: Documentation
- Prepared project proposal, reflections, and report template.
- Added README with setup and deployment instructions.

## Challenges Faced and Solutions
1. Timer state handling while switching modes
   - Solution: stopped active interval before resetting mode.
2. Keeping UI stats in sync with task updates
   - Solution: centralized stat refresh in updateStats().
3. Persistent state reliability
   - Solution: wrapped JSON parse in try-catch and fallback defaults.

## Resources Used
- MDN Web Docs (DOM, timers, Local Storage)
- CSS layout references for responsive grid
- GitHub Docs for GitHub Pages deployment
