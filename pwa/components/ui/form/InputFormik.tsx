import {Label} from "@/components/ui/label";
import {Input} from "@/components/ui/input";
import React from "react";

export function InputFormik(props){
    return(
        <div className="flex flex-col space-y-1.5">
            <Label htmlFor={props.name}>{props.label}</Label>
            <Input
                type={props.type}
                {...props}
            />
        </div>
    )
}
