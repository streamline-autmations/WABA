import { useState, useMemo, useEffect } from "react";
import { ContactList } from "@/components/ContactList";
import { ChatWindow } from "@/components/ChatWindow";
import {
  contacts as initialContacts,
  messages as initialMessages,
  Contact,
  Message,
} from "@/data/chat";
import {
  ResizableHandle,
  ResizablePanel,
  ResizablePanelGroup,
} from "@/components/ui/resizable";
import { useIsMobile } from "@/hooks/use-mobile";

export default function ChatPage() {
  const [contacts, setContacts] = useState<Contact[]>(() =>
    initialContacts.sort(
      (a, b) =>
        new Date(b.lastMessageTimestamp).getTime() -
        new Date(a.lastMessageTimestamp).getTime()
    )
  );
  const [messages, setMessages] = useState<Message[]>(initialMessages);
  const [selectedContact, setSelectedContact] = useState<Contact | null>(null);
  const [searchQuery, setSearchQuery] = useState("");
  const [statusFilter, setStatusFilter] = useState<"All" | "Active" | "Inactive">("All");
  const isMobile = useIsMobile();

  useEffect(() => {
    if (!isMobile && !selectedContact && contacts.length > 0) {
      setSelectedContact(contacts[0]);
    }
  }, [isMobile, selectedContact, contacts]);

  const handleSelectContact = (contact: Contact) => {
    setSelectedContact(contact);
  };

  const handleSendMessage = (messageText: string) => {
    if (!selectedContact) return;

    const newMessage: Message = {
      id: `m${Date.now()}`,
      contactId: selectedContact.id,
      text: messageText,
      direction: "Outgoing",
      timestamp: new Date().toISOString(),
    };

    setMessages((prevMessages) => [...prevMessages, newMessage]);

    setContacts((prevContacts) => {
      const updatedContacts = prevContacts.map((c) =>
        c.id === selectedContact.id
          ? {
              ...c,
              lastMessage: messageText,
              lastMessageTimestamp: newMessage.timestamp,
            }
          : c
      );
      updatedContacts.sort(
        (a, b) =>
          new Date(b.lastMessageTimestamp).getTime() -
          new Date(a.lastMessageTimestamp).getTime()
      );
      return updatedContacts;
    });
  };

  const filteredMessages = useMemo(() => {
    return messages
      .filter((message) => message.contactId === selectedContact?.id)
      .sort(
        (a, b) =>
          new Date(a.timestamp).getTime() - new Date(b.timestamp).getTime()
      );
  }, [messages, selectedContact]);

  const filteredContacts = useMemo(() => {
    return contacts.filter((contact) => {
      const matchesSearch =
        contact.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
        contact.phone.includes(searchQuery);
      const matchesStatus =
        statusFilter === "All" || contact.status === statusFilter;
      return matchesSearch && matchesStatus;
    });
  }, [contacts, searchQuery, statusFilter]);

  if (isMobile) {
    return (
      <div className="h-screen w-full flex flex-col bg-background">
        {!selectedContact ? (
          <ContactList
            contacts={filteredContacts}
            selectedContact={selectedContact}
            onSelectContact={handleSelectContact}
            searchQuery={searchQuery}
            setSearchQuery={setSearchQuery}
            statusFilter={statusFilter}
            setStatusFilter={setStatusFilter}
          />
        ) : (
          <ChatWindow
            contact={selectedContact}
            messages={filteredMessages}
            onSendMessage={handleSendMessage}
            onBack={() => setSelectedContact(null)}
          />
        )}
      </div>
    );
  }

  return (
    <div className="h-screen w-full flex flex-col bg-background p-4">
      <ResizablePanelGroup
        direction="horizontal"
        className="flex-1 border rounded-lg overflow-hidden"
      >
        <ResizablePanel defaultSize={30} minSize={20} maxSize={40}>
          <ContactList
            contacts={filteredContacts}
            selectedContact={selectedContact}
            onSelectContact={handleSelectContact}
            searchQuery={searchQuery}
            setSearchQuery={setSearchQuery}
            statusFilter={statusFilter}
            setStatusFilter={setStatusFilter}
          />
        </ResizablePanel>
        <ResizableHandle withHandle />
        <ResizablePanel defaultSize={70}>
          <ChatWindow
            contact={selectedContact}
            messages={filteredMessages}
            onSendMessage={handleSendMessage}
          />
        </ResizablePanel>
      </ResizablePanelGroup>
    </div>
  );
}