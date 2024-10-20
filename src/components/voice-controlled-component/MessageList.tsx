import { Messages } from "$/server/actions/actions";
import { cn } from "$/src/lib/utils";
import { Loader2 } from "lucide-react";
import React from "react";
import { Avatar, AvatarFallback, AvatarImage } from "../ui/avatar";

type Props = {
  isLoading: boolean;
  messages: Messages[];
};

const MessageList = ({ isLoading, messages }: Props) => {
  if (isLoading) {
    return (
      <div className="absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2">
        <Loader2 className="h-6 w-6 animate-spin" />
      </div>
    );
  }

  if (!messages) return <></>;

  return (
    <div className="flex flex-col gap-1">
      {messages.map((message) => {
        return (
          <div key={message.id} className="flex flex-row items-start gap-2">
            {message.userRole === "system" && (
              <Avatar>
                <AvatarImage src="https://github.com/shadcn.png" />
                <AvatarFallback>CN</AvatarFallback>
              </Avatar>
            )}
            <div
              className={cn("flex", {
                "ml-auto w-max max-w-[75%] flex-col items-center gap-2 rounded-lg bg-primary px-3 py-2 text-sm text-primary-foreground":
                  message.userRole === "user",
                "w-max max-w-[75%] flex-col items-center gap-2 rounded-lg bg-muted px-3 py-2 text-sm":
                  message.userRole === "system",
              })}
            >
              <p
                className={cn("text-sm", {
                  "text-md": message.userRole === "system",
                })}
              >
                {message.content}
              </p>
            </div>
          </div>
        );
      })}
    </div>
  );
};

export default MessageList;
