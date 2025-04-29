const forbiddenPatterns = {
  cpp: [
    /\b(system|popen|fork|exec|execl|execlp|execle|execv|execvp|execvpe)\s*\(/,
    /#include\s*<windows\.h>/i,
  ],
  python: [
    /\b(os\.system|eval|exec|subprocess|open)\b/,
    /import\s+os/,
    /import\s+sys/,
    /import\s+subprocess/,
  ],
  javascript: [
    /\brequire\s*\(\s*['"]child_process['"]\s*\)/,
    /\b(eval|Function|execSync|spawnSync|spawn|exec)\s*\(/,
    /import\s+.*['"]child_process['"]/,
  ],
};

function containsForbiddenPatterns(code, lang) {
  const patterns = forbiddenPatterns[lang.toLowerCase()];
  if (!patterns) return false;

  return patterns.some((regex) => regex.test(code));
}

module.exports = { containsForbiddenPatterns };
