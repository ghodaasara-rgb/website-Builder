function stylesheet(token, useActualHostSelector, useNativeDirPseudoclass) {
  var shadowSelector = token ? ("[" + token + "]") : "";
  var hostSelector = token ? ("[" + token + "-host]") : "";
  var suffixToken = token ? ("-" + token) : "";
  return ".empty-state" + shadowSelector + " {text-align: center;padding: 80px 20px;}.empty-icon" + shadowSelector + " {margin-bottom: 24px;}.empty-title" + shadowSelector + " {font-size: 24px;font-weight: 600;color: #111827;margin: 0 0 12px 0;}.empty-description" + shadowSelector + " {font-size: 16px;color: #6b7280;margin: 0 0 32px 0;max-width: 400px;margin-left: auto;margin-right: auto;}.btn" + shadowSelector + " {display: inline-flex;align-items: center;gap: 8px;padding: 12px 24px;border-radius: 8px;font-size: 14px;font-weight: 600;cursor: pointer;transition: all 0.2s;border: none;font-family: inherit;}.btn-primary" + shadowSelector + " {background: #4f46e5;color: white;}.btn-primary:hover" + shadowSelector + " {background: #4338ca;box-shadow: 0 4px 6px -1px rgba(0, 0, 0, 0.1);}";
  /*LWC compiler v8.28.0*/
}
export default [stylesheet];