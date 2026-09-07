import type { ThemeConfig } from "antd";

export const theme: ThemeConfig = {
  token: {
    colorPrimary: "#3D5A6C",
    colorSuccess: "#2F6E4F",
    colorError: "#B3492F",
    colorBgLayout: "#F7F6F3",
    colorBgContainer: "#FFFFFF",
    colorBorder: "#DDD8CE",
    colorText: "#1A2B33",
    colorTextSecondary: "#5C6B72",
    borderRadius: 4,
    fontFamily: "-apple-system, BlinkMacSystemFont, 'Segoe UI', sans-serif",
  },
  components: {
    Table: {
      headerBg: "#F7F6F3",
      headerColor: "#5C6B72",
      borderColor: "#DDD8CE",
    },
    Card: {
      boxShadowTertiary: "none",
    },
  },
};

export const fonts = {
  serif: "'Source Serif 4', Georgia, serif",
  mono: "'JetBrains Mono', 'SF Mono', Consolas, monospace",
};