import type { Route } from './+types/dashboard';

export const meta: Route.MetaFunction = () => [{ title: '言娘' }];

export default function Dashboard(_: Route.ComponentProps) {
    return (
        <div className="min-h-dvh">
            <header className="w-dvw items-center px-5 py-3 flex dark:bg-gray-700">
                <div className="flex-none text-xl">言娘</div>
                <input
                    type="text"
                    placeholder="搜索"
                    className="grow w-full px-4 py-2 mx-40 dark:bg-gray-600 rounded-full border dark:border-gray-500"
                />
                <button type="button" className="flex-none">
                    <svg
                        xmlns="http://www.w3.org/2000/svg"
                        width="24"
                        height="24"
                        viewBox="0 0 24 24"
                        fill="none"
                        stroke="currentColor"
                        strokeWidth="2"
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        className="fill-white"
                    >
                        <title>通知</title>
                        <path d="M18 8A6 6 0 0 0 6 8c0 7-3 9-3 9h18s-3-2-3-9" />
                        <path d="M13.73 21a2 2 0 0 1-3.46 0" />
                    </svg>
                </button>
            </header>
            <main className="px-4 pt-4">
                <p className="text-xl">仪表板</p>
            </main>
        </div>
    );
}
