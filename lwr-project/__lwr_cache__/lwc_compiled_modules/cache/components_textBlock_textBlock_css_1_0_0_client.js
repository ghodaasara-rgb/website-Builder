function stylesheet(token, useActualHostSelector, useNativeDirPseudoclass) {
  var shadowSelector = token ? ("[" + token + "]") : "";
  var hostSelector = token ? ("[" + token + "-host]") : "";
  var suffixToken = token ? ("-" + token) : "";
  return ".text-block-wrapper" + shadowSelector + " {padding: 2rem 0;max-width: 800px;margin: 0 auto;}.text-content" + shadowSelector + " h2" + shadowSelector + " {font-size: 2rem;margin-bottom: 1rem;color: var(--s-text-heading);}.text-content" + shadowSelector + " p" + shadowSelector + " {font-size: 1.1rem;line-height: 1.6;color: var(--s-text-body);}";
  /*LWC compiler v8.28.0*/
}
export default [stylesheet];