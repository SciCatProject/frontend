export const demo_organizational_schema = {
  type: "object",
  properties: {
    grants: {
      type: "array",
      items: {
        type: "object",
        properties: {
          grant_name: {
            type: "string",
            description: "name of the grant",
          },
          start_date: {
            type: "string",
            format: "date",
            description: "start date",
          },
          end_date: {
            type: "string",
            format: "date",
            description: "end date",
          },
          budget: {
            type: "number",
            description: "budget",
          },
          project_id: {
            type: "string",
            description: "project id",
          },
          country: {
            type: "string",
            description: "Country of the institution",
          },
        },
      },
      description: "List of grants associated with the project",
    },
    authors: {
      type: "array",
      items: {
        type: "object",
        properties: {
          first_name: {
            type: "string",
            description: "first name",
          },
          work_status: {
            type: "boolean",
            description: "work status",
          },
          email: {
            type: "string",
            description: "email",
            pattern: "^[a-zA-Z0-9_.+-]+@[a-zA-Z0-9-]+\\.[a-zA-Z0-9-.]+$",
          },
          work_phone: {
            type: "string",
            description: "work phone",
          },
          name: {
            type: "string",
            description: "name",
          },
          name_org: {
            type: "string",
            description: "Name of the organization",
          },
          type_org: {
            type: "string",
            description:
              "Type of organization, academic, commercial, governmental, etc.",
            enum: ["Academic", "Commercial", "Government", "Other"],
          },
          country: {
            type: "string",
            description: "Country of the institution",
          },
          role: {
            type: "string",
            description:
              "Role of the author, for example principal investigator",
          },
          orcid: {
            type: "string",
            description: "ORCID of the author, a type of unique identifier",
          },
        },
      },
      description: "List of authors associated with the project",
    },
    funder: {
      type: "array",
      items: {
        type: "object",
        properties: {
          funder_name: {
            type: "string",
            description: "funding organization/person.",
          },
          type_org: {
            type: "string",
            description:
              "Type of organization, academic, commercial, governmental, etc.",
            enum: ["Academic", "Commercial", "Government", "Other"],
          },
          country: {
            type: "string",
            description: "Country of the institution",
          },
        },
      },
      description: "Description of the project funding",
    },
  },
  required: ["authors", "funder"],
};

export const demo_acquisition_schema = {
  type: "object",
  properties: {
    nominal_defocus: {
      type: "object",
      description: "Target defocus set, min and max values in µm.",
    },
    calibrated_defocus: {
      type: "object",
      description:
        "Machine estimated defocus, min and max values in µm. Has a tendency to be off.",
    },
    nominal_magnification: {
      type: "integer",
      description:
        "Magnification level as indicated by the instrument, no unit",
    },
    calibrated_magnification: {
      type: "integer",
      description: "Calculated magnification, no unit",
    },
    holder: {
      type: "string",
      description: "Speciman holder model",
    },
    holder_cryogen: {
      type: "string",
      description:
        "Type of cryogen used in the holder - if the holder is cooled seperately",
    },
    temperature_range: {
      type: "object",
      description:
        "Temperature during data collection, in K with min and max values.",
    },
    microscope_software: {
      type: "string",
      description: "Software used for instrument control",
    },
    detector: {
      type: "string",
      description: "Make and model of the detector used",
    },
    detector_mode: {
      type: "string",
      description: "Operating mode of the detector",
    },
    dose_per_movie: {
      type: "object",
      description:
        "Average dose per image/movie/tilt - given in electrons per square Angstrom",
    },
    energy_filter: {
      type: "object",
      description: "Whether an energy filter was used and its specifics.",
    },
    image_size: {
      type: "object",
      description: "The size of the image in pixels, height and width given.",
    },
    date_time: {
      type: "string",
      description: "Time and date of the data acquisition",
    },
    exposure_time: {
      type: "object",
      description: "Time of data acquisition per movie/tilt - in s",
    },
    cryogen: {
      type: "string",
      description:
        "Cryogen used in cooling the instrument and sample, usually nitrogen",
    },
    frames_per_movie: {
      type: "integer",
      description:
        "Number of frames that on average constitute a full movie, can be a bit hard to define for some detectors",
    },
    grids_imaged: {
      type: "integer",
      description:
        "Number of grids imaged for this project - here with qualifier during this data acquisition",
    },
    images_generated: {
      type: "integer",
      description:
        "Number of images generated total for this data collection - might need a qualifier for tilt series to determine whether full series or individual tilts are counted",
    },
    binning_camera: {
      type: "number",
      description:
        "Level of binning on the images applied during data collection",
    },
    pixel_size: {
      type: "object",
      description: "Pixel size, in Angstrom",
    },
    specialist_optics: {
      type: "object",
      description: "Any type of special optics, such as a phaseplate",
    },
    beamshift: {
      type: "object",
      description:
        "Movement of the beam above the sample for data collection purposes that does not require movement of the stage. Given in mrad.",
    },
    beamtilt: {
      type: "object",
      description:
        "Another way to move the beam above the sample for data collection purposes that does not require movement of the stage. Given in mrad.",
    },
    imageshift: {
      type: "object",
      description:
        "Movement of the Beam below the image in order to shift the image on the detector. Given in µm.",
    },
    beamtiltgroups: {
      type: "integer",
      description:
        "Number of Beamtilt groups present in this dataset - for optimized processing split dataset into groups of same tilt angle. Despite its name Beamshift is often used to achieve this result.",
    },
    gainref_flip_rotate: {
      type: "string",
      description:
        "Whether and how you have to flip or rotate the gainref in order to align with your acquired images",
    },
  },
  required: [
    "detector",
    "dose_per_movie",
    "date_time",
    "binning_camera",
    "pixel_size",
  ],
};

