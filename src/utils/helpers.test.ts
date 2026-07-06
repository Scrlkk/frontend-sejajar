import { describe, it, expect, vi } from "vitest";
import {
  buildQueryString,
  formatCurrencyIDR,
  formatCompactIDR,
  formatDate,
  wordCount,
  formatDateEN,
  getFileUrl,
} from "./helpers";

describe("helpers utilities", () => {
  describe("buildQueryString", () => {
    it("should construct query string correctly", () => {
      const params = { name: "sejajar", limit: 10, offset: null, empty: "" };
      expect(buildQueryString(params)).toBe("name=sejajar&limit=10");
    });
  });

  describe("formatCurrencyIDR", () => {
    it("should format numbers into rupiah format", () => {
      expect(formatCurrencyIDR(1500000)).toContain("Rp");
      // Clean non-breaking spaces or different formatting characters in different envs
      const formatted = formatCurrencyIDR(1500000).replace(/\s/g, "");
      expect(formatted).toContain("1.500.000");
    });
  });

  describe("formatCompactIDR", () => {
    it("should format large numbers into compact IDR strings", () => {
      expect(formatCompactIDR(1500000000)).toBe("Rp. 1,5 M");
      expect(formatCompactIDR(2500000)).toBe("Rp. 2,5 JT");
      expect(formatCompactIDR(500000).replace(/\s/g, "")).toContain("500.000");
    });
  });

  describe("formatDate", () => {
    it("should format Date objects or string dates into id-ID format", () => {
      expect(formatDate("2026-07-06")).toContain("Jul");
      expect(formatDate(new Date(2026, 6, 6))).toContain("Jul");
      expect(formatDate("")).toBe("");
      expect(formatDate(null)).toBe("");
    });
  });

  describe("wordCount", () => {
    it("should count words correctly", () => {
      expect(wordCount("halo selamat pagi")).toBe(3);
      expect(wordCount("   banyak   spasi   ")).toBe(2);
      expect(wordCount("")).toBe(0);
      expect(wordCount(undefined)).toBe(0);
    });
  });

  describe("formatDateEN", () => {
    it("should format dates into en-US format", () => {
      const dateStr = "2026-07-06";
      const formatted = formatDateEN(dateStr);
      expect(formatted).toBe("Jul 6, 2026");
      expect(formatDateEN("")).toBe("");
    });
  });

  describe("getFileUrl", () => {
    it("should resolve full HTTP URLs immediately", () => {
      expect(getFileUrl("https://example.com/image.png")).toBe("https://example.com/image.png");
    });

    it("should return empty string for empty url", () => {
      expect(getFileUrl(null)).toBe("");
    });

    it("should stream relative paths with stream-media endpoint", () => {
      // Mock import.meta.env
      vi.stubEnv("VITE_API_URL", "http://localhost:8000/api");
      expect(getFileUrl("uploads/video.mp4")).toBe("http://localhost:8000/stream-media/video");
      vi.unstubAllEnvs();
    });
  });
});
