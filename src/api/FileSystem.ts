import { Dir } from "./Dir";
import { File, Meta } from "./File";
import { EventEmitter } from "events";

import FileClient from "../worker/core/File"

import Client from "../worker";

import path from "path";
import ObjectID from "bson-objectid";

export interface FileInfo {
    type: "File" | "Dir"
    chunks?: { id: string, attachments: any[] }[];
}

export class FileStorage {

    static data: Map<string, FileInfo> = new Map(
        JSON.parse(
            localStorage.getItem("fs-info") || "[]"
        )
    );

    /** 
     * Get a file info information
     */
    public static get(key: string): FileInfo {
        return this.data.get(key)
    }

    /**
     * Set a file's info data information
     */
    public static set(key: string, value: FileInfo, save?: boolean): Meta {

        this.data.set(key, value);

        if (save !== false) this.save();

        return this;
    }

    /**
     * Saves all info to your localstorage
     */
    public static save(): Meta {

        localStorage.setItem("fs-info", JSON.stringify([...this.data]))

        return this;
    }
}


export default class FileSystem {

    public token: string = null;
    public guild: string = null;

    private files: Map<string, File | Dir> = new Map;

    public event = new EventEmitter;

    public client: Client;
    /**
     * Construct a new filesystem.
     * 
     * @param token {string} Your account token with accesses to the guild.
     * @param guild {string} The server to which you want everything to be stored in.
     */
    constructor(token: string, guild: string) {

        this.token = token;
        this.guild = guild;

        this.client = new Client({
            base: "https://discord.com/api/v9",
            guild: guild
        });

        this.client.open(token).then(() => {
            console.log("Ready");
        })

        FileStorage.data.forEach((info, path) => {

            if (info.type == "Dir")
                this.createDir(path)
            else
                this.createFile(path)
        })
    }

    public exists(path: string): boolean {
        return this.files.has(path);
    }


    async createFile(path: string, data?: Blob, upload?: boolean) {

        let file = new File();

        if (data !== undefined) file.data = data

        file.path = path;

        this.set(path, file);

        if (upload == true) {

            let collection = this.client.collections.get("fs-files");

            let f = new FileClient({
                customData: { path },

                /** File's id */
                id: new ObjectID,

                /** File's information */
                metadata: { name: path, lastModifiedDate: new Date },

                /** File's buffer data */
                data: file.data
            })

            let data = await collection.upload(f);

            FileStorage.set(path, {
                type: "File",
                chunks: data.chunks
            }, true)
        }
    }

    createDir(path: string) {

        let dir = new Dir();

        dir.path = path;

        this.set(path, dir)

        FileStorage.set(path, { type: "Dir" }, true)
    }

    public set(path: string, file: File | Dir) {

        if (!path.startsWith("/"))
            throw new Error("Invalid path");

        if (file.type === "Dir" && !path.endsWith("/"))
            throw new Error("Invalid directory path")

        if (file.type === "File" && path.endsWith("/"))
            throw new Error("Invalid file path")

        if (file.path !== path)
            throw new Error("The path in the argument must me the same as the path in the file class.");

        let parentPath = path.split("/")
            .slice(0, file.type == "Dir" ? -2 : -1)
            .join("/")

        if (parentPath !== "") {

            let parent = this.files.get(parentPath + "/");

            if (parent == undefined || parent == null)
                throw new Error("Directory '" + parentPath + "' does not exists.")

            if (parent.type !== "Dir")
                throw new Error("'" + parentPath + "' is not a directory/folder.")
        }

        let itemExists = this.exists(path);

        if (itemExists) {
            let item = this.get(path);

            if (item.type === "Dir" && file.type == "File")
                throw new Error("There is already a folder with the same name as the file you specified.")

            if (item.type === "File" && file.type == "Dir")
                throw new Error("There is already a file with the same name as the folder you specified.")
        }


        this.files.set(path, file);

        this.event.emit("update-dir", parentPath);
        this.event.emit("update-file", path);
    }

    public valid(): void {
        if (typeof this.token !== "string") throw new Error("A valid string token is missing!");
        if (typeof this.guild !== "string") throw new Error("A valid guild id is missing!");
    }

    get(path: string): File | Dir {

        this.valid()

        if (typeof path !== "string") throw new Error("The path argument must be a valid string");

        return this.files.get(path)
    }

    /**
     * Returns the file's meta data 
     */
    async getMeta(path: string) {
        return Meta.get(path);
    }

    /**
     * Gets a count of every files in system
     */
    public mc(): number {
        return this.files.size
    }

    /**
     * Returns ever files or dirs in the current dir (if is a dir)
     */
    public ls(dirPath: string): Array<File | Dir> {

        let paths = [];

        let list = [];

        for (let file of this.files) {

            if (dirPath == file[0]) continue;

            if (!file[0].startsWith(dirPath)) continue;

            let p = file[0].split(dirPath)[1].split("/")[0];

            let item = this.files.get(path.join(dirPath, p) + "/")
                || this.files.get(path.join(dirPath, p));

            if (paths.includes(item.path)) continue;

            if (item) {
                paths.push(item.path)
                list.push(item)
            }
        }

        return list;

    }

    /** Returns the amount of files or dirs in the current dir */
    public count(dirPath: string): number {
        return this.ls(dirPath).length
    }
}