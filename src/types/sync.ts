import type { Category, Task, User, UUID } from "./user";

export type SyncMode = "display" | "scan";

export type SyncStatus = {
  message: string;
  severity: "info" | "success" | "error" | "warning";
};

export type OtherDataSyncOption = "this_device" | "other_device" | "no_sync";

export interface SyncData {
  version: number;
  tasks: Task[];
  deletedTasks: UUID[];
  categories: Category[];
  deletedCategories: UUID[];
  favoriteCategories: UUID[];
  lastModified: Date;
  otherData?: Partial<User>;
  otherDataSource?: OtherDataSyncOption;
}
