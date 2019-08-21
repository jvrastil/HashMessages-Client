export class Tag {
  name: string;
  uuid: string;

  constructor(name: string, uuid?: string) {
    this.name = name;
    this.uuid = uuid;
  }
}
