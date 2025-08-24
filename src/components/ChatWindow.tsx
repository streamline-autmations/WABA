import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Contact, Message } from "@/data/chat";
import { useIsMobile } from "@/hooks/use-mobile";
import { cn } from "@/lib/utils";
import { ArrowLeft, Send, Loader2 } from "lucide-react";
import { useState, useRef, useEffect } from "react";

interface ChatWindowProps {
  contact: Contact | null;
  messages: Message[];
  onSendMessage: (messageText: string) => void;
  onBack?: () => void;
  isLoading: boolean;
}

export function ChatWindow({
  contact,
  messages,
  onSendMessage,
  onBack,
  isLoading,
}: ChatWindowProps) {
  const [newMessage, setNewMessage] = useState("");
  const isMobile = useIsMobile();
  const messagesEndRef = useRef<HTMLDivElement>(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  useEffect(() => {
    if (!isLoading) {
      scrollToBottom();
    }
  }, [messages, isLoading]);

  const handleSend = () => {
    if (newMessage.trim()) {
      onSendMessage(newMessage.trim());
      setNewMessage("");
    }
  };

  if (!contact) {
    return (
      <div className="flex items-center justify-center h-full text-muted-foreground bg-card">
        Select a contact to start chatting
      </div>
    );
  }

  return (
    <div className="flex flex-col h-full bg-card">
      <div className="flex items-center p-4 border-b">
        {isMobile && onBack && (
          <Button
            variant="ghost"
            size="icon"
            className="mr-2"
            onClick={onBack}
          >
            <ArrowLeft className="h-4 w-4" />
          </Button>
        )}
        <Avatar className="mr-4">
          <AvatarFallback>{contact.avatar}</AvatarFallback>
        </Avatar>
        <div>
          <p className="font-semibold">{contact.name}</p>
          <p className="text-sm text-muted-foreground">{contact.phone}</p>
        </div>
      </div>
      <div className="flex-1 p-4 overflow-y-auto space-y-4">
        {isLoading ? (
          <div className="flex items-center justify-center h-full">
            <Loader2 className="h-8 w-8 animate-spin text-muted-foreground" />
          </div>
        ) : (
          <>
            {messages.map((message) => (
              <div
                key={message.id}
                className={cn(
                  "flex items-end gap-2",
                  message.direction === "Outgoing" ? "justify-end" : "justify-start"
                )}
              >
                <div
                  className={cn(
                    "p-3 rounded-lg max-w-xs lg:max-w-md",
                    message.direction === "Outgoing"
                      ? "bg-primary text-primary-foreground"
                      : "bg-muted"
                  )}
                >
                  <p>{message.text}</p>
                  <p className="text-xs text-right mt-1 opacity-70">
                    {new Date(message.timestamp).toLocaleTimeString([], {
                      hour: "2-digit",
                      minute: "2-digit",
                    })}
                  </p>
                </div>
              </div>
            ))}
            <div ref={messagesEndRef} />
          </>
        )}
      </div>
      <div className="p-4 border-t flex items-center gap-2">
        <Input
          placeholder="Type a message..."
          value={newMessage}
          onChange={(e) => setNewMessage(e.target.value)}
          onKeyPress={(e) => e.key === "Enter" && handleSend()}
        />
        <Button onClick={handleSend}>
          <Send className="h-4 w-4" />
        </Button>
      </div>
    </div>
  );
}