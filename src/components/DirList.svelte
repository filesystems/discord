<script>
    export let path;
    export let selected = false;
    export let click = () => {};

    import p from "path";
</script>

<dir-item
    on:click={() => {
        selected = true;
        click();
    }}
    selected={selected.toString()}
>
    <span type="path">./{p.basename(path)}/</span>
</dir-item>

<style>
    dir-item {
        padding: 10px;
        cursor: pointer;
        margin: 10px;
        margin-top: 0px;
        border-radius: 5px;
        font-size: 13px;
    }

    dir-item[selected="true"],
    dir-item:hover {
        background: var(--button-selected);
    }

    dir-item > [type="path"] {
        margin: auto;
        color: var(--font-primary-color);
    }
</style>
