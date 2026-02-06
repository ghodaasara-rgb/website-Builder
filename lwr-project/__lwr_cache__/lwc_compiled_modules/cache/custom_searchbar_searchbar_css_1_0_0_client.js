function stylesheet(token, useActualHostSelector, useNativeDirPseudoclass) {
  var shadowSelector = token ? ("[" + token + "]") : "";
  var hostSelector = token ? ("[" + token + "-host]") : "";
  var suffixToken = token ? ("-" + token) : "";
  return ".search-bar" + shadowSelector + " {display: flex;gap: 16px;align-items: center;flex-wrap: wrap;}.search-input-wrapper" + shadowSelector + " {flex: 1;min-width: 300px;position: relative;}.search-icon" + shadowSelector + " {position: absolute;left: 12px;top: 50%;transform: translateY(-50%);pointer-events: none;}.search-input" + shadowSelector + " {width: 100%;padding: 10px 12px 10px 40px;border: 1px solid #d1d5db;border-radius: 8px;font-size: 14px;font-family: inherit;transition: all 0.2s;}.search-input:focus" + shadowSelector + " {outline: none;border-color: #4f46e5;box-shadow: 0 0 0 3px rgba(79, 70, 229, 0.1);}@media (max-width: 640px) {.search-bar" + shadowSelector + " {flex-direction: column;align-items: stretch;}.search-input-wrapper" + shadowSelector + " {min-width: 100%;}}";
  /*LWC compiler v8.28.0*/
}
export default [stylesheet];