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
  const contacts = (await Contact.findAll({
    where: {
      [Op.or]: [{ email: email }, { phoneNumber: phoneNumber }],
    },
    raw: true,
  })) as any as ContactType[];

  // prepare the links response
  let primaryContact: ContactType | undefined = undefined;
  let secondaryEmails = [];
  let secondaryContactIds = [];
  let secondaryPhoneNumbers = [];
  for (const c of contacts) {
    if (c.linkPrecedence === "primary") {
      primaryContact = c;
    } else {
      if (c.email) secondaryEmails.push(c.email);
      if (c.phoneNumber) secondaryPhoneNumbers.push(c.phoneNumber);
      secondaryContactIds.push(c.id);
    }
  }

  return {
    contact: {
      primaryContactId: primaryContact?.id,
      emails: primaryContact?.email
        ? [primaryContact?.email, ...secondaryEmails]
        : secondaryEmails,
      phoneNumbers: primaryContact?.phoneNumber
        ? [primaryContact?.phoneNumber, ...secondaryPhoneNumbers]
        : secondaryPhoneNumbers,
      secondaryContactIds,
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
      linkedPrecendence: "secondary",
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
