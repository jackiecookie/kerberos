import { render, waitForElement } from "@testing-library/react";
import RouteControl from "../components/RouteControl";
import React from "react";

interface PathProp {
  path: {};
}
class Route extends React.Component<PathProp> {
  render() {
    let { path } = this.props;
    return <>{path}</>;
  }
}

describe("RouteControl", () => {
  let Component = (
    <RouteControl>
      <Route path="/user"></Route>
      <Route path="/product"></Route>
      <Route path="/" ></Route>
    </RouteControl>
  );

  test("init path correct", () => {
    let { getByText } = render(Component);
    expect(getByText("/")).not.toBeNull();
  });

  test("change path to /user", async done => {
    let { getByText } = render(Component);
    (global as any).window.history.pushState(
      "/user",
      "user",
      "http://localhost/user"
    );
    let user = await waitForElement(() => getByText("/user"));
    expect(user).not.toBeNull();

    (global as any).window.history.back();
    let home = await waitForElement(() => getByText("/"));
    expect(home).not.toBeNull();
    done();
  });


  test("return 404 when page not exist", async done => {
    let { getByText } = render(Component);
    (global as any).window.history.replaceState(
      "/404",
      "404",
      "http://localhost/404"
    );
    let notExistPage = await waitForElement(() => getByText("404"));
    expect(notExistPage).not.toBeNull();
    done();
  });
});
