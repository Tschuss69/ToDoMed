import * as Yup from "yup";


export const PeriodYupObject = {
    start : Yup.string().nullable(),
    end : Yup.string().nullable()
};

export const PeriodShape = Yup.object().shape(PeriodYupObject);