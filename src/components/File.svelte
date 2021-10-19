<script>
    export let name = "";
    export let type = "File";
</script>

<file {type}>
    <div class="icon-holder">
        <img
            class="icon"
            alt="File icon"
            src="https://findicons.com/files/icons/2813/flat_jewels/512/file.png"
        />
    </div>
    <span class="name">{name}</span>
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
        width: 100px;
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
</style>
