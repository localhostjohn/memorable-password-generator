# Memorable Password Generator

A lightweight browser-based generator for memorable temporary and permanent passwords. Passwords are generated locally using the browser Web Crypto API.

## Use the generator

[Open the live generator](https://localhostjohn.github.io/memorable-password-generator/), or open `index.html` locally in a modern browser such as Microsoft Edge or Google Chrome.

## Password profiles

- **Temporary:** one adjective, two nouns, a three-digit number and a symbol. The password must be changed after first sign-in.
- **Permanent:** one adjective, five nouns, a three-digit number and a symbol. This deliberately uses a much larger search space.

Both profiles enforce a minimum length and include uppercase, lowercase, numeric and special characters. Always confirm that the generated password meets the target system's current policy.

## Appropriate use

- Use the correct profile for the intended account.
- Do not reuse generated passwords across accounts.
- Do not place passwords in tickets, email, chat messages, source code or documentation.
- Follow the organisation's approved identity-verification, password-reset and secure-delivery processes.
- Prefer phishing-resistant MFA and organisation-approved password managers wherever available.

This project provides a generation aid, not an organisational security approval or a replacement for password policy, MFA, rate limiting, compromised-password screening or secure credential delivery.

## Privacy and security

- Generation happens entirely in the browser.
- Random selections use `crypto.getRandomValues()` with rejection sampling.
- The application does not log or store generated passwords.
- No analytics, API calls or external word services are used.
- The Content Security Policy blocks outbound network connections from the page.
- A copied password may remain in the operating system clipboard until it is replaced.

The word bank and generation algorithm are public. Security therefore comes from the randomly selected combinations—not from keeping the pattern secret.

## Development

No build process or dependencies are required. Clone the repository and open `index.html`. The validation workflow checks JavaScript syntax and required static files on pull requests and pushes to `main`.

## Publish with GitHub Pages

1. Open **Settings > Pages**.
2. Under **Build and deployment**, select **Deploy from a branch**.
3. Select the `main` branch and `/ (root)`.
4. Save.

## Project structure

```text
memorable-password-generator/
├── .github/workflows/validate.yml
├── css/style.css
├── js/generator.js
├── js/words.js
├── favicon.png
├── favicon.svg
├── index.html
├── LICENSE
└── README.md
```

## Public repository guidance

Do not add confidential organisational information, real passwords, internal server names, user details or proprietary branding to this public repository.

## Licence

Licensed under the MIT License.
