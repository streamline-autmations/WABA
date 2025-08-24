import { useState, useMemo, useEffect } from "react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { ContactList } from "@/components/ContactList";
import { ChatWindow } from "@/components/ChatWindow";
import { Contact, Message } from "@/data/chat";
import { fetchContacts, fetchMessages, sendMessage } from "@/services/airtable";
import { showError, showSuccess } from "@/utils/toast";
import {
  ResizableHandle,
  ResizablePanel,
  ResizablePanelGroup,
} from "@/components/ui/resizable";
import { useIsMobile } from "@/hooks/use-mobile";

export default function ChatPage() {
  const [selectedContact, setSelectedContact] = useState<Contact | null>(null);
  const [searchQuery, setSearchQuery] = useState("");
  const [statusFilter, setStatusFilter] = useState<"All" | "Active" | "Inactive">("All");
  const isMobile = useIsMobile();
  const queryClient = useQueryClient();

  const { data: contacts, isLoading: isLoadingContacts, isError: isErrorContacts } = useQuery<Contact[]>({
    queryKey: ['contacts'],
    queryFn: fetchContacts,
  });

  const { data: messages, isLoading: isLoadingMessages } = useQuery<Message[]>({
    queryKey: ['messages', selectedContact?.id],
    queryFn: () => fetchMessages(selectedContact!.id),
    enabled: !!selectedContact,
  });

  const sendMessageMutation = useMutation({
    mutationFn: sendMessage,
    onSuccess: () => {
      showSuccess('Message sent!');
      queryClient.invalidateQueries({ queryKey: ['messages', selectedContact?.id] });
      queryClient.invalidateQueries({ queryKey: ['contacts'] });
    },
    onError: (error: Error) => {
      showError(error.message || 'Failed to send message.');
    },
  });

  useEffect(() => {
    if (!isMobile && !selectedContact && contacts && contacts.length > 0) {
      setSelectedContact(contacts[0]);
    }
  }, [isMobile, selectedContact, contacts]);

  const handleSelectContact = (contact: Contact) => {
    setSelectedContact(contact);
  };

  const handleSendMessage = (messageText: string) => {
    if (!selectedContact) return;
    sendMessageMutation.mutate({ contactId: selectedContact.id, messageText });
  };

  const filteredContacts = useMemo(() => {
    if (!contacts) return [];
    return contacts.filter((contact) => {
      const matchesSearch =
        contact.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
        contact.phone.includes(searchQuery);
      const matchesStatus =
        statusFilter === "All" || contact.status === statusFilter;
      return matchesSearch && matchesStatus;
    });
  }, [contacts, searchQuery, statusFilter]);

  if (isErrorContacts) {
    return (
      <div className="h-screen w-full flex items-center justify-center text-destructive">
        Error: Could not load contacts. Please check your Airtable configuration and network connection.
      </div>
    );
  }

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
            isLoading={isLoadingContacts}
          />
        ) : (
          <ChatWindow
            contact={selectedContact}
            messages={messages || []}
            onSendMessage={handleSendMessage}
            onBack={() => setSelectedContact(null)}
            isLoading={isLoadingMessages}
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
            isLoading={isLoadingContacts}
          />
        </ResizablePanel>
        <ResizableHandle withHandle />
        <ResizablePanel defaultSize={70}>
          <ChatWindow
            contact={selectedContact}
            messages={messages || []}
            onSendMessage={handleSendMessage}
            isLoading={isLoadingMessages}
          />
        </ResizablePanel>
      </ResizablePanelGroup>
    </div>
  );
}