export const demo_sample_schema = {
  type: "object",
  properties: {
    overall_molecule: {
      type: "object",
      description: "Description of the overall molecule",
      properties: {
        molecular_type: {
          type: "string",
          description:
            "Description of the overall molecular type, i.e., a complex",
        },
        name_sample: {
          type: "string",
          description: "Name of the full sample",
        },
        source: {
          type: "string",
          description:
            "Where the sample was taken from, i.e., natural host, recombinantly expressed, etc.",
        },
        molecular_weight: {
          type: "object",
          description: "Molecular weight in Da",
        },
        assembly: {
          type: "string",
          description:
            "What type of higher order structure your sample forms - if any.",
          enum: ["FILAMENT", "HELICAL ARRAY", "PARTICLE"],
        },
      },
      required: ["molecular_type", "name_sample", "source", "assembly"],
    },
    molecule: {
      type: "array",
      items: {
        type: "object",
        properties: {
          name_mol: {
            type: "string",
            description:
              "Name of an individual molecule (often protein) in the sample",
          },
          molecular_type: {
            type: "string",
            description:
              "Description of the overall molecular type, i.e., a complex",
          },
          molecular_class: {
            type: "string",
            description: "Class of the molecule",
            enum: ["Antibiotic", "Carbohydrate", "Chimera", "None of these"],
          },
          sequence: {
            type: "string",
            description:
              "Full sequence of the sample as in the data, i.e., cleaved tags should also be removed from sequence here",
          },
          natural_source: {
            type: "string",
            description: "Scientific name of the natural host organism",
          },
          taxonomy_id_source: {
            type: "string",
            description: "Taxonomy ID of the natural source organism",
          },
          expression_system: {
            type: "string",
            description:
              "Scientific name of the organism used to produce the molecule of interest",
          },
          taxonomy_id_expression: {
            type: "string",
            description: "Taxonomy ID of the expression system organism",
          },
          gene_name: {
            type: "string",
            description: "Name of the gene of interest",
          },
        },
      },
      required: [
        "name_mol",
        "molecular_type",
        "molecular_class",
        "sequence",
        "natural_source",
        "taxonomy_id_source",
        "expression_system",
        "taxonomy_id_expression",
      ],
    },
    ligands: {
      type: "array",
      items: {
        type: "object",
        properties: {
          present: {
            type: "boolean",
            description: "Whether the model contains any ligands",
          },
          smiles: {
            type: "string",
            description: "Provide a valid SMILES string of your ligand",
          },
          reference: {
            type: "string",
            description:
              "Link to a reference of your ligand, i.e., CCD, PubChem, etc.",
          },
        },
      },
      description: "List of ligands associated with the sample",
    },
    specimen: {
      type: "object",
      description: "Description of the specimen",
      properties: {
        buffer: {
          type: "string",
          description:
            "Name/composition of the (chemical) sample buffer during grid preparation",
        },
        concentration: {
          type: "object",
          description:
            "Concentration of the (supra)molecule in the sample, in mg/ml",
        },
        ph: {
          type: "number",
          description: "pH of the sample buffer",
        },
        vitrification: {
          type: "boolean",
          description: "Whether the sample was vitrified",
        },
        vitrification_cryogen: {
          type: "string",
          description: "Which cryogen was used for vitrification",
        },
        humidity: {
          type: "object",
          description: "Environmental humidity just before vitrification, in %",
        },
        temperature: {
          type: "object",
          description:
            "Environmental temperature just before vitrification, in K",
          minimum: 0.0,
        },
        staining: {
          type: "boolean",
          description: "Whether the sample was stained",
        },
        embedding: {
          type: "boolean",
          description: "Whether the sample was embedded",
        },
        shadowing: {
          type: "boolean",
          description: "Whether the sample was shadowed",
        },
      },
      required: [
        "ph",
        "vitrification",
        "vitrification_cryogen",
        "staining",
        "embedding",
        "shadowing",
      ],
    },
    grid: {
      type: "object",
      description: "Description of the grid used",
      properties: {
        manufacturer: {
          type: "string",
          description: "Grid manufacturer",
        },
        material: {
          type: "string",
          description: "Material out of which the grid is made",
        },
        mesh: {
          type: "number",
          description: "Grid mesh in lines per inch",
        },
        film_support: {
          type: "boolean",
          description: "Whether a support film was used",
        },
        film_material: {
          type: "string",
          description: "Type of material the support film is made of",
        },
        film_topology: {
          type: "string",
          description: "Topology of the support film",
        },
        film_thickness: {
          type: "string",
          description: "Thickness of the support film",
        },
        pretreatment_type: {
          type: "string",
          description: "Type of pretreatment of the grid, i.e., glow discharge",
        },
        pretreatment_time: {
          type: "object",
          description: "Length of time of the pretreatment in s",
        },
        pretreatment_pressure: {
          type: "object",
          description: "Pressure of the chamber during pretreatment, in Pa",
        },
        pretreatment_atmosphere: {
          type: "string",
          description:
            "Atmospheric conditions in the chamber during pretreatment, i.e., addition of specific gases, etc.",
        },
      },
    },
  },
  required: ["overall_molecule", "molecule", "specimen", "grid"],
};

