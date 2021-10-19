<script>
    export let type = "File";

    /** @type {File[]} */
    export let files = [];

    export let inputElement;

    function input(element) {
        inputElement = element;

        return {
            destroy() {},
        };
    }
</script>

<upload on:click={() => inputElement.click()} {type}>
    <input use:input bind:files type="file" />
    <span class="name">{files[0] ? files[0].name : "Please choose a file"}</span
    >
</upload>

<style>
    upload {
        transition: all 0.1s;
        width: fit-content;
        display: flex;
        flex-direction: column;
        transition: all 0.1s;
        padding: 20px;
        background: var(--secondary);
        margin: auto;
        border-radius: 5px;
        border: dashed #ffffff1f 4px;
        cursor: pointer;
        margin-top: 30px;
        margin-bottom: 30px;
        padding: 25px;
        box-shadow: 0px 6px 11px #00000042;
    }

    upload:hover {
        box-shadow: 0px 6px 11px #0000007d;
        transform: scale(1.01);
    }

    upload > .name {
        width: fit-content;
        height: fit-content;
        margin: auto;
        padding-right: 20px;
        padding-left: 20px;
    }

    upload > input {
        display: none;
    }
</style>
