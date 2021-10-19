<script>
    export let click;
    export let title = "No title";
    export let color = "blue";
</script>

<button
    style="--color: {color == 'blue' ? '#5865f2' : '#f25858'}"
    on:click={click}
>
    <span>{title}</span>
</button>

<style>
    button {
        box-shadow: 0px 6px 11px #00000030;
        width: -webkit-fill-available;
        border: none;
        padding: 10px;
        background: var(--color);
        margin: 10px;
        cursor: pointer;
        border-radius: 5px;
        color: white;
        font-family: "Whitney";
    }
</style>