export const demo_instrument_schema = {
  type: "object",
  properties: {
    microscope: {
      type: "string",
      description: "Name/Type of the Microscope",
    },
    illumination: {
      type: "string",
      description: "Mode of illumination used during data collection",
    },
    imaging: {
      type: "string",
      description: "Mode of imaging used during data collection",
    },
    electron_source: {
      type: "string",
      description:
        "Type of electron source used in the microscope, such as FEG",
    },
    acceleration_voltage: {
      type: "object",
      description: "Voltage used for the electron acceleration, in kV",
    },
    c2_aperture: {
      type: "object",
      description: "C2 aperture size used in data acquisition, in µm",
    },
    cs: {
      type: "object",
      description: "Spherical aberration of the instrument, in mm",
    },
  },
  required: [
    "microscope",
    "illumination",
    "imaging",
    "electron_source",
    "acceleration_voltage",
    "cs",
  ],
};

export const demo_scicatheader_schema = {
  type: "object",
  properties: {
    datasetName: { type: "string" },
    description: { type: "string" },
    creationLocation: { type: "string" },
    dataFormat: { type: "string" },
    ownerGroup: { type: "string" },
    type: { type: "string" },
    license: { type: "string" },
    keywords: {
      type: "array",
      items: { type: "string" },
    },
    scientificMetadata: { type: "string" },
  },
  required: [
    "datasetName",
    "description",
    "creationLocation",
    "dataFormat",
    "ownerGroup",
    "type",
    "license",
    "keywords",
    "scientificMetadata",
  ],
};
