import * as Yup from "yup";
import {PeriodYupObject} from "./Period";


export const contactPointYupObject = {
    system : Yup.string().matches(/(phone|fax|email|pager|url|sms|other)/, {message : "Doit être égale à phone | fax | email | pager | url | sms | other" }),// required
    value : Yup.string().nullable(),
    use : Yup.string().matches(/(home|work|temp|old|mobile)/, {message : "Doit être égale à home | work | temp | old | mobile" }),//required
    rank : Yup.number().positive("Doit être un nombre positif"),
    period: Yup.object().shape(PeriodYupObject).nullable()
};

export const contactPointShape = Yup.object().shape(contactPointYupObject);
