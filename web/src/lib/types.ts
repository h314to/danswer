import { Persona } from "@/app/admin/assistants/interfaces";
import { Credential } from "./connectors/credentials";
import { Connector } from "./connectors/connectors";
import { ConnectorCredentialPairStatus } from "@/app/admin/connector/[ccPairId]/types";

interface UserPreferences {
  chosen_assistants: number[] | null;
  visible_assistants: number[];
  hidden_assistants: number[];
  default_model: string | null;
  recent_assistants: number[];
}

export enum UserStatus {
  live = "live",
  invited = "invited",
  deactivated = "deactivated",
}

export enum UserRole {
  LIMITED = "limited",
  BASIC = "basic",
  ADMIN = "admin",
  CURATOR = "curator",
  GLOBAL_CURATOR = "global_curator",
  EXT_PERM_USER = "ext_perm_user",
  SLACK_USER = "slack_user",
}

export const USER_ROLE_LABELS: Record<UserRole, string> = {
  [UserRole.BASIC]: "Basic",
  [UserRole.ADMIN]: "Admin",
  [UserRole.GLOBAL_CURATOR]: "Global Curator",
  [UserRole.CURATOR]: "Curator",
  [UserRole.LIMITED]: "Limited",
  [UserRole.EXT_PERM_USER]: "External Permissioned User",
  [UserRole.SLACK_USER]: "Slack User",
};

export const INVALID_ROLE_HOVER_TEXT: Partial<Record<UserRole, string>> = {
  [UserRole.BASIC]: "Basic users can't perform any admin actions",
  [UserRole.ADMIN]: "Admin users can perform all admin actions",
  [UserRole.GLOBAL_CURATOR]:
    "Global Curator users can perform admin actions for all groups they are a member of",
  [UserRole.CURATOR]: "Curator role must be assigned in the Groups tab",
  [UserRole.SLACK_USER]:
    "This role is automatically assigned to users who only use Danswer via Slack",
};

export interface User {
  id: string;
  email: string;
  is_active: string;
  is_superuser: string;
  is_verified: string;
  role: UserRole;
  preferences: UserPreferences;
  status: UserStatus;
  current_token_created_at?: Date;
  current_token_expiry_length?: number;
  oidc_expiry?: Date;
  is_cloud_superuser?: boolean;
  organization_name: string | null;
}

export interface MinimalUserSnapshot {
  id: string;
  email: string;
}

export type ValidInputTypes = "load_state" | "poll" | "event";
export type ValidStatuses =
  | "success"
  | "completed_with_errors"
  | "failed"
  | "in_progress"
  | "not_started";
export type TaskStatus = "PENDING" | "STARTED" | "SUCCESS" | "FAILURE";
export type Feedback = "like" | "dislike";
export type AccessType = "public" | "private" | "sync";
export type SessionType = "Chat" | "Search" | "Slack";

export interface DocumentBoostStatus {
  document_id: string;
  semantic_id: string;
  link: string;
  boost: number;
  hidden: boolean;
}

export interface FailedConnectorIndexingStatus {
  cc_pair_id: number;
  name: string | null;
  error_msg: string | null;
  is_deletable: boolean;
  connector_id: number;
  credential_id: number;
}

export interface IndexAttemptSnapshot {
  id: number;
  status: ValidStatuses | null;
  new_docs_indexed: number;
  docs_removed_from_index: number;
  total_docs_indexed: number;
  error_msg: string | null;
  error_count: number;
  full_exception_trace: string | null;
  time_started: string | null;
  time_updated: string;
}

export interface ConnectorIndexingStatus<
  ConnectorConfigType,
  ConnectorCredentialType,
> {
  cc_pair_id: number;
  name: string | null;
  cc_pair_status: ConnectorCredentialPairStatus;
  connector: Connector<ConnectorConfigType>;
  credential: Credential<ConnectorCredentialType>;
  access_type: AccessType;
  owner: string;
  groups: number[];
  last_finished_status: ValidStatuses | null;
  last_status: ValidStatuses | null;
  last_success: string | null;
  docs_indexed: number;
  error_msg: string;
  latest_index_attempt: IndexAttemptSnapshot | null;
  deletion_attempt: DeletionAttemptSnapshot | null;
  is_deletable: boolean;
  in_progress: boolean;
}

