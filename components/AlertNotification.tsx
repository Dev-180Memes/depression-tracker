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
        <div>
            <h2>Alert Notifications</h2>
            {Alerts.length === 0 ? (
                <p>No alerts at this time</p>
            ) : (
                <ul>
                    {Alerts.map((alert, index) => (
                        <li key={index}>
                            {alert.message}
                        </li>
                    ))}
                </ul>
            )}
        </div>
    );
};

export default AlertNotifications;
