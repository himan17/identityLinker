export type UserType = {
  id: number;
  name: string;
  email: string;
  age: number;
};

export type ContactType = {
  id: number;
  phoneNumber: string;
  email: string;
  linkedId?: number;
  linkPrecedence: "primary" | "secondary";
  deleteAt?: Date;
  createdAt: Date;
  updatedAt: Date;
};

export interface IdentifyRequest {
  email?: string;
  phoneNumber?: string;
}

export interface Identity {
  primaryContactId: number;
  emails: string[];
  phoneNumbers: string[];
  secondaryContactIds: number[];
}

export interface IdentifyResponse {
  contact?: Identity;
  error?: string;
}
