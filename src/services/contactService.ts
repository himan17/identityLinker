import { Transaction } from "sequelize";

const createNewContact = async (
  email?: string,
  phoneNumber?: string,
  t: Transaction
) => {};

const fetchIdentityLink = async (contact: Contact, t: Transaction) => {};

export default { createNewContact, fetchIdentityLink };
