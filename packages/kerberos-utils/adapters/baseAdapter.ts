export default class BaseAdapter {
  private events: string[];

  constructor(events: string[]) {
    this.events = events;
  }

  eventFilter(event: string): boolean {
    return this.events.indexOf(event) > -1;
  }
}
