export function DiscussionPage( { discussion, onBack } ) {
    return(
        <div className="p-6">
            <button
                onClick={onBack}
                className="mb-4"
            >
                Back
            </button>

            <h1 className="text-2xl font-bold mb-2">
                {discussion.title}
            </h1>
            <p className="text-gray-600 mb-1">
                {discussion.author}
            </p>
            <p className="text-gray-500 mb-6">
                {discussion.date}
            </p>
        </div>
    );
}