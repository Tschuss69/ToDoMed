import React, {ChangeEvent, useState} from "react";
import {regExDateCompleteFr, regExDayDateWithOneNumberMonth, regExDayDateWithOneNumberYear} from "@/lib/regex";
import {Label} from "@/components/ui/label";
import {Input} from "@/components/ui/input";
import {useField} from "formik";
import moment from "moment";

export function DateFormikInput({ label, ...props }){

    const [field, meta, helpers] = useField(props);

    const [birthdate, setBirthdate] = useState(field.value ? moment(field.value).format('DD/MM/YYYY') : null)

    function sendResult(finalValue){
        helpers.setValue(moment(finalValue, ['DD/MM/YYYY', 'DD-MM-YYYY']).toISOString())
    }

    function mySplice(
        string: string,
        idx: number,
        rem: number,
        str: string,
    ): string {
        return string.slice(0, idx) + str + string.slice(idx + Math.abs(rem));
    }

    function onValueChange(e: React.ChangeEvent<HTMLInputElement>){

        var inValue = e.target.value

        if (inValue !== birthdate) {
            setBirthdate(inValue);
        }

        const completeDate = regExDateCompleteFr.test(inValue);

        if (completeDate) {
            sendResult(inValue)
        } else if (regExDayDateWithOneNumberMonth.test(inValue)) {
            const res = mySplice(inValue, 2, 0, '/');
            setBirthdate(res);
        } else if (regExDayDateWithOneNumberYear.test(inValue)) {
            const res = mySplice(inValue, 5, 0, '/');
            setBirthdate(res);
        }
    }

    return (
        <div className="flex flex-col space-y-1.5">
            <Label htmlFor={props.name}>{label}</Label>
            <Input id={props.id} name={props.name} placeholder={props.placeholder} value={birthdate} onChange={(value: ChangeEvent<HTMLInputElement>) => onValueChange(value)}/>
        </div>
    );
}
