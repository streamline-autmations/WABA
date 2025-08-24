import { API_KEY, BASE_ID, CONTACTS_TABLE_ID, MESSAGES_TABLE_ID } from '@/lib/airtableConfig';
import {
  AirtableRecord,
  AirtableContactFields,
  AirtableMessageFields,
  Contact,
  Message,
} from '@/data/chat';

const BASE_URL = 'https://api.airtable.com/v0';
const headers = {
  Authorization: `Bearer ${API_KEY}`,
  'Content-Type': 'application/json',
};

// Transforms an Airtable contact record into the format our UI expects
const transformContact = (record: AirtableRecord<AirtableContactFields>): Contact => ({
  id: record.id,
  name: record.fields.Name,
  phone: record.fields.Phone,
  lastMessage: record.fields['Last Message'] || 'No messages yet',
  lastMessageTimestamp: record.fields['Last Contact Time'],
  status: record.fields.Status,
  avatar: record.fields.Name ? record.fields.Name.split(' ').map(n => n[0]).join('') : '??',
});

// Transforms an Airtable message record into the format our UI expects
const transformMessage = (record: AirtableRecord<AirtableMessageFields>): Message => ({
  id: record.id,
  contactId: record.fields.Contact[0],
  text: record.fields['Message Text'],
  direction: record.fields.Direction,
  timestamp: record.fields.Timestamp,
});

export const fetchContacts = async (): Promise<Contact[]> => {
  const url = `${BASE_URL}/${BASE_ID}/${CONTACTS_TABLE_ID}?sort[0][field]=Last Contact Time&sort[0][direction]=desc`;
  const response = await fetch(url, { headers });
  if (!response.ok) {
    throw new Error('Failed to fetch contacts from Airtable.');
  }
  const data = await response.json();
  return data.records.map(transformContact);
};

export const fetchMessages = async (contactId: string): Promise<Message[]> => {
  const formula = encodeURIComponent(`{Contact}='${contactId}'`);
  const url = `${BASE_URL}/${BASE_ID}/${MESSAGES_TABLE_ID}?sort[0][field]=Created Time&sort[0][direction]=asc&filterByFormula=${formula}`;
  const response = await fetch(url, { headers });
  if (!response.ok) {
    throw new Error('Failed to fetch messages from Airtable.');
  }
  const data = await response.json();
  return data.records.map(transformMessage);
};

export const sendMessage = async ({ contactId, messageText }: { contactId: string; messageText: string }): Promise<void> => {
  const url = `${BASE_URL}/${BASE_ID}/${MESSAGES_TABLE_ID}`;
  const body = JSON.stringify({
    fields: {
      'Message Text': messageText,
      Direction: 'Outgoing',
      Contact: [contactId],
      Send: true,
    },
  });
  const response = await fetch(url, { method: 'POST', headers, body });
  if (!response.ok) {
    throw new Error('Failed to send message to Airtable.');
  }
};