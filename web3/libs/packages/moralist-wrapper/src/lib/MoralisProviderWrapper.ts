import React, { ReactNode } from "react";
import { MoralisProvider } from "react-moralis";

type Props = {
  children: ReactNode;
  appId: string;
  serverUrl: string;
};

export const MoralisProviderWrapper = ({ children, appId, serverUrl }: Props) => {
  return React.createElement(
    MoralisProvider,
    { appId, serverUrl, children },
    children
  );
};