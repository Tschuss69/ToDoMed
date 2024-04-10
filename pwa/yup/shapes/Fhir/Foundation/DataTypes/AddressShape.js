import * as Yup from "yup";
import {PeriodYupObject} from "./Period";
import {NarrativeYupObject} from "./Narrative";

export const AddressYupObject = {
    "use": Yup.string().matches(/(home|work|temp|old|billing)/, {message : "Doit être égale à home | work | temp | old | billing" }), // required
    "type": Yup.string().matches(/(postal|physical|both)/, {message : "Doit être égale à postal | physical | both" }), // required
    "text": Yup.object().shape(NarrativeYupObject).nullable(),
    "line": Yup.array().of(Yup.string().nullable()),
    "city": Yup.string().nullable(),
    "district": Yup.string().nullable(),
    "state": Yup.string().nullable(),
    "postalCode": Yup.string().nullable(),
    "country": Yup.string().nullable(),
    "period": Yup.object().shape(PeriodYupObject).nullable()
};

export const AddressShape = Yup.object().shape(AddressYupObject);


