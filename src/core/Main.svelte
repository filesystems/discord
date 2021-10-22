<script>
    import DirList from "../components/DirList.svelte";
    import Button from "../components/Button.svelte";
    import File from "../components/File.svelte";
    import FileSystem from "../api/FileSystem";
    import path from "path";

    import Modal from "../components/Modal.svelte";
    import Input from "../components/Input.svelte";
    import FileUpload from "../components/FileUpload.svelte";
    import Editor from "../components/Editor.svelte";

    export let files = [];
    export let folders = [];

    export let dir = "/";
    export let creating = false;

    export const fs = new FileSystem();
    //"ODk5ODA5OTQ2NTAwMjA2NjIz.YW4LWw.ZkwGQoGAEQxwFCMtHCPJNRVj1LM",
    //"899810216382701609"

    fs.event.addListener("update-dir", (p) => {
        let isCurrent = p == dir || p + "/" == dir;
        if (isCurrent) update();
    });

    fs.event.addListener("init", (p) => {
        dir = "/";
        update();
    });

    function update() {
        let items = fs.ls(dir.endsWith("/") ? dir : dir + "/");

        folders = items.filter((e) => e.type == "Dir");
        files = items.filter((e) => e.type == "File");
    }

    window.fs = fs;

    let createName = "";
    let createFiles;

    let token = localStorage.getItem("fs-token") || "";
    let guild = localStorage.getItem("fs-guild") || "";

    let logged = false;

    let editor = null;
</script>

<div id="root">
    {#if editor !== null}
        <Modal
            style="height: 100%; max-width: -webkit-fill-available;"
            onclose={() => {
                editor = null;
            }}
            submit={() => {
                editor = null;
            }}
        >
            <bold slot="header">Editor</bold>
            <div style="height: -webkit-fill-available;" slot="content">
                <Editor file={editor.file} />
            </div>
        </Modal>
    {/if}

    {#if !logged}
        <Modal
            submit={() => {
                fs.reconstruct(token, guild);

                localStorage.setItem("fs-token", token);
                localStorage.setItem("fs-guild", guild);

                logged = true;
            }}
            on:close={() => (creating = false)}
        >
            <bold slot="header">Enter the account token and the guild id</bold>
            <div slot="content">
                <Input bind:value={token} placeholder="Account token" />
                <Input bind:value={guild} placeholder="Guild ID" />
            </div>
        </Modal>
    {/if}
    {#if creating == true}
        <Modal
            onclose={() => {
                creating = false;
            }}
            submit={() => {
                let path = createName;

                if (path.startsWith("/")) {
                    let [_, ...split] = createName.split("/");
                    path = split.join("/");
                }

                if (path.endsWith("/")) return fs.createDir(dir + path);

                let file = createFiles[0];

                if (!file) return;

                fs.createFile(dir + path, file, true);
            }}
            on:close={() => (creating = false)}
        >
            <bold slot="header">Create/upload a new file or dir</bold>

            <div slot="content">
                <Input bind:value={createName} placeholder="File name" />
                <div class="file">
                    <FileUpload bind:files={createFiles} />
                </div>
            </div>
        </Modal>
    {/if}

    <header>
        <dir-path
            on:click={() => {
                let { dir: d } = path.parse(dir);

                dir = d !== "/" ? d + "/" : d;

                update();
            }}>{dir}</dir-path
        >
    </header>

    <div id="content">
        <ul class="dir-list">
            <Button
                title="Create"
                click={() => {
                    creating = true;
                }}
            />

            {#each folders as { path }}
                <DirList
                    selected={path == dir}
                    click={() => {
                        dir = path;
                        update();
                    }}
                    {path}
                />
            {/each}
        </ul>
        <files>
            {#if files.length !== 0}
                {#each files as file}
                    <File
                        open={() => {
                            editor = { file };
                        }}
                        {file}
                    />
                {/each}
            {:else}
                <slot>
                    <em>There are no files in this directory</em>
                </slot>
            {/if}
        </files>
    </div>
</div>

<style>
    @font-face {
        font-family: "Whitney";
        font-style: normal;
        font-weight: bold;
        src: url(./fonts/Whitney.woff) format("woff");
    }

    :root {
        --primary: #36393f;
        --secondary: #2f3136;
        --button-selected: #4f545c52;
        --input: #40444b;
        --font-primary-color: #fffc;
        --font-primary: Whitney;
    }

    #root {
        background-color: var(--primary);
        position: absolute;
        top: 0;
        left: 0;
        flex-direction: column;
        display: flex;
        height: 100%;
        width: 100%;
        font-family: var(--font-primary);
    }

    /**
    #root > #content > ul.dir-list > button {
    }
    */

    #root > #content > ul.dir-list {
        display: flex;
        margin: 0;
        flex-direction: column;
        width: max-content;
        padding: 0;
        height: -webkit-fill-available;
        width: 20%;
        background: var(--secondary);
    }

    #root > header {
        background: var(--secondary);
        padding: 15px;
        color: white;
        border-bottom: solid 1px #00000047;
    }

    #root > #content {
        display: flex;
        width: -webkit-fill-available;
        height: -webkit-fill-available;
    }

    files {
        color: #ffffffc2;
        width: -webkit-fill-available;
    }

    em {
        display: block;
        margin: 25px;
        font-size: 14px;
    }
</style>
