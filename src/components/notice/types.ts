export interface Comment {
  id: string;
  content: string;
  created_at: string;
  created_by: string;
  notice_id: string;
  updated_at: string;
  profiles: {
    full_name: string | null;
  };
}

export interface Notice {
  id: string;
  title: string;
  description: string;
  date: string;
  created_by: string;
  created_at: string;
  is_pinned: boolean;
  profiles: {
    full_name: string | null;
  };
  notice_comments: Comment[];
}