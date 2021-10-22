<script>
    import path from "path";

    import { File } from "../api/File";

    /** @type {File} */
    export let file;

    export let open = () => {};

    let loading = file.loading;

    file.event("loading", (value) => (loading = value));
</script>

<file
    on:click={async () => {
        if (loading == false) {
            let f = await file.get();

            file.loading = true;

            let data = await f.get();

            file.loading = false;

            console.log(data);

            file.data = data;

            open();
        }
    }}
    type={file.type}
>
    <div class="icon-holder">
        {#if loading == true}
            <div class="loader">
                <div class="lds-ring">
                    <div />
                    <div />
                    <div />
                    <div />
                </div>
            </div>
        {:else}
            <img
                class="icon"
                alt="{file.type} icon"
                src="https://findicons.com/files/icons/2813/flat_jewels/512/file.png"
            />
        {/if}
    </div>
    <span class="name">{path.basename(file.path)}</span>
</file>

<style>
    file {
        display: inline-flex;
        flex-direction: column;
        transition: all 0.1s;
        margin: 10px;
        cursor: pointer;
    }
    file:hover > .icon-holder {
        box-shadow: 0px 5px 8px #0000001a;
        transform: scale(1.05);
    }
    file > .name {
        font-size: 11px;
        margin: auto;
        margin-top: 10px;
        word-break: keep-all;
        overflow: hidden;
        white-space: nowrap;
        width: 70px;
        text-overflow: ellipsis;
        text-align: center;
    }
    file > .icon-holder > .icon {
        margin: auto;
        height: inherit;
        width: inherit;
    }
    file > .icon-holder {
        height: 50px;
        box-shadow: 0 0 transparent;
        width: 50px;
        transition: all 0.1s;
        background: var(--secondary);
        border-radius: 10px;
        padding: 10px;
        margin: auto;
    }

    .loader {
        height: 50px;
        width: 50px;
    }

    .lds-ring {
        display: inline-block;
        position: relative;
        width: inherit;
        height: inherit;
    }
    .lds-ring div {
        box-sizing: border-box;
        display: block;
        position: absolute;
        width: inherit;
        height: inherit;
        margin: 0;
        border: 8px solid #fff;
        border-radius: 50%;
        animation: lds-ring 1.2s cubic-bezier(0.5, 0, 0.5, 1) infinite;
        border-color: #ffffff6e transparent transparent transparent;
    }
    .lds-ring div:nth-child(1) {
        animation-delay: -0.45s;
    }
    .lds-ring div:nth-child(2) {
        animation-delay: -0.3s;
    }
    .lds-ring div:nth-child(3) {
        animation-delay: -0.15s;
    }
    @keyframes lds-ring {
        0% {
            transform: rotate(0deg);
        }
        100% {
            transform: rotate(360deg);
        }
    }
</style>
