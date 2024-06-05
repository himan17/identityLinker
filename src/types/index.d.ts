declare type UserType = {
  id: number;
  name: string;
  email: string;
  age: number;
};

declare type Contact = {
  id: number;
  phoneNumber: string;
  email: string;
  linkedId?: number;
  linkPrecedence: "primary" | "secondary";
  deleteAt?: Date;
  createdAt: Date;
  updatedAt: Date;
};

declare interface IdentifyRequest {
  email?: string;
  phoneNumber?: number;
}

declare interface Identity {
  primaryContactId: number;
  emails: string[];
  phoneNumbers: string[];
  secondaryContactIds: number[];
}

declare interface IdentifyResponse {
  contact?: Contact;
  error?: string;
}
