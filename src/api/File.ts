import EventEmitter from "events";
import type FileSystem from "./FileSystem";

export interface FileMeta {
    created?: Date,
    modified?: Date,
    accessed?: Date
}

export class Meta {

    private static data: Map<string, FileMeta> = new Map(
        JSON.parse(
            localStorage.getItem("fs-meta") || "[]"
        )
    );

    /**
     * Get a file meta information
     */
    public static get(key: string): FileMeta {
        return this.data.get(key)
    }

    /**
     * Set a file's meta data information 
     */
    public static set(key: string, value: FileMeta, save?: boolean): Meta {

        this.data.set(key, value);

        if (save !== false) this.save()

        return this;
    }

    /**
     * Saves all metas to your localstorage
     */
    public static save(): Meta {
        localStorage.setItem("fs-meta", JSON.stringify([...this.data]))

        return this;
    }
}


export class File {

    public events = new EventEmitter

    public type = "File";

    public data: Blob = null;

    public path: string = null;

    public cloading: boolean = false;

    set loading(value) {
        this.events.emit("loading", value);
        this.cloading = value
    }

    get loading() { return this.cloading }

    event(name, event) { this.events.addListener(name, event) }

    public get meta(): FileMeta {

        return Meta.get(this.path)

    };

    public set meta(value: FileMeta) {

        Meta.set(this.path, value)

    }

    public fs: FileSystem;

    public async get() {

        this.loading = true;

        try {
            let [file] = await this.fs.client.collections.get("fs-files").find({
                name: this.path
            });

            this.loading = false;
            return file;
        }
        catch (e) {
            this.loading = false;
            return null;
        }
    }
}
