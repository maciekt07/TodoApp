// types for window.LanguageModel experimental chrome api
// https://docs.google.com/document/d/1VG8HIyz361zGduWgNG7R_R8Xkv0OOJ8b5C9QKeCjU0c/view?pli=1&tab=t.0#heading=h.nszgbi9928bg
// https://www.npmjs.com/package/@types/dom-chromium-ai

// Core model types and enums
export type LanguageModelMessageRole = "system" | "user" | "assistant";
export type LanguageModelMessageType = "text" | "image" | "audio";

export type LanguageModelMessageContentValue =
  | ImageBitmapSource
  | AudioBuffer
  | BufferSource
  | string;

// Message structure
export interface LanguageModelMessageContent {
  type: LanguageModelMessageType;
  content: LanguageModelMessageContentValue;
}

export interface LanguageModelMessage {
  role: LanguageModelMessageRole;
  content: LanguageModelMessageContent[];
}

export interface LanguageModelMessageShorthand {
  role: LanguageModelMessageRole;
  content: string;
}

export interface LanguageModelPromptDict {
  role?: LanguageModelMessageRole; // default: "user"
  type?: LanguageModelMessageType; // default: "text"
  content: LanguageModelMessageContent;
}

// Prompt type: supports multiple formats
export type LanguageModelPrompt = LanguageModelMessage[] | LanguageModelMessageShorthand[] | string;

export type LanguageModelInitialPrompts = LanguageModelMessage[] | LanguageModelMessageShorthand[];

// Expected input spec
export interface LanguageModelExpectedInput {
  type: LanguageModelMessageType;
  languages: string[];
}

// Options dictionaries
export interface LanguageModelCreateCoreOptions {
  topK?: number;
  temperature?: number;
  expectedInputs?: LanguageModelExpectedInput[];
}

export interface LanguageModelCreateOptions extends LanguageModelCreateCoreOptions {
  signal?: AbortSignal;
  monitor?: AICreateMonitorCallback;
  initialPrompts?: LanguageModelInitialPrompts;
}

export interface LanguageModelPromptOptions {
  responseConstraint?: object;
  signal?: AbortSignal;
}

export interface LanguageModelAppendOptions {
  signal?: AbortSignal;
}

export interface LanguageModelCloneOptions {
  signal?: AbortSignal;
}

// Parameter info from the model
export interface LanguageModelParams {
  readonly defaultTopK: number;
  readonly maxTopK: number;
  readonly defaultTemperature: number;
  readonly maxTemperature: number;
}

// Capability availability enum
export type Availability = "readily" | "after-download" | "no";

// Monitor interface
export interface AICreateMonitor extends EventTarget {
  ondownloadprogress: (event: Event) => void;
}

export type AICreateMonitorCallback = (monitor: AICreateMonitor) => void;

// Main LanguageModel interface
export interface LanguageModel extends EventTarget {
  prompt(input: LanguageModelPrompt, options?: LanguageModelPromptOptions): Promise<string>;

  promptStreaming(input: LanguageModelPrompt, options?: LanguageModelPromptOptions): ReadableStream;

  append(input: LanguageModelPrompt, options?: LanguageModelAppendOptions): Promise<void>;

  measureInputUsage(
    input: LanguageModelPrompt,
    options?: LanguageModelPromptOptions,
  ): Promise<number>;

  readonly inputUsage: number;
  readonly inputQuota: number;

  readonly topK: number;
  readonly temperature: number;

  clone(options?: LanguageModelCloneOptions): Promise<LanguageModel>;
  destroy(): void;
}

export interface LanguageModel {
  create(options?: LanguageModelCreateOptions): Promise<LanguageModel>;
  availability(options?: LanguageModelCreateCoreOptions): Promise<Availability>;
  params(): Promise<LanguageModelParams | null>;
}

declare global {
  interface Window {
    LanguageModel: LanguageModel;
  }
}
