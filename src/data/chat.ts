// Airtable's response structure for a single record
export interface AirtableRecord<T> {
  id: string;
  createdTime: string;
  fields: T;
}

// Fields from the Contacts table in Airtable
export interface AirtableContactFields {
  Name: string;
  Phone: string;
  'Last Message': string;
  'Last Contact Time': string;
  Status: 'Active' | 'Inactive';
}

// Fields from the Messages table in Airtable
export interface AirtableMessageFields {
  'Message Text': string;
  Direction: 'Incoming' | 'Outgoing';
  Timestamp: string;
  Contact: string[]; // Linked record from Contacts table
}

// Simplified Contact type for UI components
export interface Contact {
  id: string;
  name: string;
  phone: string;
  lastMessage: string;
  lastMessageTimestamp: string;
  status: 'Active' | 'Inactive';
  avatar: string;
}

// Simplified Message type for UI components
export interface Message {
  id: string;
  contactId: string;
  text: string;
  direction: 'Incoming' | 'Outgoing';
  timestamp: string;
}