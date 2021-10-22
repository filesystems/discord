<script>
    import * as Monaco from "monaco-editor";
    import Button from "./Button.svelte";
    import path from "path";
    import { onMount } from "svelte";
    import mime from "mime-types";

    let container;

    let download = null;

    function saveBlob(blob) {
        let url = window.URL.createObjectURL(blob);
        let a = document.createElement("a");
        document.body.appendChild(a);
        a.style = "display: none";

        a.href = url;
        a.download = path.basename(file.name);
        a.click();
        window.URL.revokeObjectURL(url);
    }

    export let file;

    onMount(async () => {
        let type = file.data.type;

        if (type == "") {
            let valid = mime.lookup(file.path);
            if (valid) type = valid;
        }

        if (type.startsWith("text")) {
            Monaco.editor.create(container, {
                value: await file.data.text(),
                language: type.split("/").pop() | "text",
                theme: "vs-dark",
                fontSize: 15,
            });
        } else if (type.startsWith("image")) {
            let image = document.createElement("image");
            image.src = URL.createObjectURL(file.data);
            container.append(image);
        } else {
            download = file.data;
        }
    });
</script>

<editor>
    <div bind:this={container} class="container">
        {#if download !== null}
            <Button click={() => saveBlob(download)} title="Download file" />
        {/if}
    </div>
</editor>

<style>
    .container {
        height: 100%;
        width: 100%;
    }
</style>
