(() => {
  "use strict";

  const bank = globalThis.WORD_BANK;
  const passwordOutput = document.getElementById("password");
  const generateButton = document.getElementById("generate");
  const copyButton = document.getElementById("copy");
  const copyStatus = document.getElementById("copy-status");
  const combinationCount = document.getElementById("combination-count");

  const checks = {
    length: document.getElementById("check-length"),
    uppercase: document.getElementById("check-uppercase"),
    lowercase: document.getElementById("check-lowercase"),
    number: document.getElementById("check-number"),
    special: document.getElementById("check-special")
  };

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

  function isPolicyCompliant(password) {
    return password.length >= 12 &&
      /[A-Z]/.test(password) &&
      /[a-z]/.test(password) &&
      /\d/.test(password) &&
      /[^A-Za-z0-9]/.test(password);
  }

  function buildPassword() {
    for (let attempt = 0; attempt < 1000; attempt += 1) {
      const adjective = pick(bank.adjectives);
      const noun = pick(bank.nouns);
      const number = secureRandomInt(90) + 10;
      const special = pick(bank.specials);
      const candidate = `${adjective}${noun}${number}${special}`;

      if (
        isPolicyCompliant(candidate) &&
        !recentPasswords.includes(candidate)
      ) {
        recentPasswords.push(candidate);
        if (recentPasswords.length > RECENT_LIMIT) {
          recentPasswords.shift();
        }
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
    setCheck(
      checks.length,
      password.length >= 12,
      `${password.length} characters (minimum 12)`
    );
    setCheck(checks.uppercase, /[A-Z]/.test(password), "Contains a capital letter");
    setCheck(checks.lowercase, /[a-z]/.test(password), "Contains a lowercase letter");
    setCheck(checks.number, /\d/.test(password), "Contains a number");
    setCheck(checks.special, /[^A-Za-z0-9]/.test(password), "Contains a special character");
  }

  function generate() {
    copyStatus.textContent = "";
    const password = buildPassword();
    passwordOutput.value = password;
    updatePolicy(password);
    passwordOutput.focus();
    passwordOutput.select();
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

    window.setTimeout(() => {
      copyStatus.textContent = "";
    }, 2500);
  }

  function formatCombinations() {
    const count =
      BigInt(bank.adjectives.length) *
      BigInt(bank.nouns.length) *
      90n *
      BigInt(bank.specials.length);

    combinationCount.textContent =
      `${bank.adjectives.length.toLocaleString()} adjectives × ` +
      `${bank.nouns.length.toLocaleString()} nouns · ` +
      `${count.toLocaleString()} possible combinations`;
  }

  generateButton.addEventListener("click", generate);
  copyButton.addEventListener("click", copyPassword);

  passwordOutput.addEventListener("click", () => passwordOutput.select());

  document.addEventListener("keydown", (event) => {
    if (event.key === "Enter" && !event.ctrlKey && !event.metaKey) {
      generate();
    }
  });

  formatCombinations();
  generate();
})();
