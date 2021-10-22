import ObjectId from "bson-objectid";
import axios from "axios";
import FormData from "form-data";

import Chunk from "./Chunk";
import Util from "./Util";

import * as YAML from 'yaml';
import chalk from "chalk";
import BufferListStream from "bl";
import type Server from "..";

/** File's information */
export interface FileMetadata {

    /** File's name */
    name: string;

    /** 
     * The last date this file was modified.
     * Should be the date it was uploaded (or not).
     */
    lastModifiedDate: Date
}


export interface FileOptions {

    customData?: any;

    /** File's id */
    id: ObjectId;

    /** File's information */
    metadata: FileMetadata;

    /** File's buffer data */
    data?: Blob;
}

export interface FileCunks {
    id: string;
    attachments: {
        url: string
    }[]
}

export default class File {

    /** File's options */
    public options: FileOptions;

    /** List of the file's buffers */
    public buffers: Map<ObjectId, Blob> = new Map();

    public chunks: FileCunks[] = [];

    public server: Server;

    /**
     * 
     * @param options {FileOptions}
     */
    constructor(options: FileOptions, chunks?: FileCunks[]) {
        this.options = options;
        this.chunks = chunks;
    };

    public async get(progress?: (percentage: number) => void): Promise<Blob> {
        let urls: string[] = [];

        let blobs: Blob[] = []

        for (let chunk of this.chunks)
            for (let attachment of chunk.attachments)
                urls.push(attachment.url);

        let left = urls.length;

        for (let url of urls) {

            let request: { data: any } = await axios.get(url, {
                responseType: 'blob',
                onDownloadProgress: (event) => {
                    let value = Math.round((event.loaded * 100) / event.total) / left;
                    if (progress) progress(value);

                    console.log(value)
                },
            });

            blobs.push(request.data)

            left -= 1
        }



        return new Blob(blobs);
    }

    /**
     * Upload the file to the server
     * 
     * @param webhook {string} webhook chunks uploader token
     * @param descriptor {string} webhook to post file's information
     */
    public async upload(webhook: string, descriptor: string) {

        const chunks = await Util.splitBytes(this.options.data);

        let yaml: {
            id: string;
            customData?: any;
            chunks: { id: string, attachments: any[] }[];
            metadata: FileMetadata;
        } = {
            id: this.options.id.toString(),
            chunks: [],
            metadata: this.options.metadata,
            customData: this.options.customData || null
        };

        const start = Date.now()

        for (let data of chunks) {

            let id = new ObjectId();

            let chunk = new Chunk(id, data);

            this.buffers.set(id, data);

            try {

                const start = Date.now()

                let chunk_message = await chunk.upload(webhook);

                yaml.chunks.push({
                    id: chunk_message.id,
                    attachments: chunk_message.attachments
                });

                const elapsed = chalk.yellow(((Date.now() - start) / 1000).toFixed(2));
                const bytes = chalk.yellow(data.size.toString());

                Util.log("chunk", chalk.green("Success") + ":", `Uploaded ${bytes} Bytes in ${elapsed} seconds`)

            } catch (e) {

                Util.errors.push(e);
            }
        }

        let form = new FormData();

        form.append("content", "```yaml\n" + YAML.stringify(yaml) + "\n```");

        try {
            await axios.post(descriptor, form, {
                headers: {
                    "content-type": "multipart/form-data"
                }
            });

            const elapsed = ((Date.now() - start) / 1000).toFixed(2);
            const size = chunks.map(e => e.size).reduce((p, a) => p + a, 0).toString();

            Util.log("File", chalk.green("Success") + ":", chunks.length, `chunks (${chalk.cyan(size)} Bytes) in ${chalk.yellow(elapsed)} seconds`)

        } catch (e) {
            Util.errors.push(e);
        }

        Util.logErrors();

        return yaml;
    }
}