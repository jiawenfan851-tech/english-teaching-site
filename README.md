# Bright English Studio

A small website for English lessons and independent study, with vocabulary practice, grammar notes, a student study area, and a teacher workspace. Built with HTML, CSS, and vanilla JavaScript.

[Visit the site](https://jiawenfan851-tech.github.io/english-teaching-site/) · [Learning library](https://jiawenfan851-tech.github.io/english-teaching-site/learn.html)

## What it does

- Introduces the courses and lets families request a trial lesson.
- Offers vocabulary search, filters, pronunciation playback, saved words, quizzes, and review history.
- Provides phonics, sentence patterns, and reading material for primary learners, plus 38 grammar topics for middle school.
- Gives students a view of their study progress in the current browser.
- Lets teachers manage lessons, student records, and tasks, with JSON import and export for backups.

The learning content is intended for Chinese-speaking students. The interface and Chinese definitions reflect that audience.

## Vocabulary coverage

| Collection | Entries | Source |
| --- | ---: | --- |
| Primary school | 505 | Level 2 vocabulary appendix, China's 2022 compulsory education English curriculum standard |
| Middle school | 1,600 | Level 3 appendix of the same standard; includes the 505 primary entries |
| High school | 3,000 | Full vocabulary appendix, China's high school English curriculum standard, revised in 2020 |
| Postgraduate entrance exam preparation | 4,801 | ECDICT entries tagged `ky` |
| IELTS preparation | 5,040 | ECDICT entries tagged `ielts` |

Pronunciations and Chinese definitions come mainly from ECDICT. The IELTS collection is a preparation resource, not an official IELTS word list. Source details and the ECDICT license are in [Third-party notices](THIRD_PARTY_NOTICES.md).

## Run locally

The frontend has no package installation or build step. With Python 3 installed:

```sh
git clone https://github.com/jiawenfan851-tech/english-teaching-site.git
cd english-teaching-site
python3 -m http.server 8000
```

Open [localhost:8000](http://localhost:8000). This serves the static pages; it does not start a booking API.

## How the site stores data

Study progress and teacher workspace records are saved in `localStorage`. They stay in the current browser and do not sync across devices. Teacher records can be exported to JSON and imported again for a manual backup.

Student and teacher sessions use `sessionStorage`, with expiry times of 12 and 8 hours respectively. Both login flows run entirely in the browser: their checks are included in the public JavaScript. They guide access to the pages but cannot protect private records or isolate multiple users. A hosted version used for sensitive student information would need server-side authentication and storage.

## Trial lesson requests

The form reads its API URL from `data-booking-endpoint` in `index.html`, currently set to `./api/booking`. It sends a request there first. If the request fails, or the endpoint is left empty, it prepares an email in the visitor's mail app and attempts to copy the details to the clipboard. The visitor must send that email themselves.

GitHub Pages serves static files and cannot run the API, so the Pages version relies on the email fallback. The repository also contains two optional booking handlers:

- `node-functions/api/booking.js` for an EdgeOne Pages function.
- `cloudfunctions/booking/` for a standalone Node.js HTTP service on port 9000.

Both handlers currently forward requests to Formspree. Hosting either handler in China does not remove that external delivery dependency. They need a separate deployment before the form can submit automatically.

## Repository layout

| Path | Purpose |
| --- | --- |
| `index.html` | Public homepage, trial lesson form, and login dialogs |
| `learn.html`, `learn.js`, `learn.css` | Learning library and practice tools |
| `student.html`, `student.js`, `student.css` | Student study area |
| `teacher.html`, `teacher.js`, `teacher.css` | Teacher workspace |
| `auth.js`, `student-auth.js` | Browser-based session checks |
| `booking.js` | Booking request and email fallback |
| `data/` | Vocabulary, grammar, and study material |
| `scripts/` | Vocabulary generation scripts |
| `.github/workflows/pages.yml` | GitHub Pages deployment |

## Updating the vocabulary

The generated vocabulary files are committed, so they are ready to use without running the scripts. To rebuild them, download the source curriculum PDFs and ECDICT CSV separately. Convert the PDFs to text with `pdftotext -layout`, then run:

```sh
python3 scripts/build_curriculum_vocabulary.py \
  --compulsory-text /path/to/compulsory-english-2022.txt \
  --high-school-text /path/to/high-school-english-2020.txt \
  --ecdict /path/to/ecdict.csv \
  --existing-vocabulary data/vocabulary.js \
  --output data/curriculum-vocabulary.js

python3 scripts/build_exam_vocabulary.py \
  --ecdict /path/to/ecdict.csv \
  --output data/exam-vocabulary.js
```

The source PDFs and full dictionary are not stored in this repository. See [Third-party notices](THIRD_PARTY_NOTICES.md) for source links and attribution.

## Deployment

The GitHub Pages workflow publishes the repository when changes are pushed to `main`. It can also be run manually from the Actions tab. There is no frontend compilation step.

## Project notes

- **July 10, 2026:** Added the student study area, expanded the learning library, and introduced the teacher workspace, search metadata, and session expiry.
- **July 7, 2026:** Redeployed the site on GitHub Pages.
