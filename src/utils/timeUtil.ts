class TimeUtil {
  /**
   * 将时间戳转换为指定格式的日期字符串
   * @param timestamp - Unix 时间戳（秒）
   * @param format - 日期格式，默认 'YYYY-MM-DD HH:mm:ss'
   * @returns 格式化后的日期字符串
   */
  static format(
    timestamp: number,
    format: string = "YYYY-MM-DD HH:mm:ss"
  ): string {
    const date = new Date(timestamp * 1000); // 如果是毫秒级时间戳，则不需要乘以1000
    const map: { [key: string]: string } = {
      YYYY: date.getFullYear().toString(),
      MM: String(date.getMonth() + 1).padStart(2, "0"),
      DD: String(date.getDate()).padStart(2, "0"),
      HH: String(date.getHours()).padStart(2, "0"),
      mm: String(date.getMinutes()).padStart(2, "0"),
      ss: String(date.getSeconds()).padStart(2, "0"),
    };
    return format.replace(/YYYY|MM|DD|HH|mm|ss/g, (matched) => map[matched]);
  }

  /**
   * 将时间戳转换为相对时间，如“几分钟前”、“几小时前”等
   * @param timestamp - Unix 时间戳（秒）
   * @returns 相对时间描述
   */
  static timeAgo(timestamp: number): string {
    const now = Date.now();
    const timeDiff = now - timestamp * 1000; // 如果是毫秒级时间戳，则不需要乘以1000

    const seconds = Math.floor(timeDiff / 1000);
    const minutes = Math.floor(seconds / 60);
    const hours = Math.floor(minutes / 60);
    const days = Math.floor(hours / 24);
    const months = Math.floor(days / 30);
    const years = Math.floor(days / 365);

    if (years > 0) return `${years} year${years > 1 ? "s" : ""} ago`;
    if (months > 0) return `${months} month${months > 1 ? "s" : ""} ago`;
    if (days > 0) return `${days} day${days > 1 ? "s" : ""} ago`;
    if (hours > 0) return `${hours} hour${hours > 1 ? "s" : ""} ago`;
    if (minutes > 0) return `${minutes} minute${minutes > 1 ? "s" : ""} ago`;
    return "just now";
  }

  /**
   * 检查一个时间戳是否是今天
   * @param timestamp - Unix 时间戳（秒）
   * @returns 如果是今天返回 true，否则返回 false
   */
  static isToday(timestamp: number): boolean {
    const date = new Date(timestamp * 1000);
    const today = new Date();
    return (
      date.getDate() === today.getDate() &&
      date.getMonth() === today.getMonth() &&
      date.getFullYear() === today.getFullYear()
    );
  }
}

export default TimeUtil;
