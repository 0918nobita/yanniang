<script lang="ts">
    import type { PageProps } from './$types';

    let { data }: PageProps = $props();
</script>

<h2>単語一覧</h2>

<ul>
{#each data.learning_contents as content}
    <li>{content.front}({content.front_lang}) → {content.back}({content.back_lang})</li>
{/each}
</ul>
