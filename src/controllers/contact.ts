import { Request, Response, NextFunction } from "express";
import { db } from "../config/db";
import { Contact } from "../models/contact";
import { Op } from "sequelize";
import { contactService } from "../services";
import { ContactType, IdentifyRequest } from "../types";

export const identityLinker = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const reqBody: IdentifyRequest = req.body;

    const { email, phoneNumber } = reqBody;

    // invalid reqest body
    if (!email && !phoneNumber) {
      throw new Error("Missing required fields: email or phoneNumber");
    }

    // transaction for db write/delete queries
    const t = await db.transaction();

    // check if Contacts exist for the email or phoneNumber
    const contacts = (await Contact.findAll({
      where: {
        [Op.or]: [{ email: email }, { phoneNumber: phoneNumber }],
      },
      raw: true,
    })) as any as ContactType[];

    // no contact - Create a new one
    if (contacts.length === 0) {
      await contactService.createNewContact(t, email, phoneNumber);
    } else {
      // primary contacts
      const primaryContacts = []; // 1 Contact or 2 Contacts(in case of new link)
      let isEmailInContacts = false;
      let isPhoneInContacts = false;

      for (const c of contacts) {
        if (c.linkPrecedence === "primary") {
          primaryContacts.push(c);
        }
        if (c.email === email) isEmailInContacts = true;
        if (c.phoneNumber === phoneNumber) isPhoneInContacts = true;
      }

      // new information
      if (email && phoneNumber && (!isEmailInContacts || !isPhoneInContacts)) {
        await contactService.createSecondaryContact(
          email,
          phoneNumber,
          primaryContacts[0].id,
          t
        );
      }
      // check for primary -> secondary
      else if (primaryContacts.length > 1) {
        // create link with the older contact being primary contact
        primaryContacts.sort(
          (a, b) => a.createdAt.getTime() - b.createdAt.getTime()
        );
        await contactService.createContactLink(
          primaryContacts[0].id,
          primaryContacts[1].id
        );
      }
    }
    await t.commit();

    // fetch the links and return the desired response
    const links = await contactService.fetchIdentityLink(email, phoneNumber);
    res.status(200).json(links);
  } catch (er) {
    next(er);
  }
};
