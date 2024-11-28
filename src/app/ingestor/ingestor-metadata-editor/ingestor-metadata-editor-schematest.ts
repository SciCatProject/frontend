export const schema_mask2 = {
  type: 'object',
  properties: {
    id: {
      type: 'string',
    },
    title: {
      type: 'string',
    },
    description: {
      type: 'string',
    },
    status: {
      type: 'string',
      enum: ['active', 'completed', 'archived'],
    },
    priority: {
      type: 'integer',
      minimum: 1,
      maximum: 5,
    },
    first_name: {
      type: 'string',
      description: 'first name',
    },
    work_status: {
      type: 'boolean',
      description: 'work status',
    },
    email: {
      type: 'string',
      description: 'email',
      pattern: '^[a-zA-Z0-9_.+-]+@[a-zA-Z0-9-]+\\.[a-zA-Z0-9-.]+$',
    },
    work_phone: {
      type: 'string',
      description: 'work phone',
    },
    name: {
      type: 'string',
      description: 'name',
    },
    name_org: {
      type: 'string',
      description: 'Name of the organization',
    },
    type_org: {
      type: 'string',
      description: 'Type of organization, academic, commercial, governmental, etc.',
      enum: ['Academic', 'Commercial', 'Government', 'Other'],
    },
    country: {
      type: 'string',
      description: 'Country of the institution',
    },
    role: {
      type: 'string',
      description: 'Role of the author, for example principal investigator',
    },
    orcid: {
      type: 'string',
      description: 'ORCID of the author, a type of unique identifier',
    },
    funder_name: {
      type: 'string',
      description: 'funding organization/person.',
    },
    start_date: {
      type: 'string',
      format: 'date',
      description: 'start date',
    },
    end_date: {
      type: 'string',
      format: 'date',
      description: 'end date',
    },
    budget: {
      type: 'number',
      description: 'budget',
    },
    project_id: {
      type: 'string',
      description: 'project id',
    },
    grants: {
      type: 'array',
      items: {
        type: 'object',
        properties: {
          grant_name: {
            type: 'string',
            description: 'name of the grant',
          },
          start_date: {
            type: 'string',
            format: 'date',
            description: 'start date',
          },
          end_date: {
            type: 'string',
            format: 'date',
            description: 'end date',
          },
          budget: {
            type: 'number',
            description: 'budget',
          },
          project_id: {
            type: 'string',
            description: 'project id',
          },
          country: {
            type: 'string',
            description: 'Country of the institution',
          },
        },
      },
      description: 'List of grants associated with the project',
    },
    authors: {
      type: 'array',
      items: {
        type: 'object',
        properties: {
          first_name: {
            type: 'string',
            description: 'first name',
          },
          work_status: {
            type: 'boolean',
            description: 'work status',
          },
          email: {
            type: 'string',
            description: 'email',
            pattern: '^[a-zA-Z0-9_.+-]+@[a-zA-Z0-9-]+\\.[a-zA-Z0-9-.]+$',
          },
          work_phone: {
            type: 'string',
            description: 'work phone',
          },
          name: {
            type: 'string',
            description: 'name',
          },
          name_org: {
            type: 'string',
            description: 'Name of the organization',
          },
          type_org: {
            type: 'string',
            description: 'Type of organization, academic, commercial, governmental, etc.',
            enum: ['Academic', 'Commercial', 'Government', 'Other'],
          },
          country: {
            type: 'string',
            description: 'Country of the institution',
          },
          role: {
            type: 'string',
            description: 'Role of the author, for example principal investigator',
          },
          orcid: {
            type: 'string',
            description: 'ORCID of the author, a type of unique identifier',
          },
        },
      },
      description: 'List of authors associated with the project',
    },
    instruments: {
      type: 'array',
      items: {
        type: 'object',
        properties: {
          microscope: {
            type: 'string',
            description: 'Name/Type of the Microscope',
          },
          illumination: {
            type: 'string',
            description: 'Mode of illumination used during data collection',
          },
          imaging: {
            type: 'string',
            description: 'Mode of imaging used during data collection',
          },
          electron_source: {
            type: 'string',
            description: 'Type of electron source used in the microscope, such as FEG',
          },
          acceleration_voltage: {
            type: 'number',
            description: 'Voltage used for the electron acceleration, in kV',
          },
          c2_aperture: {
            type: 'number',
            description: 'C2 aperture size used in data acquisition, in µm',
          },
          cs: {
            type: 'number',
            description: 'Spherical aberration of the instrument, in mm',
          },
        },
      },
      description: 'List of instruments used in the project',
    },
    organizational: {
      type: 'object',
      properties: {
        id: {
          type: 'string',
        },
        title: {
          type: 'string',
        },
        description: {
          type: 'string',
        },
        status: {
          type: 'string',
          enum: ['active', 'completed', 'archived'],
        },
        priority: {
          type: 'integer',
          minimum: 1,
          maximum: 5,
        },
        first_name: {
          type: 'string',
          description: 'first name',
        },
        work_status: {
          type: 'boolean',
          description: 'work status',
        },
        email: {
          type: 'string',
          description: 'email',
          pattern: '^[a-zA-Z0-9_.+-]+@[a-zA-Z0-9-]+\\.[a-zA-Z0-9-.]+$',
        },
        work_phone: {
          type: 'string',
          description: 'work phone',
        },
        name: {
          type: 'string',
          description: 'name',
        },
        name_org: {
          type: 'string',
          description: 'Name of the organization',
        },
        type_org: {
          type: 'string',
          description: 'Type of organization, academic, commercial, governmental, etc.',
          enum: ['Academic', 'Commercial', 'Government', 'Other'],
        },
        country: {
          type: 'string',
          description: 'Country of the institution',
        },
        role: {
          type: 'string',
          description: 'Role of the author, for example principal investigator',
        },
        orcid: {
          type: 'string',
          description: 'ORCID of the author, a type of unique identifier',
        },
        funder_name: {
          type: 'string',
          description: 'funding organization/person.',
        },
        start_date: {
          type: 'string',
          format: 'date',
          description: 'start date',
        },
        end_date: {
          type: 'string',
          format: 'date',
          description: 'end date',
        },
        budget: {
          type: 'number',
          description: 'budget',
        },
        project_id: {
          type: 'string',
          description: 'project id',
        },
        grants: {
          type: 'array',
          items: {
            type: 'object',
            properties: {
              grant_name: {
                type: 'string',
                description: 'name of the grant',
              },
              start_date: {
                type: 'string',
                format: 'date',
                description: 'start date',
              },
              end_date: {
                type: 'string',
                format: 'date',
                description: 'end date',
              },
              budget: {
                type: 'number',
                description: 'budget',
              },
              project_id: {
                type: 'string',
                description: 'project id',
              },
              country: {
                type: 'string',
                description: 'Country of the institution',
              },
            },
          },
          description: 'List of grants associated with the project',
        },
        authors: {
          type: 'array',
          items: {
            type: 'object',
            properties: {
              first_name: {
                type: 'string',
                description: 'first name',
              },
              work_status: {
                type: 'boolean',
                description: 'work status',
              },
              email: {
                type: 'string',
                description: 'email',
                pattern: '^[a-zA-Z0-9_.+-]+@[a-zA-Z0-9-]+\\.[a-zA-Z0-9-.]+$',
              },
              work_phone: {
                type: 'string',
                description: 'work phone',
              },
              name: {
                type: 'string',
                description: 'name',
              },
              name_org: {
                type: 'string',
                description: 'Name of the organization',
              },
              type_org: {
                type: 'string',
                description: 'Type of organization, academic, commercial, governmental, etc.',
                enum: ['Academic', 'Commercial', 'Government', 'Other'],
              },
              country: {
                type: 'string',
                description: 'Country of the institution',
              },
              role: {
                type: 'string',
                description: 'Role of the author, for example principal investigator',
              },
              orcid: {
                type: 'string',
                description: 'ORCID of the author, a type of unique identifier',
              },
            },
          },
          description: 'List of authors associated with the project',
        },
        instruments: {
          type: 'array',
          items: {
            type: 'object',
            properties: {
              microscope: {
                type: 'string',
                description: 'Name/Type of the Microscope',
              },
              illumination: {
                type: 'string',
                description: 'Mode of illumination used during data collection',
              },
              imaging: {
                type: 'string',
                description: 'Mode of imaging used during data collection',
              },
              electron_source: {
                type: 'string',
                description: 'Type of electron source used in the microscope, such as FEG',
              },
              acceleration_voltage: {
                type: 'number',
                description: 'Voltage used for the electron acceleration, in kV',
              },
              c2_aperture: {
                type: 'number',
                description: 'C2 aperture size used in data acquisition, in µm',
              },
              cs: {
                type: 'number',
                description: 'Spherical aberration of the instrument, in mm',
              },
            },
          },
          description: 'List of instruments used in the project',
        },
      },
    },
  },
  required: ['id', 'title', 'status', 'name', 'email', 'work_phone', 'orcid', 'country', 'type_org', 'name_org'],
};