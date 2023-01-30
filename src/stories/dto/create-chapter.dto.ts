export class CreateChapterDto {
  storyId: number;
  title: string;
  description?: string;
  content?: string;
  status: 'draft' | 'published' = 'draft';
}
