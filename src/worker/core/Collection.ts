import axios from "axios";
import type Server from "..";
import File from "./File";
import Util from "./Util";
import YAML from "yaml";
import ObjectId from "bson-objectid";

export interface DiscordChannel {
    guild_id: string
    id: string
    last_message_id: string

    /** channel name */
    name: string
    nsfw: boolean
    parent_id: string

    /** position index */
    position: number
    rate_limit_per_user: number
    topic: string
    type: number
}

export interface DiscordWebhook {
    channel_id: string
    guild_id: string
    id: string
    name: string
    token: string
    type: number
};

export interface DiscordMessage {
    content: string;
    id: string;
}

export interface DiscordSearch {
    analytics_id: string
    messages: DiscordMessage[][]
    total_results: number
}

export default class {

    public channel: DiscordChannel;
    public server: Server;

    constructor(channel: DiscordChannel, server: Server) {
        this.channel = channel;
        this.server = server;
    }

    webhook: DiscordWebhook;

    public async getWebhook(): Promise<DiscordWebhook> {
        const { data }: { data: DiscordWebhook[] } = await axios.get(`${this.server.options.base}/channels/${this.channel.id}/webhooks`, {
            headers: { authorization: this.server.token }
        })

        if (data.length == 0)
            this.webhook = await this.createWebhook();

        return this.webhook || data[Math.floor(Math.random() * data.length)]
    }

    public async createWebhook(): Promise<DiscordWebhook> {
        let name = "Uploader: " + Math.floor(Math.random() * Date.now());

        const { data }: { data: DiscordWebhook } = await axios.post(`${this.server.options.base}/channels/${this.channel.id}/webhooks`, { name }, {
            headers: { authorization: this.server.token }
        });

        Util.log("webhook", "Created a webhook. Name:", name)

        return data;
    }

    public parseWebhook(webhook: DiscordWebhook): string {
        return `https://discord.com/api/webhooks/${webhook.id}/${webhook.token}`
    }

    /**
    * Upload a new file to the server
    * @param file {File}
    */
    public async upload(file: File) {
        let fs_chunks = this.server.collections.get("fs-chunks");

        let chunks_webhook = this.parseWebhook(
            fs_chunks.webhook || await fs_chunks.getWebhook()
        );

        let files_webhook = this.parseWebhook(
            this.webhook || await this.getWebhook()
        );

        return await file.upload(chunks_webhook, files_webhook);

    };

    /**
     * Find files from {this} collection.
     * @param query <{ [key: string]: any }>
     * @returns <Promise<File[]>>
     */
    public async find(query: { [key: string]: any }): Promise<File[]> {
        const yaml = YAML.stringify(query);

        const { data }: { data: DiscordSearch } = await axios.get(`${this.server.options.base}/guilds/${this.server.options.guild}/messages/search`, {
            params: { content: yaml, channel_id: this.channel.id },
            headers: { Authorization: this.server.token }
        });

        let files: File[] = [];

        for (let group of data.messages) {

            for (let message of group) {
                try {
                    let content = message.content.match(/```yaml\n([\S\s]*)\n```/)[1]

                    let parsed = YAML.parse(content);

                    files.push(
                        new File({
                            id: new ObjectId(parsed.id),
                            metadata: parsed.metadata
                        }, parsed.chunks)
                    )
                } catch (e) {
                    Util.errors.push(e)
                }

            }
        }

        if (Util.errors.length > 0) Util.logErrors();

        return files;
    }

}