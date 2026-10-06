# Saferry v14 QA Checklist

## Core navigation
- [x] Home loads
- [x] Hamburger menu opens/closes
- [x] Bottom navigation works
- [x] Back buttons return to Home

## Ferry schedules
- [x] Hagnaya → Sta. Fe route loads
- [x] Sta. Fe → Hagnaya route loads
- [x] Previous/next date controls work
- [x] Calendar date picker works
- [x] Current date is used by default
- [x] Reference warning remains visible
- [x] Primary source is identified

## Safety
- [x] Sea Travel tab works
- [x] Beach Safety tab works
- [x] Tips are source-based reference guidance

## Emergency
- [x] Contact list loads from local JSON
- [x] `tel:` actions are generated
- [x] 911 warning is visible
- [x] Local LGU and hospital references are marked as reference data

## Offline/PWA
- [x] App shell is cached
- [x] Local JSON data is cached
- [x] Offline reload works
- [x] Browser-controlled install prompt is supported when available

## Online update foundation
- [x] Remote configuration file exists
- [x] Remote manifest format exists
- [x] Remote data files have validation rules
- [x] Latest successful remote data is stored locally
- [x] Failed remote updates fall back to the latest local data
- [ ] Connect the project to the owner's GitHub data repository
- [ ] Test a live GitHub data edit → app synchronization cycle

## Data status
- Reference data last checked: 2026-10-06
- Ferry schedules remain subject to operator/port changes and cancellations.
- Emergency contacts should be reconfirmed before public deployment.
