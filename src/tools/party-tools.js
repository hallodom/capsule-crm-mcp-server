/**
 * Party Tools for Capsule CRM MCP Server
 * 
 * Tools for managing parties (contacts and organizations) in Capsule CRM
 */

export function createPartyTools() {
  return [
    {
      name: 'capsule_list_parties',
      description: 'List parties (contacts and organizations) from Capsule CRM',
      inputSchema: {
        type: 'object',
        properties: {
          page: {
            type: 'integer',
            description: 'Page number (default: 1)',
            minimum: 1,
          },
          perPage: {
            type: 'integer',
            description: 'Number of results per page (1-100, default: 50)',
            minimum: 1,
            maximum: 100,
          },
          since: {
            type: 'string',
            description: 'ISO8601 date to filter parties changed after this date',
          },
          embed: {
            type: 'array',
            items: {
              type: 'string',
              enum: ['tags', 'fields', 'organisation', 'missingImportantFields'],
            },
            description: 'Additional data to include in response',
          },
        },
        required: [],
      },
      execute: async (args, client) => {
        try {
          const result = await client.listParties(args);
          return client.formatMCPResponse(result, `Found ${result.parties?.length || 0} parties`);
        } catch (error) {
          return client.formatMCPError(error);
        }
      },
    },

    {
      name: 'capsule_get_party',
      description: 'Get a specific party (contact or organization) by ID',
      inputSchema: {
        type: 'object',
        properties: {
          partyId: {
            type: 'integer',
            description: 'The ID of the party to retrieve',
          },
          embed: {
            type: 'array',
            items: {
              type: 'string',
              enum: ['tags', 'fields', 'organisation', 'missingImportantFields'],
            },
            description: 'Additional data to include in response',
          },
        },
        required: ['partyId'],
      },
      execute: async (args, client) => {
        try {
          const result = await client.getParty(args.partyId, { embed: args.embed });
          return client.formatMCPResponse(result, `Retrieved party: ${result.party.type === 'person' ? `${result.party.firstName} ${result.party.lastName}` : result.party.name}`);
        } catch (error) {
          return client.formatMCPError(error);
        }
      },
    },

    {
      name: 'capsule_search_parties',
      description: 'Search for parties using a query string',
      inputSchema: {
        type: 'object',
        properties: {
          query: {
            type: 'string',
            description: 'Search query (name, email, phone, etc.)',
          },
          page: {
            type: 'integer',
            description: 'Page number (default: 1)',
            minimum: 1,
          },
          perPage: {
            type: 'integer',
            description: 'Number of results per page (1-100, default: 50)',
            minimum: 1,
            maximum: 100,
          },
          embed: {
            type: 'array',
            items: {
              type: 'string',
              enum: ['tags', 'fields', 'organisation', 'missingImportantFields'],
            },
            description: 'Additional data to include in response',
          },
        },
        required: ['query'],
      },
      execute: async (args, client) => {
        try {
          const result = await client.searchParties(args.query, {
            page: args.page,
            perPage: args.perPage,
            embed: args.embed,
          });
          return client.formatMCPResponse(result, `Found ${result.parties?.length || 0} parties matching "${args.query}"`);
        } catch (error) {
          return client.formatMCPError(error);
        }
      },
    },

    {
      name: 'capsule_create_person',
      description: 'Create a new person (contact) in Capsule CRM',
      inputSchema: {
        type: 'object',
        properties: {
          firstName: {
            type: 'string',
            description: 'First name of the person',
          },
          lastName: {
            type: 'string',
            description: 'Last name of the person',
          },
          title: {
            type: 'string',
            description: 'Title of the person (Mr, Mrs, Dr, etc.)',
          },
          jobTitle: {
            type: 'string',
            description: 'Job title',
          },
          about: {
            type: 'string',
            description: 'Description about the person',
          },
          organizationId: {
            type: 'integer',
            description: 'ID of the organization this person belongs to',
          },
          organizationName: {
            type: 'string',
            description: 'Name of organization (will create if doesn\'t exist)',
          },
          emailAddresses: {
            type: 'array',
            items: {
              type: 'object',
              properties: {
                type: { type: 'string', description: 'Email type (Work, Home, etc.)' },
                address: { type: 'string', description: 'Email address' },
              },
              required: ['address'],
            },
            description: 'Email addresses for the person',
          },
          phoneNumbers: {
            type: 'array',
            items: {
              type: 'object',
              properties: {
                type: { type: 'string', description: 'Phone type (Work, Home, Mobile, etc.)' },
                number: { type: 'string', description: 'Phone number' },
              },
              required: ['number'],
            },
            description: 'Phone numbers for the person',
          },
          addresses: {
            type: 'array',
            items: {
              type: 'object',
              properties: {
                type: { type: 'string', description: 'Address type (Work, Home, etc.)' },
                street: { type: 'string', description: 'Street address' },
                city: { type: 'string', description: 'City' },
                state: { type: 'string', description: 'State or province' },
                zip: { type: 'string', description: 'ZIP or postal code' },
                country: { type: 'string', description: 'Country' },
              },
            },
            description: 'Addresses for the person',
          },
          websites: {
            type: 'array',
            items: {
              type: 'object',
              properties: {
                type: { type: 'string', description: 'Website type (Work, Home, etc.)' },
                address: { type: 'string', description: 'Website URL or username' },
                service: { type: 'string', enum: ['URL', 'TWITTER', 'LINKEDIN', 'FACEBOOK'], description: 'Service type' },
              },
              required: ['address', 'service'],
            },
            description: 'Websites and social media for the person',
          },
          tags: {
            type: 'array',
            items: {
              type: 'object',
              properties: {
                id: { type: 'integer', description: 'Tag ID' },
                name: { type: 'string', description: 'Tag name' },
              },
            },
            description: 'Tags to assign to the person',
          },
          ownerId: {
            type: 'integer',
            description: 'ID of the user who should own this contact',
          },
          teamId: {
            type: 'integer',
            description: 'ID of the team this contact should be assigned to',
          },
        },
        required: ['firstName', 'lastName'],
      },
      execute: async (args, client) => {
        try {
          const partyData = {
            type: 'person',
            firstName: args.firstName,
            lastName: args.lastName,
          };

          // Add optional fields
          if (args.title) partyData.title = args.title;
          if (args.jobTitle) partyData.jobTitle = args.jobTitle;
          if (args.about) partyData.about = args.about;

          // Handle organization assignment
          if (args.organizationId) {
            partyData.organisation = { id: args.organizationId };
          } else if (args.organizationName) {
            partyData.organisation = { name: args.organizationName };
          }

          // Handle contact information
          if (args.emailAddresses) partyData.emailAddresses = args.emailAddresses;
          if (args.phoneNumbers) partyData.phoneNumbers = args.phoneNumbers;
          if (args.addresses) partyData.addresses = args.addresses;
          if (args.websites) partyData.websites = args.websites;

          // Handle tags
          if (args.tags) partyData.tags = args.tags;

          // Handle ownership
          if (args.ownerId) partyData.owner = { id: args.ownerId };
          if (args.teamId) partyData.team = { id: args.teamId };

          const result = await client.createParty(partyData, { embed: ['tags', 'fields', 'organisation'] });
          return client.formatMCPResponse(result, `Created person: ${result.party.firstName} ${result.party.lastName}`);
        } catch (error) {
          return client.formatMCPError(error);
        }
      },
    },

    {
      name: 'capsule_create_organization',
      description: 'Create a new organization in Capsule CRM',
      inputSchema: {
        type: 'object',
        properties: {
          name: {
            type: 'string',
            description: 'Name of the organization',
          },
          about: {
            type: 'string',
            description: 'Description about the organization',
          },
          emailAddresses: {
            type: 'array',
            items: {
              type: 'object',
              properties: {
                type: { type: 'string', description: 'Email type (Work, Main, etc.)' },
                address: { type: 'string', description: 'Email address' },
              },
              required: ['address'],
            },
            description: 'Email addresses for the organization',
          },
          phoneNumbers: {
            type: 'array',
            items: {
              type: 'object',
              properties: {
                type: { type: 'string', description: 'Phone type (Work, Main, Fax, etc.)' },
                number: { type: 'string', description: 'Phone number' },
              },
              required: ['number'],
            },
            description: 'Phone numbers for the organization',
          },
          addresses: {
            type: 'array',
            items: {
              type: 'object',
              properties: {
                type: { type: 'string', description: 'Address type (Work, Main, etc.)' },
                street: { type: 'string', description: 'Street address' },
                city: { type: 'string', description: 'City' },
                state: { type: 'string', description: 'State or province' },
                zip: { type: 'string', description: 'ZIP or postal code' },
                country: { type: 'string', description: 'Country' },
              },
            },
            description: 'Addresses for the organization',
          },
          websites: {
            type: 'array',
            items: {
              type: 'object',
              properties: {
                type: { type: 'string', description: 'Website type (Work, Main, etc.)' },
                address: { type: 'string', description: 'Website URL or username' },
                service: { type: 'string', enum: ['URL', 'TWITTER', 'LINKEDIN', 'FACEBOOK'], description: 'Service type' },
              },
              required: ['address', 'service'],
            },
            description: 'Websites and social media for the organization',
          },
          tags: {
            type: 'array',
            items: {
              type: 'object',
              properties: {
                id: { type: 'integer', description: 'Tag ID' },
                name: { type: 'string', description: 'Tag name' },
              },
            },
            description: 'Tags to assign to the organization',
          },
          ownerId: {
            type: 'integer',
            description: 'ID of the user who should own this organization',
          },
          teamId: {
            type: 'integer',
            description: 'ID of the team this organization should be assigned to',
          },
        },
        required: ['name'],
      },
      execute: async (args, client) => {
        try {
          const partyData = {
            type: 'organisation',
            name: args.name,
          };

          // Add optional fields
          if (args.about) partyData.about = args.about;

          // Handle contact information
          if (args.emailAddresses) partyData.emailAddresses = args.emailAddresses;
          if (args.phoneNumbers) partyData.phoneNumbers = args.phoneNumbers;
          if (args.addresses) partyData.addresses = args.addresses;
          if (args.websites) partyData.websites = args.websites;

          // Handle tags
          if (args.tags) partyData.tags = args.tags;

          // Handle ownership
          if (args.ownerId) partyData.owner = { id: args.ownerId };
          if (args.teamId) partyData.team = { id: args.teamId };

          const result = await client.createParty(partyData, { embed: ['tags', 'fields'] });
          return client.formatMCPResponse(result, `Created organization: ${result.party.name}`);
        } catch (error) {
          return client.formatMCPError(error);
        }
      },
    },

    {
      name: 'capsule_update_party',
      description: 'Update an existing party (contact or organization)',
      inputSchema: {
        type: 'object',
        properties: {
          partyId: {
            type: 'integer',
            description: 'The ID of the party to update',
          },
          // Person fields
          firstName: {
            type: 'string',
            description: 'First name (for persons)',
          },
          lastName: {
            type: 'string',
            description: 'Last name (for persons)',
          },
          title: {
            type: 'string',
            description: 'Title (for persons)',
          },
          jobTitle: {
            type: 'string',
            description: 'Job title (for persons)',
          },
          // Organization fields
          name: {
            type: 'string',
            description: 'Name (for organizations)',
          },
          // Common fields
          about: {
            type: 'string',
            description: 'Description about the party',
          },
          emailAddresses: {
            type: 'array',
            items: {
              type: 'object',
              properties: {
                id: { type: 'integer', description: 'ID for updating existing email' },
                type: { type: 'string', description: 'Email type' },
                address: { type: 'string', description: 'Email address' },
                _delete: { type: 'boolean', description: 'Set to true to delete this email' },
              },
            },
            description: 'Email addresses (include ID to update existing, omit ID to add new)',
          },
          phoneNumbers: {
            type: 'array',
            items: {
              type: 'object',
              properties: {
                id: { type: 'integer', description: 'ID for updating existing phone' },
                type: { type: 'string', description: 'Phone type' },
                number: { type: 'string', description: 'Phone number' },
                _delete: { type: 'boolean', description: 'Set to true to delete this phone' },
              },
            },
            description: 'Phone numbers (include ID to update existing, omit ID to add new)',
          },
          addresses: {
            type: 'array',
            items: {
              type: 'object',
              properties: {
                id: { type: 'integer', description: 'ID for updating existing address' },
                type: { type: 'string', description: 'Address type' },
                street: { type: 'string', description: 'Street address' },
                city: { type: 'string', description: 'City' },
                state: { type: 'string', description: 'State or province' },
                zip: { type: 'string', description: 'ZIP or postal code' },
                country: { type: 'string', description: 'Country' },
                _delete: { type: 'boolean', description: 'Set to true to delete this address' },
              },
            },
            description: 'Addresses (include ID to update existing, omit ID to add new)',
          },
          websites: {
            type: 'array',
            items: {
              type: 'object',
              properties: {
                id: { type: 'integer', description: 'ID for updating existing website' },
                type: { type: 'string', description: 'Website type' },
                address: { type: 'string', description: 'Website URL or username' },
                service: { type: 'string', enum: ['URL', 'TWITTER', 'LINKEDIN', 'FACEBOOK'], description: 'Service type' },
                _delete: { type: 'boolean', description: 'Set to true to delete this website' },
              },
            },
            description: 'Websites (include ID to update existing, omit ID to add new)',
          },
          ownerId: {
            type: 'integer',
            description: 'ID of the user who should own this party',
          },
          teamId: {
            type: 'integer',
            description: 'ID of the team this party should be assigned to',
          },
        },
        required: ['partyId'],
      },
      execute: async (args, client) => {
        try {
          const { partyId, ...updateData } = args;
          const partyData = {};

          // Add fields that are provided
          Object.keys(updateData).forEach(key => {
            if (updateData[key] !== undefined && key !== 'ownerId' && key !== 'teamId') {
              partyData[key] = updateData[key];
            }
          });

          // Handle ownership
          if (args.ownerId) partyData.owner = { id: args.ownerId };
          if (args.teamId) partyData.team = { id: args.teamId };

          const result = await client.updateParty(partyId, partyData, { embed: ['tags', 'fields', 'organisation'] });
          const partyName = result.party.type === 'person' 
            ? `${result.party.firstName} ${result.party.lastName}` 
            : result.party.name;
          return client.formatMCPResponse(result, `Updated party: ${partyName}`);
        } catch (error) {
          return client.formatMCPError(error);
        }
      },
    },

    {
      name: 'capsule_delete_party',
      description: 'Delete a party (contact or organization) from Capsule CRM',
      inputSchema: {
        type: 'object',
        properties: {
          partyId: {
            type: 'integer',
            description: 'The ID of the party to delete',
          },
        },
        required: ['partyId'],
      },
      execute: async (args, client) => {
        try {
          await client.deleteParty(args.partyId);
          return {
            content: [
              {
                type: 'text',
                text: `Party with ID ${args.partyId} has been successfully deleted.`,
              },
            ],
          };
        } catch (error) {
          return client.formatMCPError(error);
        }
      },
    },

    {
      name: 'capsule_list_employees',
      description: 'List employees (people) of a specific organization',
      inputSchema: {
        type: 'object',
        properties: {
          organizationId: {
            type: 'integer',
            description: 'The ID of the organization',
          },
          page: {
            type: 'integer',
            description: 'Page number (default: 1)',
            minimum: 1,
          },
          perPage: {
            type: 'integer',
            description: 'Number of results per page (1-100, default: 50)',
            minimum: 1,
            maximum: 100,
          },
          embed: {
            type: 'array',
            items: {
              type: 'string',
              enum: ['tags', 'fields', 'organisation', 'missingImportantFields'],
            },
            description: 'Additional data to include in response',
          },
        },
        required: ['organizationId'],
      },
      execute: async (args, client) => {
        try {
          const result = await client.listEmployees(args.organizationId, {
            page: args.page,
            perPage: args.perPage,
            embed: args.embed,
          });
          return client.formatMCPResponse(result, `Found ${result.parties?.length || 0} employees for organization ID ${args.organizationId}`);
        } catch (error) {
          return client.formatMCPError(error);
        }
      },
    },
  ];
} 