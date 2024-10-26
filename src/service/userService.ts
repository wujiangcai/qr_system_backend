import axios from "axios";
import { extractUserId } from "../utils/JwtUtil";

export const fetchHeaderInfo = async () => {
  const token = localStorage.getItem("token");
  const userId = extractUserId(token);

  if (!userId) {
    console.error("未检测到用户 ID，请先登录");
    return null;
  }

  try {
    const response = await axios.get(
      `http://localhost:8080/api/v1/user/${userId}`,
      {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      }
    );

    if (response.data.code === 200) {
      return response.data.data;
    } else {
      console.error(response.data.msg);
      return null;
    }
  } catch (error) {
    console.error("获取用户信息失败:", error);
    return null;
  }
};
