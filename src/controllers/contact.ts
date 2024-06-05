import { Request, Response, NextFunction } from "express";
import { db } from "../config/db";
import { Contact } from "../models/contact";
import { Op } from "sequelize";
import { contactService } from "../services";

export const identityLinker = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    console.log("API endpoint hit");
    const reqBody: IdentifyRequest = req.body;

    const { email, phoneNumber } = req.body;

    // invalid reqest body
    if (!email || !phoneNumber) {
      throw new Error("Missing required fields: email or phoneNumber");
    }
    // transaction for db queries
    const t = await db.transaction();

    // check if Contacts exist for the email or phoneNumber
    const contacts = await Contact.findAll({
      where: {
        [Op.or]: [email, phoneNumber],
      },
    });

    // no contact - Create a new one
    if (contacts.length === 0) {
      const newContact = await contactService.createNewContact(
        email,
        phoneNumber,
        t
      );
      const links = await contactService.fetchIdentityLink(newContact, t);
      res.status(200).json(links);
      return;
    }

    // one contact - Fetch Link and return
    else if (contacts.length === 1) {
      const links = await contactService.fetchIdentityLink(contacts[0], t);
      res.status(200).json(links);
      return;
    }
    // two contact -
    else {
      // if email and phone matches to two different Contacts - chances for primary -> secondary
    }
  } catch (er) {
    next(er);
  }
};
