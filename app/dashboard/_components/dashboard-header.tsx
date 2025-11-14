
interface DashboardHeaderProps {
    title: string;
    subtitle?: string;
    children?: React.ReactNode;
}

export function DashboardHeader({ title, subtitle, children }: DashboardHeaderProps) {
    return (
        <div className="flex items-center justify-between">
            <div>
                <h1 className="text-3xl font-bold tracking-tight">{title}</h1>
                {subtitle && <p className="text-muted-foreground mt-1">{subtitle}</p>}
            </div>
            {children}
        </div>
    );
}
