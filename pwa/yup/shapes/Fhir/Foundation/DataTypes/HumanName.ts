import * as Yup from "yup";
import {PeriodYupObject} from "../DataTypes/Period";

export const HumanNameYupObject = {
    use : Yup.string().matches(/(usual|official|temp|nickname|anonymous|old|maiden)/, {message : "Doit être égale à usual | official | temp | nickname | anonymous | old | maiden", excludeEmptyString: true }).nullable(),
    //period : Yup.object().shape(PeriodYupObject).nullable(),
    family: Yup.string(),
    given : Yup.array().of(Yup.string())
};

export const HumanNameShape = Yup.object().shape(HumanNameYupObject);


