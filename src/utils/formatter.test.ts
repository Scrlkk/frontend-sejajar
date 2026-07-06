import { describe, it, expect } from "vitest";
import {
  getInitials,
  getAvatarBg,
  getInitialsAndBg,
  getRankColor,
  isTaskOverdue,
  formatCommentTimestamp,
} from "./formatter";

describe("formatter utilities", () => {
  describe("getInitials", () => {
    it("should return initials of a name", () => {
      expect(getInitials("Sheva Ardiansyah")).toBe("SA");
      expect(getInitials("Google DeepMind Team")).toBe("GDT");
      expect(getInitials("Single")).toBe("S");
      expect(getInitials("   ")).toBe("");
    });
  });

  describe("getAvatarBg", () => {
    it("should return a background color string based on name hash", () => {
      const bg1 = getAvatarBg("Sheva");
      const bg2 = getAvatarBg("Ardiansyah");
      expect(bg1).toContain("bg-");
      expect(bg2).toContain("bg-");
      expect(getAvatarBg("")).toContain("bg-blue-50");
    });
  });

  describe("getInitialsAndBg", () => {
    it("should return both initials and background class", () => {
      const res = getInitialsAndBg("Sheva Ardiansyah");
      expect(res.initials).toBe("SA");
      expect(res.avatarBg).toContain("bg-");
    });
  });

  describe("getRankColor", () => {
    it("should return amber color for rank 1 and slate color for others", () => {
      expect(getRankColor(1)).toBe("text-amber-500");
      expect(getRankColor(2)).toBe("text-slate-400");
    });
  });

  describe("isTaskOverdue", () => {
    it("should determine if a task is overdue correctly", () => {
      // Past deadline
      const pastDate = new Date(Date.now() - 24 * 60 * 60 * 1000).toISOString();
      // Future deadline
      const futureDate = new Date(Date.now() + 24 * 60 * 60 * 1000).toISOString();

      expect(isTaskOverdue(pastDate, "to_do")).toBe(true);
      expect(isTaskOverdue(pastDate, "on_progress")).toBe(true);
      
      // Task is completed/published/approved, so it shouldn't be overdue
      expect(isTaskOverdue(pastDate, "published")).toBe(false);
      expect(isTaskOverdue(pastDate, "approved")).toBe(false);
      
      // Future deadline is not overdue
      expect(isTaskOverdue(futureDate, "to_do")).toBe(false);
      
      // Null/missing deadline is not overdue
      expect(isTaskOverdue(null, "to_do")).toBe(false);
    });
  });

  describe("formatCommentTimestamp", () => {
    it("should format timestamps into relative times", () => {
      const nowStr = new Date().toISOString();
      expect(formatCommentTimestamp(nowStr)).toBe("just now");

      const tenMinutesAgo = new Date(Date.now() - 10 * 60 * 1000).toISOString();
      expect(formatCommentTimestamp(tenMinutesAgo)).toBe("10 minutes ago");

      const twoHoursAgo = new Date(Date.now() - 2 * 60 * 60 * 1000).toISOString();
      expect(formatCommentTimestamp(twoHoursAgo)).toBe("2 hours ago");

      const longAgo = new Date("2020-01-01").toISOString();
      expect(formatCommentTimestamp(longAgo)).toContain("2020");
    });
  });
});
