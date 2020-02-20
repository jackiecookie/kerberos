import IAdapter from "./types/IAdapter";

class EventSourceing {
  private events: string[];
  private eventSourceing: Array<object>[];
  constructor() {
    this.events = [];
    this.eventSourceing = [];
  }
  commit(event: string, playload: object) {
    let eventIndex = this.events.indexOf(event);
    if (eventIndex === -1) {
      this.events.push(event);
      this.eventSourceing.push([]);
      eventIndex = this.events.length - 1;
    }
    this.eventSourceing[eventIndex].push(playload);
  }

  replay(adapter: IAdapter) {
    let self = this;
    this.events
      .filter(adapter.eventFilter)
      .map(event => this.events.indexOf(event))
      .forEach(function replay(index) {
        self.eventSourceing[index].forEach(playLoad => {
          let event = self.events[index];
          adapter.commander(event, playLoad);
        });
      });
  }
}

export default EventSourceing;
