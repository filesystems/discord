<script>
    export let name = "";
    export let type = "File";
</script>

<file {type}>
    <img
        class="icon"
        alt="File icon"
        src="https://findicons.com/files/icons/2813/flat_jewels/512/file.png"
    />
    <span class="name">{name}</span>
</file>

<style>
    file {
        width: 100px;
        height: 110px;
        display: inline-flex;
        flex-direction: column;
        transition: all 0.1s;
        padding: 20px;
        background: var(--secondary);
        margin: 10px;
        border-radius: 5px;
        cursor: pointer;
    }
    file > .name {
        margin: auto;
        margin-top: 10px;
        word-break: keep-all;
        overflow: hidden;
        white-space: nowrap;
        width: 100px;
        text-overflow: ellipsis;
        text-align: center;
    }
    file > .icon {
        margin: auto;
        height: 50px;
        width: 50px;
        padding: 10px;
        border-radius: 50px;
        background: var(--button-selected);
    }
</style>
