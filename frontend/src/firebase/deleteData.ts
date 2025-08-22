import { deleteObject, getStorage, listAll, ref } from "firebase/storage";
import app from "./config";

const storage = getStorage(app)

export async function deleteWholeFolderContent(path: string) {
    try {
        const files = await listAll(ref(storage, path))
        const file = files.items.map(file => deleteObject(file))
        await Promise.all(file)
    } catch (e) {
        console.log(e)
    }
}