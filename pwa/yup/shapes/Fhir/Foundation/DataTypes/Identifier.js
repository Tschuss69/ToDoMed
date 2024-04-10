import * as Yup from "yup";
import { ERROR_URI_CODEABLE_CONCEPT, ERROR_URI_REFERENCE} from "@/yup/messages/errors";
import {PeriodShape} from "./Period";


export const IdentifierYupObject = {
    use : Yup.string().matches(/usual|official|temp|secondary|old/, {message : "Doit être égale à usual | official | temp | secondary | old"}), // required
    type : Yup.string().matches(/\/codeable_concepts\/[0-9]+/, {message : ERROR_URI_CODEABLE_CONCEPT, excludeEmptyString: true }).nullable(),
    system : Yup.string().nullable(),
    value : Yup.string().nullable(),
    assigner : Yup.string().matches(/\/references\/[0-9]+/, {message : ERROR_URI_REFERENCE, excludeEmptyString: true }).nullable(),
    period : Yup.object().shape(PeriodShape).nullable()
};

export const IdentifierShape = Yup.object().shape(IdentifierYupObject);


