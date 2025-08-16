export interface Contact {
  id: string;
  name: string;
  phone: string;
  lastMessage: string;
  lastMessageTimestamp: string;
  status: "Active" | "Inactive";
  avatar: string;
}

export interface Message {
  id: string;
  contactId: string;
  text: string;
  direction: "Incoming" | "Outgoing";
  timestamp: string;
}

export const contacts: Contact[] = [
  {
    id: "1",
    name: "Alice Johnson",
    phone: "123-456-7890",
    lastMessage: "Hey, I have a question about my order.",
    lastMessageTimestamp: "2023-10-27T10:00:00Z",
    status: "Active",
    avatar: "AJ",
  },
  {
    id: "2",
    name: "Bob Williams",
    phone: "234-567-8901",
    lastMessage: "Thanks for the quick reply!",
    lastMessageTimestamp: "2023-10-27T09:30:00Z",
    status: "Active",
    avatar: "BW",
  },
  {
    id: "3",
    name: "Charlie Brown",
    phone: "345-678-9012",
    lastMessage: "Can you confirm the shipping address?",
    lastMessageTimestamp: "2023-10-26T15:00:00Z",
    status: "Inactive",
    avatar: "CB",
  },
  {
    id: "4",
    name: "Diana Miller",
    phone: "456-789-0123",
    lastMessage: "Perfect, that's all I needed.",
    lastMessageTimestamp: "2023-10-25T11:45:00Z",
    status: "Inactive",
    avatar: "DM",
  },
];

export const messages: Message[] = [
  {
    id: "m1",
    contactId: "1",
    text: "Hey, I have a question about my order.",
    direction: "Incoming",
    timestamp: "2023-10-27T10:00:00Z",
  },
  {
    id: "m2",
    contactId: "1",
    text: "Of course, how can I help you?",
    direction: "Outgoing",
    timestamp: "2023-10-27T10:01:00Z",
  },
  {
    id: "m3",
    contactId: "2",
    text: "Thanks for the quick reply!",
    direction: "Incoming",
    timestamp: "2023-10-27T09:30:00Z",
  },
  {
    id: "m4",
    contactId: "3",
    text: "Can you confirm the shipping address?",
    direction: "Incoming",
    timestamp: "2023-10-26T15:00:00Z",
  },
];