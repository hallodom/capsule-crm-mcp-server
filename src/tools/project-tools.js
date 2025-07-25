/**
 * Project Tools for Capsule CRM MCP Server
 * 
 * Tools for managing projects (kases) in Capsule CRM
 */

export function createProjectTools() {
  return [
    {
      name: 'capsule_list_projects',
      description: 'List projects from Capsule CRM',
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
            description: 'ISO8601 date to filter projects changed after this date',
          },
          embed: {
            type: 'array',
            items: {
              type: 'string',
              enum: ['tags', 'fields', 'party', 'opportunity', 'missingImportantFields'],
            },
            description: 'Additional data to include in response',
          },
        },
        required: [],
      },
      execute: async (args, client) => {
        try {
          const result = await client.listProjects(args);
          return client.formatMCPResponse(result, `Found ${result.kases?.length || 0} projects`);
        } catch (error) {
          return client.formatMCPError(error);
        }
      },
    },

    {
      name: 'capsule_get_project',
      description: 'Get a specific project by ID',
      inputSchema: {
        type: 'object',
        properties: {
          projectId: {
            type: 'integer',
            description: 'The ID of the project to retrieve',
          },
          embed: {
            type: 'array',
            items: {
              type: 'string',
              enum: ['tags', 'fields', 'party', 'opportunity', 'missingImportantFields'],
            },
            description: 'Additional data to include in response',
          },
        },
        required: ['projectId'],
      },
      execute: async (args, client) => {
        try {
          const result = await client.getProject(args.projectId, { embed: args.embed });
          return client.formatMCPResponse(result, `Retrieved project: ${result.kase.name}`);
        } catch (error) {
          return client.formatMCPError(error);
        }
      },
    },

    {
      name: 'capsule_list_projects_by_party',
      description: 'List projects associated with a specific party (contact or organization)',
      inputSchema: {
        type: 'object',
        properties: {
          partyId: {
            type: 'integer',
            description: 'The ID of the party',
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
              enum: ['tags', 'fields', 'party', 'opportunity', 'missingImportantFields'],
            },
            description: 'Additional data to include in response',
          },
        },
        required: ['partyId'],
      },
      execute: async (args, client) => {
        try {
          const result = await client.listProjectsByParty(args.partyId, {
            page: args.page,
            perPage: args.perPage,
            embed: args.embed,
          });
          return client.formatMCPResponse(result, `Found ${result.kases?.length || 0} projects for party ID ${args.partyId}`);
        } catch (error) {
          return client.formatMCPError(error);
        }
      },
    },

    {
      name: 'capsule_search_projects',
      description: 'Search for projects using a query string',
      inputSchema: {
        type: 'object',
        properties: {
          query: {
            type: 'string',
            description: 'Search query (project name, description, etc.)',
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
              enum: ['tags', 'fields', 'party', 'opportunity', 'missingImportantFields'],
            },
            description: 'Additional data to include in response',
          },
        },
        required: ['query'],
      },
      execute: async (args, client) => {
        try {
          const result = await client.searchProjects(args.query, {
            page: args.page,
            perPage: args.perPage,
            embed: args.embed,
          });
          return client.formatMCPResponse(result, `Found ${result.kases?.length || 0} projects matching "${args.query}"`);
        } catch (error) {
          return client.formatMCPError(error);
        }
      },
    },

    {
      name: 'capsule_create_project',
      description: 'Create a new project in Capsule CRM',
      inputSchema: {
        type: 'object',
        properties: {
          name: {
            type: 'string',
            description: 'Name of the project',
          },
          description: {
            type: 'string',
            description: 'Description of the project',
          },
          partyId: {
            type: 'integer',
            description: 'ID of the main contact (party) for this project',
          },
          opportunityId: {
            type: 'integer',
            description: 'ID of the associated opportunity',
          },
          ownerId: {
            type: 'integer',
            description: 'ID of the user who should own this project',
          },
          teamId: {
            type: 'integer',
            description: 'ID of the team this project should be assigned to',
          },
          status: {
            type: 'string',
            enum: ['OPEN', 'CLOSED'],
            description: 'Status of the project',
          },
          stageId: {
            type: 'integer',
            description: 'ID of the project stage',
          },
          expectedCloseOn: {
            type: 'string',
            description: 'Expected close date (YYYY-MM-DD)',
          },
          closedOn: {
            type: 'string',
            description: 'Actual close date (YYYY-MM-DD)',
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
            description: 'Tags to assign to the project',
          },
          customFields: {
            type: 'array',
            items: {
              type: 'object',
              properties: {
                definition: {
                  oneOf: [
                    { type: 'integer', description: 'Field definition ID' },
                    {
                      type: 'object',
                      properties: {
                        id: { type: 'integer', description: 'Field definition ID' },
                        name: { type: 'string', description: 'Field definition name' },
                        tag: { 
                          oneOf: [
                            { type: 'null' },
                            { type: 'integer', description: 'Tag ID if field belongs to a DataTag' }
                          ]
                        },
                      },
                    },
                  ],
                },
                value: { type: 'string', description: 'Field value' },
              },
              required: ['definition', 'value'],
            },
            description: 'Custom fields for the project',
          },
        },
        required: ['name', 'partyId'],
      },
      execute: async (args, client) => {
        try {
          const projectData = {
            name: args.name,
            party: { id: args.partyId },
          };

          // Add optional fields
          if (args.description) projectData.description = args.description;
          if (args.status) projectData.status = args.status;
          if (args.expectedCloseOn) projectData.expectedCloseOn = args.expectedCloseOn;
          if (args.closedOn) projectData.closedOn = args.closedOn;

          // Handle relationships
          if (args.opportunityId) projectData.opportunity = { id: args.opportunityId };
          if (args.stageId) projectData.stage = { id: args.stageId };

          // Handle ownership
          if (args.ownerId) projectData.owner = { id: args.ownerId };
          if (args.teamId) projectData.team = { id: args.teamId };

          // Handle tags
          if (args.tags) projectData.tags = args.tags;

          // Handle custom fields
          if (args.customFields) projectData.fields = args.customFields;

          const result = await client.createProject(projectData, { embed: ['tags', 'fields', 'party', 'opportunity'] });
          return client.formatMCPResponse(result, `Created project: ${result.kase.name}`);
        } catch (error) {
          return client.formatMCPError(error);
        }
      },
    },

    {
      name: 'capsule_update_project',
      description: 'Update an existing project',
      inputSchema: {
        type: 'object',
        properties: {
          projectId: {
            type: 'integer',
            description: 'The ID of the project to update',
          },
          name: {
            type: 'string',
            description: 'Name of the project',
          },
          description: {
            type: 'string',
            description: 'Description of the project',
          },
          partyId: {
            type: 'integer',
            description: 'ID of the main contact (party) for this project',
          },
          opportunityId: {
            type: 'integer',
            description: 'ID of the associated opportunity',
          },
          ownerId: {
            type: 'integer',
            description: 'ID of the user who should own this project',
          },
          teamId: {
            type: 'integer',
            description: 'ID of the team this project should be assigned to',
          },
          status: {
            type: 'string',
            enum: ['OPEN', 'CLOSED'],
            description: 'Status of the project',
          },
          stageId: {
            type: 'integer',
            description: 'ID of the project stage',
          },
          expectedCloseOn: {
            type: 'string',
            description: 'Expected close date (YYYY-MM-DD)',
          },
          closedOn: {
            type: 'string',
            description: 'Actual close date (YYYY-MM-DD)',
          },
          tags: {
            type: 'array',
            items: {
              type: 'object',
              properties: {
                id: { type: 'integer', description: 'Tag ID for updating existing tag' },
                name: { type: 'string', description: 'Tag name for new tag' },
                _delete: { type: 'boolean', description: 'Set to true to delete this tag' },
              },
            },
            description: 'Tags (include ID to update existing, omit ID to add new)',
          },
          customFields: {
            type: 'array',
            items: {
              type: 'object',
              properties: {
                id: { type: 'integer', description: 'Field ID for updating existing field' },
                definition: {
                  oneOf: [
                    { type: 'integer', description: 'Field definition ID' },
                    {
                      type: 'object',
                      properties: {
                        id: { type: 'integer', description: 'Field definition ID' },
                        name: { type: 'string', description: 'Field definition name' },
                        tag: { 
                          oneOf: [
                            { type: 'null' },
                            { type: 'integer', description: 'Tag ID if field belongs to a DataTag' }
                          ]
                        },
                      },
                    },
                  ],
                },
                value: { type: 'string', description: 'Field value' },
                _delete: { type: 'boolean', description: 'Set to true to delete this field' },
              },
            },
            description: 'Custom fields (include ID to update existing, omit ID to add new)',
          },
        },
        required: ['projectId'],
      },
      execute: async (args, client) => {
        try {
          const { projectId, ...updateData } = args;
          const projectData = {};

          // Add fields that are provided
          Object.keys(updateData).forEach(key => {
            if (updateData[key] !== undefined && !['ownerId', 'teamId', 'partyId', 'opportunityId', 'stageId', 'customFields'].includes(key)) {
              projectData[key] = updateData[key];
            }
          });

          // Handle relationships
          if (args.partyId) projectData.party = { id: args.partyId };
          if (args.opportunityId) projectData.opportunity = { id: args.opportunityId };
          if (args.stageId) projectData.stage = { id: args.stageId };

          // Handle ownership
          if (args.ownerId) projectData.owner = { id: args.ownerId };
          if (args.teamId) projectData.team = { id: args.teamId };

          // Handle custom fields
          if (args.customFields) projectData.fields = args.customFields;

          const result = await client.updateProject(projectId, projectData, { embed: ['tags', 'fields', 'party', 'opportunity'] });
          return client.formatMCPResponse(result, `Updated project: ${result.kase.name}`);
        } catch (error) {
          return client.formatMCPError(error);
        }
      },
    },

    {
      name: 'capsule_delete_project',
      description: 'Delete a project from Capsule CRM',
      inputSchema: {
        type: 'object',
        properties: {
          projectId: {
            type: 'integer',
            description: 'The ID of the project to delete',
          },
        },
        required: ['projectId'],
      },
      execute: async (args, client) => {
        try {
          await client.deleteProject(args.projectId);
          return {
            content: [
              {
                type: 'text',
                text: `Project with ID ${args.projectId} has been successfully deleted.`,
              },
            ],
          };
        } catch (error) {
          return client.formatMCPError(error);
        }
      },
    },
  ];
} 