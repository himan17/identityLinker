import { Transaction } from "sequelize";
import { Contact } from "../models/contact";
import { ContactType } from "../types";
import { db } from "../config/db";

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

const fetchIdentityLink = async (contact: ContactType, t: Transaction) => {
  // Given a node in the chain, trace back the entire chain
  const linkedContacts: { contact: ContactType; isPrimary: boolean }[] = [];

  const isPrimary = contact.linkPrecedence === "primary";
  // check if primary
  if (isPrimary) {
    linkedContacts.push({ contact: contact, isPrimary: true });
  }

  // forward successors trace
  let st = contact;
  while (1) {
    const searchId = st.id;

    const nextContact = (
      await Contact.findOne({
        where: {
          linkedId: searchId,
        },
      })
    )?.toJSON();

    if (!nextContact) {
      break;
    }

    linkedContacts.push({
      contact: nextContact,
      isPrimary: nextContact.linkPrecedence === "primary",
    });
    st = nextContact;
  }
  // backward predecessors trace (only for non primary)
  if (!isPrimary) {
    while (1) {
      const searchId = st.linkedId;

      if (!searchId) {
        break;
      }

      // fetch the row
      const prevContact = (await Contact.findByPk(searchId))?.toJSON();

      linkedContacts.push({
        contact: prevContact,
        isPrimary: prevContact.linkPrecedence === "primary",
      });

      st = prevContact;
    }
  }

  
};

export default { createNewContact, fetchIdentityLink };
