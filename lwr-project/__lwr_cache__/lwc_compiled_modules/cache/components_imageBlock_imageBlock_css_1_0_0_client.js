function stylesheet(token, useActualHostSelector, useNativeDirPseudoclass) {
  var shadowSelector = token ? ("[" + token + "]") : "";
  var hostSelector = token ? ("[" + token + "-host]") : "";
  var suffixToken = token ? ("-" + token) : "";
  return ".image-block" + shadowSelector + " {margin: 2rem 0;text-align: center;}.img-responsive" + shadowSelector + " {max-width: 100%;height: auto;border-radius: 8px;box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1);}figcaption" + shadowSelector + " {margin-top: 0.5rem;font-size: 0.9rem;color: var(--s-text-secondary);font-style: italic;}";
  /*LWC compiler v8.28.0*/
}
export default [stylesheet];