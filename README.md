# Memorable Password Generator

A lightweight browser-based password generator that creates easy-to-remember passwords using one consistent format:

`Adjective + Noun + Number + Special Character`

Example:

`SilverFalcon42!`

## Password policy

Every generated password is checked for:

- Minimum 12 characters
- At least one uppercase letter
- At least one lowercase letter
- At least one number
- At least one special character

## Privacy and security

- Generation happens entirely in the browser.
- Random selections use the browser Web Crypto API (`crypto.getRandomValues`).
- No generated passwords are logged or stored.
- No analytics are included.
- No API calls or external word services are used.
- The Content Security Policy blocks outbound network connections from the page.

## Vocabulary

This version includes:

- 283 curated adjectives
- 899 curated nouns
- 90 two-digit number values
- 8 special characters

That gives **183,180,240 base combinations** before the minimum-length validation rerolls any combination that is too short.

The word bank lives in `js/words.js`, so it can be expanded without changing the generator logic.

## Run locally

Open `index.html` in a modern browser such as Microsoft Edge or Google Chrome.

## Publish with GitHub Pages

1. Open **Settings > Pages**.
2. Under **Build and deployment**, select **Deploy from a branch**.
3. Select the `main` branch and `/ (root)`.
4. Save.

GitHub Pages will then publish the app as a static website.

## Project structure

```text
memorable-password-generator/
├── index.html
├── README.md
├── LICENSE
├── css/
│   └── style.css
└── js/
    ├── generator.js
    └── words.js
```

## Note

This project describes a generic password complexity policy. Do not add confidential organisational information, real passwords, internal server names, user details or proprietary branding to a public repository without approval.
