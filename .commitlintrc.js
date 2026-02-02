/**
 * Commitlint 提交信息规范配置
 * 确保 Git 提交信息符合约定式提交规范
 */
module.exports = {
  extends: ["@commitlint/config-conventional"],
  rules: {
    // 类型枚举
    "type-enum": [
      2,
      "always",
      [
        "feat", // 新功能
        "fix", // 修复 bug
        "docs", // 文档更新
        "style", // 代码格式调整（不影响功能）
        "refactor", // 重构代码
        "perf", // 性能优化
        "test", // 测试相关
        "build", // 构建系统或依赖更新
        "ci", // CI/CD 配置更新
        "chore", // 其他杂项
        "revert", // 回滚提交
      ],
    ],
    // 主题不能为空
    "subject-empty": [2, "never"],
    // 主题最大长度
    "subject-max-length": [2, "always", 50],
    // 主题格式（首字母小写）
    "subject-case": [2, "always", "lower-case"],
    // 主题结尾不能有句号
    "subject-full-stop": [2, "never", "."],
    // 正文前必须有空行
    "body-leading-blank": [2, "always"],
    // 页脚前必须有空行
    "footer-leading-blank": [2, "always"],
    // 标题最大长度
    "header-max-length": [2, "always", 72],
  },
};