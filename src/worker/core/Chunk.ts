import type ObjectId from "bson-objectid";
import axios from "axios";

export default class Chunk {

    public id: ObjectId;
    public data: Blob;

    constructor(id: ObjectId, data: Blob) {
        this.id = id;
        this.data = data;
    }

    /**
     * 
     * @param webhook {string}
     * @returns {string}
     */
    public async upload(webhook: string): Promise<any> {

        const form = new FormData();

        form.append("file", this.data, this.id.toString() + ".bin")

        const { data }: { data: any } = await axios.post(webhook, form, {
            headers: {
                "content-type": "multipart/form-data"
            },
        });

        return data;
    }
}