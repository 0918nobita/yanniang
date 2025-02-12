import { AppLoadContext } from "react-router";
import { PlatformProxy } from "wrangler";

type Cloudflare = Omit<PlatformProxy<Env>, "dispose" | "caches" | "cf">;

declare module "react-router" {
    interface AppLoadContext {
        cloudflare: Cloudflare;
    }
}

type GetLoadContext = (args: {
    request: Request;
    context: { cloudflare: Cloudflare };
}) => AppLoadContext;

export const getLoadContext: GetLoadContext = ({ context }) => {
    return { ...context };
};
