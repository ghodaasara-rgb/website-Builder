function stylesheet(token, useActualHostSelector, useNativeDirPseudoclass) {
  var shadowSelector = token ? ("[" + token + "]") : "";
  var hostSelector = token ? ("[" + token + "-host]") : "";
  var suffixToken = token ? ("-" + token) : "";
  return ".activity-bar" + shadowSelector + " {display: flex;flex-direction: column;width: 60px;background-color: #0f172a;height: 100%;z-index: 40;align-items: center;padding-top: 1rem;}.activity-tab" + shadowSelector + " {width: 40px;height: 40px;display: flex;align-items: center;justify-content: center;margin-bottom: 0.5rem;border-radius: 4px;cursor: pointer;color: #94a3b8;transition: all 0.2s;}.activity-tab:hover" + shadowSelector + " {color: #fff;background-color: rgba(255, 255, 255, 0.1);}.activity-tab.active" + shadowSelector + " {color: #fff;background-color: #3b82f6;box-shadow: 0 0 10px rgba(59, 130, 246, 0.5);}.activity-tab" + shadowSelector + " svg" + shadowSelector + " {width: 24px;height: 24px;fill: currentColor;}";
  /*LWC compiler v8.28.0*/
}
export default [stylesheet];