export interface CCPairBasicInfo {
  docs_indexed: number;
  has_successful_run: boolean;
  source: ValidSources;
}

export type ConnectorSummary = {
  count: number;
  active: number;
  public: number;
  totalDocsIndexed: number;
  errors: number; // New field for error count
};

export type GroupedConnectorSummaries = Record<ValidSources, ConnectorSummary>;

// DELETION

export interface DeletionAttemptSnapshot {
  connector_id: number;
  credential_id: number;
  status: TaskStatus;
}

// DOCUMENT SETS
export interface CCPairDescriptor<ConnectorType, CredentialType> {
  id: number;
  name: string | null;
  connector: Connector<ConnectorType>;
  credential: Credential<CredentialType>;
}

export interface DocumentSet {
  id: number;
  name: string;
  description: string;
  cc_pair_descriptors: CCPairDescriptor<any, any>[];
  is_up_to_date: boolean;
  is_public: boolean;
  users: string[];
  groups: number[];
}

export interface Tag {
  tag_key: string;
  tag_value: string;
  source: ValidSources;
}

// STANDARD ANSWERS
export interface StandardAnswerCategory {
  id: number;
  name: string;
}

export interface StandardAnswer {
  id: number;
  keyword: string;
  answer: string;
  match_regex: boolean;
  match_any_keywords: boolean;
  categories: StandardAnswerCategory[];
}

// SLACK BOT CONFIGS

export type AnswerFilterOption =
  | "well_answered_postfilter"
  | "questionmark_prefilter";

export interface ChannelConfig {
  channel_name: string;
  respond_tag_only?: boolean;
  respond_to_bots?: boolean;
  respond_member_group_list?: string[];
  answer_filters?: AnswerFilterOption[];
  follow_up_tags?: string[];
}

export type SlackBotResponseType = "quotes" | "citations";

export interface SlackChannelConfig {
  id: number;
  slack_bot_id: number;
  persona: Persona | null;
  channel_config: ChannelConfig;
  response_type: SlackBotResponseType;
  standard_answer_categories: StandardAnswerCategory[];
  enable_auto_filters: boolean;
}

export interface SlackBot {
  id: number;
  name: string;
  enabled: boolean;
  configs_count: number;

  // tokens
  bot_token: string;
  app_token: string;
}

export interface SlackBotTokens {
  bot_token: string;
  app_token: string;
}

/* EE Only Types */
export interface UserGroup {
  id: number;
  name: string;
  users: User[];
  curator_ids: string[];
  cc_pairs: CCPairDescriptor<any, any>[];
  document_sets: DocumentSet[];
  personas: Persona[];
  is_up_to_date: boolean;
  is_up_for_deletion: boolean;
}

const validSources = [
  "web",
  "github",
  "gitlab",
  "slack",
  "google_drive",
  "gmail",
  "bookstack",
  "confluence",
  "jira",
  "productboard",
  "slab",
  "notion",
  "guru",
  "gong",
  "zulip",
  "linear",
  "hubspot",
  "document360",
  "file",
  "google_sites",
  "loopio",
  "dropbox",
  "salesforce",
  "sharepoint",
  "teams",
  "zendesk",
  "discourse",
  "axero",
  "clickup",
  "wikipedia",
  "mediawiki",
  "asana",
  "s3",
  "r2",
  "google_cloud_storage",
  "xenforo",
  "oci_storage",
  "not_applicable",
  "ingestion_api",
  "freshdesk",
  "fireflies",
] as const;

export type ValidSources = (typeof validSources)[number];
// The valid sources that are actually valid to select in the UI
export type ConfigurableSources = Exclude<
  ValidSources,
  "not_applicable" | "ingestion_api"
>;

// The sources that have auto-sync support on the backend
export const validAutoSyncSources = [
  "confluence",
  "google_drive",
  "gmail",
  "slack",
] as const;
export type ValidAutoSyncSources = (typeof validAutoSyncSources)[number];
