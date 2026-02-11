export function closeMobileKeyboard() {
  if (
    document.activeElement &&
    typeof document.activeElement.blur === "function"
  ) {
    document.activeElement.blur();
  }

  // ✅ iOS 사파리 대응 (안 내려가는 경우 방지)
  window.scrollTo({ top: window.scrollY + 1, behavior: "auto" });
  window.scrollTo({ top: window.scrollY - 1, behavior: "auto" });
}
