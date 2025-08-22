import { getStorage, ref, getDownloadURL, listAll } from "firebase/storage";
import app from "./config";

const storage = getStorage(app)

export async function getURLUser(type: string, id: string) {
  try {
    const storageRef = ref(storage, 'user/' + id + '/' + type + '/');
    const list = await listAll(storageRef)
    const files = list.items
    for (const item of files) {
      if (item.name.split('.').slice(0, -1).join('.') === type) {
        return await getDownloadURL(ref(storage, item.fullPath))
      }
    }
  } catch (e) {
    console.log(e)
  }
}

export async function getURLGroupBanner(id: string) {
  try {
    const storageRef = ref(storage, 'group/' + id + '/banner/');
    const list = await listAll(storageRef)
    const files = list.items
    for (const item of files) {
        return await getDownloadURL(ref(storage, item.fullPath))
    }
  } catch (e) {
    console.log(e)
  }
}

export async function getPostFile(id: string) {
  try {
    const storageRef = ref(storage, 'post/' + id + '/');
    const list = await listAll(storageRef)
    const files = list.items
    
    const resultPromise = files.map(async (file) => {
      return await getDownloadURL(ref(storage, file.fullPath))
    })
    return await Promise.all(resultPromise)
  } catch (e) {
    console.log(e)
  }
}