import React, { Fragment } from "react";

import { ShowLatestMessageButton } from "./ShowLatestMessageButton";
import { TimelineMessage } from "./TimelineMessage";

type Props = {
    ref: React.RefObject<HTMLUListElement | null>;
    timelineEndRef: React.RefObject<HTMLDivElement | null>;
    messages: readonly Readonly<{
        id: string;
        name: string;
        content: string;
    }>[];
    autoScroll: boolean;
    handleUserScroll: () => void;
    scrollToBottom: () => void;
};

const TimelineMessageMemo = React.memo(TimelineMessage);

export const Timeline: React.FC<Props> = ({
    ref,
    timelineEndRef,
    messages,
    autoScroll,
    scrollToBottom,
    handleUserScroll,
}) => (
    <section
        className="flex-1 overflow-y-auto px-4 relative"
        ref={ref}
        onWheel={handleUserScroll}
        onTouchStart={handleUserScroll}
        onTouchMove={handleUserScroll}
        onTouchEnd={handleUserScroll}
    >
        <div className="relative top-0 left-0 w-full">
            {messages.map((msg, index) => (
                <Fragment key={msg.id}>
                    {index !== 0 && <hr className="border-gray-300" />}
                    <TimelineMessageMemo
                        name={msg.name}
                        content={msg.content}
                    />
                </Fragment>
            ))}
            <div
                ref={timelineEndRef}
                className="h-[100px] absolute bottom-0 w-full bg-red-400 z-[1] opacity-0 pointer-events-none"
                aria-hidden
            />
        </div>

        <ShowLatestMessageButton
            isVisible={!autoScroll}
            scrollToBottom={scrollToBottom}
        />
    </section>
);
