import "./postCardSkeleton.css"

const PostCardSkeleton = () => {
    return (
        <div className="postCardSkeletonContainer">
            <div className="postCardSkeletonTop">
                <div className="postCardSkeletonTopProfile"></div>
                <div className="postCardSkeletonTopDetail">
                    <div className="postCardSkeletonTopName"></div>
                    <div className="postCardSkeletonTopTime"></div>
                </div>
            </div>
            <div className="postCardSkeletonContent"></div>
            <div className="postCardSkeletonAction"></div>
            <div className="postCardSkeletonWriteComment">
                <div className="postCardSkeletonWriteCommentProfile"></div>
                <div className="postCardSkeletonWriteCommentBtn"></div>
            </div>
        </div>
    )
}

export default PostCardSkeleton