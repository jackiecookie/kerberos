import Sandbox from "../sandbox";
import path from "path";
import fs from "fs";

describe("test sandbox.js", () => {
  let codes = [
    "expect(window.testObject).toBeUndefined();",

    "expect(typeof setTimeout).toEqual('function')",

    "expect(typeof setInterval).toEqual('function')",

    "expect(typeof console.log).toEqual('function')",

    `window.testSetTimeout = function(){};
     expect(window.testSetTimeout).not.toBeUndefined();`,

    "expect(window.testSetTimeout).toBeUndefined();",

    "console.log = null",

    "expect(typeof console.log).toEqual('function')",

    "expect(Math.pow(1,2)).toEqual(1);",

    "expect(typeof document.createElement).toEqual('function')",

    `
    Math.double = function(a) {
      return a * 2;
    };
    expect(Math.double(2)).toEqual(4);`,

    `expect(Math.double).toBeUndefined();`,

    `
    document.createElement = function(){
      expect(this).toEqual(document);
    }
    document.createElement();
    `,

    "expect(typeof Object.defineProperty).toEqual('function')",

    "expect(typeof navigator.userAgent).toEqual('string')"
  ];

  test.each([...codes])("sanbox.execute(%s)", code => {
    (window as any).test = "1";
    let sanbox = new Sandbox();
    sanbox.execute(code);
    sanbox.dispose();
  });

  // test("should sanbox work isolation", () => {
  //   let sanbox = new Sandbox();
    
  //   sanbox.execute(`
    
  //   `)
  // });

  let script = `let rawSetTimeout = window.setTimeout;
    window.setTimeout = (...args) => {
      return {
        testMock: true
      };
    };
    expect(setTimeout(function() {}, 0).testMock).toEqual(true);`;

  test("function hijecketed work correctly", () => {
    let sanbox = new Sandbox();
    sanbox.execute(script);
    sanbox = new Sandbox();
    sanbox.execute(
      `expect(setTimeout(function(){},0).testMock).toBeUndefined();`
    );
  });

  test("single sandbox run multiple scripts", () => {
    let sanbox = new Sandbox();
    sanbox.execute(script);
    sanbox.execute(`expect(setTimeout(function(){},0).testMock).toBeTruthy()`);
  });
});

// describe("sandbox.js", () => {
//   test("should ", () => {
//     require("./code/app.js");
//     // let code = fs.readFileSync(path.resolve(__dirname,"./code/app.js"));
//     // let sandbox = new Sandbox();
//     // sandbox.execute(code.toString());
//   });
// });
