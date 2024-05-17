import { useState, useEffect } from "react";

const AlertNotifications = ({ alerts }: { alerts: any }) => {
    const [Alerts, setAlerts] = useState<any[]>([]);

    useEffect(() => {
        if (!alerts) {
            return;
        }
        setAlerts(alerts);
    }, [alerts]);

    return (
        <div className="flex flex-col gap-1">
            <h2 className="text-2xl font-bold">Alert Notifications</h2>
            {Alerts.length === 0 ? (
                <p className="text-red-300">No alerts at this time</p>
            ) : (
                <ul className="">
                    {Alerts.map((alert, index) => (
                        <li key={index}>
                            {index + 1} - {alert.message}
                        </li>
                    ))}
                </ul>
            )}
        </div>
    );
};

export default AlertNotifications;
