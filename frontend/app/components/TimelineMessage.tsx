import React from "react";

type Props = {
    name: string;
    content: string;
};

export const TimelineMessage: React.FC<Props> = ({ name, content }) => (
    <article className="mb-2">
        <header className="mt-2 font-bold text-gray-600">{name}</header>
        <p className="mb-4 whitespace-pre-wrap">{content}</p>
    </article>
);
