import { Op, Transaction } from "sequelize";
import { Contact } from "../models/contact";
import { ContactType } from "../types";

const createNewContact = async (
  t: Transaction,
  email?: string,
  phoneNumber?: string
) => {
  // create a new contact
  const contact = await Contact.create(
    {
      email,
      phoneNumber,
      linkPrecedence: "primary",
    },
    { transaction: t }
  );
  return contact.toJSON();
};

const fetchIdentityLink = async (email?: string, phoneNumber?: string) => {
  const matchedContacts = (await Contact.findAll({
    where: {
      [Op.or]: [{ email }, { phoneNumber }],
    },
    raw: true,
  })) as any as ContactType[];

  const contact = matchedContacts[0];
  const isPrimary = contact.linkPrecedence === "primary";
  const primaryId = isPrimary ? contact.id : contact.linkedId;

  const contacts = (await Contact.findAll({
    where: {
      [Op.or]: [{ linkedId: primaryId }, { id: primaryId }],
    },
    raw: true,
  })) as any as ContactType[];

  const primaryContact = contacts.find((c) => c.id === primaryId);
  const secondaryContacts = contacts.filter(
    (c) => c.linkPrecedence !== "primary"
  );

  const emails = new Set<string>(
    [primaryContact?.email, ...secondaryContacts.map((c) => c.email)].filter(
      (email): email is string => !!email
    )
  );
  const phoneNumbers = new Set<string>(
    [
      primaryContact?.phoneNumber,
      ...secondaryContacts.map((c) => c.phoneNumber),
    ].filter((phone): phone is string => !!phone)
  );
  const secondaryContactIds = new Set<number>(
    secondaryContacts.map((c) => c.id)
  );

  return {
    contact: {
      primaryContactId: primaryContact?.id,
      emails: Array.from(emails),
      phoneNumbers: Array.from(phoneNumbers),
      secondaryContactIds: Array.from(secondaryContactIds),
    },
  };
};

const createSecondaryContact = async (
  email: string,
  phoneNumber: string,
  primaryContactId: number,
  t: Transaction
) => {
  await Contact.create(
    {
      email,
      phoneNumber,
      linkPrecedence: "secondary",
      linkedId: primaryContactId,
    },
    { transaction: t }
  );
};

const createContactLink = async (
  primaryContactId: number,
  secondaryContactId: number
) => {
  await Contact.update(
    {
      linkedId: primaryContactId,
      linkPrecedence: "secondary",
    },
    {
      where: {
        id: secondaryContactId,
      },
    }
  );
};

export default {
  createNewContact,
  fetchIdentityLink,
  createSecondaryContact,
  createContactLink,
};
