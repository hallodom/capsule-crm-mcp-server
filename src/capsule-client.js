import axios from 'axios';

/**
 * Capsule CRM API Client
 * 
 * A comprehensive wrapper for the Capsule CRM v2 API
 * Documentation: https://developer.capsulecrm.com/
 */
export class CapsuleCRMClient {
  constructor(apiToken) {
    this.apiToken = apiToken;
    this.baseURL = 'https://api.capsulecrm.com/api/v2';
    
    this.httpClient = axios.create({
      baseURL: this.baseURL,
      headers: {
        'Authorization': `Bearer ${apiToken}`,
        'Content-Type': 'application/json',
        'Accept': 'application/json',
      },
      timeout: 30000, // 30 seconds
    });

    this.setupInterceptors();
  }

  setupInterceptors() {
    // Request interceptor for logging
    this.httpClient.interceptors.request.use(
      (config) => {
        console.error(`[Capsule API] ${config.method?.toUpperCase()} ${config.url}`);
        return config;
      },
      (error) => Promise.reject(error)
    );

    // Response interceptor for error handling
    this.httpClient.interceptors.response.use(
      (response) => response,
      (error) => {
        if (error.response) {
          const { status, data } = error.response;
          let message = `HTTP ${status}`;
          
          if (data?.error_description) {
            message += `: ${data.error_description}`;
          } else if (data?.error) {
            message += `: ${data.error}`;
          } else if (data?.message) {
            message += `: ${data.message}`;
          }
          
          throw new Error(message);
        } else if (error.request) {
          throw new Error('Network error: Unable to reach Capsule CRM API');
        } else {
          throw new Error(`Request error: ${error.message}`);
        }
      }
    );
  }

  // ===== USER METHODS =====
  
  /**
   * Get current authenticated user
   */
  async getCurrentUser() {
    const response = await this.httpClient.get('/users/me');
    return response.data.user;
  }

  /**
   * List all users
   */
  async listUsers(options = {}) {
    const params = this.buildParams(options);
    const response = await this.httpClient.get('/users', { params });
    return response.data;
  }

  // ===== PARTY METHODS (Contacts & Organizations) =====

  /**
   * List parties (contacts and organizations)
   */
  async listParties(options = {}) {
    const params = this.buildParams(options);
    const response = await this.httpClient.get('/parties', { params });
    return response.data;
  }

  /**
   * Get a specific party by ID
   */
  async getParty(partyId, options = {}) {
    const params = this.buildParams(options);
    const response = await this.httpClient.get(`/parties/${partyId}`, { params });
    return response.data;
  }

  /**
   * Get multiple parties by IDs
   */
  async getMultipleParties(partyIds, options = {}) {
    const params = this.buildParams(options);
    const ids = Array.isArray(partyIds) ? partyIds.join(',') : partyIds;
    const response = await this.httpClient.get(`/parties/${ids}`, { params });
    return response.data;
  }

  /**
   * Create a new party
   */
  async createParty(partyData, options = {}) {
    const params = this.buildParams(options);
    const response = await this.httpClient.post('/parties', { party: partyData }, { params });
    return response.data;
  }

  /**
   * Update an existing party
   */
  async updateParty(partyId, partyData, options = {}) {
    const params = this.buildParams(options);
    const response = await this.httpClient.put(`/parties/${partyId}`, { party: partyData }, { params });
    return response.data;
  }

  /**
   * Delete a party
   */
  async deleteParty(partyId) {
    await this.httpClient.delete(`/parties/${partyId}`);
  }

  /**
   * Search parties
   */
  async searchParties(query, options = {}) {
    const params = this.buildParams({ q: query, ...options });
    const response = await this.httpClient.get('/parties/search', { params });
    return response.data;
  }

  /**
   * List employees of an organization
   */
  async listEmployees(organizationId, options = {}) {
    const params = this.buildParams(options);
    const response = await this.httpClient.get(`/parties/${organizationId}/people`, { params });
    return response.data;
  }

  // ===== OPPORTUNITY METHODS =====

