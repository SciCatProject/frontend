import { JsonSchema4 } from "@jsonforms/core";

export interface EmpiarJson {
  title: string;
  releaseDate: ReleaseDate;
  experimentType: ExperimentType;
  scale?: Scale;
  crossReferences?: References[];
  biostudiesReferences?: References[];
  idrReferences?: References[];
  empiarReferences?: References[];
  workflows?: Workflow[];
  authors: Author[];
  correspondingAuthor: AuthorExtended;
  principalInvestigator: AuthorExtended[];
  imagesets: ImageSet[];
  citations: Citation[];
}

interface References {
  name: string;
}

interface Workflow {
  url: string;
  type: number;
}

interface Author {
  name: string;
  orderId: number;
  authorOrcid?: string | null;
}

interface AuthorExtended {
  authorOrcid?: string | null;
  firstName: string;
  middleName?: string | null;
  lastName: string;
  organization: string;
  street?: string | null;
  townOrCity: string;
  stateOrProvince?: string | null;
  postOrZip: string;
  telephone?: string | null;
  fax?: string | null;
  email: string;
  country: CountryEnum;
}

interface ImageSet {
  name: string;
  directory: string;
  category: string;
  headerFormat: string;
  dataFormat: string;
  numImagesOrTiltSeries: number;
  framesPerImage: number;
  frameRangeMin?: number | null;
  frameRangeMax?: number | null;
  voxelType: string;
  pixelWidth?: number | null;
  pixelHeight?: number | null;
  details?: string | null;
  micrographsFilePattern?: string | null;
  pickedParticlesFilePattern?: string | null;
  pickedParticlesDirectory?: string | null;
  imageWidth?: number | null;
  imageHeight?: number | null;
}

interface Citation {
  authors: Author[];
  editors?: Author[];
  published: boolean;
  preprint: boolean;
  jOrNjCitation: boolean;
  title: string;
  volume?: string | null;
  country?: CountryEnum | null;
  firstPage?: string | null;
  lastPage?: string | null;
  year?: number | null;
  language?: string | null;
  doi?: string | null;
  pubmedid?: string | null;
  details?: string | null;
  bookChapterTitle?: string | null;
  publisher?: string | null;
  publicationLocation?: string | null;
  journal?: string | null;
  journalAbbreviation?: string | null;
  issue?: string | null;
}
// export function GetEnumTitles(enumObj: any): string[] {
//   return Object.keys(enumObj).map(key => enumObj[key]);
// }

export function camelToSnake(obj: any): any {
  if (Array.isArray(obj)) {
    return obj.map(camelToSnake);
  } else if (obj !== null && typeof obj === "object") {
    return Object.keys(obj).reduce((acc, key) => {
      const snakeKey = key.replace(
        /[A-Z]/g,
        (letter) => `_${letter.toLowerCase()}`,
      );
      acc[snakeKey] = camelToSnake(obj[key]);
      return acc;
    }, {} as any);
  }
  return obj;
}
export function snakeToCamel(obj: any): any {
  if (Array.isArray(obj)) {
    return obj.map(snakeToCamel);
  } else if (obj !== null && typeof obj === "object") {
    return Object.keys(obj).reduce((acc, key) => {
      const camelKey = key.replace(/_([a-z])/g, (_, letter) =>
        letter.toUpperCase(),
      );
      acc[camelKey] = snakeToCamel(obj[key]);
      return acc;
    }, {} as any);
  }
  return obj;
}

export interface ExtendedJsonSchema extends JsonSchema4 {
  $id?: string;
}

export enum ReleaseDate {
  RE = "directly after the submission has been processed",
  EP = "after the related EMDB entry has been released",
  HP = "after the related primary citation has been published",
  HO = "delay release of entry by one year from the date of deposition",
}

export enum ExperimentType {
  E1 = "image data collected using soft x-ray tomography",
  E2 = "simulated data, for instance, created using InSilicoTEM (note: we only accept simulated data in special circumstances such as test/training sets for validation challenges: you need to ask for and be granted permission PRIOR to deposition otherwise the dataset will be rejected)",
  E3 = "raw image data relating to structures deposited to the Electron Microscopy Data Bank",
  E4 = "image data collected using serial block-face scanning electron microscopy (like the Gatan 3View system)",
  E5 = "image data collected using focused ion beam scanning electron microscopy",
  E6 = "integrative hybrid modelling data",
  E7 = "correlative light-electron microscopy",
  E8 = "correlative light X-ray microscopy",
  E9 = "microcrystal electron diffraction",
  E11 = "ATUM-SEM",
  E12 = "Hard X-ray/X-ray microCT",
  E13 = "ssET",
}
export enum Scale {
  S1 = "molecule",
  S2 = "virus",
  S3 = "cell",
  S4 = "tissue",
  S5 = "organism",
}

