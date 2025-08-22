import { ContentState, EditorState } from "draft-js";
import htmlToDraft from "html-to-draftjs";

export function htmlTextToEditorStateConverter(html: string): EditorState {
    return EditorState.createWithContent(ContentState.createFromBlockArray(htmlToDraft(html).contentBlocks))
}