  /**
   * List opportunities
   */
  async listOpportunities(options = {}) {
    const params = this.buildParams(options);
    const response = await this.httpClient.get('/opportunities', { params });
    return response.data;
  }

  /**
   * List opportunities by party
   */
  async listOpportunitiesByParty(partyId, options = {}) {
    const params = this.buildParams(options);
    const response = await this.httpClient.get(`/parties/${partyId}/opportunities`, { params });
    return response.data;
  }

  /**
   * Get a specific opportunity by ID
   */
  async getOpportunity(opportunityId, options = {}) {
    const params = this.buildParams(options);
    const response = await this.httpClient.get(`/opportunities/${opportunityId}`, { params });
    return response.data;
  }

  /**
   * Get multiple opportunities by IDs
   */
  async getMultipleOpportunities(opportunityIds, options = {}) {
    const params = this.buildParams(options);
    const ids = Array.isArray(opportunityIds) ? opportunityIds.join(',') : opportunityIds;
    const response = await this.httpClient.get(`/opportunities/${ids}`, { params });
    return response.data;
  }

  /**
   * Create a new opportunity
   */
  async createOpportunity(opportunityData, options = {}) {
    const params = this.buildParams(options);
    const response = await this.httpClient.post('/opportunities', { opportunity: opportunityData }, { params });
    return response.data;
  }

  /**
   * Update an existing opportunity
   */
  async updateOpportunity(opportunityId, opportunityData, options = {}) {
    const params = this.buildParams(options);
    const response = await this.httpClient.put(`/opportunities/${opportunityId}`, { opportunity: opportunityData }, { params });
    return response.data;
  }

  /**
   * Delete an opportunity
   */
  async deleteOpportunity(opportunityId) {
    await this.httpClient.delete(`/opportunities/${opportunityId}`);
  }

  /**
   * Search opportunities
   */
  async searchOpportunities(query, options = {}) {
    const params = this.buildParams({ q: query, ...options });
    const response = await this.httpClient.get('/opportunities/search', { params });
    return response.data;
  }

  /**
   * List additional parties for an opportunity
   */
  async listOpportunityParties(opportunityId, options = {}) {
    const params = this.buildParams(options);
    const response = await this.httpClient.get(`/opportunities/${opportunityId}/parties`, { params });
    return response.data;
  }

  /**
   * Add additional party to opportunity
   */
  async addPartyToOpportunity(opportunityId, partyId) {
    await this.httpClient.post(`/opportunities/${opportunityId}/parties/${partyId}`);
  }

  /**
   * Remove additional party from opportunity
   */
  async removePartyFromOpportunity(opportunityId, partyId) {
    await this.httpClient.delete(`/opportunities/${opportunityId}/parties/${partyId}`);
  }

  // ===== PROJECT METHODS =====

  /**
   * List projects (kases)
   */
  async listProjects(options = {}) {
    const params = this.buildParams(options);
    const response = await this.httpClient.get('/kases', { params });
    return response.data;
  }

  /**
   * List projects by party
   */
  async listProjectsByParty(partyId, options = {}) {
    const params = this.buildParams(options);
    const response = await this.httpClient.get(`/parties/${partyId}/kases`, { params });
    return response.data;
  }

  /**
   * Get a specific project by ID
   */
  async getProject(projectId, options = {}) {
    const params = this.buildParams(options);
    const response = await this.httpClient.get(`/kases/${projectId}`, { params });
    return response.data;
  }

  /**
   * Create a new project
   */
  async createProject(projectData, options = {}) {
    const params = this.buildParams(options);
    const response = await this.httpClient.post('/kases', { kase: projectData }, { params });
    return response.data;
  }

  /**
   * Update an existing project
   */
  async updateProject(projectId, projectData, options = {}) {
    const params = this.buildParams(options);
    const response = await this.httpClient.put(`/kases/${projectId}`, { kase: projectData }, { params });
    return response.data;
  }

  /**
   * Delete a project
   */
  async deleteProject(projectId) {
    await this.httpClient.delete(`/kases/${projectId}`);
  }

