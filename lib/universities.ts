export type UniversityOption = {
  value: string;
  labelKey: string;
  defaultLabel: string;
};

export const UNIVERSITY_OPTIONS: UniversityOption[] = [
  {
    value: "squ",
    labelKey: "register.university.squ",
    defaultLabel: "Sultan Qaboos University",
  },
  {
    value: "dhofar-university",
    labelKey: "register.university.dhofar",
    defaultLabel: "Dhofar University",
  },
  {
    value: "german-university",
    labelKey: "register.university.german",
    defaultLabel: "German University of Technology",
  },
  {
    value: "muscat-university",
    labelKey: "register.university.muscat",
    defaultLabel: "Muscat University",
  },
  {
    value: "nizwa-university",
    labelKey: "register.university.nizwa",
    defaultLabel: "University of Nizwa",
  },
  {
    value: "oman-university",
    labelKey: "register.university.oman",
    defaultLabel: "University of Oman",
  },
  {
    value: "utas-ibri",
    labelKey: "register.university.utas.ibri",
    defaultLabel: "UTAS Ibri",
  },
  {
    value: "utas-muscat",
    labelKey: "register.university.utas.muscat",
    defaultLabel: "UTAS Muscat",
  },
  {
    value: "utas-nizwa",
    labelKey: "register.university.utas.nizwa",
    defaultLabel: "UTAS Nizwa",
  },
  {
    value: "utas-salalah",
    labelKey: "register.university.utas.salalah",
    defaultLabel: "UTAS Salalah",
  },
  {
    value: "utas-sohar",
    labelKey: "register.university.utas.sohar",
    defaultLabel: "UTAS Sohar",
  },
];

export const UNIVERSITY_VALUE_TO_NAME = UNIVERSITY_OPTIONS.reduce<Record<string, string>>(
  (acc, option) => {
    acc[option.value] = option.defaultLabel;
    return acc;
  },
  {},
);

export const UNIVERSITY_NAME_TO_VALUE = UNIVERSITY_OPTIONS.reduce<Record<string, string>>(
  (acc, option) => {
    acc[option.defaultLabel] = option.value;
    acc[option.defaultLabel.toLowerCase()] = option.value;
    return acc;
  },
  {},
);
