<script lang="ts">
  export let title: string = "Simplist | The simplicity orchestred by AI";
  export let siteName: string = "Simplist";
  export let description: string = "A sample page for your browser's new tab page.";
  export let url: string = "https://simplist.page";
  export let color: string = "#0f172a";
  export let image: string | null = "https://cdn.discordapp.com/attachments/580083630995537961/1124660510365851758/og.png";
</script>

<title>{title}</title>
<meta name="description" content={description} />
<meta name="og:title" content={title} />
<meta name="og:site_name" content={siteName} />
<meta name="og:description" content={description} />
<meta name="og:url" content={url} />
<meta name="og:type" content="website" />
<meta name="twitter:card" content="summary_large_image" />
<meta name="twitter:site" content="@Steellgold" />
<meta name="twitter:creator" content="@Steellgold" />
<meta name="twitter:title" content={title} />
<meta name="twitter:description" content={description} />
<meta name="theme-color" content={color} />
{#if image !== null}
  <meta name="og:image" content={image} />
  <meta name="twitter:image" content={image} />
{/if}