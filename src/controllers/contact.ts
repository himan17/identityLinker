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
    console.log("API endpoint hit");
    const reqBody: IdentifyRequest = req.body;

    const { email, phoneNumber } = reqBody;

    // invalid reqest body
    if (!email && !phoneNumber) {
      throw new Error("Missing required fields: email or phoneNumber");
    }
    // transaction for db queries
    const t = await db.transaction();

    // check if Contacts exist for the email or phoneNumber
    const contacts = (await Contact.findAll({
      where: {
        [Op.or]: [{ email: email }, { phoneNumber: phoneNumber }],
      },
      raw: true
    }));

    // no contact - Create a new one
    if (contacts.length === 0) {
      const newContact = await contactService.createNewContact(
        t,
        email,
        phoneNumber
      );
      const links = await contactService.fetchIdentityLink(
        newContact as any as ContactType,
        t
      );
      res.status(200).json(links);
    }

    // one contact - Fetch Link and return
    else if (contacts.length === 1) {
      const links = await contactService.fetchIdentityLink(
        contacts[0] as any as ContactType,
        t
      );
      res.status(200).json(links);
    }
    // two contact -
    else {
      // if email and phone matches to two different Contacts - chances for primary -> secondary
    }
    await t.commit();
  } catch (er) {
    next(er);
  }
};
