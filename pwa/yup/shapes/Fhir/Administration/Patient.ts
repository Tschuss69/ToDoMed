import * as Yup from "yup";
import {PeriodYupObject} from "../Foundation/DataTypes/Period";
import {ERROR_URI_CODEABLE_CONCEPT, ERROR_URI_REFERENCE} from "@/yup/messages/errors";
import {HumanNameYupObject} from "../Foundation/DataTypes/HumanName";
import {contactPointShape} from "../Foundation/DataTypes/ContactPoint";
import {AddressYupObject} from "../Foundation/DataTypes/AddressShape";
import {IdentifierShape} from "../Foundation/DataTypes/Identifier";
import {NarrativeYupObject} from "../Foundation/DataTypes/Narrative";

const referenceYup = Yup.string().matches(/\/references\/[0-9]+/, {message : ERROR_URI_REFERENCE});

const linkYupObject = {
    other : referenceYup,
    code : Yup.string().matches(/replaced-by|replaces|refer|seealso/, {message : "Doit être égale à replaced-by | replaces | refer | seealso"}),
};

const linkShape = Yup.object().shape(linkYupObject);

const communicationObject = {
    language : Yup.string().matches(/\/codeable_concepts\/[0-9]+/, {message : ERROR_URI_CODEABLE_CONCEPT}),
    preferred : Yup.boolean()
};

const communicationShape = Yup.object().shape(communicationObject);

const contactObjet = {
    relationship : Yup.string().matches(/\/references\/[0-9]+/, {message : ERROR_URI_REFERENCE, excludeEmptyString: true }).nullable(),
    name : Yup.object().shape(HumanNameYupObject).nullable(),
    telecom : Yup.array(contactPointShape),
    address : Yup.object().shape(AddressYupObject).nullable(),
    gender : Yup.string().matches(/male|female|other|unknown/, {message : "Doit être égale à male | female | other | unknown", excludeEmptyString: true }).nullable(),
    organization : Yup.string().matches(/\/references\/[0-9]+/, {message : ERROR_URI_REFERENCE, excludeEmptyString: true }).nullable(),
    period : Yup.object().shape(PeriodYupObject).nullable()
};

const contactShape =  Yup.object().shape(contactObjet);


export const PatientYupObject = {
    //language : Yup.string(),
    //text : Yup.object().shape(NarrativeYupObject).nullable(),
    //identifier : Yup.array(IdentifierShape),
    //link : Yup.array(linkShape),
    //managingOrganization :  Yup.string().matches(/\/references\/[0-9]+/, {message : ERROR_URI_REFERENCE, excludeEmptyString: true}).nullable(),
    //generalPractitioner : Yup.array(referenceYup),
   // communication : Yup.array(communicationShape),
    //contact : Yup.array(contactShape),
    //multipleBirthInteger: Yup.number().positive().nullable(),
    //isMultipleBirth : Yup.boolean().nullable(),
    //maritalStatus : Yup.string().matches(/\/codeable_concepts\/[0-9]+/, {message : ERROR_URI_CODEABLE_CONCEPT, excludeEmptyString: true}),
    //address :  Yup.array(Yup.object().shape(AddressYupObject)),
    //telecom : Yup.array(contactPointShape),
    name :  Yup.array(Yup.object().shape(HumanNameYupObject)),
    gender : Yup.string().matches(/male|female|other|unknown/, {message : "Doit être égale à male | female | other | unknown"}).required("gender est obligatoire"),
    //active : Yup.boolean(),
    birthDate : Yup.string().nullable(),
    //isDeceased : Yup.boolean().nullable(),
    //deceasedDateTime : Yup.string().nullable()
};


export const PatientShape = Yup.object().shape(PatientYupObject);


