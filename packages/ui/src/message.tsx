import { BotIcon, UserIcon } from "lucide-react";

interface MessageProps {
  role: "user" | "assistant";
  content: string;
}

export function Message({ role, content }: MessageProps) {
  const isUser = role === "user";

  return (
    <div className={`flex gap-3 ${isUser ? "flex-row-reverse" : "flex-row"}`}>
      <div
        className={`flex h-8 w-8 shrink-0 items-center justify-center rounded-full ${isUser ? "bg-blue-600" : "bg-green-600"}`}
      >
        {isUser ? (
          <UserIcon className="h-5 w-5 text-white" />
        ) : (
          <BotIcon className="h-5 w-5 text-white" />
        )}
      </div>
      <div
        className={`max-w-[80%] rounded-lg px-4 py-3 ${
          isUser ? "bg-blue-600 text-white" : "bg-gray-100 text-gray-900"
        }`}
      >
        {content}
      </div>
    </div>
  );
}
