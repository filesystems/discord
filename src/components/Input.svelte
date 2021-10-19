<script>
    export let placeholder = "";
    export let value = "";
</script>

<div id="Input">
    <input {placeholder} bind:value />
</div>

<style>
    #Input {
        overflow: hidden;
        border-radius: 5px;
        overflow: hidden;
        border-radius: 5px;
        background: var(--secondary);
        margin: 10px;
    }

    #Input > input {
        outline: none !important;
        border: none;
        background: transparent;
        height: -webkit-fill-available;
        margin: 0;
        width: -webkit-fill-available;
        padding: 10px;
        color: white;
    }
</style>
