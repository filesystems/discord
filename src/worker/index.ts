

import axios from "axios";
import Collection, { DiscordChannel } from "./core/Collection";
import Util from "./core/Util";

export * from "./core/File";

/**
 * Server's options
 */
export interface Options {

    /**
     * discord api endpoint
     */
    base: string;

    /**
     * Main server to be used to store data
     */
    guild: string;
}

export default class Server {

    /**
     * Server's options
     */
    public options: Options = null;

    /**
     * Main account token
     */
    public token: string;

    /**
     * Error caches to be logged
     */
    public errors: Error[] = [];

    /**
     * Construct the server class
     * @param options {Options}
     */
    constructor(options: Options) {
        this.options = options;
    }


    public readonly prefixes = [
        "fs-"
    ]

    /**
     * Creates a new collection
     * 
     * @param name {string} collection name
     * @returns 
     */
    public async createCollection(name: string, log: boolean = true, internal: boolean = false): Promise<void> {

        const ct = "content-type";

        if (internal == false) {
            for (let prefix of this.prefixes) {
                if (name.startsWith(prefix))
                    Util.errors.push(
                        new Error("Collection names must not start with the following reversed keys: " + this.prefixes.join(", "))
                    );

                if (log) Util.logErrors();
                return void 0
            }
        }


        let { data }: { data: DiscordChannel } = await axios.post(this.options.base + "/guilds/" + this.options.guild + "/channels", {
            type: 0,
            name: name,
            permission_overwrites: []
        }, {
            headers: {
                authorization: this.token,
                [ct]: "application/json",
            },
        });

        Util.log("collection", "Created a collection. Name:", name)

        this.collections.set(data.name, new Collection(data, this))

    }

    public readonly collections: Map<string, Collection> = new Map();

    public async getCollections(): Promise<Map<string, Collection>> {

        let request: { data: DiscordChannel[] } = await axios.get(this.options.base + "/guilds/" + this.options.guild + "/channels", {
            headers: { authorization: this.token }
        });

        this.collections.clear();

        request.data.forEach((channel: DiscordChannel) => {
            this.collections.set(channel.name, new Collection(channel, this))
        });

        return this.collections;
    }

    private ready = false;

    public async open(token: string): Promise<void> {
        this.token = token;

        if (this.ready == true) {
            Util.errors.push(
                new Error("Client is already ready.")
            )

            return Util.logErrors()
        }


        try {
            await this.getCollections();
        } catch (e) {
            Util.errors.push(e)
        }

        try {
            if (!this.collections.has("fs-files"))
                await this.createCollection("fs-files", false, true)
        } catch (e) {
            Util.errors.push(e)
        }

        try {
            if (!this.collections.has("fs-chunks"))
                await this.createCollection("fs-chunks", false, true);
        } catch (e) {
            Util.errors.push(e)
        }

        Util.logErrors();

        this.ready = true;
    }
}