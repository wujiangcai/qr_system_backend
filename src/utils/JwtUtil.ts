// src/utils/tokenUtil.ts

/**
 * Base64Url 解码方法
 * @param input 要解码的字符串
 * @returns 解码后的字符串
 */
function base64UrlDecode(input: string): string {
  let base64 = input.replace(/-/g, "+").replace(/_/g, "/");
  while (base64.length % 4) {
    base64 += "=";
  }
  return atob(base64);
}

/**
 * 解析 JWT Token 的 Payload 部分
 * @param token JWT Token
 * @returns 解析后的 Payload
 */
export function parseToken(token: string): Record<string, any> | null {
  try {
    const parts = token.split(".");
    if (parts.length !== 3) {
      console.error("Token 格式错误:", token);
      return null;
    }

    const payload = parts[1];
    const decodedPayload = base64UrlDecode(payload);
    return JSON.parse(decodedPayload);
  } catch (error) {
    console.error("解析 Token 失败:", error);
    return null;
  }
}

/**
 * 获取本地存储中的 Token
 * @returns 存储的 Token 或 null
 */
export function getToken(): string | null {
  return localStorage.getItem("token");
}

/**
 * 保存 Token 到本地存储
 * @param token 要保存的 Token
 */
export function setToken(token: string): void {
  localStorage.setItem("token", token);
}

/**
 * 移除 Token
 */
export function removeToken(): void {
  localStorage.removeItem("token");
}

/**
 * 从 Token 中提取用户 ID
 * @returns 用户 ID 或 null
 */
// src/utils/tokenUtil.ts
export function extractUserId(token: string): string | null {
  if (!token) {
    console.warn('Token 不存在');
    return null;
  }

  try {
    const payload = parseToken(token); // 解析 Token
    return payload?.id ? payload.id.toString() : null; // 返回用户 ID
  } catch (error) {
    console.error('Token 格式错误:', error);
    return null;
  }
}