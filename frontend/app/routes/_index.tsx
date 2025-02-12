import { Route } from "./+types/_index";

export const meta: Route.MetaFunction = () => [{ title: "言娘" }];

export default function Index({}: Route.ComponentProps) {
    return <p>Hello, world!</p>;
}
