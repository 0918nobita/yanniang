import { PUBLIC_BACKEND_ORIGIN } from "$env/static/public";

import type { PageLoad } from "./$types";

type MyLearningContent = Readonly<{
    front: string;
    back: string;
    front_lang: string;
    back_lang: string;
}>;

export const load: PageLoad = async ({ fetch }) => {
    const res = await fetch(`${PUBLIC_BACKEND_ORIGIN}/learning_content`);
    const learning_contents: readonly MyLearningContent[] = await res.json();
    return { learning_contents };
};
