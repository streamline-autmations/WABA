import { Input } from "@/components/ui/input";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Skeleton } from "@/components/ui/skeleton";
import { Contact } from "@/data/chat";
import { cn } from "@/lib/utils";
import { PlusCircle } from "lucide-react";

interface ContactListProps {
  contacts: Contact[];
  selectedContact: Contact | null;
  onSelectContact: (contact: Contact) => void;
  searchQuery: string;
  setSearchQuery: (query: string) => void;
  statusFilter: "All" | "Active" | "Inactive";
  setStatusFilter: (status: "All" | "Active" | "Inactive") => void;
  isLoading: boolean;
}

export function ContactList({
  contacts,
  selectedContact,
  onSelectContact,
  searchQuery,
  setSearchQuery,
  statusFilter,
  setStatusFilter,
  isLoading,
}: ContactListProps) {
  return (
    <div className="flex flex-col h-full bg-card">
      <div className="p-4 border-b">
        <div className="flex justify-between items-center mb-4">
          <h2 className="text-xl font-bold">Inbox</h2>
          <Button variant="ghost" size="icon">
            <PlusCircle className="h-5 w-5" />
          </Button>
        </div>
        <Input
          placeholder="Search contacts..."
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
        />
        <Tabs
          value={statusFilter}
          onValueChange={(value) => setStatusFilter(value as any)}
          className="mt-4"
        >
          <TabsList className="grid w-full grid-cols-3">
            <TabsTrigger value="All">All</TabsTrigger>
            <TabsTrigger value="Active">Active</TabsTrigger>
            <TabsTrigger value="Inactive">Inactive</TabsTrigger>
          </TabsList>
        </Tabs>
      </div>
      <div className="flex-1 overflow-y-auto">
        {isLoading ? (
          <div className="p-4 space-y-4">
            {[...Array(5)].map((_, i) => (
              <div key={i} className="flex items-center space-x-4">
                <Skeleton className="h-10 w-10 rounded-full" />
                <div className="space-y-2 flex-1">
                  <Skeleton className="h-4 w-3/4" />
                  <Skeleton className="h-4 w-1/2" />
                </div>
              </div>
            ))}
          </div>
        ) : contacts.length > 0 ? (
          contacts.map((contact) => (
            <div
              key={contact.id}
              className={cn(
                "flex items-center p-4 cursor-pointer hover:bg-accent",
                selectedContact?.id === contact.id && "bg-accent"
              )}
              onClick={() => onSelectContact(contact)}
            >
              <Avatar className="mr-4 h-10 w-10">
                <AvatarFallback>{contact.avatar}</AvatarFallback>
              </Avatar>
              <div className="flex-1 min-w-0">
                <div className="flex justify-between items-center">
                  <p className="font-semibold truncate">{contact.name}</p>
                  <Badge
                    variant={contact.status === "Active" ? "default" : "secondary"}
                    className="capitalize"
                  >
                    {contact.status}
                  </Badge>
                </div>
                <p className="text-sm text-muted-foreground truncate">
                  {contact.lastMessage}
                </p>
              </div>
            </div>
          ))
        ) : (
          <p className="p-4 text-center text-muted-foreground">
            No contacts found.
          </p>
        )}
      </div>
    </div>
  );
}