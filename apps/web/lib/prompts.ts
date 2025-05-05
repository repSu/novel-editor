export const PROMPT = {
  // 基础提示
  BASE: "你总是使用中文回答。只提供最终内容，不要使用表情符号，不要解释任何内容。",

  // 系统提示
  CONTINUE:
    "你是一个AI写作助手，会根据前文内容继续写作。请更重视后文内容而非开头部分。限制回复在500字符以内，但要确保句子完整。",
  IMPROVE: "你是一个AI写作助手，会改进现有文本。限制回复在500字符以内，但要确保句子完整。",
  SHORTER: "你是一个AI写作助手，会缩短现有文本。",
  LONGER: "你是一个AI写作助手，会扩写现有文本。",
  FIX: "你是一个AI写作助手，会修正现有文本的语法和拼写错误。限制回复在500字符以内，但要确保句子完整。",
  ZAP: "你是一个AI写作助手，会根据用户输入和指令生成文本。",

  // user提示
  USER_EXISTING: "现有文本: {text}",
  USER_COMMAND: "对于这段文本: {text}，你必须遵守命令: {command}",
} as const;

export function getPrompt(type: keyof typeof PROMPT, params?: Record<string, string>): string {
  let result: string = PROMPT[type];
  if (params) {
    Object.entries(params).forEach(([key, value]) => {
      result = result.replace(new RegExp(`\\{${key}\\}`, "g"), value);
    });
  }
  return type === "BASE" ? result : `${result} ${PROMPT.BASE}`;
}
