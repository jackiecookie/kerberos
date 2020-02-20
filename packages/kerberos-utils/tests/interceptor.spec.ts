import interceptor from "../interceptor";
import IAdapter from "../types/IAdapter";

class Adatper implements IAdapter {
  store;
  interceptorFn: (event: string, payload: object) => void;
  constructor() {
    this.store = {};
  }
  query(): void {
    throw new Error("Method not implemented.");
  }
  commander(event: string, payload: any): void {
    this.store[event] = payload;
    this.interceptorFn(event, payload);
  }
  eventFilter(event: string): boolean {
    return event !== "false";
  }
  interceptor(interceptor: (event: string, payload: object) => void): void {
    this.interceptorFn = interceptor;
  }
}

describe("test interceptor", () => {
  let firstAdatper = new Adatper();
  let firstcommander = jest.spyOn(firstAdatper, "commander");
  test("first Adatper work correct", () => {
    interceptor(firstAdatper);
    firstAdatper.commander("first", 1);
    expect(firstcommander).toHaveBeenCalledTimes(1);
  });
  let sencondAdatper = new Adatper();
  let sencondCommander = jest.spyOn(sencondAdatper, "commander");
  test("sencond Adapter work correct", () => {
    interceptor(sencondAdatper);
    expect(sencondCommander).toHaveBeenCalledTimes(1);   // replay =>  one time
    expect(sencondAdatper.store["first"]).toEqual(1);    // replay ok
    sencondAdatper.commander("sencond", 2);               // call sencond commander
    expect(firstcommander).toHaveBeenCalledTimes(2);
    expect(firstAdatper.store["sencond"]).toEqual(2);    
  });

  let thirdAdatper = new Adatper();
  let thirdCommander = jest.spyOn(thirdAdatper, "commander");
  test("third Adapter work correct", () => {
    interceptor(thirdAdatper);
    expect(thirdCommander).toHaveBeenCalledTimes(2); 
    expect(thirdAdatper.store["first"]).toEqual(1);  
    expect(thirdAdatper.store["sencond"]).toEqual(2);
    thirdAdatper.commander("false", false);             
    expect(firstcommander).toHaveBeenCalledTimes(2);
    expect(sencondCommander).toHaveBeenCalledTimes(2);
  });
});
