export class Message {
  title = '';
  message = '';
  encrypted?: boolean;
  tags: string[];
  date?: Date;
  hashedTitle?: string;
}
