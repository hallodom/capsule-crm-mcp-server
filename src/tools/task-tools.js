/**
 * Task Tools for Capsule CRM MCP Server
 * 
 * Tools for managing tasks in Capsule CRM
 */

export function createTaskTools() {
  return [
    {
      name: 'capsule_list_tasks',
      description: 'List tasks from Capsule CRM',
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
            description: 'ISO8601 date to filter tasks changed after this date',
          },
          embed: {
            type: 'array',
            items: {
              type: 'string',
              enum: ['tags', 'fields'],
            },
            description: 'Additional data to include in response',
          },
        },
        required: [],
      },
      execute: async (args, client) => {
        try {
          const result = await client.listTasks(args);
          return client.formatMCPResponse(result, `Found ${result.tasks?.length || 0} tasks`);
        } catch (error) {
          return client.formatMCPError(error);
        }
      },
    },

    {
      name: 'capsule_get_task',
      description: 'Get a specific task by ID',
      inputSchema: {
        type: 'object',
        properties: {
          taskId: {
            type: 'integer',
            description: 'The ID of the task to retrieve',
          },
          embed: {
            type: 'array',
            items: {
              type: 'string',
              enum: ['tags', 'fields'],
            },
            description: 'Additional data to include in response',
          },
        },
        required: ['taskId'],
      },
      execute: async (args, client) => {
        try {
          const result = await client.getTask(args.taskId, { embed: args.embed });
          return client.formatMCPResponse(result, `Retrieved task: ${result.task.description}`);
        } catch (error) {
          return client.formatMCPError(error);
        }
      },
    },

    {
      name: 'capsule_create_task',
      description: 'Create a new task in Capsule CRM',
      inputSchema: {
        type: 'object',
        properties: {
          description: {
            type: 'string',
            description: 'Description of the task',
          },
          detail: {
            type: 'string',
            description: 'Detailed description of the task',
          },
          dueOn: {
            type: 'string',
            description: 'Due date for the task (YYYY-MM-DD)',
          },
          categoryId: {
            type: 'integer',
            description: 'ID of the task category',
          },
          partyId: {
            type: 'integer',
            description: 'ID of the party this task is related to',
          },
          opportunityId: {
            type: 'integer',
            description: 'ID of the opportunity this task is related to',
          },
          kaseId: {
            type: 'integer',
            description: 'ID of the project (kase) this task is related to',
          },
          ownerId: {
            type: 'integer',
            description: 'ID of the user who should own this task',
          },
          teamId: {
            type: 'integer',
            description: 'ID of the team this task should be assigned to',
          },
          completed: {
            type: 'boolean',
            description: 'Whether the task is completed',
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
            description: 'Tags to assign to the task',
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
            description: 'Custom fields for the task',
          },
        },
        required: ['description'],
      },
      execute: async (args, client) => {
        try {
          const taskData = {
            description: args.description,
          };

          // Add optional fields
          if (args.detail) taskData.detail = args.detail;
          if (args.dueOn) taskData.dueOn = args.dueOn;
          if (args.completed !== undefined) taskData.completed = args.completed;

          // Handle relationships
          if (args.categoryId) taskData.category = { id: args.categoryId };
          if (args.partyId) taskData.party = { id: args.partyId };
          if (args.opportunityId) taskData.opportunity = { id: args.opportunityId };
          if (args.kaseId) taskData.kase = { id: args.kaseId };

          // Handle ownership
          if (args.ownerId) taskData.owner = { id: args.ownerId };
          if (args.teamId) taskData.team = { id: args.teamId };

          // Handle tags
          if (args.tags) taskData.tags = args.tags;

          // Handle custom fields
          if (args.customFields) taskData.fields = args.customFields;

          const result = await client.createTask(taskData, { embed: ['tags', 'fields'] });
          return client.formatMCPResponse(result, `Created task: ${result.task.description}`);
        } catch (error) {
          return client.formatMCPError(error);
        }
      },
    },

    {
      name: 'capsule_update_task',
      description: 'Update an existing task',
      inputSchema: {
        type: 'object',
        properties: {
          taskId: {
            type: 'integer',
            description: 'The ID of the task to update',
          },
          description: {
            type: 'string',
            description: 'Description of the task',
          },
          detail: {
            type: 'string',
            description: 'Detailed description of the task',
          },
          dueOn: {
            type: 'string',
            description: 'Due date for the task (YYYY-MM-DD)',
          },
          categoryId: {
            type: 'integer',
            description: 'ID of the task category',
          },
          partyId: {
            type: 'integer',
            description: 'ID of the party this task is related to',
          },
          opportunityId: {
            type: 'integer',
            description: 'ID of the opportunity this task is related to',
          },
          kaseId: {
            type: 'integer',
            description: 'ID of the project (kase) this task is related to',
          },
          ownerId: {
            type: 'integer',
            description: 'ID of the user who should own this task',
          },
          teamId: {
            type: 'integer',
            description: 'ID of the team this task should be assigned to',
          },
          completed: {
            type: 'boolean',
            description: 'Whether the task is completed',
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
        required: ['taskId'],
      },
      execute: async (args, client) => {
        try {
          const { taskId, ...updateData } = args;
          const taskData = {};

          // Add fields that are provided
          Object.keys(updateData).forEach(key => {
            if (updateData[key] !== undefined && !['ownerId', 'teamId', 'partyId', 'opportunityId', 'kaseId', 'categoryId', 'customFields'].includes(key)) {
              taskData[key] = updateData[key];
            }
          });

          // Handle relationships
          if (args.categoryId) taskData.category = { id: args.categoryId };
          if (args.partyId) taskData.party = { id: args.partyId };
          if (args.opportunityId) taskData.opportunity = { id: args.opportunityId };
          if (args.kaseId) taskData.kase = { id: args.kaseId };

          // Handle ownership
          if (args.ownerId) taskData.owner = { id: args.ownerId };
          if (args.teamId) taskData.team = { id: args.teamId };

          // Handle custom fields
          if (args.customFields) taskData.fields = args.customFields;

          const result = await client.updateTask(taskId, taskData, { embed: ['tags', 'fields'] });
          return client.formatMCPResponse(result, `Updated task: ${result.task.description}`);
        } catch (error) {
          return client.formatMCPError(error);
        }
      },
    },

    {
      name: 'capsule_delete_task',
      description: 'Delete a task from Capsule CRM',
      inputSchema: {
        type: 'object',
        properties: {
          taskId: {
            type: 'integer',
            description: 'The ID of the task to delete',
          },
        },
        required: ['taskId'],
      },
      execute: async (args, client) => {
        try {
          await client.deleteTask(args.taskId);
          return {
            content: [
              {
                type: 'text',
                text: `Task with ID ${args.taskId} has been successfully deleted.`,
              },
            ],
          };
        } catch (error) {
          return client.formatMCPError(error);
        }
      },
    },

    {
      name: 'capsule_mark_task_complete',
      description: 'Mark a task as completed',
      inputSchema: {
        type: 'object',
        properties: {
          taskId: {
            type: 'integer',
            description: 'The ID of the task to mark as complete',
          },
        },
        required: ['taskId'],
      },
      execute: async (args, client) => {
        try {
          const result = await client.updateTask(args.taskId, { completed: true });
          return client.formatMCPResponse(result, `Task marked as complete: ${result.task.description}`);
        } catch (error) {
          return client.formatMCPError(error);
        }
      },
    },

    {
      name: 'capsule_mark_task_incomplete',
      description: 'Mark a task as incomplete',
      inputSchema: {
        type: 'object',
        properties: {
          taskId: {
            type: 'integer',
            description: 'The ID of the task to mark as incomplete',
          },
        },
        required: ['taskId'],
      },
      execute: async (args, client) => {
        try {
          const result = await client.updateTask(args.taskId, { completed: false });
          return client.formatMCPResponse(result, `Task marked as incomplete: ${result.task.description}`);
        } catch (error) {
          return client.formatMCPError(error);
        }
      },
    },

    // Additional utility tools
    {
      name: 'capsule_list_tag_definitions',
      description: 'List all tag definitions in Capsule CRM',
      inputSchema: {
        type: 'object',
        properties: {},
        required: [],
      },
      execute: async (args, client) => {
        try {
          const result = await client.listTagDefinitions();
          return client.formatMCPResponse(result, `Found ${result.tags?.length || 0} tag definitions`);
        } catch (error) {
          return client.formatMCPError(error);
        }
      },
    },

    {
      name: 'capsule_list_custom_fields',
      description: 'List all custom field definitions in Capsule CRM',
      inputSchema: {
        type: 'object',
        properties: {},
        required: [],
      },
      execute: async (args, client) => {
        try {
          const result = await client.listCustomFields();
          return client.formatMCPResponse(result, `Found ${result.fields?.length || 0} custom field definitions`);
        } catch (error) {
          return client.formatMCPError(error);
        }
      },
    },

    {
      name: 'capsule_list_users',
      description: 'List all users in Capsule CRM',
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
        },
        required: [],
      },
      execute: async (args, client) => {
        try {
          const result = await client.listUsers(args);
          return client.formatMCPResponse(result, `Found ${result.users?.length || 0} users`);
        } catch (error) {
          return client.formatMCPError(error);
        }
      },
    },

    {
      name: 'capsule_create_entry',
      description: 'Create a new entry (note/history) in Capsule CRM',
      inputSchema: {
        type: 'object',
        properties: {
          content: {
            type: 'string',
            description: 'Content of the entry/note',
          },
          type: {
            type: 'string',
            description: 'Type of entry (e.g., note, call, meeting)',
          },
          partyId: {
            type: 'integer',
            description: 'ID of the party this entry is related to',
          },
          opportunityId: {
            type: 'integer',
            description: 'ID of the opportunity this entry is related to',
          },
          kaseId: {
            type: 'integer',
            description: 'ID of the project (kase) this entry is related to',
          },
        },
        required: ['content'],
      },
      execute: async (args, client) => {
        try {
          const entryData = {
            content: args.content,
          };

          if (args.type) entryData.type = args.type;
          if (args.partyId) entryData.party = { id: args.partyId };
          if (args.opportunityId) entryData.opportunity = { id: args.opportunityId };
          if (args.kaseId) entryData.kase = { id: args.kaseId };

          const result = await client.createEntry(entryData);
          return client.formatMCPResponse(result, `Created entry: ${result.entry.content?.substring(0, 50) || 'New entry'}...`);
        } catch (error) {
          return client.formatMCPError(error);
        }
      },
    },

    {
      name: 'capsule_list_entries',
      description: 'List entries (notes/history) from Capsule CRM',
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
            description: 'ISO8601 date to filter entries changed after this date',
          },
        },
        required: [],
      },
      execute: async (args, client) => {
        try {
          const result = await client.listEntries(args);
          return client.formatMCPResponse(result, `Found ${result.entries?.length || 0} entries`);
        } catch (error) {
          return client.formatMCPError(error);
        }
      },
    },
  ];
} 