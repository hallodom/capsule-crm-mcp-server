/**
 * Opportunity Tools for Capsule CRM MCP Server
 * 
 * Tools for managing opportunities in Capsule CRM
 */

export function createOpportunityTools() {
  return [
    {
      name: 'capsule_list_opportunities',
      description: 'List opportunities from Capsule CRM',
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
            description: 'ISO8601 date to filter opportunities changed after this date',
          },
          embed: {
            type: 'array',
            items: {
              type: 'string',
              enum: ['tags', 'fields', 'party', 'milestone', 'missingImportantFields'],
            },
            description: 'Additional data to include in response',
          },
        },
        required: [],
      },
      execute: async (args, client) => {
        try {
          const result = await client.listOpportunities(args);
          return client.formatMCPResponse(result, `Found ${result.opportunities?.length || 0} opportunities`);
        } catch (error) {
          return client.formatMCPError(error);
        }
      },
    },

    {
      name: 'capsule_get_opportunity',
      description: 'Get a specific opportunity by ID',
      inputSchema: {
        type: 'object',
        properties: {
          opportunityId: {
            type: 'integer',
            description: 'The ID of the opportunity to retrieve',
          },
          embed: {
            type: 'array',
            items: {
              type: 'string',
              enum: ['tags', 'fields', 'party', 'milestone', 'missingImportantFields'],
            },
            description: 'Additional data to include in response',
          },
        },
        required: ['opportunityId'],
      },
      execute: async (args, client) => {
        try {
          const result = await client.getOpportunity(args.opportunityId, { embed: args.embed });
          return client.formatMCPResponse(result, `Retrieved opportunity: ${result.opportunity.name}`);
        } catch (error) {
          return client.formatMCPError(error);
        }
      },
    },

    {
      name: 'capsule_list_opportunities_by_party',
      description: 'List opportunities associated with a specific party (contact or organization)',
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
              enum: ['tags', 'fields', 'party', 'milestone', 'missingImportantFields'],
            },
            description: 'Additional data to include in response',
          },
        },
        required: ['partyId'],
      },
      execute: async (args, client) => {
        try {
          const result = await client.listOpportunitiesByParty(args.partyId, {
            page: args.page,
            perPage: args.perPage,
            embed: args.embed,
          });
          return client.formatMCPResponse(result, `Found ${result.opportunities?.length || 0} opportunities for party ID ${args.partyId}`);
        } catch (error) {
          return client.formatMCPError(error);
        }
      },
    },

    {
      name: 'capsule_search_opportunities',
      description: 'Search for opportunities using a query string',
      inputSchema: {
        type: 'object',
        properties: {
          query: {
            type: 'string',
            description: 'Search query (opportunity name, description, etc.)',
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
              enum: ['tags', 'fields', 'party', 'milestone', 'missingImportantFields'],
            },
            description: 'Additional data to include in response',
          },
        },
        required: ['query'],
      },
      execute: async (args, client) => {
        try {
          const result = await client.searchOpportunities(args.query, {
            page: args.page,
            perPage: args.perPage,
            embed: args.embed,
          });
          return client.formatMCPResponse(result, `Found ${result.opportunities?.length || 0} opportunities matching "${args.query}"`);
        } catch (error) {
          return client.formatMCPError(error);
        }
      },
    },

    {
      name: 'capsule_create_opportunity',
      description: 'Create a new opportunity in Capsule CRM',
      inputSchema: {
        type: 'object',
        properties: {
          name: {
            type: 'string',
            description: 'Name of the opportunity',
          },
          description: {
            type: 'string',
            description: 'Description of the opportunity',
          },
          partyId: {
            type: 'integer',
            description: 'ID of the main contact (party) for this opportunity',
          },
          milestoneId: {
            type: 'integer',
            description: 'ID of the milestone/stage for this opportunity',
          },
          ownerId: {
            type: 'integer',
            description: 'ID of the user who should own this opportunity',
          },
          teamId: {
            type: 'integer',
            description: 'ID of the team this opportunity should be assigned to',
          },
          value: {
            type: 'object',
            properties: {
              amount: {
                type: 'number',
                description: 'The monetary value of the opportunity',
              },
              currency: {
                type: 'string',
                description: 'Currency code (e.g., USD, GBP, EUR)',
              },
            },
            description: 'The value of the opportunity',
          },
          expectedCloseOn: {
            type: 'string',
            description: 'Expected close date (YYYY-MM-DD)',
          },
          probability: {
            type: 'integer',
            description: 'Probability of winning (0-100)',
            minimum: 0,
            maximum: 100,
          },
          durationBasis: {
            type: 'string',
            enum: ['FIXED', 'HOUR', 'DAY', 'WEEK', 'MONTH', 'QUARTER', 'YEAR'],
            description: 'Time unit used by the duration field',
          },
          duration: {
            type: 'integer',
            description: 'Duration of the opportunity (must be null if durationBasis is FIXED)',
          },
          lostReasonId: {
            type: 'integer',
            description: 'ID of the lost reason (if the opportunity is lost)',
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
            description: 'Tags to assign to the opportunity',
          },
          tracks: {
            type: 'array',
            items: {
              type: 'object',
              properties: {
                definition: {
                  oneOf: [
                    { type: 'integer', description: 'Track definition ID' },
                    { 
                      type: 'object', 
                      properties: { id: { type: 'integer' } }, 
                      required: ['id'] 
                    }
                  ]
                }
              },
              required: ['definition'],
            },
            description: 'Tracks to apply to the opportunity',
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
            description: 'Custom fields for the opportunity',
          },
        },
        required: ['name', 'partyId', 'milestoneId'],
      },
      execute: async (args, client) => {
        try {
          const opportunityData = {
            name: args.name,
            party: { id: args.partyId },
            milestone: { id: args.milestoneId },
          };

          // Add optional fields
          if (args.description) opportunityData.description = args.description;
          if (args.value) opportunityData.value = args.value;
          if (args.expectedCloseOn) opportunityData.expectedCloseOn = args.expectedCloseOn;
          if (args.probability !== undefined) opportunityData.probability = args.probability;
          if (args.durationBasis) opportunityData.durationBasis = args.durationBasis;
          if (args.duration !== undefined) opportunityData.duration = args.duration;
          if (args.lostReasonId) opportunityData.lostReason = { id: args.lostReasonId };

          // Handle ownership
          if (args.ownerId) opportunityData.owner = { id: args.ownerId };
          if (args.teamId) opportunityData.team = { id: args.teamId };

          // Handle tags
          if (args.tags) opportunityData.tags = args.tags;

          // Handle tracks (special field for creation)
          if (args.tracks) opportunityData.tracks = args.tracks;

          // Handle custom fields
          if (args.customFields) opportunityData.fields = args.customFields;

          const result = await client.createOpportunity(opportunityData, { embed: ['tags', 'fields', 'party', 'milestone'] });
          return client.formatMCPResponse(result, `Created opportunity: ${result.opportunity.name}`);
        } catch (error) {
          return client.formatMCPError(error);
        }
      },
    },

    {
      name: 'capsule_update_opportunity',
      description: 'Update an existing opportunity',
      inputSchema: {
        type: 'object',
        properties: {
          opportunityId: {
            type: 'integer',
            description: 'The ID of the opportunity to update',
          },
          name: {
            type: 'string',
            description: 'Name of the opportunity',
          },
          description: {
            type: 'string',
            description: 'Description of the opportunity',
          },
          partyId: {
            type: 'integer',
            description: 'ID of the main contact (party) for this opportunity',
          },
          milestoneId: {
            type: 'integer',
            description: 'ID of the milestone/stage for this opportunity',
          },
          ownerId: {
            type: 'integer',
            description: 'ID of the user who should own this opportunity',
          },
          teamId: {
            type: 'integer',
            description: 'ID of the team this opportunity should be assigned to',
          },
          value: {
            type: 'object',
            properties: {
              amount: {
                type: 'number',
                description: 'The monetary value of the opportunity',
              },
              currency: {
                type: 'string',
                description: 'Currency code (e.g., USD, GBP, EUR)',
              },
            },
            description: 'The value of the opportunity',
          },
          expectedCloseOn: {
            type: 'string',
            description: 'Expected close date (YYYY-MM-DD)',
          },
          probability: {
            type: 'integer',
            description: 'Probability of winning (0-100)',
            minimum: 0,
            maximum: 100,
          },
          durationBasis: {
            type: 'string',
            enum: ['FIXED', 'HOUR', 'DAY', 'WEEK', 'MONTH', 'QUARTER', 'YEAR'],
            description: 'Time unit used by the duration field',
          },
          duration: {
            type: 'integer',
            description: 'Duration of the opportunity (must be null if durationBasis is FIXED)',
          },
          lostReasonId: {
            type: 'integer',
            description: 'ID of the lost reason (if the opportunity is lost)',
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
        required: ['opportunityId'],
      },
      execute: async (args, client) => {
        try {
          const { opportunityId, ...updateData } = args;
          const opportunityData = {};

          // Add fields that are provided
          Object.keys(updateData).forEach(key => {
            if (updateData[key] !== undefined && !['ownerId', 'teamId', 'partyId', 'milestoneId', 'lostReasonId', 'customFields'].includes(key)) {
              opportunityData[key] = updateData[key];
            }
          });

          // Handle relationships
          if (args.partyId) opportunityData.party = { id: args.partyId };
          if (args.milestoneId) opportunityData.milestone = { id: args.milestoneId };
          if (args.lostReasonId) opportunityData.lostReason = { id: args.lostReasonId };

          // Handle ownership
          if (args.ownerId) opportunityData.owner = { id: args.ownerId };
          if (args.teamId) opportunityData.team = { id: args.teamId };

          // Handle custom fields
          if (args.customFields) opportunityData.fields = args.customFields;

          const result = await client.updateOpportunity(opportunityId, opportunityData, { embed: ['tags', 'fields', 'party', 'milestone'] });
          return client.formatMCPResponse(result, `Updated opportunity: ${result.opportunity.name}`);
        } catch (error) {
          return client.formatMCPError(error);
        }
      },
    },

    {
      name: 'capsule_delete_opportunity',
      description: 'Delete an opportunity from Capsule CRM',
      inputSchema: {
        type: 'object',
        properties: {
          opportunityId: {
            type: 'integer',
            description: 'The ID of the opportunity to delete',
          },
        },
        required: ['opportunityId'],
      },
      execute: async (args, client) => {
        try {
          await client.deleteOpportunity(args.opportunityId);
          return {
            content: [
              {
                type: 'text',
                text: `Opportunity with ID ${args.opportunityId} has been successfully deleted.`,
              },
            ],
          };
        } catch (error) {
          return client.formatMCPError(error);
        }
      },
    },

    {
      name: 'capsule_list_opportunity_parties',
      description: 'List additional parties (contacts) associated with an opportunity',
      inputSchema: {
        type: 'object',
        properties: {
          opportunityId: {
            type: 'integer',
            description: 'The ID of the opportunity',
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
        required: ['opportunityId'],
      },
      execute: async (args, client) => {
        try {
          const result = await client.listOpportunityParties(args.opportunityId, {
            page: args.page,
            perPage: args.perPage,
            embed: args.embed,
          });
          return client.formatMCPResponse(result, `Found ${result.parties?.length || 0} additional parties for opportunity ID ${args.opportunityId}`);
        } catch (error) {
          return client.formatMCPError(error);
        }
      },
    },

    {
      name: 'capsule_add_party_to_opportunity',
      description: 'Add an additional party (contact) to an opportunity',
      inputSchema: {
        type: 'object',
        properties: {
          opportunityId: {
            type: 'integer',
            description: 'The ID of the opportunity',
          },
          partyId: {
            type: 'integer',
            description: 'The ID of the party to add',
          },
        },
        required: ['opportunityId', 'partyId'],
      },
      execute: async (args, client) => {
        try {
          await client.addPartyToOpportunity(args.opportunityId, args.partyId);
          return {
            content: [
              {
                type: 'text',
                text: `Party ${args.partyId} has been added to opportunity ${args.opportunityId}.`,
              },
            ],
          };
        } catch (error) {
          return client.formatMCPError(error);
        }
      },
    },

    {
      name: 'capsule_remove_party_from_opportunity',
      description: 'Remove an additional party (contact) from an opportunity',
      inputSchema: {
        type: 'object',
        properties: {
          opportunityId: {
            type: 'integer',
            description: 'The ID of the opportunity',
          },
          partyId: {
            type: 'integer',
            description: 'The ID of the party to remove',
          },
        },
        required: ['opportunityId', 'partyId'],
      },
      execute: async (args, client) => {
        try {
          await client.removePartyFromOpportunity(args.opportunityId, args.partyId);
          return {
            content: [
              {
                type: 'text',
                text: `Party ${args.partyId} has been removed from opportunity ${args.opportunityId}.`,
              },
            ],
          };
        } catch (error) {
          return client.formatMCPError(error);
        }
      },
    },

    {
      name: 'capsule_list_pipelines',
      description: 'List all sales pipelines in Capsule CRM',
      inputSchema: {
        type: 'object',
        properties: {},
        required: [],
      },
      execute: async (args, client) => {
        try {
          const result = await client.listPipelines();
          return client.formatMCPResponse(result, `Found ${result.pipelines?.length || 0} pipelines`);
        } catch (error) {
          return client.formatMCPError(error);
        }
      },
    },

    {
      name: 'capsule_list_milestones',
      description: 'List all opportunity milestones/stages',
      inputSchema: {
        type: 'object',
        properties: {
          pipelineId: {
            type: 'integer',
            description: 'Filter milestones by specific pipeline ID',
          },
        },
        required: [],
      },
      execute: async (args, client) => {
        try {
          let result;
          if (args.pipelineId) {
            result = await client.listMilestonesByPipeline(args.pipelineId);
          } else {
            result = await client.listMilestones();
          }
          return client.formatMCPResponse(result, `Found ${result.milestones?.length || 0} milestones`);
        } catch (error) {
          return client.formatMCPError(error);
        }
      },
    },
  ];
} 