// src/components/Feedback.tsx
import { AlertTriangle } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

export interface FeedbackItem {
  id: string | number;
  subject: string;
  message: string;
  date: string;
}

interface FeedbackProps {
  feedbacks: FeedbackItem[];
  title?: string;
  maxHeightClass?: string;
}

export function Feedback({
  feedbacks,
  title = "Owner Feedback",
  maxHeightClass = "max-h-[380px]",
}: FeedbackProps) {
  return (
    <Card className="w-full bg-white rounded-xl border border-gray-200 outline outline-gray-300/40 shadow-lg p-6 space-y-5">
      {/* HEADER CARD UTAMA */}
      <CardHeader className="flex flex-row items-center justify-between p-0 space-y-0">
        <CardTitle className="text-lg font-semibold text-gray-900">
          {title}
        </CardTitle>
        {/* Penunjuk Jumlah Pesan Masuk */}
        <span className="text-sm text-gray-400 font-medium">
          {feedbacks.length} messages
        </span>
      </CardHeader>

      {/* KONTEN UTAMA DENGAN OVERFLOW SCROLL VERTICAL */}
      <CardContent
        className={`p-0 overflow-y-auto pr-1 space-y-4 scroll-smooth ${maxHeightClass} 
        scrollbar-none [&::-webkit-scrollbar]:hidden`}
      >
        {feedbacks.length > 0 ? (
          feedbacks.map((item) => (
            <div
              key={item.id}
              className="w-full bg-amber-50/40 border border-amber-200/50 rounded-2xl p-5 space-y-2"
            >
              {/* Baris Atas: Ikon, Label Boks, & Tanggal */}
              <div className="flex items-center justify-between text-amber-800 font-bold text-sm">
                <div className="flex items-center gap-2">
                  <AlertTriangle className="h-4 w-4 stroke-[2.5]" />
                  <span>Owner Feedback</span>
                </div>
                <span className="text-amber-800 text-xs font-semibold">
                  {item.date}
                </span>
              </div>

              {/* Baris Tengah: Subjek Referensi Konten (Re:) */}
              <div className="text-sm font-medium text-amber-900/90">
                Re: {item.subject}
              </div>

              {/* Baris Bawah: Detail Isi Pesan Masukan */}
              <p className="text-sm text-amber-900/80 font-normal leading-relaxed wrap-break-word">
                {item.message}
              </p>
            </div>
          ))
        ) : (
          /* State Tampilan Jika Kosong */
          <div className="text-center py-10 text-gray-400 text-sm border border-dashed border-gray-100 rounded-2xl">
            No feedback messages received.
          </div>
        )}
      </CardContent>
    </Card>
  );
}
