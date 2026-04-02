import { describe, it, expect, beforeEach } from "vitest";
import { useThemeStore } from "../theme-store";

describe("themeStore", () => {
  beforeEach(() => {
    useThemeStore.setState({ theme: "dark" });
  });

  it("should have dark as default theme", () => {
    expect(useThemeStore.getState().theme).toBe("dark");
  });

  it("should toggle theme", () => {
    useThemeStore.getState().toggleTheme();
    expect(useThemeStore.getState().theme).toBe("light");
    useThemeStore.getState().toggleTheme();
    expect(useThemeStore.getState().theme).toBe("dark");
  });

  it("should set theme directly", () => {
    useThemeStore.getState().setTheme("light");
    expect(useThemeStore.getState().theme).toBe("light");
  });
});
