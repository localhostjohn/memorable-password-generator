(() => {
  "use strict";

  const bank = globalThis.WORD_BANK;
  const passwordOutput = document.getElementById("password");
  const generateButton = document.getElementById("generate");
  const copyButton = document.getElementById("copy");
  const copyStatus = document.getElementById("copy-status");
  const combinationCount = document.getElementById("combination-count");
  const profileInputs = document.querySelectorAll('input[name="profile"]');

  const checks = {
    length: document.getElementById("check-length"),
    uppercase: document.getElementById("check-uppercase"),
    lowercase: document.getElementById("check-lowercase"),
    number: document.getElementById("check-number"),
    special: document.getElementById("check-special")
  };

  const profiles = Object.freeze({
    temporary: Object.freeze({ nounCount: 2, minimumLength: 15, label: "Temporary" }),
    permanent: Object.freeze({ nounCount: 5, minimumLength: 20, label: "Permanent" })
  });

  const recentPasswords = [];
  const RECENT_LIMIT = 100;

  function secureRandomInt(maxExclusive) {
    if (!Number.isSafeInteger(maxExclusive) || maxExclusive <= 0) {
      throw new RangeError("maxExclusive must be a positive safe integer");
    }

    const range = 0x100000000;
    const limit = range - (range % maxExclusive);
    const value = new Uint32Array(1);

    do {
      crypto.getRandomValues(value);
    } while (value[0] >= limit);

    return value[0] % maxExclusive;
  }

  function pick(items) {
    return items[secureRandomInt(items.length)];
  }

  function selectedProfileName() {
    return document.querySelector('input[name="profile"]:checked').value;
  }

  function isPolicyCompliant(password, minimumLength) {
    return password.length >= minimumLength &&
      /[A-Z]/.test(password) &&
      /[a-z]/.test(password) &&
      /\d/.test(password) &&
      /[^A-Za-z0-9]/.test(password);
  }

  function buildPassword() {
    const profile = profiles[selectedProfileName()];

    for (let attempt = 0; attempt < 1000; attempt += 1) {
      const words = [pick(bank.adjectives)];
      for (let index = 0; index < profile.nounCount; index += 1) {
        words.push(pick(bank.nouns));
      }

      const number = secureRandomInt(900) + 100;
      const candidate = `${words.join("")}${number}${pick(bank.specials)}`;

      if (isPolicyCompliant(candidate, profile.minimumLength) && !recentPasswords.includes(candidate)) {
        recentPasswords.push(candidate);
        if (recentPasswords.length > RECENT_LIMIT) recentPasswords.shift();
        return candidate;
      }
    }

    throw new Error("Unable to generate a compliant password.");
  }

  function setCheck(element, passed, text) {
    element.classList.toggle("pass", passed);
    element.classList.toggle("fail", !passed);
    element.querySelector(".check-icon").textContent = passed ? "✓" : "×";
    element.querySelector(".check-text").textContent = text;
  }

  function updatePolicy(password) {
    const minimumLength = profiles[selectedProfileName()].minimumLength;
    setCheck(checks.length, password.length >= minimumLength, `${password.length} characters (minimum ${minimumLength})`);
    setCheck(checks.uppercase, /[A-Z]/.test(password), "Contains a capital letter");
    setCheck(checks.lowercase, /[a-z]/.test(password), "Contains a lowercase letter");
    setCheck(checks.number, /\d/.test(password), "Contains a number");
    setCheck(checks.special, /[^A-Za-z0-9]/.test(password), "Contains a special character");
  }

  function formatCombinations() {
    const profile = profiles[selectedProfileName()];
    const count = BigInt(bank.adjectives.length) *
      (BigInt(bank.nouns.length) ** BigInt(profile.nounCount)) *
      900n * BigInt(bank.specials.length);
    const totalWords = profile.nounCount + 1;

    combinationCount.textContent = `${profile.label} profile · ${totalWords} words + three-digit number + symbol · ${count.toLocaleString()} possible combinations`;
  }

  function generate() {
    copyStatus.textContent = "";
    try {
      const password = buildPassword();
      passwordOutput.value = password;
      updatePolicy(password);
      formatCombinations();
      passwordOutput.focus();
      passwordOutput.select();
    } catch {
      copyStatus.textContent = "A password could not be generated. Refresh the page and try again.";
    }
  }

  async function copyPassword() {
    const password = passwordOutput.value;
    if (!password) return;

    try {
      await navigator.clipboard.writeText(password);
      copyStatus.textContent = "Copied to clipboard";
    } catch {
      passwordOutput.focus();
      passwordOutput.select();
      const copied = document.execCommand("copy");
      copyStatus.textContent = copied ? "Copied to clipboard" : "Select the password and copy it manually";
    }

    window.setTimeout(() => { copyStatus.textContent = ""; }, 2500);
  }

  generateButton.addEventListener("click", generate);
  copyButton.addEventListener("click", copyPassword);
  passwordOutput.addEventListener("click", () => passwordOutput.select());
  profileInputs.forEach((input) => input.addEventListener("change", generate));

  formatCombinations();
  generate();
})();
