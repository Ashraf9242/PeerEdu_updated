export type UniversityOption = {
  value: string;
  labelKey: string;
  defaultLabel: string;
};

export const UNIVERSITY_OPTIONS: UniversityOption[] = [
  { value: "squ", labelKey: "register.university.squ", defaultLabel: "Sultan Qaboos University" },
  { value: "uts-general", labelKey: "register.university.utas.general", defaultLabel: "UTAS (General)" },
  { value: "utas-ibri", labelKey: "register.university.utas.ibri", defaultLabel: "UTAS Ibri" },
  { value: "utas-muscat", labelKey: "register.university.utas.muscat", defaultLabel: "UTAS Muscat" },
  { value: "utas-nizwa", labelKey: "register.university.utas.nizwa", defaultLabel: "UTAS Nizwa" },
  { value: "utas-salalah", labelKey: "register.university.utas.salalah", defaultLabel: "UTAS Salalah" },
  { value: "utas-sohar", labelKey: "register.university.utas.sohar", defaultLabel: "UTAS Sohar" },
  { value: "utas-shinas", labelKey: "register.university.utas.shinas", defaultLabel: "UTAS Shinas" },
  { value: "utas-sur", labelKey: "register.university.utas.sur", defaultLabel: "UTAS Sur" },
  { value: "utas-almusannah", labelKey: "register.university.utas.almusannah", defaultLabel: "UTAS Al Musannah" },
  { value: "utas-ibra", labelKey: "register.university.utas.ibra", defaultLabel: "UTAS Ibra" },
  { value: "utas-rustaq", labelKey: "register.university.utas.rustaq", defaultLabel: "UTAS Rustaq" },
  { value: "dhofar-university", labelKey: "register.university.dhofar", defaultLabel: "Dhofar University" },
  { value: "german-university", labelKey: "register.university.german", defaultLabel: "German University of Technology" },
  { value: "muscat-university", labelKey: "register.university.muscat", defaultLabel: "Muscat University" },
  { value: "nizwa-university", labelKey: "register.university.nizwa", defaultLabel: "University of Nizwa" },
  { value: "oman-university", labelKey: "register.university.oman", defaultLabel: "University of Oman" },
  { value: "buraimi-university", labelKey: "register.university.buraimi", defaultLabel: "University of Buraimi" },
  { value: "sohar-university", labelKey: "register.university.sohar", defaultLabel: "Sohar University" },
  { value: "asharqiyah-university", labelKey: "register.university.asharqiyah", defaultLabel: "A'Sharqiyah University" },
  { value: "national-university", labelKey: "register.university.national", defaultLabel: "National University of Science & Technology" },
  { value: "majan-college", labelKey: "register.university.majan", defaultLabel: "Majan University College" },
  { value: "modern-college", labelKey: "register.university.modern", defaultLabel: "Modern College of Business & Science" },
  { value: "middle-east-college", labelKey: "register.university.middleeast", defaultLabel: "Middle East College" },
  { value: "arab-open-university", labelKey: "register.university.arabopen", defaultLabel: "Arab Open University - Oman" },
  { value: "oman-tourism-college", labelKey: "register.university.tourism", defaultLabel: "Oman Tourism College" },
  { value: "oman-health-sciences", labelKey: "register.university.healthsciences", defaultLabel: "Oman College of Health Sciences" },
  { value: "international-maritime-college", labelKey: "register.university.maritime", defaultLabel: "International Maritime College Oman" },
  { value: "oman-dental-college", labelKey: "register.university.dental", defaultLabel: "Oman Dental College" },
  { value: "alzahra-college", labelKey: "register.university.alzahra", defaultLabel: "Al Zahra College for Women" },
  { value: "gulf-college", labelKey: "register.university.gulf", defaultLabel: "Gulf College" },
  { value: "bayan-college", labelKey: "register.university.bayan", defaultLabel: "Bayan College" },
  { value: "law-college", labelKey: "register.university.law", defaultLabel: "Oman College of Law" },
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
