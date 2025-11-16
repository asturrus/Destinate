export function DiscussionPage( { discussion, onBack } ) {
    return(
        <div className="p-6" data-testid="page-discussion-detail">
            <button
                onClick={onBack}
                className="mb-4"
                data-testid="button-back-to-discussions"
            >
                Back
            </button>

            <h1 className="text-2xl font-bold mb-2" data-testid="text-discussion-detail-title">
                {discussion.title}
            </h1>
            <p className="text-gray-600 mb-1" data-testid="text-discussion-detail-author">
                {discussion.author}
            </p>
            <p className="text-gray-500 mb-6" data-testid="text-discussion-detail-date">
                {discussion.date}
            </p>

            <div className="bg-white p-4 rounded shadow" data-testid="content-discussion-body">
                <p>
                    This is where the body of the discussion goes.
                </p>
            </div>
        </div>
    );
}