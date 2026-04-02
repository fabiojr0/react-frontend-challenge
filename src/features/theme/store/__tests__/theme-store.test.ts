import { describe, it, expect, beforeEach } from "vitest";
import { useThemeStore } from "../theme-store";

describe("themeStore", () => {
  beforeEach(() => {
    useThemeStore.setState({ theme: "dark" });
  });

  it("deve ter 'dark' como tema padrão", () => {
    expect(useThemeStore.getState().theme).toBe("dark");
  });

  it("deve alternar o tema", () => {
    useThemeStore.getState().toggleTheme();
    expect(useThemeStore.getState().theme).toBe("light");
    useThemeStore.getState().toggleTheme();
    expect(useThemeStore.getState().theme).toBe("dark");
  });

  it("deve definir o tema diretamente", () => {
    useThemeStore.getState().setTheme("light");
    expect(useThemeStore.getState().theme).toBe("light");
  });
});
