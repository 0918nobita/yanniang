export const RootLayout: React.FC<{ children: React.ReactNode }> = ({
    children,
}) => {
    return <div className="min-h-dvh bg-gray-50 p-5">{children}</div>;
};