  /**
   * Search projects
   */
  async searchProjects(query, options = {}) {
    const params = this.buildParams({ q: query, ...options });
    const response = await this.httpClient.get('/kases/search', { params });
    return response.data;
  }

  // ===== TASK METHODS =====

  /**
   * List tasks
   */
  async listTasks(options = {}) {
    const params = this.buildParams(options);
    const response = await this.httpClient.get('/tasks', { params });
    return response.data;
  }

  /**
   * Get a specific task by ID
   */
  async getTask(taskId, options = {}) {
    const params = this.buildParams(options);
    const response = await this.httpClient.get(`/tasks/${taskId}`, { params });
    return response.data;
  }

  /**
   * Create a new task
   */
  async createTask(taskData, options = {}) {
    const params = this.buildParams(options);
    const response = await this.httpClient.post('/tasks', { task: taskData }, { params });
    return response.data;
  }

  /**
   * Update an existing task
   */
  async updateTask(taskId, taskData, options = {}) {
    const params = this.buildParams(options);
    const response = await this.httpClient.put(`/tasks/${taskId}`, { task: taskData }, { params });
    return response.data;
  }

  /**
   * Delete a task
   */
  async deleteTask(taskId) {
    await this.httpClient.delete(`/tasks/${taskId}`);
  }

  // ===== PIPELINE & MILESTONE METHODS =====

  /**
   * List pipelines
   */
  async listPipelines() {
    const response = await this.httpClient.get('/pipelines');
    return response.data;
  }

  /**
   * List milestones
   */
  async listMilestones(options = {}) {
    const params = this.buildParams(options);
    const response = await this.httpClient.get('/milestones', { params });
    return response.data;
  }

  /**
   * List milestones by pipeline
   */
  async listMilestonesByPipeline(pipelineId) {
    const response = await this.httpClient.get(`/pipelines/${pipelineId}/milestones`);
    return response.data;
  }

  // ===== ENTRY METHODS =====

  /**
   * List entries (history/notes)
   */
  async listEntries(options = {}) {
    const params = this.buildParams(options);
    const response = await this.httpClient.get('/entries', { params });
    return response.data;
  }

  /**
   * Create a new entry
   */
  async createEntry(entryData, options = {}) {
    const params = this.buildParams(options);
    const response = await this.httpClient.post('/entries', { entry: entryData }, { params });
    return response.data;
  }

  // ===== TAG METHODS =====

  /**
   * List tag definitions
   */
  async listTagDefinitions() {
    const response = await this.httpClient.get('/tags');
    return response.data;
  }

  // ===== CUSTOM FIELD METHODS =====

  /**
   * List custom field definitions
   */
  async listCustomFields() {
    const response = await this.httpClient.get('/fields');
    return response.data;
  }

  // ===== UTILITY METHODS =====

  /**
   * Build query parameters from options object
   */
  buildParams(options = {}) {
    const params = {};
    
    // Handle pagination
    if (options.page) params.page = options.page;
    if (options.perPage) params.perPage = options.perPage;
    
    // Handle embedding
    if (options.embed) {
      params.embed = Array.isArray(options.embed) ? options.embed.join(',') : options.embed;
    }
    
    // Handle since parameter
    if (options.since) params.since = options.since;
    
    // Handle search query
    if (options.q) params.q = options.q;
    
    // Handle any other parameters
    Object.keys(options).forEach(key => {
      if (!['page', 'perPage', 'embed', 'since', 'q'].includes(key)) {
        params[key] = options[key];
      }
    });
    
    return params;
  }

  /**
   * Format response for MCP tools
   */
  formatMCPResponse(data, message = 'Operation completed successfully') {
    return {
      content: [
        {
          type: 'text',
          text: `${message}\n\n${JSON.stringify(data, null, 2)}`,
        },
      ],
    };
  }

  /**
   * Format error for MCP tools
   */
  formatMCPError(error) {
    return {
      content: [
        {
          type: 'text',
          text: `Error: ${error.message}`,
        },
      ],
      isError: true,
    };
  }
} 