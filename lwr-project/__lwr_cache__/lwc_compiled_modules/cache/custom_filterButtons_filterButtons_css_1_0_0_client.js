function stylesheet(token, useActualHostSelector, useNativeDirPseudoclass) {
  var shadowSelector = token ? ("[" + token + "]") : "";
  var hostSelector = token ? ("[" + token + "-host]") : "";
  var suffixToken = token ? ("-" + token) : "";
  return ".filter-buttons" + shadowSelector + " {display: flex;gap: 8px;background: #f3f4f6;padding: 4px;border-radius: 8px;}.filter-button" + shadowSelector + " {padding: 8px 16px;border: none;background: transparent;border-radius: 6px;font-size: 14px;font-weight: 500;color: #6b7280;cursor: pointer;transition: all 0.2s;font-family: inherit;}.filter-button:hover" + shadowSelector + " {color: #374151;}.filter-button.active" + shadowSelector + " {background: white;color: #4f46e5;box-shadow: 0 1px 2px 0 rgba(0, 0, 0, 0.05);}@media (max-width: 640px) {.filter-buttons" + shadowSelector + " {width: 100%;justify-content: stretch;}.filter-button" + shadowSelector + " {flex: 1;}}";
  /*LWC compiler v8.28.0*/
}
export default [stylesheet];