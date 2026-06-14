import type { FeedbackItem } from "@/features/reviews/components/Feedback";
import type { CommentItem } from "@/features/reviews/components/RecentComments";

export const sampleComments: CommentItem[] = [
  {
    id: 1,
    name: "Sarah Mitchell",
    initials: "SM",
    avatarBg: "bg-blue-50 text-blue-600",
    role: "Content Lead",
    roleBg: "bg-gray-100 text-gray-400 hover:bg-gray-100",
    targetContent: "Skincare Morning Routine Reel",
    commentText:
      "Great progress on the script! Just make sure to mention the SPF benefits naturally without sounding too salesy.",
    date: "Apr 20, 2024",
  },
  {
    id: 2,
    name: "Lucas Hoffmann",
    initials: "LH",
    avatarBg: "bg-pink-50 text-pink-600",
    role: "Editor",
    roleBg: "bg-gray-100 text-gray-400 hover:bg-gray-100",
    targetContent: "Foundation Tutorial - Spring Collection",
    commentText:
      "Video editing complete! Added warm color grading that perfectly matches the spring aesthetic. Ready for final review.",
    date: "Apr 19, 2024",
  },
  {
    id: 3,
    name: "James Rivera",
    initials: "JR",
    avatarBg: "bg-purple-50 text-purple-600",
    role: "Script Writer",
    roleBg: "bg-gray-100 text-gray-400 hover:bg-gray-100",
    targetContent: "Coffee Bean Origins - Edu Series Ep.1",
    commentText:
      "Starting the research and script outline today. Will have a full draft ready by Thursday EOD.",
    date: "Apr 18, 2024",
  },
  {
    id: 4,
    name: "Sarah Mitchell",
    initials: "SM",
    avatarBg: "bg-blue-50 text-blue-600",
    role: "Content Lead",
    roleBg: "bg-gray-100 text-gray-400 hover:bg-gray-100",
    targetContent: "Skincare Morning Routine Reel",
    commentText:
      "Great progress on the script! Just make sure to mention the SPF benefits naturally without sounding too salesy.",
    date: "Apr 20, 2024",
  },
  {
    id: 5,
    name: "Lucas Hoffmann",
    initials: "LH",
    avatarBg: "bg-pink-50 text-pink-600",
    role: "Editor",
    roleBg: "bg-gray-100 text-gray-400 hover:bg-gray-100",
    targetContent: "Foundation Tutorial - Spring Collection",
    commentText:
      "Video editing complete! Added warm color grading that perfectly matches the spring aesthetic. Ready for final review.",
    date: "Apr 19, 2024",
  },
  {
    id: 6,
    name: "James Rivera",
    initials: "JR",
    avatarBg: "bg-purple-50 text-purple-600",
    role: "Script Writer",
    roleBg: "bg-gray-100 text-gray-400 hover:bg-gray-100",
    targetContent: "Coffee Bean Origins - Edu Series Ep.1",
    commentText:
      "Starting the research and script outline today. Will have a full draft ready by Thursday EOD.",
    date: "Apr 18, 2024",
  },
];

export const sampleFeedbacks: FeedbackItem[] = [
  {
    id: 1,
    subject: "Day 1 Challenge - Full Body Warmup",
    message:
      "The script needs more energy in the opening! First 10 seconds must hook the audience immediately. Please revise with a more punchy, hype tone.",
    date: "Apr 20, 2024",
  },
  {
    id: 2,
    subject: "Aesthetic Morning Coffee Routine",
    message:
      "Love the concept! The slow morning aesthetic is exactly what we're going for. This will resonate with the target audience. Approved!",
    date: "Apr 19, 2024",
  },
  {
    id: 3,
    subject: "Foundation Tutorial - Spring Collection",
    message:
      "Color grading looks slightly desaturated on mobile screens. Can we tweak the warmth parameters by 5% before exporting the final cut?",
    date: "Apr 18, 2024",
  },
];
