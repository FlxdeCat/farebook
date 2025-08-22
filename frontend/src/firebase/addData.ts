import { getStorage, ref, uploadBytes } from "firebase/storage";
import app from "./config";
import { deleteWholeFolderContent } from "./deleteData";

const storage = getStorage(app)

export async function addUserImageFile(file: File, type: string, id: string | undefined) {
    if(!file || !id){
        return
    }

    let result = null;
    let error = null;
    const storageRef = ref(storage, 'user/' + id + '/' + type + '/'+ type + '.' + file.name.substring(file.name.lastIndexOf('.') + 1).toLowerCase());

    try {
        await deleteWholeFolderContent('user/' + id + '/' + type + '/')
        result = await uploadBytes(storageRef, file);
    } catch (e) {
        error = e;
    }

    return { result, error };
}

export async function addGroupBannerImageFile(file: File, id: string | undefined) {
    if(!file || !id){
        return
    }

    let result = null;
    let error = null;
    const storageRef = ref(storage, 'group/' + id + '/banner/'+ file.name);

    try {
        await deleteWholeFolderContent('group/' + id + '/banner/')
        result = await uploadBytes(storageRef, file);
    } catch (e) {
        error = e;
    }

    return { result, error };
}

export async function addPostFile(file: File, id: string | undefined) {
    if(!file || !id){
        return
    }

    let result = null;
    let error = null;
    const storageRef = ref(storage, 'post/' + id + '/' + file.name);

    try {
        result = await uploadBytes(storageRef, file);
    } catch (e) {
        error = e;
    }

    return { result, error };
}