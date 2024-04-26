import {Popover, PopoverTrigger, PopoverContent} from "@radix-ui/react-popover";
import {CalendarIcon} from "lucide-react";
import {Button} from "@/components/ui/Button";
import {Calendar} from "@/components/ui/calendar";
import React, {useEffect, useState} from "react";
import moment from "moment";
import {useField} from "formik";
import {Label} from "@/components/ui/Label";

export function CalendarFormik({disabled, label, ...props}){

    const [field, meta, helpers] = useField(props);
    const [selected, setSelected] = useState<Date | null>(field.value ? field.value : null);


    useEffect(() => {
        helpers.setValue(moment(selected).toISOString())
    }, [selected])

    return(
        <Popover>
            {label ? <Label htmlFor={props.name}>{label}</Label> : null}
            <PopoverTrigger asChild>
                    <Button variant="outline">
                        <span>{selected ? moment(selected).format('DD/MM/YYYY'): "Sélectionner une date"}</span>
                        <CalendarIcon className="ml-auto h-4 w-4 opacity-50" />
                    </Button>
            </PopoverTrigger>
            <PopoverContent className="w-auto p-0 bg-white" align="start">
                <Calendar
                    mode="single"
                    selected={selected}
                    onSelect={setSelected}
                    disabled={(date: Date) =>
                        date < new Date()
                    }
                    initialFocus
                />
            </PopoverContent>
        </Popover>
    )
}
