export type RawTask = {
  id: string;
  title: string;
  type: string;
  status: string;
  updatedAt: string | number;
  annotationCount: string | number;
  assignee: { id: string; name: string } | null;
  meta: Record<string, unknown>;
};

export type TasksResponse = {
    page: number;
    pageSize: number;
    total: number;
    items: RawTask[]
}

