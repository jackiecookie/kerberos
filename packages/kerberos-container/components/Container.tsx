import React, { Component } from "react";

import RouteControl, { RouteChangeHocksProps } from "./RouteControl";

import Route from "./Route";

import { recordAssets,setContainerFlag } from "kerberos-utils";

import ProLayout from '@ant-design/pro-layout';


interface ContainerProps extends RouteChangeHocksProps {
  authUrl: String;
}
interface ContainerState {
  apps: Array<AppConfig>;
}

export interface AppConfig {
  title?: string;
  url?: string[];
  path: string | string[];
  code: string;
}

export default class Container extends Component<
  ContainerProps,
  ContainerState
> {
  constructor(props: ContainerProps) {
    super(props);
    this.state = {
      apps: []
    };
  }

  componentDidMount() {
    // 将container中的style保护起来
    recordAssets();
    setContainerFlag();
    // 根据权限获得可以显示的数据
    this.setState({
      apps: [
        {
          path: "/",
          title: "首页",
          code: "user"
        },
      ]
    });


  }

  render() {
    let { apps } = this.state;
    return (<ProLayout>
      {
        apps.length > 0 ? (
          <RouteControl>
            {(apps || []).map((item, idx) => {
              return <Route key={idx} {...item} />;
            })}
          </RouteControl>
        ) : (
          <div>loading</div>
        )
      }
    </ProLayout>)
  }
}
