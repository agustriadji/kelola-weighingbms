export interface Chat {
  id?: string | null;
  content: string;
  response?: string | null;
  type?: "text";
  datetime?: string | null;
}