export enum CountryEnum {
  AF = "Afghanistan",
  AL = "Albania",
  DZ = "Algeria",
  AS = "American Samoa",
  AD = "Andorra",
  AO = "Angola",
  AI = "Anguilla",
  AQ = "Antarctica",
  AG = "Antigua and Barbuda",
  AR = "Argentina",
  AM = "Armenia",
  AW = "Aruba",
  AU = "Australia",
  AT = "Austria",
  AZ = "Azerbaijan",
  BS = "Bahamas (the)",
  BH = "Bahrain",
  BD = "Bangladesh",
  BB = "Barbados",
  BY = "Belarus",
  BE = "Belgium",
  BZ = "Belize",
  BJ = "Benin",
  BM = "Bermuda",
  BT = "Bhutan",
  BO = "Bolivia (Plurinational State of)",
  BQ = "Bonaire, Sint Eustatius and Saba",
  BA = "Bosnia and Herzegovina",
  BW = "Botswana",
  BV = "Bouvet Island",
  BR = "Brazil",
  IO = "British Indian Ocean Territory (the)",
  BN = "Brunei Darussalam",
  BG = "Bulgaria",
  BF = "Burkina Faso",
  BI = "Burundi",
  CV = "Cabo Verde",
  KH = "Cambodia",
  CM = "Cameroon",
  CA = "Canada",
  KY = "Cayman Islands (the)",
  CF = "Central African Republic (the)",
  TD = "Chad",
  CL = "Chile",
  CN = "China",
  CX = "Christmas Island",
  CC = "Cocos (Keeling) Islands (the)",
  CO = "Colombia",
  KM = "Comoros (the)",
  CD = "Congo (the Democratic Republic of the)",
  CG = "Congo (the)",
  CK = "Cook Islands (the)",
  CR = "Costa Rica",
  HR = "Croatia",
  CU = "Cuba",
  CW = "Curaçao",
  CY = "Cyprus",
  CZ = "Czechia",
  CI = "Côte d'Ivoire",
  DK = "Denmark",
  DJ = "Djibouti",
  DM = "Dominica",
  DO = "Dominican Republic (the)",
  EC = "Ecuador",
  EG = "Egypt",
  SV = "El Salvador",
  GQ = "Equatorial Guinea",
  ER = "Eritrea",
  EE = "Estonia",
  SZ = "Eswatini",
  ET = "Ethiopia",
  FK = "Falkland Islands (the) [Malvinas]",
  FO = "Faroe Islands (the)",
  FJ = "Fiji",
  FI = "Finland",
  FR = "France",
  GF = "French Guiana",
  PF = "French Polynesia",
  TF = "French Southern Territories (the)",
  GA = "Gabon",
  GM = "Gambia (the)",
  GE = "Georgia",
  DE = "Germany",
  GH = "Ghana",
  GI = "Gibraltar",
  GR = "Greece",
  GL = "Greenland",
  GD = "Grenada",
  GP = "Guadeloupe",
  GU = "Guam",
  GT = "Guatemala",
  GG = "Guernsey",
  GN = "Guinea",
  GW = "Guinea-Bissau",
  GY = "Guyana",
  HT = "Haiti",
  HM = "Heard Island and McDonald Islands",
  VA = "Holy See (the)",
  HN = "Honduras",
  HK = "Hong Kong",
  HU = "Hungary",
  IS = "Iceland",
  IN = "India",
  ID = "Indonesia",
  IR = "Iran (Islamic Republic of)",
  IQ = "Iraq",
  IE = "Ireland",
  IM = "Isle of Man",
  IL = "Israel",
  IT = "Italy",
  JM = "Jamaica",
  JP = "Japan",
  JE = "Jersey",
  JO = "Jordan",
  KZ = "Kazakhstan",
  KE = "Kenya",
  KI = "Kiribati",
  KP = "Korea (the Democratic People's Republic of)",
  KR = "Korea (the Republic of)",
  KW = "Kuwait",
  KG = "Kyrgyzstan",
  LA = "Lao People's Democratic Republic (the)",
  LV = "Latvia",
  LB = "Lebanon",
  LS = "Lesotho",
  LR = "Liberia",
  LY = "Libya",
  LI = "Liechtenstein",
  LT = "Lithuania",
  LU = "Luxembourg",
  MO = "Macao",
  MG = "Madagascar",
  MW = "Malawi",
  MY = "Malaysia",
  MV = "Maldives",
  ML = "Mali",
  MT = "Malta",
  MH = "Marshall Islands (the)",
  MQ = "Martinique",
  MR = "Mauritania",
  MU = "Mauritius",
  YT = "Mayotte",
  MX = "Mexico",
  FM = "Micronesia (Federated States of)",
  MD = "Moldova (the Republic of)",
  MC = "Monaco",
  MN = "Mongolia",
  ME = "Montenegro",
  MS = "Montserrat",
  MA = "Morocco",
  MZ = "Mozambique",
  MM = "Myanmar",
  NA = "Namibia",
  NR = "Nauru",
  NP = "Nepal",
  NL = "Netherlands (the)",
  NC = "New Caledonia",
  NZ = "New Zealand",
  NI = "Nicaragua",
  NE = "Niger (the)",
  NG = "Nigeria",
  NU = "Niue",
  NF = "Norfolk Island",
  MP = "Northern Mariana Islands (the)",
  NO = "Norway",
  OM = "Oman",
  PK = "Pakistan",
  PW = "Palau",
  PS = "Palestine, State of",
  PA = "Panama",
  PG = "Papua New Guinea",
  PY = "Paraguay",
  PE = "Peru",
  PH = "Philippines (the)",
  PN = "Pitcairn",
  PL = "Poland",
  PT = "Portugal",
  PR = "Puerto Rico",
  QA = "Qatar",
  MK = "Republic of North Macedonia",
  RO = "Romania",
  RU = "Russian Federation (the)",
  RW = "Rwanda",
  RE = "Réunion",
  BL = "Saint Barthélemy",
  SH = "Saint Helena, Ascension and Tristan da Cunha",
  KN = "Saint Kitts and Nevis",
  LC = "Saint Lucia",
  MF = "Saint Martin (French part)",
  PM = "Saint Pierre and Miquelon",
  VC = "Saint Vincent and the Grenadines",
  WS = "Samoa",
  SM = "San Marino",
  ST = "Sao Tome and Principe",
  SA = "Saudi Arabia",
  SN = "Senegal",
  RS = "Serbia",
  SC = "Seychelles",
  SL = "Sierra Leone",
  SG = "Singapore",
  SX = "Sint Maarten (Dutch part)",
  SK = "Slovakia",
  SI = "Slovenia",
  SB = "Solomon Islands",
  SO = "Somalia",
  ZA = "South Africa",
  GS = "South Georgia and the South Sandwich Islands",
  SS = "South Sudan",
  ES = "Spain",
  LK = "Sri Lanka",
  SD = "Sudan (the)",
  SR = "Suriname",
  SJ = "Svalbard and Jan Mayen",
  SE = "Sweden",
  CH = "Switzerland",
  SY = "Syrian Arab Republic",
  TW = "Taiwan (Province of China)",
  TJ = "Tajikistan",
  TZ = "Tanzania, United Republic of",
  TH = "Thailand",
  TL = "Timor-Leste",
  TG = "Togo",
  TK = "Tokelau",
  TO = "Tonga",
  TT = "Trinidad and Tobago",
  TN = "Tunisia",
  TR = "Turkey",
  TM = "Turkmenistan",
  TC = "Turks and Caicos Islands (the)",
  TV = "Tuvalu",
  UG = "Uganda",
  UA = "Ukraine",
  AE = "United Arab Emirates (the)",
  GB = "United Kingdom of Great Britain and Northern Ireland (the)",
  UM = "United States Minor Outlying Islands (the)",
  US = "United States of America (the)",
  UY = "Uruguay",
  UZ = "Uzbekistan",
  VU = "Vanuatu",
  VE = "Venezuela (Bolivarian Republic of)",
  VN = "Viet Nam",
  VG = "Virgin Islands (British)",
  VI = "Virgin Islands (U.S.)",
  WF = "Wallis and Futuna",
  EH = "Western Sahara",
  YE = "Yemen",
  ZM = "Zambia",
  ZW = "Zimbabwe",
  AX = "Åland Islands",
}
