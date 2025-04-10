
# Project Name

## Overview
CampusNav is a real-time web application that helps students create, locate, and join in-person study sessions on campus. It addresses the problem of students struggling to find peers studying the same material — especially for those living off-campus or unfamiliar with the campus layout. Users can register and log in, view their current location, see nearby study sessions on an interactive map, and get information about each session.

This project was developed by a team of BCIT CST students as part of the COMP 1800 course. We followed agile development practices with weekly sprints, user-centred design feedback from our instructor Carly, and integrated several modern web technologies like Firebase and Mapbox.


---

## Features

- Firebase Authentication for secure login and signup
- Firestore database integration to store users and session data
- Create and post new study sessions with geolocation
- Interactive map using Mapbox API to display study sessions and user location
- Real-time updates for session activity indicators
- Auto-removal of expired sessions from Firestore
- Personalized messages and session tracking
- Clean, student-friendly UI styled with a sage green colour palette

---

## Technologies Used


- **Frontend**: HTML, CSS, JavaScript, Bootstrap, Font Awesome
- **Backend**: Firebase Authentication, Firestore
- **Map API**: Mapbox GL JS
- **Version Control**: Git and GitHub
- **Design Tools**: Figma (UI/UX wireframes), Trello (project management), Discord (team meetings)


---

## Usage

1. Visit the live app: [https://campusnav-8ebd2.web.app](https://campusnav-8ebd2.web.app)
2. Log in or create a new account.
3. On the main page:
   - View your session status and welcome message.
   - Create a new session with a description and duration.
   - See yourself and other study groups on the map.
4. Click on any session marker to view details and contact info.

---

## Project Structure
campusnav/
├── .firebaserc
├── .gitignore
├── 404.html
├── firebase.json
├── firestore.indexes.json
├── firestore.rules
├── index.html
├── login.html
├── main.html
├── README.md
├── template.html
├── test.md
├── .firebase/
│   └── hosting..cache
├── images/
│   ├── AM01.jpg
│   ├── BBY01.jpg
│   ├── drink1.jpg
│   ├── drink2.jpg
│   ├── drink3.jpg
│   ├── elmo.jpg
│   ├── hike1.jpg
│   ├── hike2.jpg
│   ├── hike3.jpg
│   ├── logo.jpg
│   └── NV01.jpg
├── scripts/
│   ├── authentification.js
│   ├── firebaseAPI.js
│   ├── main.js
│   ├── script.js
│   └── skeleton.js
├── styles/
│   ├── style_index.css
│   ├── style_login.css
│   ├── style.css
│   └── text/
│       ├── nav_after_login.html
│       └── nav_before_login.html


## Contributors
```
- Nikolas Rose - BCIT CST Student who enjoys programming and has a passion for gaming and hiking.
- **Nathan** - BCIT CST Student, I'm studying CST at BCIT.
- **Berenice** - BCIT CST Student. I am excited to see what I can create!

---
```
## Acknowledgments

- [Font Awesome](https://fontawesome.com/) – Icon library
- [Feather Icons](https://feathericons.com/)
- [Google Fonts](https://fonts.google.com/)
- [Bootstrap](https://getbootstrap.com/) – For layout and responsive components
- [Adobe Fonts](https://fonts.adobe.com/) – Font inspiration
- [Adobe Stock Images](https://stock.adobe.com/images) – UI inspiration
- Instructor **Carly** for guidance and project pivots

---

## Limitations and Future Work
### Limitations

- Map routing was incomplete at submission but will be added post-launch
- UI is partially polished; layout tweaks in progress
- Sessions can't currently be "joined" formally — it's more about location and contact
- No filtering options for sessions yet (e.g., by course or subject)
- Known bug: occasionally delays rendering markers when sessions expire

### Future Work

- Implement “Join Session” feature for RSVP functionality
- Add filters by course ID or subject
- Allow club-based session tagging
- Improve mobile responsiveness and navigation
- Add dark mode and accessibility improvements

---

## License

Example:
This project is licensed under the MIT License. See the LICENSE file for details.