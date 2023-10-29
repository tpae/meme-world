import {
  getDefaultWallets,
  RainbowKitProvider,
  lightTheme,
} from "@rainbow-me/rainbowkit";
import { WagmiConfig, createConfig, configureChains } from "wagmi";
import { publicProvider } from "wagmi/providers/public";
import ReactDOM from "react-dom/client";
import { optimism } from "viem/chains";
import { mudFoundry } from "@latticexyz/common/chains";
import { createBrowserRouter, RouterProvider } from "react-router-dom";
import { setup } from "./mud/setup";
import { MUDProvider } from "./MUDContext";
import mudConfig from "contracts/mud.config";
import { RootPage } from "./pages/root";
import { ErrorPage } from "./pages/error";
import { App } from "./pages/app";
import { TemplateCreate } from "./pages/template-create";
import { TemplateMint } from "./pages/template-mint";
import { Derivative } from "./pages/derivative";
import "@rainbow-me/rainbowkit/styles.css";
import "../globals.css";

const { chains, publicClient, webSocketPublicClient } = configureChains(
  [optimism, mudFoundry],
  [publicProvider()]
);

const { connectors } = getDefaultWallets({
  appName: "MemeWorld",
  projectId: "b9746a66be4150b1b11884f16161437e",
  chains,
});

const config = createConfig({
  autoConnect: true,
  publicClient,
  webSocketPublicClient,
  connectors,
});

const router = createBrowserRouter([
  {
    path: "/",
    element: <RootPage />,
    errorElement: <ErrorPage />,
    children: [
      {
        path: "/",
        element: <App />,
      },
      {
        path: "/template",
        element: <TemplateCreate />,
      },
      {
        path: "/template/:templateId",
        element: <TemplateMint />,
      },
      {
        path: "/derivative",
        element: <Derivative />,
      },
    ],
  },
]);

const rootElement = document.getElementById("react-root");
if (!rootElement) throw new Error("React root not found");
const root = ReactDOM.createRoot(rootElement);

setup().then(async (result) => {
  root.render(
    <WagmiConfig config={config}>
      <RainbowKitProvider chains={chains}>
        <MUDProvider value={result}>
          <RouterProvider router={router} />
        </MUDProvider>
      </RainbowKitProvider>
    </WagmiConfig>
  );

  // https://vitejs.dev/guide/env-and-mode.html
  if (import.meta.env.DEV) {
    const { mount: mountDevTools } = await import("@latticexyz/dev-tools");
    mountDevTools({
      config: mudConfig,
      publicClient: result.network.publicClient,
      walletClient: result.network.walletClient,
      latestBlock$: result.network.latestBlock$,
      storedBlockLogs$: result.network.storedBlockLogs$,
      worldAddress: result.network.worldContract.address,
      worldAbi: result.network.worldContract.abi,
      write$: result.network.write$,
      recsWorld: result.network.world,
    });
  }
});
