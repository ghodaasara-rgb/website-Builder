function stylesheet(token, useActualHostSelector, useNativeDirPseudoclass) {
  var shadowSelector = token ? ("[" + token + "]") : "";
  var hostSelector = token ? ("[" + token + "-host]") : "";
  var suffixToken = token ? ("-" + token) : "";
  return ".card-block" + shadowSelector + " {background: #fff;border-radius: 8px;box-shadow: 0 2px 4px rgba(0, 0, 0, 0.05);padding: 1.5rem;margin: 1rem auto;max-width: 400px;transition: transform 0.2s;border: 1px solid var(--s-border-light);}.card-block:hover" + shadowSelector + " {transform: translateY(-2px);box-shadow: 0 4px 8px rgba(0, 0, 0, 0.1);}.card-title" + shadowSelector + " {font-size: 1.25rem;margin-bottom: 0.5rem;color: var(--s-text-heading);}.card-text" + shadowSelector + " {color: var(--s-text-body);margin-bottom: 1.5rem;}";
  /*LWC compiler v8.28.0*/
}
export default [stylesheet];