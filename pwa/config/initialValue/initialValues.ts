import moment from 'moment';

export const language_initialValue = 'fr-Fr';

const language = {language : language_initialValue}

const human_name = {
  use: 'usual',
};



const deviceDefinition_preInitialValue = {};

export const deviceDefinition_initialValue = {...deviceDefinition_preInitialValue, ...language};




const observation_preInitialValue = {
  status : "preliminary"
};

export const observation_initialValue = {...observation_preInitialValue, ...language};



const procedure_preInitialValue = {
  "@type" : "Procedure",
  status : "in-progress"
};

export const procedure_initialValue = {...procedure_preInitialValue, ...language}


const composition_preInitialValue = {
  status : "preliminary",
  //date : moment(new Date(), "Y-m-d H:i:s")
};

export const composition_initialValue = {...composition_preInitialValue, ...language}



const patient_preInitialValue = {
  active : true,
  gender : "unknown"
};

export const patient_initialValue = {...patient_preInitialValue, ...language}


const documentReference_preInitialValue = {
  status: "current",
  content : [
    {
      title : null
    }
  ]
};

export const documentReference_initialValue = {...documentReference_preInitialValue, ...language}

